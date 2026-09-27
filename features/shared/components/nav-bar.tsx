"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blogs" },
];

export function NavBar() {
  const pathname = usePathname();
  const hasDarkBackground = ["/", "/about", "/services", "/portfolio", "/contact", "/blog"].includes(pathname) || pathname.startsWith("/blog/");
  const [scrolled, setScrolled] = useState(false);
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

  const dark = hasDarkBackground || open;
  const bar = open
    ? "bg-transparent"
    : hasDarkBackground
      ? scrolled
        ? "bg-ink/80 backdrop-blur-md border-b border-gold/15"
        : "bg-transparent"
      : "bg-background/90 backdrop-blur border-b border-border";

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-colors duration-500 ${bar}`}
      >
        <div className="mx-auto grid w-[90%] grid-cols-[1fr_auto] items-center gap-4 py-4 lg:grid-cols-[1fr_auto_1fr]">
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 justify-self-start">
            <Image
              src={dark ? "/white_logo.png" : "/colorful_logo.png"}
              alt="HEX Healing Hub"
              width={34}
              height={34}
              className="rounded-full"
            />
            <span
              className={`whitespace-nowrap font-heading text-lg font-semibold tracking-wide sm:text-xl ${dark ? "text-ivory" : "text-foreground"}`}
            >
              HEX Healing Hub
            </span>
          </Link>
          <nav
            className={`hidden gap-8 text-sm lg:flex ${hasDarkBackground ? "text-ivory/70" : "text-muted"}`}
          >
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${hasDarkBackground ? "hover:text-gold-light" : "hover:text-foreground"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 justify-self-end">
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="btn-gold hidden rounded-full px-6 py-2.5 text-sm font-medium tracking-wide sm:inline-flex"
            >
              Contact
            </Link>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className={`relative z-10 flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden ${
                dark ? "text-ivory" : "text-foreground"
              }`}
            >
              <span
                className={`block h-px w-6 bg-current transition-transform duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
              />
              <span
                className={`block h-px w-6 bg-current transition-transform duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
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
        <nav className="flex flex-col gap-6">
          {[
            { href: "/", label: "Home" },
            ...LINKS,
            { href: "/contact", label: "Contact" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-heading text-4xl font-light text-ivory"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="mt-14 text-xs font-medium uppercase tracking-[0.3em] text-gold">
          Heal Within • Awaken • Transform
        </p>
      </div>
    </>
  );
}
