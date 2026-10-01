import type { ReactNode } from "react";

/** Page wrapper with the site's base colours. Scroll animations come from SiteMotion in the site layout. */
export function PageMotion({ children }: { children: ReactNode }) {
  return <div className="bg-ink text-ivory">{children}</div>;
}
