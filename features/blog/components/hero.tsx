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
      image={{ src: "/images/cosmos.jpg", alt: "A night sky full of stars" }}
    />
  );
}
