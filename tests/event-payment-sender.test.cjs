const test=require("node:test");const assert=require("node:assert/strict");
// Isolate server dependencies: no mail is actually sent by these tests.
require.cache[require.resolve("server-only")]={exports:{}};
let connected=true,savedSender=null,providerError=null,calls=[];
require.cache[require.resolve("../src/lib/gmail-send.ts")]={exports:{gmailAccountConfigured:account=>connected&&account==="bookings",sendGmail:async(account,message)=>{if(providerError)throw providerError;calls.push({account,...message});}}};
require.cache[require.resolve("../src/lib/email-notifications.ts")]={exports:{getEmailConfig:async()=>savedSender,sendAccountEmail:async(config,to,subject,text)=>calls.push({sender:config.sender,to:[to],subject,text})}};
const {sendEventPaymentEmail}=require("../src/lib/event-payment-email.ts");
test("event payment mail sends from bookings to the entered customer address",async()=>{
 calls=[];connected=true;providerError=null;savedSender=null;
 await sendEventPaymentEmail("customer@example.com",{subject:"Event test",text:"Preview"});
 assert.equal(calls.length,1);assert.equal(calls[0].account,"bookings");assert.deepEqual(calls[0].to,["customer@example.com"]);
});
test("a different fallback sender cannot silently replace the bookings sender",async()=>{
 calls=[];connected=false;savedSender={sender:"other@example.com"};
 await assert.rejects(()=>sendEventPaymentEmail("customer@example.com",{subject:"Test",text:"Preview"}),/Connect bookings.vinyasaearth@gmail.com/);assert.equal(calls.length,0);
});
test("an explicitly configured bookings sender preserves the customer receiver",async()=>{
 calls=[];connected=false;savedSender={sender:"bookings.vinyasaearth@gmail.com"};
 await sendEventPaymentEmail("guest@example.com",{subject:"Test",text:"Preview"});
 assert.equal(calls[0].sender,"bookings.vinyasaearth@gmail.com");assert.deepEqual(calls[0].to,["guest@example.com"]);
});
test("expired Google authorization is reported instead of claiming email was sent",async()=>{
 calls=[];connected=true;providerError=Error("Gmail token refresh failed: expired");
 await assert.rejects(()=>sendEventPaymentEmail("guest@example.com",{subject:"Test",text:"Preview"}),/connection expired/);assert.equal(calls.length,0);
});
