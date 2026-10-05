import { notFound } from "next/navigation";
import { TestimonialForm } from "@/features/admin/components/testimonial-form";
import { PageHeader } from "@/features/admin/components/page-header";
import { getViewer } from "@/features/admin/server/viewer";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Edit testimonial" };

export default async function EditTestimonialPage(props: PageProps<"/admin/testimonials/[id]">) {
  const { id } = await props.params;
  const { testimonials, services, healers } = container();
  const [viewer, item, serviceList, healerNames] = await Promise.all([getViewer(), testimonials.findById(id), services.list(), healers.listNames()]);
  if (!item) notFound();

  return (
    <>
      <PageHeader title={item.name} back={{ href: "/admin/testimonials", label: "Testimonials" }} />
      <TestimonialForm item={item} services={serviceList.map((service) => service.title)} healers={healerNames} readOnly={!viewer.isVerified} />
    </>
  );
}
