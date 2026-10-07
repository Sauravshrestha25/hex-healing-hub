import { notFound } from "next/navigation";
import { FaqForm } from "@/features/admin/components/faq-form";
import { PageHeader } from "@/features/admin/components/page-header";
import { getViewer } from "@/features/admin/server/viewer";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Edit question" };

export default async function EditFaqPage(props: PageProps<"/admin/faqs/[id]">) {
  const { id } = await props.params;
  const [viewer, item] = await Promise.all([getViewer(), container().faqs.findById(id)]);
  if (!item) notFound();

  return (
    <>
      <PageHeader title="Edit question" back={{ href: "/admin/faqs", label: "FAQs" }} />
      <FaqForm item={item} readOnly={!viewer.isVerified} />
    </>
  );
}
