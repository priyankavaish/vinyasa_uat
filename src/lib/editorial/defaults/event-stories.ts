export const PAUSE_WITHIN_CONTENT = {
  intro: "The Pause Within is an invitation to slow down and become curious about how stress, emotions, tension, overwhelm, disconnection and the need for rest show up in everyday life.",
  context: "This is not a retreat about eliminating stress or achieving a particular state of calm. It is an exploration of our relationship with stress - an opportunity to recognise our patterns, understand our signals and discover what helps us feel supported.",
  explore: [
    "How we recognise when stress is building",
    "How emotions show up physically",
    "What helps us feel more settled and supported",
    "How to notice when we are doing too much",
    "How to pause before reacting automatically",
    "Simple practices that can support us in everyday life",
  ],
  takeBack: [
    "A clearer understanding of your stress responses",
    "Greater awareness of what supports you",
    "More space between what you feel and what you do next",
    "A more compassionate relationship with yourself",
  ],
  passes: [
    { name: "Complete Retreat Pass", price: "Rs. 4,999", detail: "Two-night stay, food and retreat facilitation." },
    { name: "Stay & Retreat Pass", price: "Rs. 2,499", detail: "Two-night stay and retreat facilitation. Meals can be ordered separately." },
    { name: "Community Pass", price: "Rs. 1,800", detail: "For members of the Vinyasa community. Includes stay and food." },
  ],
};

type EditorialEvent = {
  introTitle: string;
  intro: string;
  context: string;
  exploreTitle: string;
  explore: string[];
  takeawayTitle: string;
  takeaways: string[];
  aboutTitle: string;
  about: string;
  passes?: { name: string; price: string; detail: string }[];
  cta: string;
};

