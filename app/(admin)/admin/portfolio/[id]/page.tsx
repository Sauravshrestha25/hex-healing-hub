import { notFound } from "next/navigation";
import { GalleryForm } from "@/features/admin/components/gallery-form";
import { PageHeader } from "@/features/admin/components/page-header";
import { getViewer } from "@/features/admin/server/viewer";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Edit photo" };

export default async function EditGalleryItemPage(props: PageProps<"/admin/portfolio/[id]">) {
  const { id } = await props.params;
  const [viewer, item] = await Promise.all([getViewer(), container().gallery.findById(id)]);
  if (!item) notFound();

  return (
    <>
      <PageHeader title={item.title} back={{ href: "/admin/portfolio", label: "Portfolio" }} />
      <GalleryForm item={item} readOnly={!viewer.isVerified} />
    </>
  );
}
