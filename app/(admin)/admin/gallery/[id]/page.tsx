import { notFound } from "next/navigation";
import { GalleryForm } from "@/features/admin/components/gallery-form";
import { PageHeader } from "@/features/admin/components/page-header";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Edit image" };

export default async function EditGalleryItemPage(props: PageProps<"/admin/gallery/[id]">) {
  const { id } = await props.params;
  const item = await container().gallery.findById(id);
  if (!item) notFound();

  return (
    <>
      <PageHeader title="Edit image" />
      <GalleryForm item={item} />
    </>
  );
}
