import { redirect } from "next/navigation";
import { PageHeader } from "@/features/admin/components/page-header";
import { ServiceForm } from "@/features/admin/components/service-form";
import { getViewer } from "@/features/admin/server/viewer";

export const metadata = { title: "New service" };

export default async function NewServicePage() {
  if (!(await getViewer()).isVerified) redirect("/admin/services");
  return (
    <>
      <PageHeader title="New service" back={{ href: "/admin/services", label: "Services" }} />
      <ServiceForm />
    </>
  );
}
