import assert from "node:assert/strict";
import test from "node:test";
import {configuredLinkPayload,DEFAULT_EVENT_PAYMENT_SETTINGS,eventPaymentSettingsSchema,eventPaymentMessages,eventPaymentEmail,razorpayKeyMode} from "../src/lib/event-payment-settings";
test("configured links attach signed-return parameters automatically for the selected event",()=>{
 const data=configuredLinkPayload("dhun-a-handpan-retreat",11000,"Dhun - Dorm","http://localhost:3000");
 assert.equal(data.amount,1100000);assert.equal(data.callback_url,"http://localhost:3000/events/dhun-a-handpan-retreat");assert.equal(data.callback_method,"get");assert.equal(data.notes.vinyasa_event,"dhun-a-handpan-retreat");assert.equal(data.accept_partial,false);
});
test("invalid amount, origin and event targets are rejected",()=>{
 for(const amount of [0,-1,Infinity,NaN,1000001,1.005])assert.throws(()=>configuredLinkPayload("event",amount,"Pass","http://localhost:3000"));
 assert.throws(()=>configuredLinkPayload("../../admin",100,"Pass","http://localhost:3000"));
 assert.throws(()=>configuredLinkPayload("event",100,"Pass","javascript:alert(1)"));
});
test("success and failed previews use independent configured content",()=>{
 const settings=eventPaymentSettingsSchema.parse({...DEFAULT_EVENT_PAYMENT_SETTINGS,successTitle:"Thanks for joining",failureTitle:"Please retry"});
 assert.equal(eventPaymentMessages(settings,"success").title,"Thanks for joining");assert.equal(eventPaymentMessages(settings,"failed").title,"Please retry");
});
test("test emails cannot masquerade as actual payment or booking confirmation",()=>{
 for(const outcome of ["success","failed"] as const){const mail=eventPaymentEmail(DEFAULT_EVENT_PAYMENT_SETTINGS,outcome,"Dhun",{test:true});assert.ok(mail.subject.startsWith("[TEST - NO PAYMENT]"));assert.ok(mail.text.includes("No payment was taken and no booking was confirmed."));}
});
test("failure emails use only failure copy and real emails include their reference",()=>{
 const mail=eventPaymentEmail(DEFAULT_EVENT_PAYMENT_SETTINGS,"failed","Dhun",{reference:"pay_test",amount:11000});assert.ok(mail.text.includes("not completed"));assert.ok(!mail.text.includes(DEFAULT_EVENT_PAYMENT_SETTINGS.successEmailBody));assert.ok(mail.text.includes("pay_test"));assert.ok(mail.text.includes("11000.00"));assert.ok(!mail.subject.includes("[TEST"));
});
test("Razorpay connection mode never reveals credentials",()=>{
 assert.equal(razorpayKeyMode("rzp_test_abc"),"test");assert.equal(razorpayKeyMode("rzp_live_abc"),"live");assert.equal(razorpayKeyMode(),"unconfigured");
});
