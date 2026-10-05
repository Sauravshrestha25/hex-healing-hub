"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WhatsAppIcon, WhatsAppLink } from "./whatsapp-link";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/healers", label: "Healers" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blogs" },
  { href: "/contact", label: "Contact" },
];

export function NavBar() {
  const pathname = usePathname();
  const hasDarkBackground = ["/", "/about", "/services", "/portfolio", "/contact", "/blog", "/book"].includes(pathname) || pathname.startsWith("/blog/") || pathname.startsWith("/services/") || pathname.startsWith("/healers");
  const [scrolled, setScrolled] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // These pages open on a cream header, so the bar reads purple until it scrolls onto its own background.
  // (Home, About, Services, Portfolio, Blogs and Book open on a photo and keep the cream bar.)
  const creamHeader = pathname === "/contact" || pathname.startsWith("/blog/") || pathname.startsWith("/services/");
  const onCream = creamHeader && !scrolled && !open;
  const accent = onCream ? "text-brand-purple" : "text-brand-cream";
  const accentHover = onCream ? "hover:text-brand-purple" : "hover:text-brand-cream";
  const dark = (hasDarkBackground || open) && !onCream;
  const bar = open
    ? "bg-transparent"
    : hasDarkBackground
      ? scrolled
        ? "bg-brand-purple border-b border-brand-cream/10"
        : "bg-transparent"
      : "bg-background/90 backdrop-blur border-b border-border";

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-colors duration-500 ${bar} ${onCream ? "on-cream" : ""}`}
      >
        <div className="mx-auto grid w-[90%] grid-cols-[1fr_auto] items-center gap-4 py-4 lg:grid-cols-[1fr_auto_1fr]">
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center justify-self-start">
            {/* Full logo: cream wordmark over purple or photos, the original dark wordmark on cream. */}
            <Image
              src={dark ? "/images/hex-healing-logo-light.svg" : "/images/hex-healing-logo.svg"}
              alt="HEX Healing Hub"
              width={116}
              height={44}
              priority
              className="h-11 w-auto"
            />
          </Link>
          <nav
            className={`hidden gap-8 text-sm lg:flex ${hasDarkBackground ? "text-ivory/75" : "text-muted"}`}
          >
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`relative py-1 transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:mx-auto after:h-px after:bg-current after:transition-all after:duration-500 ${
                  isActive(link.href)
                    ? `after:w-full ${hasDarkBackground ? accent : "text-foreground"}`
                    : `after:w-0 ${hasDarkBackground ? accentHover : "hover:text-foreground"}`
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 justify-self-end">
            <WhatsAppLink
              onNavigate={() => setOpen(false)}
              className={`btn-ghost grid size-11 place-items-center rounded-full ${dark || onCream ? "" : "text-foreground"}`}
            >
              <WhatsAppIcon />
            </WhatsAppLink>
            <Link
              href="/book"
              onClick={() => setOpen(false)}
              aria-current={isActive("/book") ? "page" : undefined}
              className={`btn-gold hidden rounded-full px-6 py-2.5 text-sm font-medium tracking-wide sm:inline-flex ${
                isActive("/book") ? "outline outline-1 outline-offset-4 outline-[var(--button-bg)]/70" : ""
              }`}
            >
              Book Now
            </Link>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className={`relative z-10 flex h-10 w-10 flex-col items-center justify-center gap-1.5 transition-[scale] duration-500 ease-out active:scale-90 active:duration-100 lg:hidden ${
                dark || onCream ? "text-ivory" : "text-foreground"
              }`}
            >
              <span
                className={`block h-px w-5 bg-current transition-transform duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
              />
              <span
                className={`block h-px w-5 bg-current transition-transform duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>
      <div
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-ink px-[5%] transition-opacity duration-500 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`font-heading origin-left py-2 text-2xl font-light transition-[scale,opacity] duration-500 ease-out active:scale-95 active:opacity-70 active:duration-100 ${isActive(link.href) ? "text-brand-cream" : "text-ivory hover:text-brand-cream"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/book" onClick={() => setOpen(false)} className="btn-gold rounded-full px-6 py-3 text-sm font-medium">
            Book Now
          </Link>
          <WhatsAppLink onNavigate={() => setOpen(false)} className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium">
            <WhatsAppIcon /> WhatsApp
          </WhatsAppLink>
        </div>
        <p className="mt-6 text-xs text-gold-light">
          Heal Within. Awaken. Transform.
        </p>
      </div>
    </>
  );
}
