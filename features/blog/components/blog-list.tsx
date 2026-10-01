import Image from "next/image";
import Link from "next/link";
import type { Blog } from "@/features/shared/lib/data";
import { BlogCard } from "./blog-card";
import { formatBlogDate, readingTime } from "@/features/blog/lib/format";

export function BlogList({ blogs }: { blogs: Blog[] }) {
  const [featured, ...remaining] = blogs;

  return (
    <section id="latest-articles" aria-labelledby="articles-title" className="mx-auto w-[90%] scroll-mt-28 pb-24 pt-14 lg:pb-32 lg:pt-20">
      <h2 id="articles-title" className="sr-only">Latest Articles</h2>
      {featured ? (
        <>
          <article className="page-reveal">
            <Link href={`/blog/${featured.slug}`} className="card-hover-cream group grid gap-3 p-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cream sm:p-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-64 overflow-hidden rounded-2xl sm:min-h-96 lg:min-h-[480px]">
                <Image src={featured.image} alt="" fill preload sizes="(min-width: 1024px) 49vw, 90vw" className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-105" />
                                <p className="absolute left-5 top-5 rounded-full bg-brand-purple px-4 py-2 text-xs uppercase tracking-[0.2em] text-brand-cream">Latest Story</p>
              </div>
              <div className="flex flex-col justify-center p-4 sm:p-8 lg:p-10">
                <p className="text-sm text-lavender">{featured.category}</p>
                <h3 className="mt-4 font-heading text-2xl font-semibold leading-tight sm:text-3xl">{featured.title}</h3>
                <p className="mt-5 text-sm leading-loose text-lavender sm:text-base">{featured.excerpt}</p>
                <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-lavender">
                  {featured.publishedAt && <time dateTime={featured.publishedAt}>{formatBlogDate(featured.publishedAt)}</time>}
                  <span>{readingTime(featured.content)}</span>
                </div>
                <span className="mt-8 inline-flex items-center gap-3 py-2 text-sm font-medium">Read the story <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          </article>
          {remaining.length > 0 && (
            <div className="mt-20 lg:mt-28">
              <div className="page-reveal mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div><h2 className="font-heading text-3xl text-brand-cream">A moment to read. Something to carry with you.</h2></div>
                <p className="text-xs text-lavender">Mindfulness · Learning · Inner awareness</p>
              </div>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {remaining.map(blog => <BlogCard key={blog.id} blog={blog} />)}
              </div>
            </div>
          )}
        </>
      ) : <p className="card-plain py-16 text-center text-lavender">New reflections are on their way. Check back soon.</p>}
    </section>
  );
}
