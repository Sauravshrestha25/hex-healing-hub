import { SOCIAL_LINKS } from "@/features/shared/lib/data";

type Network = (typeof SOCIAL_LINKS)[number]["label"];

// Line icons in the same 24px, 1.8 stroke style as the site's other icons.
const ICONS: Record<Network, React.ReactNode> = {
  Facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  Instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  TikTok: <path d="M9 12a4 4 0 1 0 4 4V3a5 5 0 0 0 5 5" />,
  YouTube: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
    </>
  ),
};

/** Round icon buttons for the centre's social profiles. */
export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul aria-label="Social media" className={`flex flex-wrap gap-3 ${className}`}>
      {SOCIAL_LINKS.map((social) => (
        <li key={social.label}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`HEX Healing Hub on ${social.label}`}
            title={social.label}
            className="grid size-11 place-items-center rounded-full text-ivory ring-1 ring-inset ring-ivory/25 transition-colors hover:bg-brand-cream hover:text-brand-purple hover:ring-brand-cream"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
              {ICONS[social.label]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