export const EDITORIAL_EVENTS: Record<string, EditorialEvent> = {
  "artist-in-residence": {
    introTitle: "A slower way to let practice evolve.",
    intro: "The Vinyasa Artist-in-Residence Program is a four-month living and research opportunity for artists and practitioners who want to deepen their practice within a nature-led, community-oriented environment.",
    context: "Two selected artists live, explore and create between October and January. This is not a retreat and not a production residency. It is a process-driven immersion in which practice can be questioned, documented and reshaped in dialogue with land, people and time.",
    exploreTitle: "What the residency offers",
    explore: ["Four-month residential stay at Vinyasa Earth", "Dormitory accommodation and daily vegetarian meals", "Access to natural, architectural and community spaces", "Space for independent research and artistic inquiry", "Opportunity to host workshops, sessions or offerings", "A growing body of practice-led work for the Vinyasa Archive"],
    takeawayTitle: "What the application asks for",
    takeaways: ["A clear research topic and central question", "Scope, methodology and proposed outcomes", "A tentative October-January timeline", "A plan for process documentation", "A willingness to offer consistent, accessible engagements to the community"],
    aboutTitle: "Research as practice.",
    about: "Residents are expected to develop their inquiry into a well-structured research document, with written reflections, process journals, visual documentation or practice-based findings. Artists retain authorship while contributing to Vinyasa's growing archive of knowledge.",
    cta: "Apply for the residency",
  },
  "artist-unite": {
    introTitle: "Come with your practice. Leave with a community.",
    intro: "Artist Unite is a ten-day interdisciplinary residency built around the experience of living, creating and exchanging practices with artists from completely different worlds.",
    context: "There are no masterclasses here. A painter might invite you into the way they observe; a dancer might share how movement begins; a theatre-maker might introduce a game for discovering characters. The intention is to experience how another artist thinks through their art.",
    exploreTitle: "The rhythm of Artist Unite",
    explore: ["Morning stretch and a 7:30 AM artist process session", "Open afternoons for self-creation and studio time", "Shared evening practice, experiments or conversations", "Community meals, closing circles and spontaneous jams", "A final day at Zariya, the festival created by the residents", "Ten days of living inside an interdisciplinary artistic community"],
    takeawayTitle: "Who this is for",
    takeaways: ["Dancers, painters and theatre-makers", "Visual artists, musicians and sculptors", "Photographers, filmmakers and writers", "Performance artists and interdisciplinary practitioners", "Anyone curious about how other artists live and create"],
    aboutTitle: "And then, we build Zariya.",
    about: "Over the residency, Vinyasa gradually transforms from a home for artists into a festival made by them. Performances, artworks, installations and collaborations find their spaces, and every resident gets an opportunity to present work in a form suited to their practice.",
    passes: [{ name: "Artist Unite 2026", price: "Rs. 18,500 + GST", detail: "Ten nights in a dormitory, daily breakfast and dinner, shared process spaces and participation at Zariya." }],
    cta: "Apply for Artist Unite",
  },
  zariya: {
    introTitle: "A night to create, connect and celebrate.",
    intro: "Zariya is Vinyasa Earth's annual gathering of artists, creators and curious minds - an evening that begins around sunset and slowly unfolds into art, conversations, performances, music and meaningful connections.",
    context: "As the sun sets, Vinyasa becomes a shared creative space. Some things are planned and some emerge from the people who gather: open stages, artist showcases, spontaneous jams, installations, exhibitions and experiences.",
    exploreTitle: "What the evening holds",
    explore: ["Performances and open stages", "Artist showcases and exhibitions", "Conversations across creative disciplines", "Music, spontaneous jams and shared experiences", "Natural spaces and local, conscious choices", "The option to stay back and wake to a slower morning"],
    takeawayTitle: "Come as you are",
    takeaways: ["Come with your art", "Come with a story", "Come with a friend", "Come curious", "Leave with a collaboration, an idea, a conversation or a beautiful memory"],
    aboutTitle: "At the heart of Zariya is connection.",
    about: "Connection between artists and audiences, between different creative disciplines, and between celebration and a more conscious way of experiencing it. Zariya is our way of bringing people back together for the festive season.",
    cta: "Join the gathering",
  },
  "drishti-new-years-retreat": {
    introTitle: "A different kind of New Year.",
    intro: "Drishti is Vinyasa Earth's year-end retreat - three days to step away from the noise, look back at the year that has been, and create space for the one that is about to begin.",
    context: "Drishti means vision: the way we see, perceive and direct our attention. There is nowhere to rush to and nothing you need to become. These days invite you to notice what the year gave you, what it asked of you, what you are ready to leave behind and what you would like to carry forward.",
    exploreTitle: "The experience",
    explore: ["Slow mornings and movement practices", "Meditation, breathwork and time in nature", "Creative explorations and intimate conversations", "Shared meals, laughter and spaces for silence", "An intentional transition into the New Year", "Room to be part of the community or entirely your own"],
    takeawayTitle: "Who is Drishti for?",
    takeaways: ["Anyone who wants to end the year differently", "People arriving alone or with a friend", "Beginners and experienced practitioners alike", "Anyone willing to arrive, participate and give themselves three days", "Those looking for clarity rather than resolutions"],
    aboutTitle: "Sometimes, changing where you stand changes what you can see.",
    about: "Drishti is not a New Year's Eve party disguised as a retreat. It is a slower kind of beginning, rooted in movement, stillness, conversation, nature, creativity and community.",
    cta: "Reserve your place",
  },
  "performing-lab-retreat": {
    introTitle: "Where technique meets ritual, discipline meets play.",
    intro: "Performing Lab is a five-day residential intensive for performers, dancers, actors, theatre-makers, musicians, facilitators and creative explorers seeking a deeper artistic practice through movement, ritual, physical theatre and embodied creation.",
    context: "Led by internationally acclaimed theatre practitioner Sukh Ahlstrom, the lab combines physical theatre, Kalaripayattu, movement research, rhythm, voice, clowning and collective creation in the natural surroundings of Vinyasa Earth.",
    exploreTitle: "What you will explore",
    explore: ["Physical theatre and Kalaripayattu", "Body Weather and active meditations", "Clowning, pantomime and rhythm training", "Voice, singing and body percussion", "Contemporary movement and creative composition", "Training, laboratories, reflection and a final showcase"],
    takeawayTitle: "What you take home",
    takeaways: ["A wider physical and expressive range", "Practical tools for artistic creation and performance", "Stronger presence, improvisation and adaptability", "New movement qualities and creative strategies", "A renewed relationship with curiosity, play and artistic intuition", "An official certificate of participation"],
    aboutTitle: "Learn with Sukh Ahlstrom.",
    about: "Sukh is an international performing artist, director and educator with more than twenty years of experience across physical theatre, dance, martial arts, theatrical anthropology and embodied creative practices. Her work has reached artists and students across Chile, India, Denmark, Brazil, Serbia and Greenland.",
    passes: [{ name: "Early Bird Dorm", price: "Rs. 20,475", detail: "Shared dormitory accommodation. Limited seats available." }, { name: "Dorm Residency", price: "Rs. 24,150", detail: "Shared dormitory accommodation with the full residency experience." }, { name: "Mudhouse Residency", price: "Rs. 32,025", detail: "Twin-sharing earthen mudhouse accommodation." }, { name: "Artist Scholarship", price: "Rs. 15,015", detail: "Limited scholarship-supported dormitory seats for emerging artists and practitioners." }],
    cta: "Apply for Performing Lab",
  },
  "anhad-ka-baaja": {
    introTitle: "An evening of Kabir bhajans.",
    intro: "Anhad ka Baaja is an intimate evening of listening and singing along to the words of Sant Kabir. Led by Priyal, the evening invites us to slow down and experience poetry through music - not only as something to perform, but as something to feel, share and reflect upon.",
    context: "Come as you are. Listen quietly, sing along when you feel called, and spend an evening in the company of music, poetry and people. Food is not included in the ticket; guests can order from the Vinyasa kitchen before the event begins.",
    exploreTitle: "An evening to sit inside",
    explore: ["Kabir bhajans led by Priyal", "Listening as a shared practice", "Space to sing along or simply be present", "A welcome drink at Vinyasa Earth", "Music, poetry and conversation in community"],
    takeawayTitle: "With Priyal",
    takeaways: ["Musician and yoga teacher", "A bridge between science, spirituality and the arts", "Student of the oral traditions of Kabir, Nanak and Meera", "A musical journey shaped by two years learning with Prahlad Tipanya Ji"],
    aboutTitle: "Come listen, sing and spend an evening with Kabir.",
    about: "Priyal's work brings together music, yoga and meditation as tools for healing and self-discovery. Anhad ka Baaja marks a new step in his journey as he brings these bhajans to Vinyasa in his own voice.",
    passes: [{ name: "Entry", price: "Rs. 450 + GST", detail: "Per person. Includes a welcome drink; food can be ordered separately." }],
    cta: "Book your place",
  },
};

