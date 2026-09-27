"use client";

import { useState, type FormEvent } from "react";
import { CONTACT_EMAIL, SERVICES } from "@/features/shared/lib/data";

const fieldClass = "mt-2 w-full min-w-0 rounded-none border-0 border-b border-gold/30 bg-transparent px-0 py-3 text-sm text-ivory placeholder:text-lavender/70 transition-colors focus:border-gold-light focus:outline-none focus:ring-0";
const labelClass = "block text-xs font-medium text-ivory/90";

export function ContactForm() {
  const [prepared, setPrepared] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPrepared(false);
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const interest = String(data.get("interest") ?? "");
    const message = String(data.get("message") ?? "").trim();
    if (!name || !email || !message) {
      setError("Please add your name, email address and message.");
      return;
    }
    const details = [`Name: ${name}`, `Email: ${email}`, ...(phone ? [`Phone: ${phone}`] : []), `Interested in: ${interest}`];
    const body = [...details, "", message].join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`HEX Healing Hub Inquiry — ${name}`)}&body=${encodeURIComponent(body)}`;
    setPrepared(true);
  }

  return (
    <div className="page-reveal glass min-w-0 p-6 sm:p-10 lg:p-12">
      <h2 id="inquiry-title" className="font-heading text-2xl leading-snug sm:text-3xl">Tell us what brings<br />you here.</h2>
      <p className="mt-4 text-sm leading-relaxed text-lavender">A few details are all you need to start. Fields marked * are required.</p>
      <form onSubmit={handleSubmit} aria-labelledby="inquiry-title" className="mt-9 flex flex-col gap-7">
        <div>
          <label htmlFor="contact-name" className={labelClass}>Full Name *</label>
          <input id="contact-name" name="name" autoComplete="name" placeholder="Your name" required className={fieldClass} />
        </div>
        <div className="grid gap-7 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-email" className={labelClass}>Email Address *</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required className={fieldClass} />
          </div>
          <div>
            <label htmlFor="contact-phone" className={labelClass}>Phone Number <span className="text-lavender">(optional)</span></label>
            <input id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder="Your contact number" className={fieldClass} />
          </div>
        </div>
        <div>
          <label htmlFor="contact-interest" className={labelClass}>What Would You Like to Explore?</label>
          <select id="contact-interest" name="interest" defaultValue="Not Sure Yet" className={`${fieldClass} [color-scheme:dark]`}>
            <option className="bg-ink" value="Not Sure Yet">Not sure yet, I&apos;d like some guidance</option>
            {SERVICES.map(service => <option className="bg-ink" key={service.id} value={service.title}>{service.title}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="contact-message" className={labelClass}>Your Message *</label>
          <textarea id="contact-message" name="message" placeholder="Share a question, your interests, or what you would like to know." required rows={4} className={`${fieldClass} resize-y`} />
        </div>
        {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
        <div>
          <button type="submit" className="btn-gold rounded-full px-7 py-4 text-sm font-medium">Open Email App <span aria-hidden="true" className="ml-3">↗</span></button>
          <p className="mt-4 text-xs leading-relaxed text-lavender">This prepares your inquiry in your email app. Review it there and press send when you&apos;re ready.</p>
        </div>
        <div role="status" aria-live="polite">
          {prepared && <p className="border-l border-gold/50 pl-4 text-sm leading-relaxed text-gold-light">Your email draft is ready to open. If no email app appears, you can email {CONTACT_EMAIL} directly. Your message has not been sent by this website.</p>}
        </div>
      </form>
    </div>
  );
}
