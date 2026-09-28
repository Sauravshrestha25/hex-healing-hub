import { notFound } from "next/navigation";
import { PageHeader } from "@/features/admin/components/page-header";
import { ServiceForm } from "@/features/admin/components/service-form";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Edit service" };

export default async function EditServicePage(props: PageProps<"/admin/services/[id]">) {
  const { id } = await props.params;
  const service = await container().services.findById(id);
  if (!service) notFound();

  return (
    <>
      <PageHeader title="Edit service" />
      <ServiceForm service={service} />
    </>
  );
}
