import type { Metadata } from "next";
import { Montserrat, Poppins, Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

const poppins = Poppins({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "HEX Healing Hub — Heal Within • Awaken • Transform",
    template: "%s — HEX Healing Hub",
  },
  description:
    "HEX Healing Hub is a spiritual wellness and learning center offering meditation, energy-focused practices, hypnotherapy and spiritual education.",
  icons: {
    icon: "/images/hex-mark.svg",
    apple: "/colorful_logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the script below may add `hex-preloaded` to <html> before React hydrates.
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${montserrat.variable} ${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col overflow-x-hidden bg-background text-foreground">
        {/* Skip the site preloader on later page loads in the same visit, before it paints. */}
        <Script id="hex-preloaded" strategy="beforeInteractive">
          {"try{if(sessionStorage.getItem('hex-preloaded'))document.documentElement.classList.add('hex-preloaded')}catch(e){}"}
        </Script>
        {children}
      </body>
    </html>
  );
}
