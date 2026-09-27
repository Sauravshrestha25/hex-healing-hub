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
          <p className="eyebrow">What Guides Us</p>
          <h2 id="values-title" className="mt-7 max-w-md font-heading text-4xl leading-tight sm:text-5xl">
            Seven values.<br /><span className="font-light italic text-gold-metal">One intention.</span>
          </h2>
          <p className="mt-7 max-w-sm text-base leading-relaxed text-lavender">
            To hold a space where people feel respected, supported and free to learn.
          </p>
          <p aria-hidden="true" className="numeral mt-12 hidden text-[10rem] lg:block">07</p>
        </div>
        <ol className="divide-y divide-gold/20 border-t border-gold/20">
          {VALUES.map((value, index) => (
            <li key={value.title} className="page-reveal grid grid-cols-[2rem_1fr] gap-4 py-7 sm:grid-cols-[2rem_0.8fr_1fr] sm:gap-6">
              <span aria-hidden="true" className="pt-1 font-heading text-xs tracking-widest text-gold">0{index + 1}</span>
              <h3 className="font-heading text-xl font-semibold">{value.title}</h3>
              <p className="col-start-2 text-sm leading-relaxed text-lavender sm:col-start-auto">{value.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
