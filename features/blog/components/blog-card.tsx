import Image from "next/image";
import Link from "next/link";
import type { Blog } from "@/features/shared/lib/data";
import { formatBlogDate, readingTime } from "@/features/blog/lib/format";

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <article className="page-reveal h-full border-b hairline-gold pb-7">
      <Link href={`/blog/${blog.slug}`} className="group flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-gold">
        <div className="relative aspect-[16/10] overflow-hidden bg-purple">
          <Image src={blog.image} alt="" fill sizes="(min-width: 768px) 43vw, 90vw" className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-105" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/35 to-transparent" />
          <span className="absolute bottom-5 left-5 border border-white/20 bg-ink/75 px-3 py-2 text-[0.65rem] uppercase tracking-[0.15em] text-gold-light backdrop-blur-sm">{blog.category}</span>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-lavender">
          {blog.publishedAt && <time dateTime={blog.publishedAt}>{formatBlogDate(blog.publishedAt)}</time>}
          <span>{readingTime(blog.content)}</span>
        </div>
        <h3 className="mt-4 font-heading text-2xl font-semibold leading-snug transition-colors group-hover:text-gold-light sm:text-3xl">{blog.title}</h3>
        <p className="mb-6 mt-4 text-sm leading-loose text-lavender sm:text-base">{blog.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-6 py-2 text-sm text-gold-light">Read Article <span aria-hidden="true">↗</span></span>
      </Link>
    </article>
  );
}
