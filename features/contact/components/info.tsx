import { LOCATIONS, CONTACT_EMAIL } from "@/features/shared/lib/data";

export function ContactInfo() {
  return (
    <div className="page-reveal min-w-0">
      <h2 className="mt-6 font-heading text-3xl leading-tight sm:text-4xl">Close to you.<br /><span className="text-gold-light">Here for you.</span></h2>
      <p className="mt-6 max-w-sm text-sm leading-relaxed text-lavender">Call your nearest center to ask about available sessions, classes and visiting times.</p>
      <ul className="mt-8 divide-y divide-gold/20 border-y hairline-gold">
        {LOCATIONS.map((location) => (
          <li key={location.city}>
            <a href={`tel:${location.phone}`} className="group flex items-center justify-between gap-4 py-6">
              <div className="flex items-start gap-5">
                <div><h3 className="font-heading text-xl">{location.city}</h3><p className="mt-2 text-sm text-lavender transition-colors group-hover:text-gold-light">{location.phone}</p></div>
              </div>
              <span aria-hidden="true" className="text-xl text-gold">↗</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-9">
        <h3 className="text-sm font-medium text-ivory">Prefer to write?</h3>
        <a href={`mailto:${CONTACT_EMAIL}`} className="mt-3 inline-block break-all text-sm text-ivory underline decoration-gold/40 underline-offset-8 transition-colors hover:text-gold-light">{CONTACT_EMAIL}</a>
      </div>
      <p className="mt-9 max-w-sm border-l border-gold/40 pl-5 text-xs leading-relaxed text-lavender">Your privacy matters. Share only what you feel comfortable sharing. Your inquiry helps us understand your interests and respond with care.</p>
    </div>
  );
}
