import { notFound } from "next/navigation";
import { PageHeader } from "@/features/admin/components/page-header";
import { ServiceForm } from "@/features/admin/components/service-form";
import { getViewer } from "@/features/admin/server/viewer";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Edit service" };

export default async function EditServicePage(props: PageProps<"/admin/services/[id]">) {
  const { id } = await props.params;
  const [viewer, service] = await Promise.all([getViewer(), container().services.findById(id)]);
  if (!service) notFound();

  return (
    <>
      <PageHeader title={service.title} back={{ href: "/admin/services", label: "Services" }} />
      <ServiceForm service={service} readOnly={!viewer.isVerified} />
    </>
  );
}
