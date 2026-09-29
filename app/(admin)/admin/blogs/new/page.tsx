import { redirect } from "next/navigation";
import { BlogForm } from "@/features/admin/components/blog-form";
import { PageHeader } from "@/features/admin/components/page-header";
import { getViewer } from "@/features/admin/server/viewer";

export const metadata = { title: "New post" };

export default async function NewBlogPage() {
  if (!(await getViewer()).isVerified) redirect("/admin/blogs");
  return (
    <>
      <PageHeader title="New post" back={{ href: "/admin/blogs", label: "Blogs" }} description="Save as a draft first if you're not ready to publish." />
      <BlogForm />
    </>
  );
}
