import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "cn";
import { Panel } from "@/features/admin/components/kit";
import { PageHeader } from "@/features/admin/components/page-header";
import { InquiryStatusBadge } from "@/features/admin/components/status-badge";
import { formatDate, timeAgo } from "@/features/admin/lib/format";
import { getViewer } from "@/features/admin/server/viewer";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Overview" };

const QUICK_LINKS = [
  { href: "/admin/blogs/new", label: "Write a post" },
  { href: "/admin/portfolio/new", label: "Add a photo" },
  { href: "/admin/services/new", label: "Add a service" },
  { href: "/admin/users/new", label: "Add a user" },
];

export default async function AdminOverviewPage() {
  const [viewer, stats] = await Promise.all([getViewer(), container().dashboard.stats()]);
  const today = new Intl.DateTimeFormat("en", { weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Kathmandu" }).format(new Date());

  const figures = [
    { label: "New inquiries", value: stats.newInquiries, href: "/admin/inquiries", attention: stats.newInquiries > 0 },
    { label: "Published posts", value: stats.publishedPosts, href: "/admin/blogs", note: stats.draftPosts ? `${stats.draftPosts} draft${stats.draftPosts === 1 ? "" : "s"}` : undefined },
    { label: "Services", value: stats.services, href: "/admin/services" },
    { label: "Portfolio photos", value: stats.galleryImages, href: "/admin/portfolio" },
  ];

  return (
    <>
      <PageHeader title="Overview" description={today} />

      <dl className="grid grid-cols-2 overflow-hidden rounded-lg border bg-card lg:grid-cols-4">
        {figures.map((figure, index) => (
          <Link
            key={figure.label}
            href={figure.href}
            className={cn(
              "flex flex-col gap-1 border-border p-5 transition-colors hover:bg-muted/50",
              index % 2 === 1 && "border-l",
              index >= 2 && "border-t lg:border-t-0",
              index === 2 && "lg:border-l",
            )}
          >
            <dt className="text-sm text-muted-foreground">{figure.label}</dt>
            <dd className={cn("text-3xl font-semibold tabular-nums", figure.attention && "text-[oklch(0.5_0.11_70)]")}>{figure.value}</dd>
            {figure.note && <dd className="text-xs text-muted-foreground">{figure.note}</dd>}
          </Link>
        ))}
      </dl>

      <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Panel
          title="Latest inquiries"
          bodyClassName="p-0"
          action={
            <Link href="/admin/inquiries" className="inline-flex items-center gap-1 text-sm text-brand hover:underline">
              View all <ArrowRight className="size-3.5" />
            </Link>
          }
        >
          {stats.recentInquiries.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">No inquiries yet.</p>
          ) : (
            <ul className="divide-y">
              {stats.recentInquiries.map((inquiry) => (
                <li key={inquiry.id}>
                  <Link href={`/admin/inquiries/${inquiry.id}`} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 px-5 py-3.5 hover:bg-muted/50">
                    <span className={cn("truncate", inquiry.status === "NEW" ? "font-semibold" : "font-medium")}>{inquiry.name}</span>
                    <span className="text-right text-xs whitespace-nowrap text-muted-foreground">{timeAgo(inquiry.createdAt)}</span>
                    <span className="truncate text-sm text-muted-foreground">{inquiry.message}</span>
                    <span className="justify-self-end"><InquiryStatusBadge status={inquiry.status} /></span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <div className="grid min-w-0 grid-cols-1 gap-6">
          {viewer.isVerified && (
            <Panel title="Quick links" bodyClassName="p-0">
              <ul className="divide-y">
                {QUICK_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="flex items-center justify-between px-5 py-3 text-sm hover:bg-muted/50">
                      {label}
                      <ArrowRight className="size-3.5 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          <Panel title="Recently edited" bodyClassName="p-0">
            <ul className="divide-y">
              {stats.recentPosts.map((post) => (
                <li key={post.id}>
                  <Link href={`/admin/blogs/${post.id}`} className="block px-5 py-3 hover:bg-muted/50">
                    <span className="block truncate text-sm font-medium">{post.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {post.published ? "Published" : "Draft"} · {formatDate(post.updatedAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
