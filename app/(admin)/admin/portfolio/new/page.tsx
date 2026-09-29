import { redirect } from "next/navigation";
import { GalleryForm } from "@/features/admin/components/gallery-form";
import { PageHeader } from "@/features/admin/components/page-header";
import { getViewer } from "@/features/admin/server/viewer";

export const metadata = { title: "Add photo" };

export default async function NewGalleryItemPage() {
  if (!(await getViewer()).isVerified) redirect("/admin/portfolio");
  return (
    <>
      <PageHeader title="Add photo" back={{ href: "/admin/portfolio", label: "Portfolio" }} />
      <GalleryForm />
    </>
  );
}
