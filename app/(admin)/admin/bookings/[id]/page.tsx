import { notFound } from "next/navigation";
import { CalendarDays, Clock, Mail, MapPin, MessageCircle, Phone, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { BookingActions } from "@/features/admin/components/booking-actions";
import { InitialsAvatar, Panel } from "@/features/admin/components/kit";
import { PageHeader } from "@/features/admin/components/page-header";
import { BookingStatusBadge } from "@/features/admin/components/status-badge";
import { formatDateTime, formatDay, timeAgo } from "@/features/admin/lib/format";
import { getViewer } from "@/features/admin/server/viewer";
import { whatsappUrl } from "@/features/shared/lib/whatsapp";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Booking" };

export default async function BookingPage(props: PageProps<"/admin/bookings/[id]">) {
  const { id } = await props.params;
  const [viewer, booking] = await Promise.all([getViewer(), container().bookings.findById(id)]);
  if (!booking) notFound();

  const when = [booking.preferredDate && formatDay(booking.preferredDate), booking.timeOfDay].filter(Boolean).join(", ");
  const whatsappReply =
    booking.phone &&
    whatsappUrl(
      `Namaste ${booking.name}! This is HEX Healing Hub about your booking request${booking.service ? ` for ${booking.service}` : ""}${when ? ` (${when})` : ""}.`,
      booking.phone,
    );

  const details = [
    { icon: Sparkles, label: "Service", value: booking.service },
    { icon: MapPin, label: "Centre", value: booking.centre },
    { icon: CalendarDays, label: "Preferred day", value: booking.preferredDate && formatDay(booking.preferredDate) },
    { icon: Clock, label: "Time of day", value: booking.timeOfDay },
  ];

  return (
    <>
      <PageHeader
        title={booking.name}
        back={{ href: "/admin/bookings", label: "Bookings" }}
        meta={<BookingStatusBadge status={booking.status} />}
        description={`Requested ${timeAgo(booking.createdAt)} · ${formatDateTime(booking.createdAt)}`}
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-6">
          <Panel title="Request">
            <dl className="grid gap-4 sm:grid-cols-2">
              {details.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <dt className="mt-0.5"><Icon className="size-4 text-muted-foreground" aria-label={label} /></dt>
                  <dd>
                    <span className="block text-xs text-muted-foreground">{label}</span>
                    <span className="font-medium">{value || <span className="font-normal text-muted-foreground">Not given</span>}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>
          {booking.note && (
            <Panel title="Note">
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{booking.note}</p>
            </Panel>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Contact">
            <div className="flex items-center gap-3">
              <InitialsAvatar name={booking.name} className="size-11 text-sm" />
              <div className="min-w-0">
                <p className="truncate font-medium">{booking.name}</p>
                {booking.phone && <p className="truncate text-sm text-muted-foreground">{booking.phone}</p>}
              </div>
            </div>
            <dl className="mt-5 grid gap-3 text-sm">
              <div className="flex items-center gap-2.5">
                <dt><Phone className="size-4 text-muted-foreground" aria-label="Phone" /></dt>
                <dd>{booking.phone ? <a href={`tel:${booking.phone}`} className="hover:text-brand hover:underline">{booking.phone}</a> : <span className="text-muted-foreground">Not given</span>}</dd>
              </div>
              <div className="flex items-center gap-2.5">
                <dt><Mail className="size-4 text-muted-foreground" aria-label="Email" /></dt>
                <dd className="min-w-0 truncate">{booking.email ? <a href={`mailto:${booking.email}`} className="hover:text-brand hover:underline">{booking.email}</a> : <span className="text-muted-foreground">Not given</span>}</dd>
              </div>
            </dl>
            <div className="mt-5 grid gap-2">
              {whatsappReply && (
                <a href={whatsappReply} target="_blank" rel="noopener noreferrer" className={buttonVariants({ className: "w-full" })}>
                  <MessageCircle /> Reply on WhatsApp
                </a>
              )}
              {booking.phone && (
                <a href={`tel:${booking.phone}`} className={buttonVariants({ variant: "outline", className: "w-full" })}>
                  <Phone /> Call
                </a>
              )}
            </div>
          </Panel>

          {viewer.isVerified && (
            <Panel title="Status" description="Track where this booking is.">
              <BookingActions id={booking.id} status={booking.status} />
            </Panel>
          )}
        </div>
      </div>
    </>
  );
}
