import { notFound } from "next/navigation";
import { Mail, Phone, Reply } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { InquiryActions } from "@/features/admin/components/inquiry-actions";
import { InitialsAvatar, Panel } from "@/features/admin/components/kit";
import { PageHeader } from "@/features/admin/components/page-header";
import { InquiryStatusBadge } from "@/features/admin/components/status-badge";
import { formatDateTime, timeAgo } from "@/features/admin/lib/format";
import { getViewer } from "@/features/admin/server/viewer";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Inquiry" };

export default async function InquiryPage(props: PageProps<"/admin/inquiries/[id]">) {
  const { id } = await props.params;
  const [viewer, inquiry] = await Promise.all([getViewer(), container().inquiries.findById(id)]);
  if (!inquiry) notFound();

  const replyHref = `mailto:${inquiry.email}?subject=${encodeURIComponent("Re: Your inquiry to HEX Healing Hub")}`;

  return (
    <>
      <PageHeader
        title={inquiry.name}
        back={{ href: "/admin/inquiries", label: "Inquiries" }}
        meta={<InquiryStatusBadge status={inquiry.status} />}
        description={`Received ${timeAgo(inquiry.createdAt)} · ${formatDateTime(inquiry.createdAt)}`}
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Panel
          title="Message"
          action={inquiry.interest && <span className="rounded-md bg-accent px-2 py-1 text-xs font-medium text-brand">{inquiry.interest}</span>}
        >
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel title="Contact">
            <div className="flex items-center gap-3">
              <InitialsAvatar name={inquiry.name} className="size-11 text-sm" />
              <div className="min-w-0">
                <p className="truncate font-medium">{inquiry.name}</p>
                <p className="truncate text-sm text-muted-foreground">{inquiry.email}</p>
              </div>
            </div>
            <dl className="mt-5 grid gap-3 text-sm">
              <div className="flex items-center gap-2.5">
                <dt><Mail className="size-4 text-muted-foreground" aria-label="Email" /></dt>
                <dd className="min-w-0 truncate"><a href={`mailto:${inquiry.email}`} className="hover:text-brand hover:underline">{inquiry.email}</a></dd>
              </div>
              <div className="flex items-center gap-2.5">
                <dt><Phone className="size-4 text-muted-foreground" aria-label="Phone" /></dt>
                <dd>{inquiry.phone ? <a href={`tel:${inquiry.phone}`} className="hover:text-brand hover:underline">{inquiry.phone}</a> : <span className="text-muted-foreground">Not given</span>}</dd>
              </div>
            </dl>
            <div className="mt-5 grid gap-2">
              <a href={replyHref} className={buttonVariants({ className: "w-full" })}>
                <Reply /> Reply by email
              </a>
              {inquiry.phone && (
                <a href={`tel:${inquiry.phone}`} className={buttonVariants({ variant: "outline", className: "w-full" })}>
                  <Phone /> Call
                </a>
              )}
            </div>
          </Panel>

          {viewer.isVerified && (
            <Panel title="Status" description="Track where this conversation is.">
              <InquiryActions id={inquiry.id} status={inquiry.status} />
            </Panel>
          )}
        </div>
      </div>
    </>
  );
}
