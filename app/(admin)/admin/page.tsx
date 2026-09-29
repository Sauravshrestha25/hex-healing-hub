import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FilePlus2, ImagePlus, Images, Inbox, Newspaper, Plus, Sparkles, UserPlus } from "lucide-react";
import { EmptyState, InitialsAvatar, Panel, StatCard } from "@/features/admin/components/kit";
import { PageHeader } from "@/features/admin/components/page-header";
import { InquiryStatusBadge, PublishedBadge } from "@/features/admin/components/status-badge";
import { timeAgo } from "@/features/admin/lib/format";
import { getViewer } from "@/features/admin/server/viewer";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Overview" };

function greeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const QUICK_ACTIONS = [
  { href: "/admin/blogs/new", label: "Write a post", icon: FilePlus2 },
  { href: "/admin/gallery/new", label: "Add a photo", icon: ImagePlus },
  { href: "/admin/services/new", label: "Add a service", icon: Plus },
  { href: "/admin/users/new", label: "Invite a user", icon: UserPlus },
];

export default async function AdminOverviewPage() {
  const viewer = await getViewer();
  const stats = await container().dashboard.stats();
  // Nepal time: the business and its admins are there.
  const hour = Number(new Intl.DateTimeFormat("en", { hour: "numeric", hourCycle: "h23", timeZone: "Asia/Kathmandu" }).format(new Date()));

  return (
    <>
      <PageHeader
        title={`${greeting(hour)}, ${viewer.name}`}
        description={
          stats.newInquiries > 0
            ? `You have ${stats.newInquiries} new ${stats.newInquiries === 1 ? "inquiry" : "inquiries"} waiting for a reply.`
            : "Everything is answered. Here's how the website looks today."
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="New inquiries" value={stats.newInquiries} icon={Inbox} href="/admin/inquiries" highlight={stats.newInquiries > 0} />
        <StatCard
          label="Published posts"
          value={stats.publishedPosts}
          note={stats.draftPosts ? `${stats.draftPosts} draft${stats.draftPosts === 1 ? "" : "s"}` : undefined}
          icon={Newspaper}
          href="/admin/blogs"
        />
        <StatCard label="Services" value={stats.services} icon={Sparkles} href="/admin/services" />
        <StatCard label="Gallery photos" value={stats.galleryImages} icon={Images} href="/admin/gallery" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Panel
          title="Latest inquiries"
          description="Messages from the contact form"
          bodyClassName="p-0"
          action={
            <Link href="/admin/inquiries" className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
              View all <ArrowRight className="size-3.5" />
            </Link>
          }
        >
          {stats.recentInquiries.length === 0 ? (
            <EmptyState icon={Inbox} title="No inquiries yet" description="Messages sent through the contact form will show up here." />
          ) : (
            <ul className="divide-y">
              {stats.recentInquiries.map((inquiry) => (
                <li key={inquiry.id}>
                  <Link href={`/admin/inquiries/${inquiry.id}`} className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/60">
                    <InitialsAvatar name={inquiry.name} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={inquiry.status === "NEW" ? "truncate font-semibold" : "truncate font-medium"}>{inquiry.name}</span>
                        {inquiry.interest && <span className="hidden truncate text-xs text-muted-foreground sm:inline">· {inquiry.interest}</span>}
                      </div>
                      <p className="truncate text-sm text-muted-foreground">{inquiry.message}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <InquiryStatusBadge status={inquiry.status} />
                      <span className="text-xs text-muted-foreground">{timeAgo(inquiry.createdAt)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel title="Quick actions" bodyClassName="grid grid-cols-2 gap-2 p-3">
            {QUICK_ACTIONS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-start gap-2.5 rounded-lg border border-transparent p-3 text-sm font-medium transition-colors hover:border-border hover:bg-muted/60"
              >
                <span className="grid size-8 place-items-center rounded-md bg-accent text-brand">
                  <Icon className="size-4" />
                </span>
                {label}
              </Link>
            ))}
          </Panel>

          <Panel title="Recently edited posts" bodyClassName="p-0">
            <ul className="divide-y">
              {stats.recentPosts.map((post) => (
                <li key={post.id}>
                  <Link href={`/admin/blogs/${post.id}`} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/60">
                    <span className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image src={post.coverImage} alt="" fill sizes="40px" className="object-cover" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{post.title}</p>
                      <p className="text-xs text-muted-foreground">Edited {timeAgo(post.updatedAt)}</p>
                    </div>
                    <PublishedBadge published={post.published} />
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
