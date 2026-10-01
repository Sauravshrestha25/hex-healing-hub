import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/features/shared/components/faq";
import { ContactInfo } from "@/features/contact/components/info";
import { PageMotion } from "@/features/shared/components/page-motion";
import { SocialLinks } from "@/features/shared/components/social-links";
import { WhatsAppIcon, WhatsAppLink } from "@/features/shared/components/whatsapp-link";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Connect with HEX Healing Hub in Butwal, Pokhara or Kapilvastu on WhatsApp or by phone, or book a session online.",
};

export default function ContactPage() {
  return (
    <PageMotion>
      <section aria-labelledby="contact-title" className="section-cream min-h-svh">
        <div className="mx-auto w-[90%] pb-24 pt-32 sm:pt-40 lg:pb-32">
          <div className="page-reveal mb-12 flex flex-col items-center gap-5 text-center lg:mb-16">
            <h1 id="contact-title" className="font-heading text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Let&apos;s begin with a conversation.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-lavender sm:text-lg">
              You don&apos;t need to have all the answers. Tell us where you are, and we&apos;ll take it from there.
            </p>
          </div>
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-8">
            <div className="grid min-w-0 gap-6">
              <div className="page-reveal card-plain rounded-3xl p-6 sm:p-10">
                <h2 className="font-heading text-2xl leading-snug">Message us on WhatsApp</h2>
                <p className="mt-3 max-w-lg text-base leading-relaxed text-lavender">
                  The quickest way to reach us. Ask about a service, a schedule or your first visit, and we&apos;ll reply as soon as we can.
                </p>
                <WhatsAppLink label="Chat with us on WhatsApp" className="btn-gold mt-7 inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-medium">
                  <WhatsAppIcon /> Chat on WhatsApp
                </WhatsAppLink>
              </div>
              <div className="page-reveal card-plain rounded-3xl p-6 sm:p-10">
                <h2 className="font-heading text-2xl leading-snug">Ready to book?</h2>
                <p className="mt-3 max-w-lg text-base leading-relaxed text-lavender">
                  Choose a service, a centre and a day that suits you. We&apos;ll confirm the time with you.
                </p>
                <Link href="/book" className="btn-ghost mt-7 inline-flex rounded-full px-7 py-4 text-sm font-medium">
                  Book a Session
                </Link>
              </div>
              <div className="page-reveal flex flex-wrap items-center gap-4 px-2 text-base">
                <span className="text-lavender">Follow us</span>
                <SocialLinks />
              </div>
            </div>
            <ContactInfo />
          </div>
        </div>
      </section>
      <div className="section-cream border-t border-brand-purple/10">
        <Faq />
      </div>
    </PageMotion>
  );
}
