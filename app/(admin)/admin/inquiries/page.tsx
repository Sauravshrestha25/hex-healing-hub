import Link from "next/link";
import { Inbox, Mail, Phone } from "lucide-react";
import { cn } from "cn";
import { EmptyState, InitialsAvatar, Panel } from "@/features/admin/components/kit";
import { PageHeader } from "@/features/admin/components/page-header";
import { InquiryStatusBadge } from "@/features/admin/components/status-badge";
import { DeleteButton } from "@/features/admin/components/delete-button";
import { timeAgo } from "@/features/admin/lib/format";
import { deleteInquiry } from "@/features/admin/server/inquiries";
import { getViewer } from "@/features/admin/server/viewer";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Inquiries" };

const FILTERS = [
  { key: "open", label: "Open" },
  { key: "resolved", label: "Resolved" },
  { key: "all", label: "All" },
] as const;

export default async function AdminInquiriesPage(props: PageProps<"/admin/inquiries">) {
  const { status } = await props.searchParams;
  const filter = FILTERS.find((f) => f.key === (typeof status === "string" ? status.toLowerCase() : ""))?.key ?? "open";
  const { inquiries: service } = container();
  const [viewer, inquiries, counts] = await Promise.all([getViewer(), service.list(filter), service.counts()]);

  return (
    <>
      <PageHeader title="Inquiries" description="Messages sent through the website's contact form." />

      <nav aria-label="Filter inquiries" className="mb-4 inline-flex rounded-lg border bg-card p-1">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={f.key === "open" ? "/admin/inquiries" : `/admin/inquiries?status=${f.key}`}
            aria-current={filter === f.key ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
              filter === f.key && "bg-primary text-primary-foreground shadow-sm hover:text-primary-foreground",
            )}
          >
            {f.label}
            <span className={cn("rounded-full bg-muted px-1.5 text-xs tabular-nums", filter === f.key && "bg-white/15")}>{counts[f.key]}</span>
          </Link>
        ))}
      </nav>

      <Panel bodyClassName="p-0">
        {inquiries.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={filter === "open" ? "You're all caught up" : "Nothing here yet"}
            description={filter === "open" ? "No open inquiries. New messages from the contact form will appear here." : undefined}
          />
        ) : (
          <ul className="divide-y">
            {inquiries.map((inquiry) => (
              <li key={inquiry.id} className="flex items-center transition-colors hover:bg-muted/60">
                <Link href={`/admin/inquiries/${inquiry.id}`} className="flex min-w-0 flex-1 gap-3 py-4 pl-5 sm:items-center">
                  <div className="relative">
                    <InitialsAvatar name={inquiry.name} />
                    {inquiry.status === "NEW" && (
                      <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-brand-gold ring-2 ring-card" aria-label="New" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className={cn("truncate", inquiry.status === "NEW" ? "font-semibold" : "font-medium")}>{inquiry.name}</span>
                      {inquiry.interest && <span className="rounded-md bg-accent px-1.5 py-0.5 text-xs text-brand">{inquiry.interest}</span>}
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{inquiry.message}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Mail className="size-3" />{inquiry.email}</span>
                      {inquiry.phone && <span className="inline-flex items-center gap-1"><Phone className="size-3" />{inquiry.phone}</span>}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <InquiryStatusBadge status={inquiry.status} />
                    <span className="text-xs whitespace-nowrap text-muted-foreground">{timeAgo(inquiry.createdAt)}</span>
                  </div>
                </Link>
                <div className="shrink-0 pr-3 pl-2">
                  {viewer.isVerified ? (
                    <DeleteButton id={inquiry.id} itemName={`inquiry from ${inquiry.name}`} action={deleteInquiry} />
                  ) : (
                    <span className="block w-2" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
