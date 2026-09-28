import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InquiryActions } from "@/features/admin/components/inquiry-actions";
import { InquiryStatusBadge } from "@/features/admin/components/status-badge";
import { formatDateTime } from "@/features/admin/lib/format";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Inquiry" };

export default async function InquiryPage(props: PageProps<"/admin/inquiries/[id]">) {
  const { id } = await props.params;
  const inquiry = await container().inquiries.findById(id);
  if (!inquiry) notFound();

  const details = [
    { label: "Email", value: <a href={`mailto:${inquiry.email}`} className="text-primary underline">{inquiry.email}</a> },
    { label: "Phone", value: inquiry.phone ? <a href={`tel:${inquiry.phone}`} className="text-primary underline">{inquiry.phone}</a> : "—" },
    { label: "Interested in", value: inquiry.interest ?? "—" },
    { label: "Received", value: formatDateTime(inquiry.createdAt) },
  ];

  return (
    <div className="max-w-3xl">
      <Link href="/admin/inquiries" className="text-sm text-muted-foreground hover:text-foreground">← All inquiries</Link>
      <div className="mt-3 mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{inquiry.name}</h1>
        <InquiryStatusBadge status={inquiry.status} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Message</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <p className="whitespace-pre-wrap leading-relaxed">{inquiry.message}</p>
          <dl className="grid gap-3 border-t pt-4 text-sm sm:grid-cols-2">
            {details.map((d) => (
              <div key={d.label}>
                <dt className="text-muted-foreground">{d.label}</dt>
                <dd className="mt-0.5">{d.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
      <div className="mt-6">
        <InquiryActions id={inquiry.id} status={inquiry.status} />
      </div>
    </div>
  );
}
