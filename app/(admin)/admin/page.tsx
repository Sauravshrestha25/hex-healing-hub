import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InquiryStatusBadge } from "@/features/admin/components/status-badge";
import { PageHeader } from "@/features/admin/components/page-header";
import { formatDateTime } from "@/features/admin/lib/format";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Overview" };

export default async function AdminOverviewPage() {
  const {
    newInquiries,
    publishedPosts: published,
    draftPosts: drafts,
    services,
    galleryImages: gallery,
    recentInquiries: recent,
  } = await container().dashboard.stats();

  const stats = [
    { label: "New inquiries", value: newInquiries, href: "/admin/inquiries" },
    { label: "Published posts", value: published, href: "/admin/blogs", note: drafts ? `${drafts} draft${drafts === 1 ? "" : "s"}` : undefined },
    { label: "Services", value: services, href: "/admin/services" },
    { label: "Gallery images", value: gallery, href: "/admin/gallery" },
  ];

  return (
    <>
      <PageHeader title="Overview" description="What's happening on the website." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="rounded-xl focus-visible:outline-2 focus-visible:outline-ring">
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader>
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-3xl tabular-nums">{stat.value}</CardTitle>
                {stat.note && <p className="text-xs text-muted-foreground">{stat.note}</p>}
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Latest inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No inquiries yet. Messages from the contact form will appear here.</p>
          ) : (
            <ul className="divide-y">
              {recent.map((inquiry) => (
                <li key={inquiry.id}>
                  <Link href={`/admin/inquiries/${inquiry.id}`} className="flex items-center gap-4 py-3 hover:text-primary">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{inquiry.name}</span>
                      <span className="block truncate text-sm text-muted-foreground">{inquiry.message}</span>
                    </span>
                    <InquiryStatusBadge status={inquiry.status} />
                    <span className="hidden text-xs text-muted-foreground sm:block">{formatDateTime(inquiry.createdAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  );
}
