import { redirect } from "next/navigation";
import { FaqForm } from "@/features/admin/components/faq-form";
import { PageHeader } from "@/features/admin/components/page-header";
import { getViewer } from "@/features/admin/server/viewer";

export const metadata = { title: "Add question" };

export default async function NewFaqPage() {
  if (!(await getViewer()).isVerified) redirect("/admin/faqs");
  return (
    <>
      <PageHeader title="Add question" back={{ href: "/admin/faqs", label: "FAQs" }} />
      <FaqForm />
    </>
  );
}
