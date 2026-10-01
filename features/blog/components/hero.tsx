import { PageHero } from "@/features/shared/components/page-hero";

export function BlogHero() {
  return (
    <PageHero
      id="blogs-title"
      title={
        <>
          A little insight.
          <br />A deeper awareness.
        </>
      }
      intro="Reflections on mindfulness, wellbeing and the practice of understanding yourself."
      image={{ src: "/images/cosmos.jpg", alt: "A night sky full of stars" }}
    />
  );
}
