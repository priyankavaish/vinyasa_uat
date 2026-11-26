const test=require('node:test');
const assert=require('node:assert/strict');
const {mkdtempSync}=require('node:fs');
const {tmpdir}=require('node:os');
const path=require('node:path');
const {createHmac}=require('node:crypto');
// All storage and transports are isolated. Never load the developer's .env files.
Object.assign(process.env,{NODE_ENV:'development',DATABASE_URL:'pglite:'+mkdtempSync(path.join(tmpdir(),'artist-escape-integrated-')),SESSION_SECRET:'artist-escape-local-test-only',ARTIST_ESCAPE_EMAIL_MODE:'preview',RAZORPAY_KEY_ID:'',RAZORPAY_KEY_SECRET:'',GMAIL_OAUTH_CLIENT_ID:'',SMTP_USER:'',SMTP_PASSWORD:''});
require.cache[require.resolve('server-only')]={id:require.resolve('server-only'),filename:require.resolve('server-only'),loaded:true,exports:{}};
const cache=require('next/cache');cache.unstable_cache=fn=>fn;cache.revalidatePath=()=>{};
const server=require('next/server');const afterTasks=[];server.after=fn=>{afterTasks.push(fn);};
const sent=[];let failMail=false;
require('nodemailer').createTransport=()=>({sendMail:async mail=>{if(failMail)throw Error('Simulated email service failure');sent.push(mail);return {accepted:mail.to};},close(){}});
const nativeFetch=global.fetch;let captureAmount=0,captureStatus='captured',orderSequence=0;
global.fetch=async(url,options)=>{
 if(String(url)==='https://api.razorpay.com/v1/orders'){const data=JSON.parse(options.body);return new Response(JSON.stringify({id:'order_artisttest'+(++orderSequence),amount:data.amount,currency:'INR'}),{status:200,headers:{'Content-Type':'application/json'}});}
 if(String(url).startsWith('https://api.razorpay.com/v1/payments/'))return new Response(JSON.stringify({id:'pay_artisttest',order_id:'order_artisttest'+orderSequence,status:captureStatus,amount:captureAmount,currency:'INR'}),{status:200,headers:{'Content-Type':'application/json'}});
 throw Error('Unexpected external request blocked: '+url);
};
const {getDb}=require('../src/lib/db');
const {siteContent,cottages,bookings}=require('../src/lib/db/schema');
const {eq}=require('drizzle-orm');
const {migrate}=require('drizzle-orm/pglite/migrator');
const {createLead,createBooking,getBooking,listBookings,updateBookingStatus}=require('../src/lib/store');
const {upsertAdmin}=require('../src/lib/db/users');
const {createSessionToken}=require('../src/lib/auth');
const {NextRequest}=server;
const approvalRoute=require('../src/app/api/admin/leads/[id]/artist-escape-review/route');
const publicRoute=require('../src/app/api/artist-escape/booking/route');
const standardRoute=require('../src/app/api/bookings/route');
const genericVerify=require('../src/app/api/razorpay/verify/route');
const {artistEscapeQuote,portfolioHref}=require('../src/lib/artist-escape-plans');
const flow=require('../src/lib/artist-escape-booking');
const {withStayBookingLock}=require('../src/lib/stay-booking-lock');
const {unitsLeft}=require('../src/lib/stay-availability');
const {encryptEmailSecret}=require('../src/lib/email-notifications');
const db=getDb();let cookie='';let sequence=0;
const date=offset=>new Date(Date.now()+offset*86400000).toISOString().slice(0,10);
async function publicPost(body){return publicRoute.POST(new NextRequest('http://localhost:3000/api/artist-escape/booking',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}));}
async function approve(lead,auth=true){return approvalRoute.POST(new NextRequest('http://localhost:3000/api/admin/leads/'+lead.id+'/artist-escape-review',{method:'POST',headers:auth?{cookie}: {},body:JSON.stringify({action:'approve'})}),{params:Promise.resolve({id:lead.id})});}
async function artist(){const lead=await createLead({source:'artist-escape',name:'Test Artist '+(++sequence),email:'artist'+sequence+'@example.test',phone:'9999999999',message:'Portfolio: https://example.test/portfolio\nIntent: develop my painting'});const r=await approve(lead);assert.equal(r.status,200);const {approval}=await r.json();return {lead,approval,token:new URL(approval.link).searchParams.get('token')};}
async function hold(a,start=10,nights=3,planId='short'){const r=await publicPost({action:'reserve',token:a.token,dormSlug:'dorm',planId,checkIn:date(start),checkOut:date(start+nights),accepted:true,amount:1});return {response:r,data:await r.json()};}
async function pay(a,b,extra={}){return publicPost({action:'verify',token:a.token,bookingId:b.id,orderId:b.razorpayOrderId,paymentId:'pay_mock_'+b.id,signature:'mock',...extra});}
test('integrated Artist Escape approval, plan, GST, inventory, payment and admin workflow',async t=>{
 t.after(async()=>{global.fetch=nativeFetch;await db.$client.close();});
 await migrate(db,{migrationsFolder:'./drizzle'});
 await db.insert(cottages).values({slug:'dorm',name:'Dorm',pricePerNight:1000,maxGuests:1,published:true});
 await db.insert(siteContent).values({key:'stay-stock:dorm',value:{quantity:2}});
 await upsertAdmin('admin@example.test','local-test-password');cookie='vinyasa_admin_session='+encodeURIComponent(await createSessionToken('admin@example.test'));
 await t.test('approval requires an admin and only accepts Artist Escape applications',async()=>{const lead=await createLead({source:'contact',name:'Contact User',email:'contact@example.test'});assert.equal((await approve(lead,false)).status,401);assert.equal((await approve(lead)).status,400);});
 await t.test('rejection requires and persists a remark and blocks approval',async()=>{
  const lead=await createLead({source:'artist-escape',name:'Rejected Artist',email:'rejected@example.test'});
  const url='http://localhost:3000/api/admin/leads/'+lead.id+'/artist-escape-review';
  const params={params:Promise.resolve({id:lead.id})};
  const reject=remark=>approvalRoute.POST(new NextRequest(url,{method:'POST',headers:{cookie},body:JSON.stringify({action:'reject',remark})}),params);
  assert.equal((await reject('   ')).status,400);
  assert.equal((await reject(' Portfolio incomplete ')).status,200);
  const result=await approvalRoute.GET(new NextRequest(url,{headers:{cookie}}),params);
  const {rejection}=await result.json();
  assert.equal(rejection.remark,'Portfolio incomplete');
  assert.equal(rejection.emailState,'preview');
  assert.equal((await flow.listArtistReviewStatuses())[lead.id],'Rejected');
  const [mail]=await db.select({value:siteContent.value}).from(siteContent).where(eq(siteContent.key,'artist-escape:mail:rejection:'+lead.id));
  assert.equal(mail.value.to,lead.email);
  assert.match(mail.value.body,/unable to offer you a place/);
  assert.doesNotMatch(mail.value.body,/Portfolio incomplete/);
  assert.equal((await approve(lead)).status,400);
 });
 let a,booking;
 await t.test('approval email contains a signed local booking URL; forged tokens fail',async()=>{a=await artist();assert.equal(a.approval.email.state,'preview');assert.equal((await flow.listArtistReviewStatuses())[a.lead.id],'Approved');assert.match(a.approval.email.body,/http:\/\/localhost:3000\/artist-escape\/book\?token=/);assert.equal((await publicPost({action:'reserve',token:'forged',dormSlug:'dorm',planId:'short',checkIn:date(10),checkOut:date(13),accepted:true})).status,400);});
 await t.test('plan boundaries, 5% GST and safe portfolio links',async()=>{assert.equal(artistEscapeQuote('short',date(10),date(24)).totalAmount,13230);assert.equal(artistEscapeQuote('extended',date(10),date(25)).totalAmount,11812.5);assert.throws(()=>artistEscapeQuote('extended',date(10),date(13)));assert.throws(()=>artistEscapeQuote('short',date(10),date(25)));assert.equal(portfolioHref('javascript:alert(1)'),null);assert.equal(portfolioHref('www.example.com/portfolio'),'https://www.example.com/portfolio');});
 await t.test('server pricing ignores tampered client amount; hold shares normal dorm stock',async()=>{await createBooking({type:'stay',itemSlug:'dorm',checkIn:date(10),checkOut:date(13),guests:1,rooms:1,guestName:'Normal Guest',guestEmail:'normal@example.test',guestPhone:'9999999999',amount:3150});const {response,data}=await hold(a);assert.equal(response.status,200);booking=data.booking;assert.equal(booking.amount,2835);assert.equal(data.pricing.gstAmount,135);assert.equal((await unitsLeft([{slug:'dorm'}],date(10),date(13))).dorm,0);assert.equal((await unitsLeft([{slug:'dorm'}],date(13),date(14))).dorm,2);const other=await artist();assert.equal((await hold(other)).response.status,400);});
 await t.test('one active hold per application; ownership and generic-verification bypass rejected',async()=>{const retry=await hold(a);assert.equal(retry.data.booking.id,booking.id);const b=await artist();assert.equal((await pay(b,booking)).status,400);const wrong=await genericVerify.POST(new NextRequest('http://localhost:3000/api/razorpay/verify',{method:'POST',body:JSON.stringify({bookingId:booking.id,razorpay_order_id:booking.razorpayOrderId,razorpay_payment_id:'pay_mock',razorpay_signature:'mock'})}));assert.equal(wrong.status,400);});
 await t.test('confirmed booking, metadata and email appear once; payment replay is safe',async()=>{assert.equal((await pay(a,booking)).status,200);assert.equal((await pay(a,booking)).status,200);assert.equal((await getBooking(booking.id)).status,'paid');assert.ok((await listBookings()).some(b=>b.id===booking.id));const metadata=await flow.listArtistBookingMetadata();assert.equal(metadata[booking.id].planId,'short');const mail=await flow.getArtistMail(booking.id);assert.match(mail.body,/GST \(5%\): INR 135.00/);assert.match(mail.body,/2835.00/);assert.equal((await hold(a,30)).response.status,400);});
 await t.test('cancelled and expired holds release beds and cannot later confirm',async()=>{const b=await artist();const held=(await hold(b,40)).data.booking;assert.equal((await publicPost({action:'cancel',token:b.token,bookingId:held.id})).status,200);assert.equal((await pay(b,held)).status,400);const expired=(await hold(b,40)).data.booking;await db.update(bookings).set({createdAt:new Date(Date.now()-21*60000)}).where(eq(bookings.id,expired.id));assert.equal((await pay(b,expired)).status,400);assert.equal((await unitsLeft([{slug:'dorm'}],date(40),date(43))).dorm,2);});
 await t.test('simultaneous public and artist reservations cannot oversell the last bed',async()=>{await db.update(siteContent).set({value:{quantity:1}}).where(eq(siteContent.key,'stay-stock:dorm'));const b=await artist();const regular={type:'stay',itemSlug:'dorm',checkIn:date(60),checkOut:date(63),rooms:1,guests:1,guestName:'Normal Race',guestEmail:'race@example.test',guestPhone:'9999999999',acceptGuidelines:true,acceptTerms:true};const [x,y]=await Promise.all([hold(b,60),standardRoute.POST(new NextRequest('http://localhost:3000/api/bookings',{method:'POST',body:JSON.stringify(regular)}))]);assert.equal(Number(x.response.status===200)+Number(y.status===200),1);assert.equal((await unitsLeft([{slug:'dorm'}],date(60),date(63))).dorm,0);});
 await t.test('real Razorpay test callback requires valid signature, captured amount and status',async()=>{process.env.RAZORPAY_KEY_ID='rzp_test_isolated';process.env.RAZORPAY_KEY_SECRET='test-only-secret';const b=await artist();const data=(await hold(b,90,15,'extended')).data;assert.equal(data.order.mock,false);const paymentId='pay_artisttest',signature=createHmac('sha256',process.env.RAZORPAY_KEY_SECRET).update(data.order.id+'|'+paymentId).digest('hex');const args={paymentId,signature};captureAmount=data.order.amount;assert.equal((await pay(b,data.booking,{...args,signature:'invalid'})).status,400);captureStatus='authorized';assert.equal((await pay(b,data.booking,args)).status,400);captureStatus='captured';captureAmount=1;assert.equal((await pay(b,data.booking,args)).status,400);captureAmount=data.order.amount;assert.equal((await pay(b,data.booking,args)).status,200);assert.equal((await getBooking(data.booking.id)).amount,11812.5);});
 await t.test('email transport failure preserves paid booking and retries without duplicating sent email',async()=>{process.env.ARTIST_ESCAPE_EMAIL_MODE='send';await db.insert(siteContent).values({key:'email-notifications:config',value:{provider:'smtp',sender:'sender@example.test',host:'smtp.example.test',port:465,user:'sender',secret:encryptEmailSecret('test-secret')}});failMail=true;const entry=await getBooking(booking.id);let mail=await flow.artistConfirmation(entry);assert.equal(mail.state,'failed');assert.equal((await getBooking(booking.id)).status,'paid');failMail=false;mail=await flow.artistConfirmation(entry);assert.equal(mail.state,'sent');await flow.artistConfirmation(entry);assert.equal(sent.length,1);});
 await t.test('rejection sends to the applicant and retries a failed delivery only once',async()=>{
  const lead=await createLead({source:'artist-escape',name:'Declined Artist',email:'declined@example.test'});
  const before=sent.length;
  failMail=true;
  try {
   const rejected=await flow.rejectArtist(lead.id,'admin@example.test','Internal review note');
   assert.equal(rejected.emailState,'failed');
   assert.equal((await flow.getArtistRejection(lead.id)).remark,'Internal review note');
  } finally {
   failMail=false;
  }
  assert.equal((await flow.rejectArtist(lead.id,'admin@example.test','Internal review note')).emailState,'sent');
  await flow.rejectArtist(lead.id,'admin@example.test','Internal review note');
  assert.equal(sent.length-before,1);
  assert.deepEqual(sent[before].to,[lead.email]);
  assert.match(sent[before].subject,/Artist Escape application/);
 });
 await t.test('ordinary stay payment confirmation still schedules its existing admin/customer emails',async()=>{
  await db.insert(siteContent).values({key:'email-notifications:recipients',value:{defaults:{to:['admin@example.test'],cc:[],bcc:[]},stays:{to:['admin@example.test'],cc:[],bcc:[]}}});
  const normal=await createBooking({type:'stay',itemSlug:'dorm',checkIn:date(150),checkOut:date(151),guests:1,rooms:1,guestName:'Ordinary Guest',guestEmail:'ordinary@example.test',guestPhone:'9999999999',amount:1050,razorpayOrderId:'order_regression'});
  afterTasks.length=0;const before=sent.length;const {confirmCapturedPayment}=require('../src/lib/payment-confirmation');
  await confirmCapturedPayment({id:'pay_regression',order_id:'order_regression',status:'captured',amount:105000,currency:'INR'});
  for(const fn of afterTasks.splice(0))await fn();assert.equal((await getBooking(normal.id)).status,'paid');assert.equal(sent.length-before,2);
 });
 await t.test('Vercel enables the workflow only for the hosted UAT project',()=>{
  const {isHostedArtistEscapeUat}=require('../src/lib/artist-escape-environment');
  const keys=['VERCEL_ENV','VERCEL_PROJECT_PRODUCTION_URL','VERCEL_GIT_REPO_OWNER','VERCEL_GIT_REPO_SLUG','SITE_ORIGIN'];
  const saved=Object.fromEntries(keys.map(key=>[key,process.env[key]]));
  try {
   for(const key of keys)delete process.env[key];
   process.env.VERCEL_ENV='production';
   process.env.VERCEL_PROJECT_PRODUCTION_URL='vinyasa.earth';
   assert.equal(isHostedArtistEscapeUat(),false);
   process.env.VERCEL_GIT_REPO_OWNER='priyankavaish';
   process.env.VERCEL_GIT_REPO_SLUG='vinyasa_uat';
   assert.equal(isHostedArtistEscapeUat(),true);
   process.env.VERCEL_ENV='preview';
   assert.equal(isHostedArtistEscapeUat(),false);
  } finally {
   for(const key of keys){if(saved[key]===undefined)delete process.env[key];else process.env[key]=saved[key];}
  }
 });
 await t.test('shared database lease serializes invocations and releases on error',async()=>{
  const {withDatabaseStayBookingLock}=require('../src/lib/stay-booking-lock');
  let inLock=0;
  const write=()=>withDatabaseStayBookingLock(async()=>{
   assert.equal(++inLock,1);
   await new Promise(resolve=>setTimeout(resolve,30));
   assert.equal(--inLock,0);
  });
  await Promise.all([write(),write()]);
  await assert.rejects(withDatabaseStayBookingLock(async()=>{throw Error('test write failure');}),/test write failure/);
  const rows=await db.select().from(siteContent).where(eq(siteContent.key,'stay-booking:write-lock'));
  assert.equal(rows.length,0);
 });
 await t.test('production guard prevents activation',async()=>{process.env.NODE_ENV='production';await assert.rejects(flow.approveArtist(a.lead.id,'admin@example.test','http://localhost:3000'));process.env.NODE_ENV='development';});
});
