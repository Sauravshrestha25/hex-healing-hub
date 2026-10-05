import { notFound } from "next/navigation";
import { HealerForm } from "@/features/admin/components/healer-form";
import { PageHeader } from "@/features/admin/components/page-header";
import { getViewer } from "@/features/admin/server/viewer";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Edit healer" };

export default async function EditHealerPage(props: PageProps<"/admin/healers/[id]">) {
  const { id } = await props.params;
  const { healers, services } = container();
  const [viewer, healer, serviceList] = await Promise.all([getViewer(), healers.findById(id), services.list()]);
  if (!healer) notFound();

  return (
    <>
      <PageHeader title={healer.name} back={{ href: "/admin/healers", label: "Healers" }} />
      <HealerForm
        healer={{ ...healer, timeOff: healer.timeOff.map((day) => day.date.toISOString().slice(0, 10)) }}
        services={serviceList.map(({ id: serviceId, title }) => ({ id: serviceId, title }))}
        readOnly={!viewer.isVerified}
      />
    </>
  );
}
