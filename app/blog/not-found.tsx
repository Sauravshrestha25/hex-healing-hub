import Link from "next/link";

export default function BlogNotFound() {
  return (
    <section className="flex min-h-[70svh] flex-col items-center justify-center bg-ink px-[5%] pb-20 pt-36 text-center text-ivory">
      <h1 className="mt-8 font-heading text-4xl sm:text-5xl">This article couldn&apos;t be found.</h1>
      <p className="mt-6 max-w-lg text-lavender">Explore our latest reflections on mindfulness, learning and spiritual wellbeing.</p>
      <Link href="/blog" className="btn-gold mt-9 rounded-full px-8 py-4 text-sm font-medium">Back to Blogs</Link>
    </section>
  );
}
