import { Hero } from "@/features/home/components/hero";
import { Manifesto } from "@/features/home/components/manifesto";
import { ServicesShowcase } from "@/features/home/components/services-showcase";
import { Tagline } from "@/features/home/components/tagline";
import { Centers } from "@/features/home/components/centers";
import { Closing } from "@/features/home/components/closing";
import { VideoBackground } from "@/features/home/components/video-background";
import { SplitHeadings } from "@/features/shared/components/split-headings";
import { getServices } from "@/features/content/server/queries";

export default async function Home() {
  const services = await getServices();
  return (
    <>
      <VideoBackground />
      <Hero />
      <div data-phase="0">
        <Manifesto />
      </div>
      <div data-phase="1">
        <ServicesShowcase services={services} />
      </div>
      <div data-phase="2">
        <Tagline />
      </div>
      <div data-phase="3">
        <Centers />
      </div>
      <div data-phase="4">
        <Closing />
      </div>
      <SplitHeadings />
    </>
  );
}
