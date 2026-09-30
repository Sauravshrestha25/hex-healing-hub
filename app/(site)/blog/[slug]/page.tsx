import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedBlog, getPublishedBlogs } from "@/features/content/server/queries";
import { sanitizeBlogHtml } from "@/features/content/lib/sanitize";
import { BlogCard } from "@/features/blog/components/blog-card";
import { formatBlogDate, readingTime } from "@/features/blog/lib/format";
import { PageMotion } from "@/features/shared/components/page-motion";

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const blog = await getPublishedBlog(slug);
  if (!blog) return {};
  return { title: blog.title, description: blog.excerpt };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const blog = await getPublishedBlog(slug);
  if (!blog) notFound();
  const related = (await getPublishedBlogs()).filter((post) => post.slug !== blog.slug).slice(0, 2);

  return (
    <PageMotion>
      <article>
        <header className="section-cream flex min-h-svh flex-col justify-center">
          <div className="page-reveal mx-auto w-[90%] max-w-5xl pb-16 pt-32 sm:pt-36">
            <Link href="/blog" className="inline-flex items-center gap-3 py-3 text-sm text-gold-light underline decoration-gold/40 underline-offset-8"><span aria-hidden="true">←</span> Back to Blogs</Link>
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-lavender">
              <span className="uppercase tracking-[0.18em] text-gold">{blog.category}</span>
              {blog.publishedAt && <time dateTime={blog.publishedAt}>{formatBlogDate(blog.publishedAt)}</time>}
              <span>{readingTime(blog.content)}</span>
            </div>
            <h1 className="mt-7 font-heading text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{blog.title}</h1>
            <p className="mt-7 max-w-3xl text-base leading-relaxed text-lavender sm:text-xl">{blog.excerpt}</p>
          </div>
        </header>
        <div className="page-reveal relative mx-auto mt-12 aspect-[16/10] w-[90%] max-w-6xl overflow-hidden rounded-3xl sm:aspect-[21/9] lg:mt-16">
          <Image src={blog.image} alt="" fill preload sizes="(min-width: 1280px) 1152px, 90vw" className="object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" />
        </div>
        <div className="mx-auto w-[90%] max-w-3xl py-14 lg:py-20">
          <div
            className="page-reveal blog-body text-base leading-loose text-ivory/85 sm:text-lg"
            dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(blog.content) }}
          />
          <div className="page-reveal mt-10 flex flex-col justify-between gap-4 border-t hairline-gold pt-7 sm:flex-row sm:items-center">
            <p className="text-sm text-lavender">Written by the HEX Healing Hub team</p>
            <Link href="/contact" className="w-fit py-2 text-sm text-gold-light">Continue the Conversation <span aria-hidden="true" className="ml-3">↗</span></Link>
          </div>
        </div>
      </article>
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="section-cream">
          <div className="mx-auto w-[90%] py-20 lg:py-28">
            <div className="page-reveal mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div><h2 id="related-title" className="font-heading text-3xl">A little more to reflect on.</h2></div>
              <Link href="/blog" className="w-fit py-3 text-sm text-gold-light underline decoration-gold/40 underline-offset-8">View All Blogs <span aria-hidden="true" className="ml-3">↗</span></Link>
            </div>
            <div className="grid gap-12 md:grid-cols-2 lg:gap-20">{related.map(post => <BlogCard key={post.id} blog={post} />)}</div>
          </div>
        </section>
      )}
    </PageMotion>
  );
}
