import { PageHero } from "@/features/shared/components/page-hero";

export function ServicesHero() {
  return (
    <PageHero
      id="services-title"
      title={
        <>
          Many ways inward.
          <br />A path of your own.
        </>
      }
      image={{ src: "/images/spiritual-classes.jpg", alt: "A stupa strung with prayer flags against a clear sky" }}
    />
  );
}
