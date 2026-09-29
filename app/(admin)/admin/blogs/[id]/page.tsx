import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { BlogForm } from "@/features/admin/components/blog-form";
import { PageHeader } from "@/features/admin/components/page-header";
import { PublishedBadge } from "@/features/admin/components/status-badge";
import { timeAgo } from "@/features/admin/lib/format";
import { getViewer } from "@/features/admin/server/viewer";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Edit post" };

export default async function EditBlogPage(props: PageProps<"/admin/blogs/[id]">) {
  const { id } = await props.params;
  const [viewer, blog] = await Promise.all([getViewer(), container().blogs.findById(id)]);
  if (!blog) notFound();

  return (
    <>
      <PageHeader
        title={blog.title}
        back={{ href: "/admin/blogs", label: "Blogs" }}
        meta={<PublishedBadge published={blog.published} />}
        description={`Last edited ${timeAgo(blog.updatedAt)}`}
      >
        {blog.published && (
          <Link href={`/blog/${blog.slug}`} target="_blank" className={buttonVariants({ variant: "outline" })}>
            <ExternalLink /> View post
          </Link>
        )}
      </PageHeader>
      <BlogForm blog={blog} readOnly={!viewer.isVerified} />
    </>
  );
}
