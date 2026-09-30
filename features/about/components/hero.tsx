import { PageHero } from "@/features/shared/components/page-hero";

export function AboutHero() {
  return (
    <PageHero
      id="about-title"
      title={
        <>
          A little stillness.
          <br />A deeper connection.
        </>
      }
      image={{
        src: "/images/meditation-classes.jpg",
        alt: "A young monk seated peacefully in meditation outdoors",
        position: "object-[70%_15%]",
      }}
    />
  );
}
