import { LOCATIONS } from "@/features/shared/lib/data";

const pokhara = LOCATIONS.find((l) => l.city === "Pokhara")!;
const others = LOCATIONS.filter((l) => l.city !== "Pokhara");

// Adapted from the FAQ on the centre's previous website (hexhealinghubpokhara.com).
const FAQS = [
  {
    q: "What is energy healing, and how does it work?",
    a: "Energy healing works with the body's natural energy systems to help release blockages, ease tension, and restore balance. Many clients describe feeling lighter, calmer, and more emotionally clear after a session.",
  },
  {
    q: "Is hypnotherapy safe?",
    a: "Yes. Hypnotherapy is a guided, relaxed state of focused attention — you remain fully aware and in control throughout. It's used to help access the subconscious mind and gently work through patterns, habits, or emotional blocks at their root.",
  },
  {
    q: "Do I need to believe in energy healing for it to work?",
    a: "Not necessarily. Many clients come with curiosity rather than certainty, and results often speak for themselves. That said, an open mind tends to help you get the most from the experience.",
  },
  {
    q: "What can I expect in my first session?",
    a: "Your first visit usually starts with a conversation — understanding what you're going through and what you're hoping to work on — before moving into the session itself. There's no set script; sessions are shaped around you.",
  },
  {
    q: "How many sessions will I need?",
    a: "This varies from person to person. Some clients feel significant shifts after a single session, while others benefit from a short series of sessions spaced over days or weeks.",
  },
  {
    q: "Can these sessions help with anxiety, depression, or insomnia?",
    a: "Many clients have come to us specifically for support with anxiety, depression, overthinking, insomnia, and panic attacks, and have reported meaningful improvement. That said, this isn't a replacement for medical or psychiatric treatment.",
  },
  {
    q: "What's the difference between online and in-person sessions?",
    a: "In-person sessions take place at our centres and include hands-on energy work, sound healing, and face-to-face hypnotherapy. Online sessions are guided remotely and offer the same depth of attention for anyone who can't visit in person.",
  },
  {
    q: "Do online sessions actually work as well as in-person ones?",
    a: "Yes — many clients based outside Pokhara, or even outside Nepal, have had strong results with online energy healing and hypnotherapy sessions.",
  },
  {
    q: "Can I train to do this work myself?",
    a: "Yes. We offer hypnosis and energy healing training for those who want to deepen their own personal practice or begin working with others.",
  },
  {
    q: "What are your hours, and do I need an appointment?",
    a: `Our Pokhara centre is open daily from 11am to 5pm. It's best to book a session online or call ahead on ${pokhara.phone} to make sure a time is available.`,
  },
  {
    q: "Where are you located?",
    a: `Our Pokhara centre is on Lakeside Rd, Pokhara, Gandaki Province 33700. We also have centres in ${others.map((l) => `${l.city} (${l.phone})`).join(" and ")}.`,
  },
];

/** Common questions, as a native disclosure list (works without JS, keyboard accessible). */
export function Faq() {
  return (
    <section aria-labelledby="faq-title">
      <div className="mx-auto w-[90%] max-w-5xl py-24 lg:py-32">
        <div className="page-reveal mb-12 text-center">
          <h2 id="faq-title" className="font-heading text-3xl leading-tight text-brand-cream in-[.section-cream]:text-brand-purple">
            Questions, gently answered.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-lavender">
            Anything else on your mind? Message us on WhatsApp or book a first conversation.
          </p>
        </div>
        <div className="page-reveal grid gap-3">
          {FAQS.map((item) => (
            <details key={item.q} className="card-plain group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-heading text-lg">
                {item.q}
                <span aria-hidden="true" className="text-2xl leading-none transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 text-base leading-relaxed text-lavender">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
