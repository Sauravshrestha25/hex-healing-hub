import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/features/admin/components/page-header";
import { InquiryStatusBadge } from "@/features/admin/components/status-badge";
import { formatDateTime } from "@/features/admin/lib/format";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Inquiries" };

const FILTERS = [
  { key: "open", label: "Open" },
  { key: "RESOLVED", label: "Resolved" },
  { key: "all", label: "All" },
] as const;

export default async function AdminInquiriesPage(props: PageProps<"/admin/inquiries">) {
  const { status } = await props.searchParams;
  const filter = FILTERS.find((f) => f.key === status)?.key ?? "open";
  const inquiries = await container().inquiries.list(filter === "RESOLVED" ? "resolved" : filter);

  return (
    <>
      <PageHeader title="Inquiries" description="Messages sent through the contact form." />
      <nav aria-label="Filter inquiries" className="mb-4 flex gap-1">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={f.key === "open" ? "/admin/inquiries" : `/admin/inquiries?status=${f.key}`}
            aria-current={filter === f.key ? "page" : undefined}
            className={`rounded-md px-3 py-1.5 text-sm ${filter === f.key ? "bg-secondary font-medium text-secondary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {f.label}
          </Link>
        ))}
      </nav>
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead className="hidden md:table-cell">Interest</TableHead>
              <TableHead className="hidden lg:table-cell">Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Received</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">Nothing here.</TableCell>
              </TableRow>
            )}
            {inquiries.map((inquiry) => (
              <TableRow key={inquiry.id} className={inquiry.status === "NEW" ? "font-medium" : undefined}>
                <TableCell>
                  <Link href={`/admin/inquiries/${inquiry.id}`} className="block hover:text-primary hover:underline">
                    {inquiry.name}
                    <span className="block text-xs font-normal text-muted-foreground">{inquiry.email}</span>
                  </Link>
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">{inquiry.interest ?? "—"}</TableCell>
                <TableCell className="hidden max-w-sm truncate font-normal text-muted-foreground lg:table-cell">{inquiry.message}</TableCell>
                <TableCell><InquiryStatusBadge status={inquiry.status} /></TableCell>
                <TableCell className="hidden font-normal text-muted-foreground sm:table-cell">{formatDateTime(inquiry.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
