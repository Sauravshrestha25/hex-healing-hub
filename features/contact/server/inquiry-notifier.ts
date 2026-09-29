import "server-only";
import type { Mailer } from "@/features/shared/server/mailer";

export type NewInquiry = { name: string; email: string; phone: string | null; interest: string | null; message: string };

/** Emails the team about each new inquiry. Without a recipient or SMTP, inquiries are only saved. */
export class InquiryNotifier {
  constructor(
    private readonly mailer: Mailer,
    private readonly to: string | undefined,
    private readonly dashboardUrl: string,
  ) {}

  async notify(inquiry: NewInquiry) {
    if (!this.to || !this.mailer.isConfigured) return;
    await this.mailer.send({
      to: this.to,
      replyTo: inquiry.email,
      subject: `New inquiry from ${inquiry.name}`,
      text: [
        `Name: ${inquiry.name}`,
        `Email: ${inquiry.email}`,
        inquiry.phone ? `Phone: ${inquiry.phone}` : null,
        inquiry.interest ? `Interested in: ${inquiry.interest}` : null,
        "",
        inquiry.message,
        "",
        `View in dashboard: ${this.dashboardUrl}`,
      ]
        .filter((line): line is string => line !== null)
        .join("\n"),
    });
  }
}
