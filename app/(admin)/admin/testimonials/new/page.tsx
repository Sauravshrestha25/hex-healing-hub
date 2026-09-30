import { redirect } from "next/navigation";
import { TestimonialForm } from "@/features/admin/components/testimonial-form";
import { PageHeader } from "@/features/admin/components/page-header";
import { getViewer } from "@/features/admin/server/viewer";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Add testimonial" };

export default async function NewTestimonialPage() {
  if (!(await getViewer()).isVerified) redirect("/admin/testimonials");
  const services = (await container().services.list()).map((service) => service.title);
  return (
    <>
      <PageHeader title="Add testimonial" back={{ href: "/admin/testimonials", label: "Testimonials" }} />
      <TestimonialForm services={services} />
    </>
  );
}
