import Image from "next/image";
import { CONTACT_EMAIL, GOOGLE_REVIEWS_URL, LOCATIONS, POKHARA_HOURS } from "@/features/shared/lib/data";

export function ContactInfo() {
  return (
    <aside aria-label="Call or email" className="page-reveal grid min-w-0 gap-4">
      {LOCATIONS.map((location) => (
        <a key={location.city} href={`tel:${location.phone}`} className="card-hover-cream group flex items-center justify-between gap-4 px-6 py-5">
          <span>
            <span className="block text-sm text-lavender">Call {location.city}</span>
            <span className="mt-1 block font-heading text-xl">{location.phone}</span>
          </span>
          <span aria-hidden="true" className="text-xl transition-transform group-hover:translate-x-1">→</span>
        </a>
      ))}
      <a
        href={GOOGLE_REVIEWS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="card-hover-cream group flex items-center justify-between gap-4 px-6 py-5"
      >
        <span className="min-w-0">
          <span className="block text-sm text-lavender">Visit our Pokhara centre</span>
          <span className="mt-1 block font-heading text-lg">{POKHARA_HOURS}</span>
        </span>
        <span aria-hidden="true" className="text-xl transition-transform group-hover:translate-x-1">↗</span>
      </a>
      <a href={`mailto:${CONTACT_EMAIL}`} className="card-hover-cream group flex items-center justify-between gap-4 px-6 py-5">
        <span className="min-w-0">
          <span className="block text-sm text-lavender">Or email us</span>
          <span className="mt-1 block break-all font-heading text-lg">{CONTACT_EMAIL}</span>
        </span>
        <span aria-hidden="true" className="text-xl transition-transform group-hover:translate-x-1">→</span>
      </a>
      <div className="relative hidden aspect-[4/3] overflow-hidden rounded-3xl lg:block">
        <Image src="/images/contact.jpg" alt="Soft sunlight on a quiet forest path" fill sizes="30vw" className="object-cover" />
      </div>
    </aside>
  );
}
