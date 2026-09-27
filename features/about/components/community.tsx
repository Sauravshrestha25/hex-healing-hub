import Image from "next/image";
import Link from "next/link";
import { LOCATIONS } from "@/features/shared/lib/data";

export function Community() {
  return (
    <section aria-labelledby="community-title" className="relative isolate overflow-hidden">
      <Image src="/images/himalaya.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-ink via-ink/85 to-ink/95" />
      <div className="mx-auto w-[90%] py-24 lg:py-36">
        <div className="page-reveal mx-auto max-w-3xl text-center">
          <p className="eyebrow">Rooted in Nepal</p>
          <h2 id="community-title" className="mt-8 font-heading text-4xl leading-tight sm:text-6xl">
            Three places.<br /><span className="font-light italic text-gold-metal">The same welcome.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-lavender">
            Find HEX Healing Hub in Butwal, Pokhara and Kapilvastu. Connect with a center for details,
            class schedules and appointments.
          </p>
        </div>
        <ul className="page-reveal mt-14 grid border-y hairline-gold md:grid-cols-3">
          {LOCATIONS.map((location, index) => (
            <li key={location.city} className="border-b hairline-gold last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
              <a href={`tel:${location.phone}`} className="group flex items-center justify-between gap-5 px-5 py-8 transition-colors hover:bg-white/5 sm:px-8">
                <div>
                  <p className="mb-3 text-[0.65rem] uppercase tracking-[0.2em] text-gold">0{index + 1} / Our Centers</p>
                  <h3 className="font-heading text-2xl">{location.city}</h3>
                  <p className="mt-2 text-sm text-lavender">{location.phone}</p>
                </div>
                <span aria-hidden="true" className="text-xl text-gold transition-transform motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:translate-x-1">↗</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="page-reveal mt-16 text-center">
          <p className="font-heading text-2xl sm:text-3xl">Your next chapter can begin with a conversation.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-gold rounded-full px-8 py-4 text-sm font-medium">Let&apos;s Connect</Link>
            <Link href="/services" className="btn-ghost rounded-full px-8 py-4 text-sm font-medium">Explore Our Services</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
