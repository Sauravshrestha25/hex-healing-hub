import Image from "next/image";
import Link from "next/link";
import type { Blog } from "@/features/shared/lib/data";
import { BlogCard } from "./blog-card";
import { formatBlogDate, readingTime } from "@/features/blog/lib/format";

export function BlogList({ blogs }: { blogs: Blog[] }) {
  const [featured, ...remaining] = blogs;

  return (
    <section id="latest-articles" aria-labelledby="articles-title" className="mx-auto w-[90%] scroll-mt-28 pb-24 lg:pb-32">
      <h2 id="articles-title" className="sr-only">Latest Articles</h2>
      {featured ? (
        <>
          <article className="page-reveal">
            <Link href={`/blog/${featured.slug}`} className="group grid overflow-hidden border hairline-gold bg-purple/25 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-64 overflow-hidden sm:min-h-96 lg:min-h-[520px]">
                <Image src={featured.image} alt="" fill preload sizes="(min-width: 1024px) 49vw, 90vw" className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-105" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
                <p className="absolute left-6 top-6 border border-white/20 bg-ink/75 px-4 py-2.5 text-xs uppercase tracking-[0.2em] text-gold-light backdrop-blur-sm">Latest Story</p>
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
                <p className="text-xs uppercase tracking-[0.2em] text-gold">{featured.category}</p>
                <h3 className="mt-6 font-heading text-3xl font-semibold leading-tight transition-colors group-hover:text-gold-light xl:text-4xl">{featured.title}</h3>
                <p className="mt-5 text-sm leading-loose text-lavender sm:text-base">{featured.excerpt}</p>
                <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-lavender">
                  {featured.publishedAt && <time dateTime={featured.publishedAt}>{formatBlogDate(featured.publishedAt)}</time>}
                  <span>{readingTime(featured.content)}</span>
                </div>
                <span className="mt-8 inline-flex items-center gap-6 py-2 text-sm text-gold-light">Read the Story <span aria-hidden="true">↗</span></span>
              </div>
            </Link>
          </article>
          {remaining.length > 0 && (
            <div className="mt-20 lg:mt-28">
              <div className="page-reveal mb-10 flex flex-col justify-between gap-5 border-b hairline-gold pb-8 sm:flex-row sm:items-end">
                <div><h2 className="mt-5 font-heading text-3xl sm:text-4xl">A moment to read.<br /><span className="text-gold-light">Something to carry with you.</span></h2></div>
                <p className="text-xs text-lavender">Mindfulness · Learning · Inner awareness</p>
              </div>
              <div className="grid gap-x-12 gap-y-14 md:grid-cols-2 lg:gap-x-20 lg:gap-y-20">
                {remaining.map(blog => <BlogCard key={blog.id} blog={blog} />)}
              </div>
            </div>
          )}
        </>
      ) : <p className="border-y hairline-gold py-16 text-center text-lavender">New reflections are on their way. Check back soon.</p>}
    </section>
  );
}
