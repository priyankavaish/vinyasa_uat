import test from "node:test";
import assert from "node:assert/strict";
import { eventGalleryFromForm, eventGallerySettings, eventGalleryPhotos, eventGallerySchema } from "../src/lib/event-gallery";

const venue=[{src:"/seed/grounds-01.jpg",alt:"Farm walk"}];
test("old event forms preserve gallery settings; new forms can explicitly hide it",()=>{
 const form=new FormData();assert.equal(eventGalleryFromForm(form),null);
 form.set("eventGallery","/media/event-1.jpg\n/media/event-1.jpg\nhttps://photos.example.com/event-2.jpg");
 form.set("eventGalleryEnabled","on");
 assert.deepEqual(eventGalleryFromForm(form),{enabled:true,images:["/media/event-1.jpg","https://photos.example.com/event-2.jpg"]});
 form.delete("eventGalleryEnabled");assert.equal(eventGalleryFromForm(form)?.enabled,false);
});
test("custom event photos keep their order and fall back to venue photos only when empty",()=>{
 const settings=eventGallerySettings({enabled:true,images:["/media/portrait.jpg","/media/landscape.jpg"]});
 assert.deepEqual(eventGalleryPhotos(settings,"A new event",venue).map(photo=>photo.src),settings.images);
 assert.deepEqual(eventGalleryPhotos({enabled:true,images:[]},"A new event",venue),venue);
 assert.deepEqual(eventGalleryPhotos({enabled:false,images:settings.images},"A new event",venue),[]);
 assert.deepEqual(eventGallerySettings(undefined),{enabled:true,images:[]});
});
test("gallery rejects unsafe photo sources and excessive uploads",()=>{
 for(const src of ["javascript:alert(1)","//external.example/photo.jpg","https://name:password@example.com/photo.jpg","/photos\\bad.jpg","/photos/bad photo.jpg","data:image/svg+xml,test"]){
  assert.equal(eventGallerySchema.safeParse({images:[src]}).success,false,src);
 }
 assert.equal(eventGallerySchema.safeParse({images:Array(31).fill("/photo.jpg")}).success,false);
 assert.deepEqual(eventGalleryPhotos({enabled:true,images:[]},"Event",[...venue,...venue,{src:"javascript:test",alt:"Invalid"}]),venue);
});
