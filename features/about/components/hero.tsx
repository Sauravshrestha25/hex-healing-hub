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
      intro="A spiritual wellness and learning center. A calm place to pause and grow at your own pace."
      image={{
        src: "/images/meditation-classes.jpg",
        alt: "A young monk seated peacefully in meditation outdoors",
        position: "object-[70%_15%]",
      }}
    />
  );
}
