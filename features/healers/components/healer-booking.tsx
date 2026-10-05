"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { formatDate, formatMinute, formatRupees } from "@/features/healers/lib/slots";
import { bookHealerSlot, getAvailableDates, getSlots, type SlotBookingState } from "@/features/healers/server/actions";
import { WhatsAppIcon } from "@/features/shared/components/whatsapp-link";
import type { HealerOffering } from "@/features/shared/lib/data";
import { usePreservingSubmit } from "@/features/shared/lib/use-preserving-submit";

const fieldClass =
  "mt-1 w-full min-w-0 rounded-none border-0 border-b border-ivory/30 bg-transparent px-0 py-3 text-base text-ivory placeholder:text-ivory/50 transition-colors focus:border-ivory focus:outline-none";
const labelClass = "block text-sm font-medium text-ivory/90";
// A choice chip: outlined, filled purple when chosen.
const chip = (selected: boolean) =>
  `rounded-xl px-4 py-3 text-left text-sm transition-colors ring-1 ring-inset ${
    selected ? "bg-brand-purple text-brand-cream ring-brand-purple" : "ring-brand-purple/25 hover:ring-brand-purple"
  }`;

/** Step heading inside the booking card. */
function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="flex items-center gap-3 font-heading text-lg">
        <span className="grid size-7 place-items-center rounded-full bg-brand-purple text-sm text-brand-cream">{number}</span>
        {title}
      </legend>
      <div className="mt-4">{children}</div>
    </fieldset>
  );
}

/**
 * Books a real time slot with one healer: service, place, a day with free times, a start time, then
 * the visitor's details. Free days and times come from the server and are re-checked when booking.
 */
