import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

export type NewInquiry = { name: string; email: string; phone: string | null; interest: string | null; message: string };

export interface InquiryNotifier {
  notify(inquiry: NewInquiry): Promise<void>;
}

/** Used when SMTP isn't configured: inquiries are still saved, just not emailed. */
export class NullInquiryNotifier implements InquiryNotifier {
  async notify() {}
}

export class SmtpInquiryNotifier implements InquiryNotifier {
  private readonly transport: Transporter;

  constructor(
    config: { host: string; port: number; user?: string; pass?: string },
    private readonly from: string,
    private readonly to: string,
    private readonly dashboardUrl: string,
  ) {
    this.transport = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: config.user ? { user: config.user, pass: config.pass } : undefined,
    });
  }

  async notify(inquiry: NewInquiry) {
    await this.transport.sendMail({
      from: this.from,
      to: this.to,
      replyTo: inquiry.email,
      subject: `New inquiry from ${inquiry.name}`,
      // Plain text only: visitor input is never interpolated into HTML email.
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

  static fromEnv(): InquiryNotifier {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, INQUIRY_NOTIFY_TO, SITE_URL } = process.env;
    if (!SMTP_HOST || !INQUIRY_NOTIFY_TO) return new NullInquiryNotifier();
    return new SmtpInquiryNotifier(
      { host: SMTP_HOST, port: Number(SMTP_PORT || 587), user: SMTP_USER, pass: SMTP_PASS },
      SMTP_FROM || SMTP_USER || "no-reply@localhost",
      INQUIRY_NOTIFY_TO,
      `${SITE_URL ?? ""}/admin/inquiries`,
    );
  }
}
