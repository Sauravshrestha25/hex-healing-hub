const VALUES = [
  {
    title: "Compassion",
    body: "Meet every person with warmth, patience and care.",
  },
  {
    title: "Respect",
    body: "Honor individual beliefs, boundaries and personal journeys.",
  },
  {
    title: "Inner Awareness",
    body: "Make room to notice, reflect and connect with yourself.",
  },
  {
    title: "Learning",
    body: "Stay curious and deepen understanding through spiritual education.",
  },
  {
    title: "Discipline",
    body: "Nurture growth through steady, thoughtful practice.",
  },
  {
    title: "Privacy",
    body: "Treat personal experiences with sensitivity and discretion.",
  },
  {
    title: "Service",
    body: "Support others with sincerity and a spirit of contribution.",
  },
];

export function Values() {
  return (
    <section aria-labelledby="values-title">
      <div className="mx-auto w-[90%] pb-24 lg:pb-32">
        <div className="page-reveal flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <h2
            id="values-title"
            className="font-heading text-3xl leading-tight text-brand-cream"
          >
            Seven values. One intention.
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-lavender">
            To hold a space where people feel respected, supported and free to
            learn.
          </p>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value) => (
            <li key={value.title} className="page-reveal card-plain p-6">
              <h3 className="font-heading text-lg font-semibold">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-lavender">
                {value.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
