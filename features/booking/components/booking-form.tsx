"use client";

import { useActionState } from "react";
import { submitBooking, type BookingState } from "@/features/booking/server/actions";
import { BOOKING_PLACES, TIMES_OF_DAY } from "@/features/shared/lib/data";
import { usePreservingSubmit } from "@/features/shared/lib/use-preserving-submit";
import { WhatsAppIcon } from "@/features/shared/components/whatsapp-link";

const fieldClass =
  "mt-1 w-full min-w-0 rounded-none border-0 border-b border-brand-purple/30 bg-transparent px-0 py-3 text-base text-brand-purple placeholder:text-brand-purple/45 transition-colors focus:border-brand-purple focus:outline-none";
const labelClass = "block text-sm font-medium text-ivory/90";

export function BookingForm({ services, defaultService, today }: { services: string[]; defaultService?: string; today: string }) {
  const [state, formAction, pending] = useActionState<BookingState, FormData>(submitBooking, { status: "idle" });
  const onSubmit = usePreservingSubmit(formAction);

  if (state.status === "sent") {
    return (
      <div className="page-reveal card-plain min-w-0 rounded-3xl p-6 sm:p-10" role="status" aria-live="polite">
        <h2 className="font-heading text-2xl leading-snug sm:text-3xl">Thank you, your request is with us.</h2>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-lavender">
          We&apos;ll call or message you soon to confirm your session. Want a quicker reply? Send us your booking on WhatsApp.
        </p>
        {state.whatsapp && (
          <a href={state.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-gold mt-8 inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-medium">
            <WhatsAppIcon /> Message us on WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="page-reveal card-plain min-w-0 rounded-3xl p-6 sm:p-10">
      <h2 id="booking-title" className="font-heading text-2xl leading-snug">
        Request a session
      </h2>
      <p className="mt-2 text-sm text-lavender">Fields marked * are required. We&apos;ll confirm the exact time with you.</p>
      <form action={formAction} onSubmit={onSubmit} aria-labelledby="booking-title" className="mt-7 flex flex-col gap-6">
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="booking-company">Company</label>
          <input id="booking-company" name="company" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="booking-name" className={labelClass}>Full Name *</label>
            <input id="booking-name" name="name" autoComplete="name" placeholder="Your name" required className={fieldClass} />
          </div>
          <div>
            <label htmlFor="booking-phone" className={labelClass}>Phone Number *</label>
            <input id="booking-phone" name="phone" type="tel" autoComplete="tel" placeholder="98XXXXXXXX" required className={fieldClass} />
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="booking-service" className={labelClass}>Service *</label>
            <select id="booking-service" name="service" required defaultValue={defaultService ?? ""} className={fieldClass}>
              <option value="" disabled>Choose a service</option>
              {services.map((title) => (
                <option key={title} value={title}>{title}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="booking-centre" className={labelClass}>Centre or Online</label>
            <select id="booking-centre" name="centre" defaultValue="" className={fieldClass}>
              <option value="">No preference</option>
              {BOOKING_PLACES.map((place) => (
                <option key={place} value={place}>{place === "Online" ? "Online session" : place}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="booking-date" className={labelClass}>Preferred Date</label>
            <input id="booking-date" name="preferredDate" type="date" min={today} className={fieldClass} />
          </div>
          <div>
            <label htmlFor="booking-time" className={labelClass}>Time of Day</label>
            <select id="booking-time" name="timeOfDay" defaultValue="" className={fieldClass}>
              <option value="">Any time</option>
              {TIMES_OF_DAY.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="booking-email" className={labelClass}>
            Email Address <span className="text-lavender">(optional)</span>
          </label>
          <input id="booking-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="booking-note" className={labelClass}>
            Anything we should know? <span className="text-lavender">(optional)</span>
          </label>
          <textarea id="booking-note" name="note" rows={3} placeholder="Questions, first visit, accessibility needs…" className={`${fieldClass} resize-y`} />
        </div>
        {state.status === "error" && (
          <p role="alert" className="text-sm text-rose-700">{state.message}</p>
        )}
        <div>
          <button type="submit" disabled={pending} className="btn-gold rounded-full px-7 py-4 text-sm font-medium disabled:opacity-60">
            {pending ? "Sending…" : "Request Booking"}
          </button>
        </div>
      </form>
    </div>
  );
}
