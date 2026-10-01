import type { Metadata } from "next";
import { BookingForm } from "@/features/booking/components/booking-form";
import { ContactInfo } from "@/features/contact/components/info";
import { getServices } from "@/features/content/server/queries";
import { PageMotion } from "@/features/shared/components/page-motion";
import { PageHero } from "@/features/shared/components/page-hero";

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
      <PageHero
        id="book-title"
        title="Book a session."
        intro="Tell us what you'd like and when suits you. We'll confirm by phone or WhatsApp."
        image={{ src: "/images/spiritual-awakening.jpg", alt: "A person above the clouds at sunrise, arm raised" }}
      />
      <section aria-label="Booking form" className="section-cream">
        <div className="mx-auto w-[90%] py-16 lg:py-24">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-8">
            <BookingForm services={services.map((s) => s.title)} defaultService={preselected} today={today} />
            <ContactInfo />
          </div>
        </div>
      </section>
    </PageMotion>
  );
}
