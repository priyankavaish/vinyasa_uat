const test = require("node:test");
const assert = require("node:assert/strict");
const {mkdtempSync} = require("node:fs");
const {tmpdir} = require("node:os");
const path = require("node:path");
process.env.DATABASE_URL="pglite:"+mkdtempSync(path.join(tmpdir(),"vinyasa-stay-email-"));
process.env.SESSION_SECRET="isolated-stay-routing-test-secret";
process.env.SMTP_PASSWORD="";
process.env.RESEND_API_KEY="";
const sent=[];
let failNext=false;
require("nodemailer").createTransport=()=>({sendMail:async mail=>{
 if(failNext){failNext=false;throw Error("Temporary mail rejection");}
 sent.push(mail);return {accepted:mail.to};
},close(){}});
const {getDb}=require("../src/lib/db");
const {siteContent}=require("../src/lib/db/schema");
const {migrate}=require("drizzle-orm/pglite/migrator");
const {getNotificationRouting,NOTIFICATION_ROUTING_KEY}=require("../src/lib/notification-routing-store");
const {routingSchema,recipientsForSource}=require("../src/lib/notification-routing");
const {encryptEmailSecret,notifyEntry,listEmailStates,retryNotification,EMAIL_CONFIG_KEY}=require("../src/lib/email-notifications");
const {createLead}=require("../src/lib/store");
const db=getDb();
async function save(key,value){await db.insert(siteContent).values({key,value}).onConflictDoUpdate({target:siteContent.key,set:{value,updatedAt:new Date()}});}
async function lead(source){return createLead({source,name:"Test Guest",email:"guest@example.test",phone:"+919876543210",message:"Availability enquiry"});}
const defaults={to:["general@example.test"],cc:["manager@example.test"],bcc:["archive@example.test"]};

test("stay enquiry inbox routes independently and replies target the guest",async t=>{
 t.after(async()=>{await db.$client.close();});
 await migrate(db,{migrationsFolder:"./drizzle"});
 const config={provider:"smtp",sender:"website@example.test",host:"smtp.example.test",port:465,user:"website",secret:encryptEmailSecret("test-only-secret")};
 await save(EMAIL_CONFIG_KEY,config);
 await t.test("missing and legacy routing use the requested stays inbox",async()=>{
  const initial=await getNotificationRouting();
  for(const source of ["stay-enquiry","work-from-farm"])assert.deepEqual(recipientsForSource(initial,source),{to:["lexabizagency@gmail.com"],cc:[],bcc:[]});
  await save(NOTIFICATION_ROUTING_KEY,{defaults,rules:{"stay-enquiry":{to:["obsolete@example.test"]}}});
  const legacy=await getNotificationRouting();
  assert.deepEqual(legacy.defaults,defaults);
  assert.deepEqual(legacy.stays,{to:["lexabizagency@gmail.com"],cc:[],bcc:[]});
 });
 await t.test("both stay forms notify only the dedicated inbox with guest Reply-To",async()=>{
  for(const source of ["stay-enquiry","work-from-farm"]){
   const start=sent.length,entry=await lead(source);await notifyEntry("lead",entry);
   assert.equal(sent.length,start+1,"does not add an unsolicited customer email");
   const mail=sent.at(-1);
   assert.deepEqual(mail.to,["lexabizagency@gmail.com"]);assert.deepEqual(mail.cc,[]);assert.deepEqual(mail.bcc,[]);
   assert.equal(mail.replyTo,"guest@example.test");
   assert.equal(mail.from.address,"website@example.test");
   assert.match(mail.subject,new RegExp(source));
   await notifyEntry("lead",entry);assert.equal(sent.length,start+1,"successful notices are not duplicated");
  }
 });
 await t.test("other enquiry sources retain general recipients and copies",async()=>{
  for(const source of ["contact","volunteer","artist-residence","artist-unite","organizer","corporate","newsletter","artist-escape"]){
   await notifyEntry("lead",await lead(source));const mail=sent.at(-1);
   assert.deepEqual(mail.to,defaults.to);assert.deepEqual(mail.cc,defaults.cc);assert.deepEqual(mail.bcc,defaults.bcc);
  }
 });
 await t.test("admin can change stay recipients without inheriting general CC/BCC",async()=>{
  const routing=routingSchema.parse({defaults,stays:{to:[" STAYS@example.test ","stays@example.test"],cc:["assistant@example.test"],bcc:[]}});
  assert.deepEqual(routing.stays.to,["stays@example.test"]);
  await save(NOTIFICATION_ROUTING_KEY,routing);
  await notifyEntry("lead",await lead("work-from-farm"));
  const mail=sent.at(-1);assert.deepEqual(mail.to,["stays@example.test"]);assert.deepEqual(mail.cc,["assistant@example.test"]);assert.deepEqual(mail.bcc,[]);
  assert.equal(routingSchema.safeParse({defaults,stays:{to:["invalid"]}}).success,false);
  assert.equal(routingSchema.safeParse({defaults,stays:{to:[]}}).success,false);
  assert(routingSchema.safeParse({defaults}).success,"older callers remain valid");
 });
 await t.test("failed stay notices retry using the current stay inbox",async()=>{
  const entry=await lead("stay-enquiry");failNext=true;await notifyEntry("lead",entry);
  assert.equal((await listEmailStates()).find(state=>state.entryId===entry.id).state,"failed");
  await save(NOTIFICATION_ROUTING_KEY,{defaults,stays:{to:["new-stays@example.test"],cc:[],bcc:[]}});
  await retryNotification("lead",entry.id);
  assert.deepEqual(sent.at(-1).to,["new-stays@example.test"]);
  assert.equal(sent.at(-1).replyTo,"guest@example.test");
  assert.equal((await listEmailStates()).find(state=>state.entryId===entry.id).state,"sent");
 });
 await t.test("Resend uses the same dedicated route and guest reply address",async()=>{
  const original=global.fetch;const calls=[];
  global.fetch=async(url,options)=>{calls.push({url,body:JSON.parse(options.body)});return {ok:true};};
  try{
   await save(EMAIL_CONFIG_KEY,{...config,provider:"resend",secret:encryptEmailSecret("isolated-resend-key")});
   await notifyEntry("lead",await lead("work-from-farm"));
   assert.equal(calls.length,1);assert.equal(calls[0].url,"https://api.resend.com/emails");
   assert.deepEqual(calls[0].body.to,["new-stays@example.test"]);assert.equal(calls[0].body.reply_to,"guest@example.test");
   assert.equal(calls[0].body.cc,undefined);assert.equal(calls[0].body.bcc,undefined);
  }finally{global.fetch=original;}
 });
});
