import type { Metadata } from "next";
import { BookingForm } from "@/features/booking/components/booking-form";
import { ContactInfo } from "@/features/contact/components/info";
import { getServices } from "@/features/content/server/queries";
import { PageMotion } from "@/features/shared/components/page-motion";

export const metadata: Metadata = {
  title: "Book a Session",
  description: "Request a session at HEX Healing Hub in Butwal, Pokhara or Kapilvastu. We'll confirm the time with you.",
};

export default async function BookPage(props: PageProps<"/book">) {
  const [{ service }, services] = await Promise.all([props.searchParams, getServices()]);
  // ?service=<slug> preselects the service the visitor came from.
  const preselected = services.find((s) => s.slug === service)?.title;
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kathmandu" }).format(new Date());

  return (
    <PageMotion>
      <section aria-labelledby="book-title" className="section-cream min-h-svh">
        <div className="mx-auto w-[90%] pb-24 pt-32 sm:pt-40 lg:pb-32">
          <div className="page-reveal mb-12 flex flex-col items-center gap-5 text-center lg:mb-16">
            <h1 id="book-title" className="font-heading text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Book a session.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-lavender sm:text-lg">
              Tell us what you&apos;d like and when suits you. We&apos;ll confirm by phone or WhatsApp.
            </p>
          </div>
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-8">
            <BookingForm services={services.map((s) => s.title)} defaultService={preselected} today={today} />
            <ContactInfo />
          </div>
        </div>
      </section>
    </PageMotion>
  );
}
