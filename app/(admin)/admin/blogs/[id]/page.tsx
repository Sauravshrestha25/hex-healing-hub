import { notFound } from "next/navigation";
import { BlogForm } from "@/features/admin/components/blog-form";
import { PageHeader } from "@/features/admin/components/page-header";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Edit post" };

export default async function EditBlogPage(props: PageProps<"/admin/blogs/[id]">) {
  const { id } = await props.params;
  const blog = await container().blogs.findById(id);
  if (!blog) notFound();

  return (
    <>
      <PageHeader title="Edit post" description={blog.published ? `Live at /blog/${blog.slug}` : "Draft: not visible on the website yet."} />
      <BlogForm blog={blog} />
    </>
  );
}
