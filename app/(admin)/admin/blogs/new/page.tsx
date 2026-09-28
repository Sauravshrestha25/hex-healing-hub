import { BlogForm } from "@/features/admin/components/blog-form";
import { PageHeader } from "@/features/admin/components/page-header";

export const metadata = { title: "New post" };

export default function NewBlogPage() {
  return (
    <>
      <PageHeader title="New post" />
      <BlogForm />
    </>
  );
}
