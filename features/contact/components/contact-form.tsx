"use client";

import { useActionState } from "react";
import { submitInquiry, type InquiryState } from "@/features/contact/server/actions";
import { usePreservingSubmit } from "@/features/shared/lib/use-preserving-submit";

const fieldClass = "mt-2 w-full min-w-0 rounded-none border-0 border-b border-gold/30 bg-transparent px-0 py-3 text-sm text-ivory placeholder:text-lavender/70 transition-colors focus:border-gold-light focus:outline-none focus:ring-0";
const labelClass = "block text-xs font-medium text-ivory/90";

export function ContactForm({ interests }: { interests: string[] }) {
  const [state, formAction, pending] = useActionState<InquiryState, FormData>(submitInquiry, { status: "idle" });
  const onSubmit = usePreservingSubmit(formAction);

  if (state.status === "sent") {
    return (
      <div className="page-reveal glass min-w-0 p-6 sm:p-10 lg:p-12" role="status" aria-live="polite">
        <h2 className="font-heading text-2xl leading-snug sm:text-3xl">Thank you, your message is with us.</h2>
        <p className="mt-4 text-sm leading-relaxed text-lavender">
          Someone from HEX Healing Hub will get back to you soon. If it&apos;s urgent, call your nearest center directly.
        </p>
      </div>
    );
  }

  return (
    <div className="page-reveal glass min-w-0 p-6 sm:p-10 lg:p-12">
      <h2 id="inquiry-title" className="font-heading text-2xl leading-snug sm:text-3xl">Tell us what brings<br />you here.</h2>
      <p className="mt-4 text-sm leading-relaxed text-lavender">A few details are all you need to start. Fields marked * are required.</p>
      <form action={formAction} onSubmit={onSubmit} aria-labelledby="inquiry-title" className="mt-9 flex flex-col gap-7">
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="contact-company">Company</label>
          <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" />
        </div>
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
            {interests.map((title) => <option className="bg-ink" key={title} value={title}>{title}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="contact-message" className={labelClass}>Your Message *</label>
          <textarea id="contact-message" name="message" placeholder="Share a question, your interests, or what you would like to know." required rows={4} className={`${fieldClass} resize-y`} />
        </div>
        {state.status === "error" && <p role="alert" className="text-sm text-rose-300">{state.message}</p>}
        <div>
          <button type="submit" disabled={pending} className="btn-gold rounded-full px-7 py-4 text-sm font-medium disabled:opacity-60">{pending ? "Sending…" : "Send Message"}</button>
        </div>
      </form>
    </div>
  );
}
