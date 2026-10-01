import Image from "next/image";
import Link from "next/link";
import { WhatsAppIcon, WhatsAppLink } from "@/features/shared/components/whatsapp-link";

// Adapted from the centre's own description of a first session (previous website FAQ).
const STEPS = [
  {
    title: "Reach out",
    body: "Message us on WhatsApp, call your nearest centre or book online. Ask anything first; there's no obligation.",
  },
  {
    title: "A gentle conversation",
    body: "Your first visit begins with talking: what you're going through and what you hope for. Nothing is scripted.",
  },
  {
    title: "Your session",
    body: "Shaped around you, in person in Butwal, Pokhara or Kapilvastu, or online from wherever you are.",
  },
  {
    title: "Space to reflect",
    body: "Take your time. Some feel a shift after one session, others prefer a short series. You decide if and when to return.",
  },
];

/** "Your first visit": what actually happens, in four calm steps, before the testimonials. */
export function FirstVisit() {
  return (
    <section aria-labelledby="first-visit-title" className="relative isolate overflow-hidden">
      <div data-parallax aria-hidden="true" className="absolute inset-x-0 -top-[12%] -bottom-[12%] -z-10">
        <Image src="/images/himalaya.jpg" alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-brand-purple/90" />

      <div className="mx-auto w-[90%] py-24 lg:py-32">
        <div className="page-reveal mx-auto max-w-2xl text-center">
          <h2 id="first-visit-title" className="font-heading text-3xl leading-tight text-brand-cream">
            Your first visit, step by step.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-lavender">
            No pressure and no script. Here is what to expect when you reach out to us.
          </p>
        </div>

        <ol className="relative mt-16 grid gap-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-8">
          {/* The thread joining the steps (wide screens), running through the centre of the numbers. */}
          <span aria-hidden="true" className="absolute inset-x-[12.5%] top-7 hidden h-px bg-brand-cream/25 lg:block" />
          {STEPS.map((step, index) => (
            <li key={step.title} className="page-reveal relative flex flex-col items-center text-center">
              <span className="grid size-14 place-items-center rounded-full bg-brand-purple font-heading text-lg text-brand-cream ring-1 ring-brand-cream/40">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 font-heading text-xl text-brand-cream">{step.title}</h3>
              <p className="mt-3 max-w-xs text-base leading-relaxed text-lavender">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="page-reveal mt-16 flex flex-col items-center gap-8 text-center lg:mt-20">
          <p className="max-w-xl text-base leading-relaxed text-lavender">
            Our practices are complementary and supportive, never a replacement for medical or psychiatric care.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/book" className="btn-gold rounded-full px-7 py-3.5 text-sm font-medium">
              Book a Session
            </Link>
            <WhatsAppLink className="btn-ghost inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium">
              <WhatsAppIcon className="size-4" /> Ask on WhatsApp
            </WhatsAppLink>
          </div>
        </div>
      </div>
    </section>
  );
}