export function HealerBooking({
  healer,
  preselectedServiceId,
}: {
  healer: { id: string; name: string; places: string[]; offerings: HealerOffering[] };
  preselectedServiceId?: string;
}) {
  const [loading, startLoading] = useTransition();

  const initialService = healer.offerings.find((o) => o.serviceId === preselectedServiceId) ?? (healer.offerings.length === 1 ? healer.offerings[0] : undefined);
  const [serviceId, setServiceId] = useState(initialService?.serviceId ?? "");
  const [place, setPlace] = useState(healer.places.length === 1 ? healer.places[0]! : "");
  const [dates, setDates] = useState<string[] | null>(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<number[] | null>(null);
  const [start, setStart] = useState<number | null>(null);
  const offering = healer.offerings.find((o) => o.serviceId === serviceId);

  // "That time was just taken": refresh the times so the visitor can pick another.
  async function submit(previous: SlotBookingState, formData: FormData) {
    const result = await bookHealerSlot(previous, formData);
    if (result.status === "error" && serviceId && date) {
      setStart(null);
      setSlots(await getSlots(healer.id, serviceId, date));
    }
    return result;
  }
  const [state, formAction, pending] = useActionState<SlotBookingState, FormData>(submit, { status: "idle" });
  const onSubmit = usePreservingSubmit(formAction);

  function chooseService(id: string) {
    setServiceId(id);
    setDate("");
    setSlots(null);
    setStart(null);
    setDates(null);
    startLoading(async () => setDates(await getAvailableDates(healer.id, id)));
  }

  function chooseDate(day: string) {
    setDate(day);
    setStart(null);
    setSlots(null);
    startLoading(async () => setSlots(await getSlots(healer.id, serviceId, day)));
  }

  // A preselected (or only) service: load its free days straight away.
  useEffect(() => {
    if (initialService) startLoading(async () => setDates(await getAvailableDates(healer.id, initialService.serviceId)));
    // Runs once for the initial selection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state.status === "booked") {
    const summary = state.summary;
    return (
      <div ref={(element) => element?.focus()} tabIndex={-1} role="status" aria-live="polite" className="card-plain rounded-3xl p-6 outline-none sm:p-10">
        <h3 className="font-heading text-2xl leading-snug sm:text-3xl">Your request is in.</h3>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-lavender">
          We&apos;ve held this time for you. Our team will confirm it shortly by phone or WhatsApp{summary ? ", and by email if you left one" : ""}.
        </p>
        {summary && (
          <dl className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {[
              ["Booking reference", summary.reference],
              ["Healer", summary.healer],
              ["Service", summary.service],
              ["When", summary.when],
              ["Where", summary.place],
              ["Length", summary.length],
              ["Fee", summary.price],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-sm text-lavender">{label}</dt>
                <dd className={`mt-1 font-heading ${label === "Booking reference" ? "text-2xl tracking-wide" : "text-lg"}`}>{value}</dd>
              </div>
            ))}
          </dl>
        )}
        {state.whatsapp && (
          <a href={state.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-gold mt-9 inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-medium">
            <WhatsAppIcon /> Message us on WhatsApp
          </a>
        )}
      </div>
    );
  }

  const ready = Boolean(offering && place && date && start !== null);

  return (
    <form action={formAction} onSubmit={onSubmit} className="card-plain grid gap-10 rounded-3xl p-6 sm:p-10" aria-label={`Book a session with ${healer.name}`}>
      <input type="hidden" name="healerId" value={healer.id} />
      <input type="hidden" name="serviceId" value={serviceId} />
      <input type="hidden" name="place" value={place} />
      <input type="hidden" name="date" value={date} />
      <input type="hidden" name="start" value={start ?? ""} />
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="slot-company">Company</label>
        <input id="slot-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <Step number={1} title="Choose a service">
        <div className="grid gap-3 sm:grid-cols-2">
          {healer.offerings.map((o) => (
            <button key={o.serviceId} type="button" aria-pressed={serviceId === o.serviceId} onClick={() => chooseService(o.serviceId)} className={chip(serviceId === o.serviceId)}>
              <span className="block font-heading text-base">{o.title}</span>
              <span className="mt-1 block opacity-80">
                {o.durationMinutes} min · {formatRupees(o.price)}
              </span>
            </button>
          ))}
        </div>
      </Step>

      <Step number={2} title="Where?">
        <div className="flex flex-wrap gap-3">
          {healer.places.map((p) => (
            <button key={p} type="button" aria-pressed={place === p} onClick={() => setPlace(p)} className={chip(place === p)}>
              {p === "Online" ? "Online session" : p}
            </button>
          ))}
        </div>
      </Step>

      <Step number={3} title="Pick a day">
        {!serviceId ? (
          <p className="text-base text-lavender">Choose a service first to see free days.</p>
        ) : dates === null ? (
          <p className="text-base text-lavender" aria-live="polite">Finding free days…</p>
        ) : dates.length === 0 ? (
          <p className="text-base text-lavender">No free days in the next 30 days. Please message us on WhatsApp and we&apos;ll find a time.</p>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2" data-lenis-prevent>
            {dates.map((day) => {
              const [weekday, rest] = formatDate(day).split(", ");
              return (
                <button key={day} type="button" aria-pressed={date === day} aria-label={formatDate(day)} onClick={() => chooseDate(day)} className={`${chip(date === day)} shrink-0 text-center`}>
                  <span className="block text-sm opacity-80">{weekday}</span>
                  <span className="block font-heading text-base whitespace-nowrap">{rest}</span>
                </button>
              );
            })}
          </div>
        )}
      </Step>

      <Step number={4} title="Pick a time">
        {!date ? (
          <p className="text-base text-lavender">Choose a day to see free times.</p>
        ) : slots === null ? (
          <p className="text-base text-lavender" aria-live="polite">Finding free times…</p>
        ) : slots.length === 0 ? (
          <p className="text-base text-lavender">That day is now full. Please choose another day.</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-3">
              {slots.map((minute) => (
                <button key={minute} type="button" aria-pressed={start === minute} onClick={() => setStart(minute)} className={chip(start === minute)}>
                  {formatMinute(minute)}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-lavender">Times are in Nepal time.</p>
          </>
        )}
      </Step>

      <Step number={5} title="Your details">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="slot-name" className={labelClass}>Full Name *</label>
            <input id="slot-name" name="name" autoComplete="name" placeholder="Your name" required className={fieldClass} />
          </div>
          <div>
            <label htmlFor="slot-phone" className={labelClass}>Phone Number *</label>
            <input id="slot-phone" name="phone" type="tel" autoComplete="tel" placeholder="98XXXXXXXX" required className={fieldClass} />
          </div>
        </div>
        <div className="mt-6">
          <label htmlFor="slot-email" className={labelClass}>
            Email Address <span className="text-lavender">(optional, for your confirmation)</span>
          </label>
          <input id="slot-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className={fieldClass} />
        </div>
        <div className="mt-6">
          <label htmlFor="slot-note" className={labelClass}>
            Anything we should know? <span className="text-lavender">(optional)</span>
          </label>
          <textarea id="slot-note" name="note" rows={3} placeholder="Questions, first visit, accessibility needs…" className={`${fieldClass} resize-y`} />
        </div>
      </Step>

      <div className="grid gap-4">
        {ready && offering && (
          <p className="text-base leading-relaxed" aria-live="polite">
            <span className="font-heading text-lg">{offering.title}</span> with {healer.name}, {formatDate(date)} at {formatMinute(start!)} ·{" "}
            {place === "Online" ? "online" : place} · {offering.durationMinutes} min · {formatRupees(offering.price)}
          </p>
        )}
        {state.status === "error" && (
          <p role="alert" className="text-sm text-rose-700">{state.message}</p>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" disabled={!ready || pending || loading} className="btn-gold rounded-full px-7 py-4 text-sm font-medium disabled:opacity-50">
            {pending ? "Booking…" : "Request this time"}
          </button>
          {!ready && <span className="text-sm text-lavender">Choose a service, place, day and time to continue.</span>}
        </div>
      </div>
    </form>
  );
}
