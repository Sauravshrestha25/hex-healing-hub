import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getBlog, getBlogs } from "@/features/shared/lib/data";
import { BlogCard } from "@/features/blog/components/blog-card";
import { formatBlogDate, readingTime } from "@/features/blog/lib/format";
import { PageMotion } from "@/features/shared/components/page-motion";

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const blog = getBlog(slug);
  if (!blog) return {};
  return { title: blog.title, description: blog.excerpt };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const blog = getBlog(slug);
  if (!blog) notFound();
  const related = getBlogs().filter(post => post.slug !== blog.slug).sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")).slice(0, 2);

  return (
    <PageMotion>
      <article>
        <header className="bg-[radial-gradient(ellipse_at_top_right,#243B8F44,transparent_65%)]">
          <div className="page-reveal mx-auto w-[90%] max-w-5xl pb-12 pt-32 sm:pt-40 lg:pb-16">
            <Link href="/blog" className="inline-flex items-center gap-3 py-3 text-sm text-gold-light underline decoration-gold/40 underline-offset-8"><span aria-hidden="true">←</span> Back to Blogs</Link>
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-lavender">
              <span className="uppercase tracking-[0.18em] text-gold">{blog.category}</span>
              {blog.publishedAt && <time dateTime={blog.publishedAt}>{formatBlogDate(blog.publishedAt)}</time>}
              <span>{readingTime(blog.content)}</span>
            </div>
            <h1 className="mt-7 font-heading text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">{blog.title}</h1>
            <p className="mt-7 max-w-3xl text-base leading-relaxed text-lavender sm:text-xl">{blog.excerpt}</p>
          </div>
        </header>
        <div className="page-reveal relative mx-auto aspect-[16/10] w-[90%] max-w-6xl overflow-hidden sm:aspect-[21/9]">
          <Image src={blog.image} alt="" fill preload sizes="(min-width: 1280px) 1152px, 90vw" className="object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" />
        </div>
        <div className="mx-auto w-[90%] max-w-3xl py-14 lg:py-20">
          <div className="page-reveal space-y-7 text-base leading-loose text-ivory/85 sm:text-lg">
            {blog.content.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>
          <div className="page-reveal mt-10 flex flex-col justify-between gap-4 border-t hairline-gold pt-7 sm:flex-row sm:items-center">
            <p className="text-xs uppercase tracking-[0.15em] text-lavender">HEX Healing Hub · Heal Within</p>
            <Link href="/contact" className="w-fit py-2 text-sm text-gold-light">Continue the Conversation <span aria-hidden="true" className="ml-3">↗</span></Link>
          </div>
        </div>
      </article>
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="border-t hairline-gold bg-purple/20">
          <div className="mx-auto w-[90%] py-20 lg:py-28">
            <div className="page-reveal mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div><p className="eyebrow">Keep Reading</p><h2 id="related-title" className="mt-5 font-heading text-3xl sm:text-4xl">A little more <span className="font-light italic text-gold-metal">to reflect on.</span></h2></div>
              <Link href="/blog" className="w-fit py-3 text-sm text-gold-light underline decoration-gold/40 underline-offset-8">View All Blogs <span aria-hidden="true" className="ml-3">↗</span></Link>
            </div>
            <div className="grid gap-12 md:grid-cols-2 lg:gap-20">{related.map(post => <BlogCard key={post.id} blog={post} />)}</div>
          </div>
        </section>
      )}
    </PageMotion>
  );
}
