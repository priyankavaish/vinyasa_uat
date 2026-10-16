const test = require('node:test');
const assert = require('node:assert/strict');
const {mkdtempSync} = require('node:fs');
const {tmpdir} = require('node:os');
const path = require('node:path');
const {createHmac} = require('node:crypto');
process.env.DATABASE_URL='pglite:'+mkdtempSync(path.join(tmpdir(),'vinyasa-payment-email-'));
process.env.SESSION_SECRET='isolated-email-test-secret';
process.env.RAZORPAY_WEBHOOK_SECRET='isolated-webhook-secret';
const sent=[];let failCustomerOnce=false;
const nodemailer=require('nodemailer');
nodemailer.createTransport=()=>({sendMail:async mail=>{
 const customer=Array.isArray(mail.to)&&mail.to.includes('customer@example.test');
 if(customer&&failCustomerOnce){failCustomerOnce=false;throw Error('Temporary customer mail rejection');}
 sent.push(mail);return {accepted:mail.to};
},close(){}});
const cache=require('next/cache');cache.revalidatePath=()=>{};
const {getDb}=require('../src/lib/db');
const {siteContent}=require('../src/lib/db/schema');
const {eq}=require('drizzle-orm');
const {migrate}=require('drizzle-orm/pglite/migrator');
const {createBooking,getBooking}=require('../src/lib/store');
const {encryptEmailSecret,notifyEntry,listEmailStates}=require('../src/lib/email-notifications');
const {confirmCapturedPayment}=require('../src/lib/payment-confirmation');
const {validWebhookSignature}=require('../src/lib/razorpay-events');
const {POST:webhook}=require('../src/app/api/razorpay/webhook/route');
const {NextRequest}=require('next/server');
const {GET:paymentReturn}=require('../src/app/api/razorpay/payment-return/route');
const db=getDb();
const config={provider:'smtp',sender:'bookings@example.test',host:'smtp.example.test',port:465,user:'sender',secret:encryptEmailSecret('test-only-smtp-password')};
async function setupSender(){await db.insert(siteContent).values({key:'email-notifications:config',value:config}).onConflictDoUpdate({target:siteContent.key,set:{value:config}});}
let sequence=0;
async function booking(){sequence++;return createBooking({type:'stay',itemSlug:'agni',checkIn:'2099-01-01',checkOut:'2099-01-02',guests:2,guestName:'Test Customer',guestEmail:'customer@example.test',guestPhone:'9999999999',amount:1180,razorpayOrderId:'order_mail'+sequence});}
function payment(entry){return {id:'pay_mail'+sequence,order_id:entry.razorpayOrderId,status:'captured',amount:118000,currency:'INR',email:'customer@example.test'};}
async function sendWebhook(payload,signature){return webhook(new NextRequest('https://example.test/api/razorpay/webhook',{method:'POST',body:payload,headers:{'x-razorpay-signature':signature}}));}
test('verified payments notify admin/customer independently with retries and webhook deduplication',async t=>{
 t.after(async()=>{await db.$client.close();});
 await migrate(db,{migrationsFolder:'./drizzle'});
 await setupSender();
 await db.insert(siteContent).values({key:'email-notifications:recipients',value:{defaults:{to:['admin@example.test'],cc:['manager@example.test'],bcc:[]}}});
 await t.test('pending bookings send no payment confirmation',async()=>{const entry=await booking();await notifyEntry('payment',entry);assert.equal(sent.length,0);});
 await t.test('captured booking sends separate admin and customer mails once',async()=>{
  const entry=await booking(),captured=payment(entry);await confirmCapturedPayment(captured);
  assert.equal((await getBooking(entry.id)).status,'paid');assert.equal(sent.length,2);
  const admin=sent.find(mail=>mail.to.includes('admin@example.test')),customer=sent.find(mail=>mail.to.includes('customer@example.test'));
  assert.deepEqual(admin.cc,['manager@example.test']);assert.deepEqual(customer.to,['customer@example.test']);assert.deepEqual(customer.cc,[]);assert.deepEqual(customer.bcc,[]);
  assert.match(customer.text,/2099-01-01/);assert.match(customer.text,/1180|1,180/);assert.match(customer.text,new RegExp(captured.id));assert.doesNotMatch(customer.text,/admin\/bookings/);
  await confirmCapturedPayment(captured);assert.equal(sent.length,2);
 });
 await t.test('customer failure can retry without resending the admin mail',async()=>{
  const start=sent.length;const entry=await booking(),captured=payment(entry);failCustomerOnce=true;await confirmCapturedPayment(captured);
  let states=(await listEmailStates()).filter(state=>state.entryId===entry.id);assert.equal(states.find(state=>state.kind==='payment').state,'sent');assert.equal(states.find(state=>state.kind==='payment-customer').state,'failed');
  await confirmCapturedPayment(captured);assert.equal(sent.slice(start).filter(mail=>mail.to.includes('admin@example.test')).length,1);assert.equal(sent.slice(start).filter(mail=>mail.to.includes('customer@example.test')).length,1);
 });
 await t.test('uncaptured or wrong-amount payments send nothing',async()=>{
  const start=sent.length;const entry=await booking(),captured=payment(entry);await assert.rejects(confirmCapturedPayment({...captured,status:'authorized'}));await assert.rejects(confirmCapturedPayment({...captured,amount:100}));assert.equal(sent.length,start);assert.equal((await getBooking(entry.id)).status,'pending');
 });
 await t.test('standalone Razorpay link receipts notify both recipients once',async()=>{
  const start=sent.length;const captured={id:'pay_standalone123',status:'captured',amount:118000,currency:'INR',email:'customer@example.test',notes:{name:'Test Customer'}};
  await confirmCapturedPayment(captured);await confirmCapturedPayment(captured);assert.equal(sent.length,start+2);
 });
 await t.test('missing email configuration is visible and recoverable',async()=>{
  await db.delete(siteContent).where(eq(siteContent.key,'email-notifications:config'));const entry=await booking(),captured=payment(entry);const start=sent.length;await confirmCapturedPayment(captured);assert.equal(sent.length,start);
  const states=(await listEmailStates()).filter(state=>state.entryId===entry.id);assert.equal(states.length,2);assert.ok(states.every(state=>state.state==='unconfigured'));await setupSender();await confirmCapturedPayment(captured);assert.equal(sent.length,start+2);
 });
 await t.test('concurrent duplicate confirmations do not duplicate delivery',async()=>{
  const entry=await booking(),captured=payment(entry),start=sent.length;await Promise.all([confirmCapturedPayment(captured),confirmCapturedPayment(captured)]);assert.equal(sent.length,start+2);
 });
 await t.test('missing customer email leaves admin delivery intact',async()=>{
  const start=sent.length;await confirmCapturedPayment({id:'pay_missingemail123',status:'captured',amount:10000,currency:'INR'});
  assert.equal(sent.length,start+1);const states=(await listEmailStates()).filter(state=>state.entryId==='pay_missingemail123');assert.equal(states.find(state=>state.kind==='payment-receipt').state,'sent');assert.equal(states.find(state=>state.kind==='payment-receipt-customer').state,'failed');
 });
 await t.test('a signed-webhook receipt confirms return without resending emails',async()=>{
  const start=sent.length;const response=await paymentReturn(new NextRequest('https://example.test/api/razorpay/payment-return?razorpay_payment_id=pay_standalone123&payment=success'));assert.equal((await response.json()).status,'success');assert.equal(sent.length,start);
  const unsigned=await paymentReturn(new NextRequest('https://example.test/api/razorpay/payment-return?payment=success'));assert.equal((await unsigned.json()).status,'unverified');
 });
 await t.test('webhook validates the raw signature and handles duplicate events',async()=>{
  const entry=await booking(),captured=payment(entry);const body=JSON.stringify({event:'payment.captured',payload:{payment:{entity:captured}}});
  const signature=createHmac('sha256',process.env.RAZORPAY_WEBHOOK_SECRET).update(body).digest('hex');assert.equal(validWebhookSignature(body,signature,process.env.RAZORPAY_WEBHOOK_SECRET),true);assert.equal(validWebhookSignature(body+' ',signature,process.env.RAZORPAY_WEBHOOK_SECRET),false);
  assert.equal((await sendWebhook(body,'bad')).status,400);const start=sent.length;assert.equal((await sendWebhook(body,signature)).status,200);assert.equal((await sendWebhook(body,signature)).status,200);assert.equal(sent.length,start+2);
  const failedBody=JSON.stringify({event:'payment.failed',payload:{payment:{entity:{...captured,status:'failed'}}}});assert.equal((await sendWebhook(failedBody,createHmac('sha256',process.env.RAZORPAY_WEBHOOK_SECRET).update(failedBody).digest('hex'))).status,200);assert.equal(sent.length,start+2);
 });
});
