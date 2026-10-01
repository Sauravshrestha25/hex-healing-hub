import Link from "next/link";
import { ArrowRight, CalendarCheck, Images, Newspaper, Sparkles } from "lucide-react";
import { cn } from "cn";
import { Panel } from "@/features/admin/components/kit";
import { PageHeader } from "@/features/admin/components/page-header";
import { BookingStatusBadge } from "@/features/admin/components/status-badge";
import { formatDate, timeAgo } from "@/features/admin/lib/format";
import { getViewer } from "@/features/admin/server/viewer";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Overview" };

const QUICK_LINKS = [
  { href: "/admin/blogs/new", label: "Write a post" },
  { href: "/admin/portfolio/new", label: "Add a photo" },
  { href: "/admin/services/new", label: "Add a service" },
  { href: "/admin/testimonials/new", label: "Add a testimonial" },
  { href: "/admin/users/new", label: "Add a user" },
];

export default async function AdminOverviewPage() {
  const [viewer, stats] = await Promise.all([getViewer(), container().dashboard.stats()]);
  const today = new Intl.DateTimeFormat("en", { weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Kathmandu" }).format(new Date());

  const figures = [
    { label: "New bookings", value: stats.newBookings, href: "/admin/bookings", icon: CalendarCheck, attention: stats.newBookings > 0 },
    { label: "Published posts", value: stats.publishedPosts, href: "/admin/blogs", icon: Newspaper, note: stats.draftPosts ? `${stats.draftPosts} draft${stats.draftPosts === 1 ? "" : "s"}` : undefined },
    { label: "Services", value: stats.services, href: "/admin/services", icon: Sparkles },
    { label: "Portfolio photos", value: stats.galleryImages, href: "/admin/portfolio", icon: Images },
  ];

  return (
    <>
      <PageHeader title="Overview" description={today} />

      <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {figures.map(({ icon: Icon, ...figure }) => (
          <Link
            key={figure.label}
            href={figure.href}
            className="group flex flex-col rounded-xl border bg-card p-5 transition-colors hover:border-brand/25 hover:bg-accent/40"
          >
            <div className="flex items-start justify-between gap-3">
              <dt className="text-sm text-muted-foreground">{figure.label}</dt>
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-brand transition-colors group-hover:bg-brand group-hover:text-brand-cream">
                <Icon className="size-4" aria-hidden="true" />
              </span>
            </div>
            <dd className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">{figure.value}</dd>
            {figure.attention ? (
              <dd className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-brand">
                <span className="size-1.5 rounded-full bg-brand-gold" aria-hidden="true" /> To review
              </dd>
            ) : (
              figure.note && <dd className="mt-1 text-xs text-muted-foreground">{figure.note}</dd>
            )}
          </Link>
        ))}
      </dl>

      <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Panel
          title="Latest bookings"
          bodyClassName="p-0"
          action={
            <Link href="/admin/bookings" className="inline-flex items-center gap-1 text-sm text-brand hover:underline">
              View all <ArrowRight className="size-3.5" />
            </Link>
          }
        >
          {stats.recentBookings.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">No bookings yet.</p>
          ) : (
            <ul className="divide-y">
              {stats.recentBookings.map((booking) => (
                <li key={booking.id}>
                  <Link href={`/admin/bookings/${booking.id}`} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 px-5 py-3.5 hover:bg-muted/50">
                    <span className={cn("truncate", booking.status === "NEW" ? "font-semibold" : "font-medium")}>{booking.name}</span>
                    <span className="text-right text-xs whitespace-nowrap text-muted-foreground">{timeAgo(booking.createdAt)}</span>
                    <span className="truncate text-sm text-muted-foreground">{[booking.service, booking.centre].filter(Boolean).join(" · ") || booking.note}</span>
                    <span className="justify-self-end"><BookingStatusBadge status={booking.status} /></span>
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
