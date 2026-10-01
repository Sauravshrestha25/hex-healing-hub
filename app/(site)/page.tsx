import { Hero } from "@/features/home/components/hero";
import { FirstVisit } from "@/features/home/components/first-visit";
import { Manifesto } from "@/features/home/components/manifesto";
import { ServicesShowcase } from "@/features/home/components/services-showcase";
import { Community } from "@/features/about/components/community";
import { BowlExperience } from "@/features/home/components/bowl-experience";
import { PageMotion } from "@/features/shared/components/page-motion";
import { getServices, getTestimonials } from "@/features/content/server/queries";
import { Testimonials } from "@/features/shared/components/testimonials";

export default async function Home() {
  const [services, testimonials] = await Promise.all([getServices(), getTestimonials()]);
  return (
    <>
      <Hero />
      <div data-phase="0">
        <Manifesto />
      </div>
      <div data-phase="1">
        <ServicesShowcase services={services} />
      </div>
      <div data-phase="2">
        <BowlExperience />
      </div>
      <PageMotion>
        <FirstVisit />
        <Testimonials items={testimonials} />
      </PageMotion>
      <div data-phase="3">
        {/* Locations + call to action, shared with the About page. */}
        <PageMotion>
          <Community />
        </PageMotion>
      </div>
    </>
  );
}
