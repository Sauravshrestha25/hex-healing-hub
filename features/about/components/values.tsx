const VALUES = [
  { title: "Compassion", body: "Meet every person with warmth, patience and care." },
  { title: "Respect", body: "Honor individual beliefs, boundaries and personal journeys." },
  { title: "Inner Awareness", body: "Make room to notice, reflect and connect with yourself." },
  { title: "Learning", body: "Stay curious and deepen understanding through spiritual education." },
  { title: "Discipline", body: "Nurture growth through steady, thoughtful practice." },
  { title: "Privacy", body: "Treat personal experiences with sensitivity and discretion." },
  { title: "Service", body: "Support others with sincerity and a spirit of contribution." },
];

export function Values() {
  return (
    <section aria-labelledby="values-title" className="border-y hairline-gold bg-purple/35">
      <div className="mx-auto grid w-[90%] gap-14 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:py-36">
        <div className="page-reveal self-start lg:sticky lg:top-32">
          <h2 id="values-title" className="max-w-md font-heading text-4xl leading-tight sm:text-5xl">
            Seven values.<br /><span className="text-gold-light">One intention.</span>
          </h2>
          <p className="mt-7 max-w-sm text-base leading-relaxed text-lavender">
            To hold a space where people feel respected, supported and free to learn.
          </p>
        </div>
        <ul className="divide-y divide-gold/20 border-t border-gold/20">
          {VALUES.map((value) => (
            <li key={value.title} className="page-reveal grid gap-2 py-7 sm:grid-cols-[0.8fr_1fr] sm:gap-6">
              <h3 className="font-heading text-xl font-semibold">{value.title}</h3>
              <p className="text-sm leading-relaxed text-lavender">{value.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
