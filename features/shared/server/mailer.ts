import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

export type MailMessage = { to: string; subject: string; text: string; replyTo?: string };

export interface Mailer {
  readonly isConfigured: boolean;
  send(message: MailMessage): Promise<void>;
}

export class SmtpMailer implements Mailer {
  readonly isConfigured = true;
  private readonly transport: Transporter;

  constructor(
    config: { host: string; port: number; user?: string; pass?: string },
    private readonly from: string,
  ) {
    this.transport = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: config.user ? { user: config.user, pass: config.pass } : undefined,
    });
  }

  async send(message: MailMessage) {
    // Plain text only: user input is never interpolated into HTML email.
    await this.transport.sendMail({ from: this.from, ...message });
  }
}

/** No SMTP configured. In development it prints the email so flows can still be tested. */
export class ConsoleMailer implements Mailer {
  readonly isConfigured = false;

  async send(message: MailMessage) {
    if (process.env.NODE_ENV === "production") {
      console.warn(`Email not sent (SMTP not configured): "${message.subject}"`);
      return;
    }
    console.info(`\n--- email (SMTP not configured) ---\nTo: ${message.to}\nSubject: ${message.subject}\n\n${message.text}\n---\n`);
  }
}

export function mailerFromEnv(): Mailer {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  if (!SMTP_HOST) return new ConsoleMailer();
  return new SmtpMailer(
    { host: SMTP_HOST, port: Number(SMTP_PORT || 587), user: SMTP_USER, pass: SMTP_PASS },
    SMTP_FROM || SMTP_USER || "no-reply@localhost",
  );
}
