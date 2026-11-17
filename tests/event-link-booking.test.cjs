const test=require("node:test");const assert=require("node:assert/strict");
require.cache[require.resolve("server-only")]={exports:{}};
const {PGlite}=require("@electric-sql/pglite");const {drizzle}=require("drizzle-orm/pglite");
const schema=require("../src/lib/db/schema.ts");const pg=new PGlite();const db=drizzle(pg,{schema});
require.cache[require.resolve("../src/lib/db/index.ts")]={exports:{getDb:()=>db}};
require.cache[require.resolve("../src/lib/cms.ts")]={exports:{getEvent:async slug=>slug==="dhun"?{slug,name:"Dhun",dateLabel:"18 December"}:null}};
const {recordEventLinkBooking}=require("../src/lib/event-link-booking.ts");
const payment={id:"pay_actualtest",order_id:"order_actualtest",amount:1100000,email:"checkout-customer@example.com",contact:"+919999999999",notes:{guest_name:"Checkout Guest"}};
test.before(async()=>{await pg.exec(`CREATE TABLE bookings(id uuid PRIMARY KEY,type text NOT NULL,item_slug text NOT NULL,check_in text,check_out text,event_date text,guests integer NOT NULL,rooms integer NOT NULL DEFAULT 1,guest_name text NOT NULL,guest_email text NOT NULL,guest_phone text NOT NULL,amount numeric(12,2) NOT NULL,status text NOT NULL,razorpay_order_id text,razorpay_payment_id text,failure_reason text,terms_accepted_at timestamptz,terms_version text,created_at timestamptz NOT NULL DEFAULT now());`);});
test.after(async()=>pg.close());
test("verified failure records the actual checkout customer and failed booking",async()=>{
 const booking=await recordEventLinkBooking(payment,"dhun","failed");assert.equal(booking.status,"failed");assert.equal(booking.guestEmail,payment.email);assert.equal(booking.guestName,"Checkout Guest");assert.equal(booking.amount,11000);assert.equal(booking.termsAcceptedAt,undefined);
});
test("verified success upgrades failure and duplicate callbacks create only one booking",async()=>{
 const [one,two]=await Promise.all([recordEventLinkBooking(payment,"dhun","paid"),recordEventLinkBooking(payment,"dhun","paid")]);assert.equal(one.id,two.id);assert.equal(one.status,"paid");const count=await pg.query("SELECT count(*)::int AS count FROM bookings");assert.equal(count.rows[0].count,1);
});
test("a late failure cannot downgrade a paid booking",async()=>{
 const booking=await recordEventLinkBooking(payment,"dhun","failed");assert.equal(booking.status,"paid");assert.equal(booking.failureReason,undefined);
});
test("unknown events never create a booking",async()=>{
 assert.equal(await recordEventLinkBooking({...payment,id:"pay_unknown"},"missing","paid"),null);const count=await pg.query("SELECT count(*)::int AS count FROM bookings");assert.equal(count.rows[0].count,1);
});
