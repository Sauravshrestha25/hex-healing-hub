import { GalleryForm } from "@/features/admin/components/gallery-form";
import { PageHeader } from "@/features/admin/components/page-header";

export const metadata = { title: "Add image" };

export default function NewGalleryItemPage() {
  return (
    <>
      <PageHeader title="Add image" />
      <GalleryForm />
    </>
  );
}
