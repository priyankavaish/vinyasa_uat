import { eq, sql } from "drizzle-orm";
import { getDb } from "./index";
import { blogs, siteContent } from "./schema";

// Posts copied from https://www.vinyasa.earth/blogs/ (text as published). Images are served from /public/blog.
const POSTS = [
  {
    slug: "settling-in",
    title: "Settling In….",
    excerpt: "Bengaluru – The City Of Hope! Taking it slow as I settle in my cozy new house.",
    coverUrl: "",
    publishedAt: "2025-09-30T00:00:00+05:30",
    html: `
<p>Bengaluru – The City Of Hope! Anything &amp; Everything Can Happen Here………….</p>
<p>Taking it slow as I settle in my cozy new house, slowly unpacking and setting up things, emotions and me myself.</p>
<p>It is ok to not work everyday<br>It is ok to get that sleep you were deprived<br>It is ok to feel hollow from within</p>
<p>While settling in this month, I haven't taken up much freelance works and was only doing little of everything and still felt drained and empty.</p>
<p><strong>WHY?</strong><br>Is it true there is no why sometimes or can it be always?<br>Is it the stamina which is low or the energy or is it me who became lethargic?</p>
<p>Having a place for yourself, does make a lot of diifferenece after 4 months of hustle. Slowly with all these questions and emotions September has come to an end. I don't believe this whole month I was just reflecting on myself.</p>
<p>This is very much required atleast for me to recharge and buckle up for the busiest season of year the last quarter by all means. Kickstarted with lot of ideas, applications and plans and then festive season and most importantly entering into my Birthday Month!</p>
<p>My Birthday is my biggest celebration for myself to look upon how far I have come and all that ups and downs I went through. Yes, it is a big deal for me! Do you really celebrate your birthday? What is it for you?</p>
<p>People set goals and make resolutions for New Year but I do that for my birthday. For some reason I am feeling from Oct'25 to Oct'26 gonna be the busiest year in my life.</p>
<ul><li>To more new connections</li><li>To lots of travel</li><li>To more work gigs</li><li>To more happiness and peace</li></ul>
<p>I am so excited! Will be back with more updates soon.</p>
<p>Signing off……………….Mango</p>`,
  },
  {
    slug: "the-shift",
    title: "The Shift",
    excerpt: "Either things happened or I happened to feel the change within………seems like the winds shifted!",
    coverUrl: "/blog/WhatsApp-Image-2025-08-31-at-18.17.17-1024x459.jpeg",
    publishedAt: "2025-08-31T00:00:00+05:30",
    html: `
<p>Either things happened or I happened to feel the change within………seems like the winds shifted!</p>
<figure><img src="/blog/WhatsApp-Image-2025-08-31-at-18.17.17-1-1024x459.jpeg" alt=""></figure>
<p>While the hustle continued with me getting stressed for not finding the house……….lot of depressed feelings and felt very low, crying in between the nights and self doubting myself as I took another leap of faith after Mango's Kitchen that is not going back to full time job but doing more of freelance works and Bengaluru becoming more and more expensive….will I be able to survive or should I just go back home???????????</p>
<p>I know it is always a step by stey process but the struggle, the hustle was never easy in my life but I always believed that defientely there is a ray of hope which always did happen.</p>
<p>Had to compromise on few things but non – negotiable is good vibes and serenity whether it is work, home, networking or even the dating part. Then, through a friend got chance to visit Varnasi and Gaya. That trip made a shift in me which I realised after starting meditation and sudarshana kriya from Art of Living through another friend who forced me to do. Never knew but it did give me that peace in pieces again and yes, I am doing it everyday now as part of routine, let's see.</p>
<p>After coming back, I didn't have a house still and again same feeling but hook or crook I had to find a house coz I am done crying and yes, I did find my cozy rented home. <strong>"I knew this but we tend to ignore, it is only when I decide and do, things will definetly happen, so it is all me"</strong></p>
<figure><img src="/blog/WhatsApp-Image-2025-08-31-at-18.17.17-1024x459.jpeg" alt=""></figure>
<p>Immediately after finalizing the house, flew to my hometown Visakhapatnam and realised how much I missed that place, the beaches, those clean roads and what not. The beaches and waterbodies are my calling and undoubtedly the bliss on earth for me!</p>
<p>Met my folks at hometown, loved being in my home with peace after long as I couldn't visit hometown like I wanted to for almost two years but was meeting parents wherever I can.</p>
<p>Things on my work front also started getting better and yes something is happening but the good one this time!</p>
<p>Signing off……………….Mango</p>
<figure><img src="/blog/WhatsApp-Image-2025-08-31-at-18.17.17-2-460x1024.jpeg" alt=""></figure>`,
  },
  {
    slug: "the-real-hustle",
    title: "The Real Hustle!",
    excerpt: "HUSTLE – I realised this is never ending in my life, either I seek it or it had to happen.",
    coverUrl: "",
    publishedAt: "2025-07-31T00:00:00+05:30",
    html: `
<p>HUSTLE – I realised this is never ending in my life, either I seek it or it had to happen.</p>
<p>As I said, yes finally picked up some freelance projects and trying to get the survival mode again but definitely a lot went into it in the last two months and may be its worth it.</p>
<p>Feeling of being overstayed at friend's homes (it's only me who is feeling that way though) to the expensive commute – got me into thoughts how having a remote forever kind of job and being in my hometown Visakhapatnam is a bliss to save money. However, I would always choose a challenging one and getting out of my comfort zone kind of things so yeah started taking buses and felt really so cool how well they are connected just that we don't do such things anymore unless its required wala feeling.</p>
<p>No matter what, stars are being aligned or my bad phase is over – slowly things are getting better (touchwood don't want to jinx it though).</p>
<p>Today as I write this blog just realised how somethings you don't plan and it forms pattern but we only realise it later after few events happen.</p>
<p>I have been so lucky and privileged to be part of a great corporate workshop and then I realised the pattern which is all my first best things in art happened with my Telugu only. To name it:</p>
<ul><li>My first voiceover was in Telugu</li><li>My first dubbing was for an ad in Telugu</li><li>My first ad which made me feel like a star was in Telugu</li><li>My first corporate theatre workshop is in Telugu (which I completed few days back and returned just now)</li></ul>
<p>Also, manifestation or the word "THADAASTU" really works when you least expect. I left corporate in December 2022 and my parents were so worried that I am doing everything except finance. I did tell them though finance is always imbibed in me being my academic qualification and a decade of experience which I can always use all over my life in whatever things I do.</p>
<p>Today, another feeling which always feels nostalgic is being part of corporates. Food and Art is why I left a full-time corporate job and when I worked in Hyderabad food startup (which I referred as toxic though had its own shares of few best memories).</p>
<p>I have been part of managing a whole food event for the company I worked for and now doing a theatre workshop for a corporate. So, this proves I don't have to be away from corporates just that the way you work changed.</p>
<p>"What Else I Can Ask For" – after all the above patterns and coincidences.</p>
<p>My house hunt is still on and it is always draining, hoping to soon find a cozy abode and then many more things planned and the list is never ending!</p>
<p>Signing off…………..Mango!</p>`,
  },
  {
    slug: "new-beginnings",
    title: "New Beginnings!",
    excerpt: "\"Bangalore is a city but Bengaluru is an Emotion\" – how this city gave me a new life.",
    coverUrl: "/blog/WhatsApp-Image-2025-06-30-at-23.28.44-1-1.jpeg",
    publishedAt: "2025-06-30T00:00:00+05:30",
    html: `
<p>Namma Bengaluru!</p>
<p>"Bangalore is a city but Bengaluru is an Emotion" – This hit me heard when I saw this written on a wall of a pub which became so trending &amp; viral. But for me, it is not that for me it is about how this city gave me a new life!</p>
<p>Hence, let me share a small story here……. I shifted to Bengaluru in Jan 2014 and that's when everything changed for good. My kickstart of corporate life and my social life like never before. Progressed in life, made amazing connections, unlearned a lot and learned new way of things. Not only this, I started doing multiple things along with my fulltime job like theatre, dance tutoring &amp; choreography, volunteering for causes, helping friends through connecting and that's how I became "A Social Butterfly".</p>
<figure><img src="/blog/WhatsApp-Image-2025-06-30-at-23.28.44-1-1.jpeg" alt=""></figure>
<p>When I had to leave Bengaluru in Dec 2022 to start my entrepreneurship in food that is when it hit me hard how much I love this city and how much this city gave me. I wanted to do something in gratitude and in love for this city and did lot of brainstorming and was lost in the chaos eventually.</p>
<p>My heart was always in Bengaluru though I tried to live elsewhere. Whatever happened and how much ever I tried, the path again led only to this city and then I realised its time to give back to the city which gave me everything to re-start my life after a part of life shattered and ended.</p>
<p>However, I always rise like a phoenix from the ashes every time I hit rock bottom. A blessing in disguise is I always had a ray of hope in me to thrive in life. That is nothing but "My people, My Passion &amp; My Positivity"!</p>
<p>So here I am sitting in my favourite Chai Point and writing this after more than a month of being in Bengaluru. Back to Bengaluru for good and started looking for more and more of freelance projects and now it was much easier as I have fraternity here which I built but definitely should adapt to the new things here. Still, I am all set for the roller coaster ride which always gives me an adrenaline rush.</p>
<p>This one month is mix of emotions, new things, new connections, networking for various reasons, hustling and juggling for survival and what not. Still, like I said I am never this happy in any other place except Namma Bengaluru!</p>
<p>Ahhhhh, is it boring by any chance? I can go on and on and on about Bengaluru diaries…….<br>And I am sure I am gonna do something about it soon!</p>
<p>Are anyone reading my blogs even? If yes, I would love to add at least some interactive element to it and if you folks are up for it let me know!</p>
<p>Signing off………….Mango</p>`,
  },
  {
    slug: "memories-of-vinyasa",
    title: "Memories of Vinyasa",
    excerpt: "Heyaaa I am back! The windy night I experienced Vinyasa's vibe.",
    coverUrl: "/blog/WhatsApp-Image-2025-05-24-at-10.41.15-459x1024.jpeg",
    publishedAt: "2025-05-26T00:00:00+05:30",
    html: `
<p>Heyaaa I am back!</p>
<p>It was the windy night, when I actually experienced Vinyasa's vibe where I saw few artists walk in to visit and stayed for long and then lot of conversations happened and the most magical thing was the flute performance by Raman Acharya with his sound healing technique. That night was mesmerising and unforgettable!</p>
<figure><img src="/blog/WhatsApp-Image-2025-05-24-at-10.41.15-459x1024.jpeg" alt=""></figure>
<p>The next day I also witnessed the sand storm, after which I was worried for my event but the saviours Vinyasa team handled everything so perfectly. Everyone loved the curation and the different taste of each item and their wonderful feedback made my day!</p>
<p>I genuinely feel very happy with small gestures and the little things in life. Especially when it comes to my food, I just want people to cherish and feel soulful whenever they eat my food. That's how these intimate dining experiences validate my passion towards food.</p>
<p>My favourite at Vinyasa is definitely "Laali Bhabhi" – soul of Vinyasa Kitchen. We share the most important and common thing in food i.e. making with lots of love!</p>
<p>And then Abhishek undoubtedly, my buddy and my go to person who understands me so well right from the first conversation. It's the way you vibe instantly with someone really makes the bond to cherish for life!</p>
<figure><img src="/blog/WhatsApp-Image-2025-05-24-at-10.41.15-1-458x1024.jpeg" alt=""></figure>
<p>The next day after my event, I head to Jaipur to explore and stayed in this Jaipur Jantar hostel which was recommended by Vinyasa and trust me its really cozy and beautiful. I was so cozy that I was lazy to even explore Jaipur. Again, food it is their kitchen is my favourite and yes of course I cooked a dish for them before I left(pic attached). Also, next time I visit Jaipur, definitely hosting a brunch event at this quintessential instagramable hostel.</p>
<p>Strange thing was, I am never a solo traveller but tried this time and really felt weird but somehow managed. I might travel alone but definitely I would explore places with my local friends but not alone. But here, maybe the summers or me being alone going everywhere felt really weird and somehow, I couldn't feel the complete vibe of Jaipur like I imagined or visualized in my mind all this while.</p>
<p>Ohhhh, but the sunset at Nahargad fort and the Maharani Rose Whisky is Laajawaab! Hence, definitely would visit sometime in winters to make my incomplete trip complete very soon!</p>
<figure><img src="/blog/WhatsApp-Image-2025-05-24-at-10.41.15-2-675x1024.jpeg" alt=""></figure>
<p>Then back to Mumbai and my little break got extended to another month for family medical emergencies…………so yeah then I experienced these lot of mixed emotions of me pausing life for certain time and not able to go to my destination soon kind of feelings as I was stressing to figure out my next part of journey etc, lot of restlessness, panic and what not. However, everything has a right time is what we forget at times and until then how much ever you try it doesn't happen. Yes, I made peace that it is ok to pause, take it slow and then see how things unfold on its own!</p>
<p>Finally, on my way to Bengaluru as I write this blog on May 21st from the train with a lot of hope for another set of new beginnings in my life………….</p>
<p>Signing off, Mango!</p>
<figure><img src="/blog/WhatsApp-Image-2025-05-24-at-10.55.43-576x1024.jpeg" alt=""></figure>`,
  },
];

/** Inserts the journal posts once per database (flag in site_content), like the other default content. Existing rows are kept. */
export async function ensureJournalPosts() {
  const db = getDb();
  const flag = "journal-seed:v1";
  const [seeded] = await db.select({ key: siteContent.key }).from(siteContent).where(eq(siteContent.key, flag)).limit(1);
  if (seeded) return;
  for (const post of POSTS) {
    await db.insert(blogs).values({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      coverUrl: post.coverUrl,
      bodyHtml: post.html.trim(),
      status: "published",
      publishedAt: new Date(post.publishedAt),
    }).onConflictDoNothing({ target: blogs.slug });
    const [row] = await db.select({ id: blogs.id }).from(blogs).where(eq(blogs.slug, post.slug)).limit(1);
    if (row) await db.insert(siteContent).values({ key: `blog-settings:${row.id}`, value: { category: "", tags: "", seoTitle: "", seoDescription: "", seoKeywords: "", aliases: [] } }).onConflictDoNothing({ target: siteContent.key });
  }
  await db.insert(siteContent).values({ key: flag, value: true }).onConflictDoNothing({ target: siteContent.key });
}
