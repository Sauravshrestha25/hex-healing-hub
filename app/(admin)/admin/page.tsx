import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  HeartHandshake,
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
import { InitialsAvatar } from "@/features/admin/components/kit";
import { BookingStatusBadge, PublishedBadge } from "@/features/admin/components/status-badge";
import { formatDate, formatDay, timeAgo } from "@/features/admin/lib/format";
import { getViewer } from "@/features/admin/server/viewer";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Overview" };

const QUICK_ACTIONS: { href: string; label: string; hint: string; icon: LucideIcon }[] = [
  { href: "/admin/healers/new", label: "Add a healer", hint: "Profile, prices and hours", icon: HeartHandshake },
  { href: "/admin/blogs/new", label: "Write a post", hint: "Share a new reflection", icon: PenLine },
  { href: "/admin/portfolio/new", label: "Add a photo", hint: "Grow the portfolio", icon: ImagePlus },
  { href: "/admin/services/new", label: "Add a service", hint: "Offer something new", icon: Sparkles },
  { href: "/admin/testimonials/new", label: "Add a testimonial", hint: "Kind words from visitors", icon: MessageSquareQuote },
  { href: "/admin/users/new", label: "Add a user", hint: "Invite a team member", icon: UserPlus },
];

/** Flat icon chip: the section's icon on a cream wash; fills plum when its card is hovered. */
function IconChip({ icon: Icon, size = "md" }: { icon: LucideIcon; size?: "md" | "lg" }) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-xl bg-accent text-brand transition-colors group-hover:bg-brand group-hover:text-brand-cream",
        size === "lg" ? "size-12" : "size-10",
      )}
    >
      <Icon className={size === "lg" ? "size-5" : "size-[18px]"} aria-hidden="true" />
    </span>
  );
}

/** A titled block with generous padding: the overview's one building unit (flat, bordered, no shadow). */
function Block({
  title,
  description,
  action,
  children,
  flush,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  flush?: boolean;
  className?: string;
}) {
  return (
    <section className={cn("min-w-0 rounded-2xl border bg-card", className)}>
      <header className="flex items-start justify-between gap-4 px-6 pt-6 sm:px-8 sm:pt-7">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
      </header>
      <div className={flush ? "mt-4 pb-2" : "px-6 pt-5 pb-6 sm:px-8 sm:pb-8"}>{children}</div>
    </section>
  );
}

function ViewAll({ href, label = "View all" }: { href: string; label?: string }) {
  return (
    <Link href={href} className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brand hover:underline">
      {label} <ArrowRight className="size-3.5" aria-hidden="true" />
    </Link>
  );
}

