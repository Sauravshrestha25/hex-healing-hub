import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  ImagePlus,
  Images,
  MapPin,
  MessageSquareQuote,
  Newspaper,
  PenLine,
  Sparkles,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";
import { InitialsAvatar, Panel } from "@/features/admin/components/kit";
import { BookingStatusBadge, PublishedBadge } from "@/features/admin/components/status-badge";
import { formatDate, formatDay, timeAgo } from "@/features/admin/lib/format";
import { getViewer } from "@/features/admin/server/viewer";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Overview" };

const QUICK_ACTIONS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin/blogs/new", label: "Write a post", icon: PenLine },
  { href: "/admin/portfolio/new", label: "Add a photo", icon: ImagePlus },
  { href: "/admin/services/new", label: "Add a service", icon: Sparkles },
  { href: "/admin/testimonials/new", label: "Add a testimonial", icon: MessageSquareQuote },
  { href: "/admin/users/new", label: "Add a user", icon: UserPlus },
];

/** A flat icon chip: the section's icon on a cream wash. */
function IconChip({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-brand transition-colors", className)}>
      <Icon className="size-4" aria-hidden="true" />
    </span>
  );
}

export default async function AdminOverviewPage() {
  const [viewer, stats] = await Promise.all([getViewer(), container().dashboard.stats()]);
  const now = new Date();
  const today = new Intl.DateTimeFormat("en", { weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Kathmandu" }).format(now);
  const hour = Number(new Intl.DateTimeFormat("en", { hour: "numeric", hourCycle: "h23", timeZone: "Asia/Kathmandu" }).format(now));
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = viewer.name.split(/\s+/)[0];

  const figures = [
    {
      label: "New bookings",
      value: stats.newBookings,
      href: "/admin/bookings",
      icon: CalendarCheck,
      note: stats.newBookings > 0 ? "Waiting to be confirmed" : "All caught up",
      attention: stats.newBookings > 0,
    },
    { label: "Confirmed", value: stats.confirmedBookings, href: "/admin/bookings", icon: CalendarClock, note: "Upcoming sessions" },
    {
      label: "Published posts",
      value: stats.publishedPosts,
      href: "/admin/blogs",
      icon: Newspaper,
      note: stats.draftPosts ? `${stats.draftPosts} draft${stats.draftPosts === 1 ? "" : "s"}` : "No drafts",
    },
    {
      label: "Testimonials",
      value: stats.testimonialsShown,
      href: "/admin/testimonials",
      icon: MessageSquareQuote,
      note: stats.testimonialsHidden ? `${stats.testimonialsHidden} hidden` : "All shown on the site",
    },
  ];

  const content = [
    { label: "Blogs", value: stats.publishedPosts + stats.draftPosts, href: "/admin/blogs", icon: Newspaper },
    { label: "Services", value: stats.services, href: "/admin/services", icon: Sparkles },
    { label: "Portfolio", value: stats.galleryImages, href: "/admin/portfolio", icon: Images },
    { label: "Testimonials", value: stats.testimonialsShown + stats.testimonialsHidden, href: "/admin/testimonials", icon: MessageSquareQuote },
  ];

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{today}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            {greeting}, {firstName}.
          </h1>
        </div>
        <Link
          href="/admin/bookings"
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <CalendarCheck className="size-4" aria-hidden="true" /> Review bookings
        </Link>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {figures.map(({ icon, ...figure }) => (
          <Link
            key={figure.label}
            href={figure.href}
            className="group flex flex-col rounded-xl border bg-card p-5 transition-colors hover:border-brand/30"
          >
            <div className="flex items-start justify-between gap-3">
              <dt className="text-sm text-muted-foreground">{figure.label}</dt>
              <IconChip icon={icon} className="group-hover:bg-brand group-hover:text-brand-cream" />
            </div>
            <dd className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">{figure.value}</dd>
            <dd className={cn("mt-1 inline-flex items-center gap-1.5 text-xs", figure.attention ? "font-medium text-brand" : "text-muted-foreground")}>
              {figure.attention && <span className="size-1.5 rounded-full bg-brand-gold" aria-hidden="true" />}
              {figure.note}
            </dd>
          </Link>
        ))}
      </dl>

      <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid min-w-0 gap-6">
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
              <div className="flex flex-col items-center px-6 py-12 text-center">
                <IconChip icon={CalendarCheck} className="size-11" />
                <p className="mt-3 text-sm font-medium">No bookings yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Requests from the website&apos;s Book Now form will appear here.</p>
              </div>
            ) : (
              <ul className="divide-y">
                {stats.recentBookings.map((booking) => (
                  <li key={booking.id}>
                    <Link href={`/admin/bookings/${booking.id}`} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-accent/40">
                      <InitialsAvatar name={booking.name} />
                      <div className="min-w-0 flex-1">
                        <p className={cn("truncate text-sm", booking.status === "NEW" ? "font-semibold" : "font-medium")}>{booking.name}</p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                          {booking.service && (
                            <span className="inline-flex items-center gap-1"><Sparkles className="size-3" aria-hidden="true" />{booking.service}</span>
                          )}
                          {booking.centre && (
                            <span className="inline-flex items-center gap-1"><MapPin className="size-3" aria-hidden="true" />{booking.centre}</span>
                          )}
                          {booking.preferredDate && (
                            <span className="inline-flex items-center gap-1"><CalendarDays className="size-3" aria-hidden="true" />{formatDay(booking.preferredDate)}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <BookingStatusBadge status={booking.status} />
                        <span className="text-xs whitespace-nowrap text-muted-foreground">{timeAgo(booking.createdAt)}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Your website" description="Everything visitors can see, at a glance.">
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {content.map(({ icon, ...item }) => (
                <li key={item.label}>
                  <Link href={item.href} className="group flex items-center gap-3 rounded-lg border p-3 transition-colors hover:border-brand/30">
                    <IconChip icon={icon} className="group-hover:bg-brand group-hover:text-brand-cream" />
                    <span className="min-w-0">
                      <span className="block text-lg leading-tight font-semibold tabular-nums">{item.value}</span>
                      <span className="block truncate text-xs text-muted-foreground">{item.label}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/" target="_blank" className="mt-4 inline-flex items-center gap-1 text-sm text-brand hover:underline">
              Open the website <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </Panel>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-6">
          {viewer.isVerified && (
            <Panel title="Quick actions">
              <ul className="grid grid-cols-2 gap-2">
                {QUICK_ACTIONS.map(({ href, label, icon }) => (
                  <li key={href} className="last:col-span-2">
                    <Link
                      href={href}
                      className="group flex h-full flex-col gap-2 rounded-lg border p-3 text-sm font-medium transition-colors hover:border-brand/30"
                    >
                      <IconChip icon={icon} className="size-8 group-hover:bg-brand group-hover:text-brand-cream" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          <Panel
            title="Recently edited"
            bodyClassName="p-0"
            action={
              <Link href="/admin/blogs" className="inline-flex items-center gap-1 text-sm text-brand hover:underline">
                Blogs <ArrowRight className="size-3.5" />
              </Link>
            }
          >
            {stats.recentPosts.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-muted-foreground">No posts yet.</p>
            ) : (
              <ul className="divide-y">
                {stats.recentPosts.map((post) => (
                  <li key={post.id}>
                    <Link href={`/admin/blogs/${post.id}`} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-accent/40">
                      <span className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {post.coverImage && <Image src={post.coverImage} alt="" fill sizes="44px" className="object-cover" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{post.title}</span>
                        <span className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <PublishedBadge published={post.published} />
                          {formatDate(post.updatedAt)}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
