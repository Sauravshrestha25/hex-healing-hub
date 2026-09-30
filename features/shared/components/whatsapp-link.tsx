"use client";

import { blogMessage, generalMessage, serviceMessage, whatsappUrl } from "@/features/shared/lib/whatsapp";

/** WhatsApp-style glyph (speech bubble with a handset), drawn in currentColor. */
export function WhatsAppIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M3.2 20.8l1.3-4.1A9 9 0 1 1 8 20.1z" />
      <path d="M9 7.6c-.4 0-.9.4-.9 1.2 0 2.6 3.3 6.2 6.4 6.8.9.2 1.5-.3 1.6-.9l.1-.7-1.9-.9-.8.9c-1.2-.4-2.6-1.8-3-3l.8-.8-.8-2c-.3-.1-.8-.6-1.5-.6z" />
    </svg>
  );
}

/** Builds the message for the page being viewed: service and blog pages name what the visitor is reading. */
function messageForCurrentPage() {
  const pageUrl = `${window.location.origin}${window.location.pathname}`;
  const title = document.querySelector("main h1")?.textContent?.trim();
  if (title && /^\/services\/[^/]+/.test(window.location.pathname)) return serviceMessage(title, pageUrl);
  if (title && /^\/blog\/[^/]+/.test(window.location.pathname)) return blogMessage(title, pageUrl);
  return generalMessage(pageUrl);
}

/**
 * Opens a WhatsApp chat with the business. The prefilled message is worked out on click from the
 * current page; without JS the link still opens WhatsApp with a general hello.
 */
export function WhatsAppLink({
  className,
  children,
  label = "Chat with us on WhatsApp",
  onNavigate,
}: {
  className?: string;
  children: React.ReactNode;
  label?: string;
  onNavigate?: () => void;
}) {
  return (
    <a
      href={whatsappUrl(generalMessage())}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={className}
      onClick={(event) => {
        event.currentTarget.href = whatsappUrl(messageForCurrentPage());
        onNavigate?.();
      }}
    >
      {children}
    </a>
  );
}
