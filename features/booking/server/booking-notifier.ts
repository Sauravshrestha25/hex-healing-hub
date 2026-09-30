import "server-only";
import type { Mailer } from "@/features/shared/server/mailer";
import type { NewBooking } from "./booking.service";

/** Emails the team about each new booking request. Without a recipient or SMTP, bookings are only saved. */
export class BookingNotifier {
  constructor(
    private readonly mailer: Mailer,
    private readonly to: string | undefined,
    private readonly dashboardUrl: string,
  ) {}

  async notify(booking: NewBooking) {
    if (!this.to || !this.mailer.isConfigured) return;
    await this.mailer.send({
      to: this.to,
      replyTo: booking.email ?? undefined,
      subject: `New booking request: ${booking.service} (${booking.name})`,
      text: [
        `Name: ${booking.name}`,
        `Phone: ${booking.phone}`,
        booking.email ? `Email: ${booking.email}` : null,
        `Service: ${booking.service}`,
        booking.centre ? `Centre: ${booking.centre}` : null,
        booking.preferredDate || booking.timeOfDay
          ? `Preferred: ${[booking.preferredDate, booking.timeOfDay].filter(Boolean).join(", ")}`
          : null,
        booking.note ? `\n${booking.note}` : null,
        "",
        `View in dashboard: ${this.dashboardUrl}`,
      ]
        .filter((line): line is string => line !== null)
        .join("\n"),
    });
  }
}
