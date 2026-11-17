import test from "node:test";
import assert from "node:assert/strict";
import {eventPaymentBookingId,assertEventPaymentMatchesOrder} from "../src/lib/event-checkout";
test("callback and webhook replay resolve to the same booking UUID",()=>{
 assert.equal(eventPaymentBookingId("pay_one"),eventPaymentBookingId("pay_one"));assert.notEqual(eventPaymentBookingId("pay_one"),eventPaymentBookingId("pay_two"));assert.match(eventPaymentBookingId("pay_one"),/^[a-f0-9]{8}-[a-f0-9]{4}-5[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/);assert.throws(()=>eventPaymentBookingId("fake"));
});
test("browser claims cannot change the provider order, amount, currency or unsettled status",()=>{
 const order={id:"order_one",amount:1100000};const payment={id:"pay_one",order_id:"order_one",amount:1100000,currency:"INR",status:"captured"};
 assert.doesNotThrow(()=>assertEventPaymentMatchesOrder(payment,order));assert.doesNotThrow(()=>assertEventPaymentMatchesOrder({...payment,status:"failed"},order));
 for(const change of [{order_id:"order_other"},{amount:1},{currency:"USD"},{status:"authorized"},{status:"created"}])assert.throws(()=>assertEventPaymentMatchesOrder({...payment,...change},order));
});
