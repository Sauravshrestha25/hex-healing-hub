import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/features/shared/components/nav-bar";
import { Footer } from "@/features/shared/components/footer";

const poppins = Poppins({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
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
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable} h-full`}>
      <body className="frame-lines min-h-full flex flex-col overflow-x-hidden bg-background text-foreground">
        <NavBar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