export default async function AdminOverviewPage() {
  const [viewer, stats] = await Promise.all([getViewer(), container().dashboard.stats()]);
  const now = new Date();
  const today = new Intl.DateTimeFormat("en", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kathmandu" }).format(now);
  const hour = Number(new Intl.DateTimeFormat("en", { hour: "numeric", hourCycle: "h23", timeZone: "Asia/Kathmandu" }).format(now));
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = viewer.name.split(/\s+/)[0];
  const summary =
    stats.newBookings > 0
      ? `${stats.newBookings} new ${stats.newBookings === 1 ? "booking is" : "bookings are"} waiting for you.`
      : "You're all caught up. No new bookings to review.";

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
      note: stats.draftPosts ? `${stats.draftPosts} draft${stats.draftPosts === 1 ? "" : "s"} in progress` : "No drafts",
    },
    {
      label: "Testimonials",
      value: stats.testimonialsShown,
      href: "/admin/testimonials",
      icon: MessageSquareQuote,
      note: stats.testimonialsHidden ? `${stats.testimonialsHidden} hidden` : "All shown on the site",
    },
  ];

  const pipeline = [
    { label: "New", value: stats.newBookings, className: "bg-brand-gold" },
    { label: "Confirmed", value: stats.confirmedBookings, className: "bg-brand" },
    { label: "Completed", value: stats.completedBookings, className: "bg-[var(--admin-sage)]" },
    { label: "Cancelled", value: stats.cancelledBookings, className: "bg-brand/20" },
  ];
  const pipelineTotal = pipeline.reduce((sum, step) => sum + step.value, 0);

  const content = [
    { label: "Blog posts", value: stats.publishedPosts + stats.draftPosts, href: "/admin/blogs", icon: Newspaper },
    { label: "Services", value: stats.services, href: "/admin/services", icon: Sparkles },
    { label: "Portfolio photos", value: stats.galleryImages, href: "/admin/portfolio", icon: Images },
    { label: "Testimonials", value: stats.testimonialsShown + stats.testimonialsHidden, href: "/admin/testimonials", icon: MessageSquareQuote },
  ];

  return (
    <div className="grid gap-8 lg:gap-10">
      {/* Greeting */}
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{today}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {greeting}, {firstName}.
          </h1>
          <p className="mt-3 text-base text-muted-foreground">{summary}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl border bg-card px-5 py-3 text-sm font-medium transition-colors hover:border-brand/40"
          >
            <ArrowUpRight className="size-4" aria-hidden="true" /> View website
          </Link>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <CalendarCheck className="size-4" aria-hidden="true" /> Review bookings
          </Link>
        </div>
      </header>

      {/* Key figures */}
      <dl className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4 xl:gap-6">
        {figures.map(({ icon, ...figure }) => (
          <Link
            key={figure.label}
            href={figure.href}
            className="group flex flex-col rounded-2xl border bg-card p-4 transition-colors hover:border-brand/30 sm:p-7"
          >
            <div className="flex items-center justify-between gap-3">
              <dt className="text-sm font-medium text-muted-foreground">{figure.label}</dt>
              <IconChip icon={icon} />
            </div>
            <dd className="mt-4 text-3xl font-semibold tracking-tight tabular-nums sm:mt-6 sm:text-4xl">{figure.value}</dd>
            <dd className={cn("mt-2 inline-flex items-center gap-2 text-sm", figure.attention ? "font-medium text-brand" : "text-muted-foreground")}>
              {figure.attention && <span className="size-2 rounded-full bg-brand-gold" aria-hidden="true" />}
              {figure.note}
            </dd>
          </Link>
        ))}
      </dl>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-12 xl:gap-10">
        {/* Left: bookings and site content */}
        <div className="grid min-w-0 content-start gap-8 xl:col-span-8 xl:gap-10">
          <Block title="Booking pipeline" description="Every request from the Book Now form, by where it stands.">
            {pipelineTotal === 0 ? (
              <p className="text-sm text-muted-foreground">No bookings yet. Once requests come in, you&apos;ll see them move through here.</p>
            ) : (
              <>
                <div className="flex h-3 overflow-hidden rounded-full bg-muted" role="img" aria-label={pipeline.map((s) => `${s.label}: ${s.value}`).join(", ")}>
                  {pipeline.map((step) =>
                    step.value > 0 ? (
                      <span key={step.label} className={cn("h-full", step.className)} style={{ width: `${(step.value / pipelineTotal) * 100}%` }} />
                    ) : null,
                  )}
                </div>
                <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {pipeline.map((step) => (
                    <div key={step.label} className="rounded-xl bg-muted/60 px-4 py-3">
                      <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className={cn("size-2.5 rounded-full", step.className)} aria-hidden="true" />
                        {step.label}
                      </dt>
                      <dd className="mt-1 text-2xl font-semibold tabular-nums">{step.value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
          </Block>

          <Block title="Latest bookings" description="The five most recent requests." action={<ViewAll href="/admin/bookings" />} flush>
            {stats.recentBookings.length === 0 ? (
              <div className="flex flex-col items-center px-8 py-14 text-center">
                <span className="group"><IconChip icon={CalendarCheck} size="lg" /></span>
                <p className="mt-4 text-base font-medium">No bookings yet</p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">Requests from the website&apos;s Book Now form will appear here.</p>
              </div>
            ) : (
              <ul className="divide-y">
                {stats.recentBookings.map((booking) => (
                  <li key={booking.id}>
                    <Link href={`/admin/bookings/${booking.id}`} className="flex items-center gap-4 px-6 py-5 transition-colors hover:bg-accent/40 sm:px-8">
                      <InitialsAvatar name={booking.name} className="size-11 text-sm" />
                      <div className="min-w-0 flex-1">
                        <p className={cn("truncate text-base", booking.status === "NEW" ? "font-semibold" : "font-medium")}>{booking.name}</p>
                        <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          {booking.service && (
                            <span className="inline-flex items-center gap-1.5"><Sparkles className="size-3.5" aria-hidden="true" />{booking.service}</span>
                          )}
                          {booking.centre && (
                            <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" aria-hidden="true" />{booking.centre}</span>
                          )}
                          {booking.preferredDate && (
                            <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5" aria-hidden="true" />{formatDay(booking.preferredDate)}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <BookingStatusBadge status={booking.status} />
                        <span className="text-xs whitespace-nowrap text-muted-foreground">{timeAgo(booking.createdAt)}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Block>

          <Block
            title="Your website"
            description="Everything visitors can see, at a glance."
            action={
              <Link href="/" target="_blank" className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brand hover:underline">
                Open the website <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            }
          >
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {content.map(({ icon, ...item }) => (
                <li key={item.label}>
                  <Link href={item.href} className="group flex items-center gap-4 rounded-xl border p-5 transition-colors hover:border-brand/30">
                    <IconChip icon={icon} size="lg" />
                    <span className="min-w-0">
                      <span className="block text-2xl leading-tight font-semibold tabular-nums">{item.value}</span>
                      <span className="block truncate text-sm text-muted-foreground">{item.label}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Block>
        </div>

        {/* Right: actions and recent edits */}
        <div className="grid min-w-0 content-start gap-8 xl:col-span-4 xl:gap-10">
          {viewer.isVerified && (
            <Block title="Quick actions">
              <ul className="grid gap-3">
                {QUICK_ACTIONS.map(({ href, label, hint, icon }) => (
                  <li key={href}>
                    <Link href={href} className="group flex items-center gap-4 rounded-xl border p-4 transition-colors hover:border-brand/30">
                      <IconChip icon={icon} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{label}</span>
                        <span className="block truncate text-xs text-muted-foreground">{hint}</span>
                      </span>
                      <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Block>
          )}

          <Block title="Recently edited" action={<ViewAll href="/admin/blogs" label="Blogs" />} flush>
            {stats.recentPosts.length === 0 ? (
              <p className="px-6 pb-6 text-sm text-muted-foreground sm:px-8">No posts yet.</p>
            ) : (
              <ul className="divide-y">
                {stats.recentPosts.map((post) => (
                  <li key={post.id}>
                    <Link href={`/admin/blogs/${post.id}`} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-accent/40 sm:px-8">
                      <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                        {post.coverImage && <Image src={post.coverImage} alt="" fill sizes="56px" className="object-cover" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-2 text-sm leading-snug font-medium">{post.title}</span>
                        <span className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                          <PublishedBadge published={post.published} />
                          {formatDate(post.updatedAt)}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Block>
        </div>
      </div>

    </div>
  );
}
