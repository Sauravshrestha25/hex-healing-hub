import Image from "next/image";
import Link from "next/link";
import type { Blog } from "@/features/shared/lib/data";
import { formatBlogDate, readingTime } from "@/features/blog/lib/format";

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <article className="page-reveal h-full">
      <Link href={`/blog/${blog.slug}`} className="card-hover-cream group flex h-full flex-col p-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cream">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-purple">
          <Image src={blog.image} alt="" fill sizes="(min-width: 768px) 43vw, 90vw" className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-105" />
          <span className="absolute bottom-4 left-4 rounded-full border border-brand-cream/25 bg-brand-purple/80 px-3 py-1.5 text-xs uppercase tracking-[0.15em] text-brand-cream backdrop-blur-sm">{blog.category}</span>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 px-3 text-sm text-lavender">
          {blog.publishedAt && <time dateTime={blog.publishedAt}>{formatBlogDate(blog.publishedAt)}</time>}
          <span>{readingTime(blog.content)}</span>
        </div>
        <h3 className="mt-3 px-3 font-heading text-xl font-semibold leading-snug">{blog.title}</h3>
        <p className="mb-4 mt-3 px-3 text-sm leading-relaxed text-lavender">{blog.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-3 px-3 pb-2 text-sm font-medium">Read article <span aria-hidden="true">→</span></span>
      </Link>
    </article>
  );
}
