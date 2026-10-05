import { redirect } from "next/navigation";
import { HealerForm } from "@/features/admin/components/healer-form";
import { PageHeader } from "@/features/admin/components/page-header";
import { getViewer } from "@/features/admin/server/viewer";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Add healer" };

export default async function NewHealerPage() {
  if (!(await getViewer()).isVerified) redirect("/admin/healers");
  const services = (await container().services.list()).map(({ id, title }) => ({ id, title }));
  return (
    <>
      <PageHeader title="Add healer" back={{ href: "/admin/healers", label: "Healers" }} />
      <HealerForm services={services} />
    </>
  );
}
