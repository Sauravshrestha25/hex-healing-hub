import { PageHeader } from "@/features/admin/components/page-header";
import { ServiceForm } from "@/features/admin/components/service-form";

export const metadata = { title: "New service" };

export default function NewServicePage() {
  return (
    <>
      <PageHeader title="New service" />
      <ServiceForm />
    </>
  );
}
