import Image from "next/image";
import Link from "next/link";
import { LOCATIONS, CONTACT_EMAIL, SOCIAL_LINKS } from "@/features/shared/lib/data";
import { WhatsAppIcon, WhatsAppLink } from "./whatsapp-link";
import { FooterWordmark } from "./footer-wordmark";
import { WebxLogoSparkles } from "./webx-logo-sparkles";

const EXPLORE = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blogs" },
  { href: "/book", label: "Book a Session" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="overflow-hidden border-t hairline-gold bg-ink text-ivory">
      <div className="mx-auto w-[90%] py-20">
        <div className="grid gap-12 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <Image
              src="/white_logo.png"
              alt="HEX Healing Hub"
              width={40}
              height={40}
              className="rounded-full mb-4"
            />
            <p className="font-heading text-lg mb-1">HEX Healing Hub</p>
            <p className="mb-5 text-sm text-brand-cream">
              Heal Within. Awaken. Transform.
            </p>
            <p className="text-sm text-lavender max-w-xs">
              A spiritual wellness and learning center offering meditation,
              energy-focused practices, hypnotherapy and spiritual education.
            </p>
            <ul aria-label="Social media" className="mt-6 flex flex-wrap gap-2">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full bg-ivory/[0.07] px-4 py-2 text-sm text-ivory/85 transition-colors hover:bg-brand-cream hover:text-brand-purple"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium mb-4">Explore</p>
            <ul className="flex flex-col gap-3 text-sm text-lavender">
              {EXPLORE.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-brand-cream transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium mb-4">Contact</p>
            <ul className="flex flex-col gap-3 text-sm text-lavender">
              {LOCATIONS.map((l) => (
                <li key={l.city}>
                  {l.city} — {l.phone}
                </li>
              ))}
              <li>
                <WhatsAppLink className="inline-flex items-center gap-2 transition-colors hover:text-brand-cream">
                  <WhatsAppIcon className="size-4" /> WhatsApp us
                </WhatsAppLink>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="hover:text-gold-light transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <FooterWordmark />
        <div className="mt-8 flex flex-col gap-6 border-t hairline-gold pt-6 text-xs text-lavender/70 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p>© 2026 Hex Healing Hub Pvt. Ltd.</p>
          </div>
          <div className="flex shrink-0 items-center justify-center gap-3 self-end">
            <p className="mt-1.5">Designed &amp; Developed by </p>
            <WebxLogoSparkles
              width={64}
              particleDensity={260}
              className="shrink-0"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
