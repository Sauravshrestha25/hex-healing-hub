// Launch content: the site's original copy, loaded into the database by prisma/seed.ts.

export const SERVICES = [
  {
    id: "1",
    title: "Spiritual Healing",
    slug: "spiritual-healing",
    image: "/images/spiritual-healing.jpg",
    description:
      "A calm, guided practice to release what weighs on you and restore a sense of peace and balance within.",
  },
  {
    id: "2",
    title: "Energy Healing",
    slug: "energy-healing",
    image: "/images/energy-healing.jpg",
    description:
      "Traditional energy-focused practices to help you feel grounded, balanced and reconnected with your inner state.",
  },
  {
    id: "3",
    title: "Hypnotherapy",
    slug: "hypnotherapy",
    image: "/images/hypnotherapy.jpg",
    description:
      "A relaxed, focused state that supports self-reflection on habits, thoughts and emotional patterns.",
  },
  {
    id: "4",
    title: "Spiritual Awakening",
    slug: "spiritual-awakening",
    image: "/images/spiritual-awakening.jpg",
    description:
      "Guided space for deeper self-inquiry and awareness, rooted in traditional spiritual practice.",
  },
  {
    id: "5",
    title: "Meditation Classes",
    slug: "meditation-classes",
    image: "/images/meditation-classes.jpg",
    description:
      "Structured classes to help you build a steady, sustainable meditation practice at your own pace.",
  },
  {
    id: "6",
    title: "Spiritual Classes",
    slug: "spiritual-classes",
    image: "/images/spiritual-classes.jpg",
    description:
      "Learning-focused sessions for those who want to understand these practices more deeply, not just receive them.",
  },
];

export const BLOGS = [
  {
    id: "1",
    title: "What to Expect From a Hypnotherapy Session",
    slug: "what-to-expect-from-hypnotherapy",
    category: "Self-awareness",
    image: "/images/hypnotherapy.jpg",
    excerpt: "A calm, guided state of focus — not a loss of control. Here's what a first session actually looks like.",
    content:
      "Hypnotherapy is often misunderstood. In reality, it is a relaxed, focused state where you remain fully aware, guided gently through reflection on habits, thoughts and emotional patterns. A first session at HEX Healing Hub begins with a quiet conversation about what you're hoping to explore, followed by a guided relaxation. There is no loss of control — only a calmer space to notice what is already there.",
    publishedAt: "2026-01-01",
  },
  {
    id: "2",
    title: "Meditation Is a Practice, Not a Performance",
    slug: "meditation-is-a-practice-not-a-performance",
    category: "Mindfulness",
    image: "/images/meditation-classes.jpg",
    excerpt: "You don't need a quiet mind to begin meditating. You need a willingness to sit with it.",
    content:
      "Many people avoid meditation because they believe they're 'bad at it' — the mind keeps wandering, thoughts keep arriving. But meditation was never about achieving silence. It is the practice of noticing, gently, and returning. Our meditation classes are built for beginners as much as for those with years of practice, with no pressure to get it right the first time.",
    publishedAt: "2026-01-08",
  },
  {
    id: "3",
    title: "An Introduction to Energy Healing",
    slug: "an-introduction-to-energy-healing",
    category: "Healing practices",
    image: "/images/energy-healing.jpg",
    excerpt: "A gentle overview of what energy healing is, and what a session may involve.",
    content:
      "Energy healing draws on traditional practices focused on balance, awareness and the connection between mind, body and spirit. A session is calm and unhurried — there are no dramatic claims, only a supportive space to slow down. As with all our services, energy healing is offered as a complementary practice alongside, not a replacement for, professional medical or psychological care.",
    publishedAt: "2026-01-15",
  },
  {
    id: "4",
    title: "Why We Keep Our Spaces Simple",
    slug: "why-we-keep-our-spaces-simple",
    category: "Life at HEX",
    image: "/images/prayer-flags.jpg",
    excerpt: "Calm surroundings support calm minds. A short note on the philosophy behind our centers.",
    content:
      "Across our Butwal, Pokhara and Kapilvastu locations, you'll notice the same thing: uncluttered rooms, soft light, quiet corners. This isn't accidental. A peaceful environment is part of the practice itself, and we try to remove distraction wherever we can so the focus stays on you.",
    publishedAt: "2026-01-22",
  },
  {
    id: "5",
    title: "Preparing for Your First Visit to HEX Healing Hub",
    slug: "preparing-for-your-first-visit",
    category: "Getting started",
    image: "/images/contact.jpg",
    excerpt: "A short, practical guide to what to bring, wear and expect before your first session.",
    content:
      "Wear something comfortable. Arrive a little early if you can, so you're not rushing in. Come with an open mind rather than a fixed expectation of what should happen. Our team will walk you through the session beforehand so there are no surprises — just a calm space to begin.",
    publishedAt: "2026-01-29",
  },
];

export const GALLERY = [
  { image: "/images/meditation-classes.jpg", title: "A Moment of Stillness", category: "Mindfulness", alt: "A young monk sitting in meditation outdoors" },
  { image: "/images/himalaya.jpg", title: "Space to Reflect", category: "Nature", alt: "A stupa and prayer flags beneath snow-covered Himalayan peaks" },
  { image: "/images/spiritual-healing.jpg", title: "A Quiet Resonance", category: "Spiritual tradition", alt: "A collection of golden singing bowls" },
  { image: "/images/prayer-flags.jpg", title: "Carried by the Wind", category: "Spiritual heritage", alt: "Colorful prayer flags above a green mountain valley" },
  { image: "/images/contact.jpg", title: "The Slower Path", category: "Nature", alt: "Sunlight falling on a quiet path through a green forest" },
  { image: "/images/spiritual-classes.jpg", title: "Rooted in Tradition", category: "Spiritual heritage", alt: "A white stupa with a golden spire and colorful prayer flags" },
];
