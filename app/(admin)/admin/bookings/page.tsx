import Link from "next/link";
import { CalendarCheck, CalendarDays, HeartHandshake, MapPin, Phone } from "lucide-react";
import { cn } from "cn";
import { EmptyState, InitialsAvatar, Panel } from "@/features/admin/components/kit";
import { PageHeader } from "@/features/admin/components/page-header";
import { BookingStatusBadge } from "@/features/admin/components/status-badge";
import { DeleteButton } from "@/features/admin/components/delete-button";
import { formatDay, timeAgo } from "@/features/admin/lib/format";
import { deleteBooking } from "@/features/admin/server/bookings";
import { getViewer } from "@/features/admin/server/viewer";
import { formatSlot } from "@/features/healers/lib/slots";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Bookings" };

const FILTERS = [
  { key: "open", label: "Open" },
  { key: "done", label: "Done" },
  { key: "all", label: "All" },
] as const;

export default async function AdminBookingsPage(props: PageProps<"/admin/bookings">) {
  const { status } = await props.searchParams;
  const filter = FILTERS.find((f) => f.key === (typeof status === "string" ? status.toLowerCase() : ""))?.key ?? "open";
  const { bookings: service } = container();
  const [viewer, bookings, counts] = await Promise.all([getViewer(), service.list(filter), service.counts()]);

  return (
    <>
      <PageHeader title="Bookings" description="Session requests from the website's Book Now form. Confirm each one by phone or WhatsApp." />

      <nav aria-label="Filter bookings" className="mb-4 inline-flex rounded-lg border bg-card p-1">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={f.key === "open" ? "/admin/bookings" : `/admin/bookings?status=${f.key}`}
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
        {bookings.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title={filter === "open" ? "You're all caught up" : "Nothing here yet"}
            description={filter === "open" ? "No open bookings. New requests from the Book Now form will appear here." : undefined}
          />
        ) : (
          <ul className="divide-y">
            {bookings.map((booking) => (
              <li key={booking.id} className="flex items-center transition-colors hover:bg-muted/60">
                <Link href={`/admin/bookings/${booking.id}`} className="flex min-w-0 flex-1 gap-3 py-4 pl-5 sm:items-center">
                  <div className="relative">
                    <InitialsAvatar name={booking.name} />
                    {booking.status === "NEW" && (
                      <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-brand-gold ring-2 ring-card" aria-label="New" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className={cn("truncate", booking.status === "NEW" ? "font-semibold" : "font-medium")}>{booking.name}</span>
                      {booking.service && <span className="rounded-md bg-accent px-1.5 py-0.5 text-xs text-brand">{booking.service}</span>}
                    </div>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                      {booking.phone && <span className="inline-flex items-center gap-1"><Phone className="size-3" />{booking.phone}</span>}
                      {booking.healer && <span className="inline-flex items-center gap-1"><HeartHandshake className="size-3" />{booking.healer.name}</span>}
                      {booking.centre && <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{booking.centre}</span>}
                      {(booking.startsAt || booking.preferredDate || booking.timeOfDay) && (
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="size-3" />
                          {booking.startsAt
                            ? formatSlot(booking.startsAt)
                            : [booking.preferredDate && formatDay(booking.preferredDate), booking.timeOfDay].filter(Boolean).join(" · ")}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <BookingStatusBadge status={booking.status} />
                    <span className="text-xs whitespace-nowrap text-muted-foreground">{timeAgo(booking.createdAt)}</span>
                  </div>
                </Link>
                <div className="shrink-0 pr-3 pl-2">
                  {viewer.isVerified ? (
                    <DeleteButton id={booking.id} itemName={`booking from ${booking.name}`} action={deleteBooking} />
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
