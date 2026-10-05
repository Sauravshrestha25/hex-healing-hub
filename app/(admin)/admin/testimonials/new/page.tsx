import { redirect } from "next/navigation";
import { TestimonialForm } from "@/features/admin/components/testimonial-form";
import { PageHeader } from "@/features/admin/components/page-header";
import { getViewer } from "@/features/admin/server/viewer";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Add testimonial" };

export default async function NewTestimonialPage() {
  if (!(await getViewer()).isVerified) redirect("/admin/testimonials");
  const { services: catalog, healers } = container();
  const [services, healerNames] = await Promise.all([catalog.list().then((list) => list.map((service) => service.title)), healers.listNames()]);
  return (
    <>
      <PageHeader title="Add testimonial" back={{ href: "/admin/testimonials", label: "Testimonials" }} />
      <TestimonialForm services={services} healers={healerNames} />
    </>
  );
}
