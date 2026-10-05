import "server-only";
import { formatRupees, formatSlot } from "@/features/healers/lib/slots";
import type { Mailer } from "@/features/shared/server/mailer";
import type { NewBooking } from "./booking.service";

type ConfirmedBooking = {
  name: string;
  email: string;
  service: string | null;
  centre: string | null;
  reference: string | null;
  healerName: string | null;
  startsAt: Date | null;
  durationMinutes: number | null;
  price: number | null;
};

/** Booking emails: the team hears about each new request; the visitor hears when it's confirmed. */
export class BookingNotifier {
  constructor(
    private readonly mailer: Mailer,
    private readonly to: string | undefined,
    private readonly dashboardUrl: string,
  ) {}

  /** Without a recipient or SMTP, bookings are only saved. */
  async notify(booking: NewBooking) {
    if (!this.to || !this.mailer.isConfigured) return;
    const when = booking.startsAt ? formatSlot(booking.startsAt) : [booking.preferredDate, booking.timeOfDay].filter(Boolean).join(", ");
    await this.mailer.send({
      to: this.to,
      replyTo: booking.email ?? undefined,
      subject: `New booking ${booking.reference}: ${booking.service} (${booking.name})`,
      text: [
        `Reference: ${booking.reference}`,
        `Name: ${booking.name}`,
        `Phone: ${booking.phone}`,
        booking.email ? `Email: ${booking.email}` : null,
        `Service: ${booking.service}`,
        booking.healerName ? `Healer: ${booking.healerName}` : null,
        booking.centre ? `Place: ${booking.centre}` : null,
        when ? `${booking.startsAt ? "Time slot" : "Preferred"}: ${when}${booking.startsAt ? " (Nepal time)" : ""}` : null,
        booking.durationMinutes ? `Length: ${booking.durationMinutes} minutes` : null,
        booking.price != null ? `Price: ${formatRupees(booking.price)}` : null,
        booking.note ? `\n${booking.note}` : null,
        "",
        `View in dashboard: ${this.dashboardUrl}`,
      ]
        .filter((line): line is string => line !== null)
        .join("\n"),
    });
  }

  /** Sent once, when staff confirm a booking. Uses the Mailer even without SMTP (dev prints it). */
  async confirmToVisitor(booking: ConfirmedBooking) {
    await this.mailer.send({
      to: booking.email,
      replyTo: this.to,
      subject: `Your booking is confirmed${booking.reference ? ` (${booking.reference})` : ""}`,
      text: [
        `Namaste ${booking.name},`,
        "",
        "Your session at HEX Healing Hub is confirmed.",
        "",
        booking.reference ? `Reference: ${booking.reference}` : null,
        booking.service ? `Service: ${booking.service}` : null,
        booking.healerName ? `Healer: ${booking.healerName}` : null,
        booking.startsAt ? `When: ${formatSlot(booking.startsAt)} (Nepal time)` : null,
        booking.durationMinutes ? `Length: ${booking.durationMinutes} minutes` : null,
        booking.centre ? `Where: ${booking.centre}` : null,
        booking.price != null ? `Fee: ${formatRupees(booking.price)}` : null,
        "",
        "If you need to change or cancel, just reply to this email or message us on WhatsApp.",
        "",
        "HEX Healing Hub",
      ]
        .filter((line): line is string => line !== null)
        .join("\n"),
    });
  }
}
