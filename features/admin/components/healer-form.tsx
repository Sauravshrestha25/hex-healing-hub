"use client";

import { useActionState, useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { saveHealer } from "@/features/admin/server/healers";
import { addDays, nepalDate, toClock, WEEKDAYS, type Fee } from "@/features/healers/lib/slots";
import { Calendar } from "@/features/shared/components/calendar";
import { BOOKING_PLACES } from "@/features/shared/lib/data";
import type { FormState } from "@/features/shared/lib/form-state";
import { usePreservingSubmit } from "@/features/shared/lib/use-preserving-submit";
import { FORM_SECTIONS, Field, FormActions, FormSection } from "./form-bits";
import { ImageUploadField } from "./image-upload-field";
import { TitleSlugFields } from "./title-slug-fields";

export type HealerValues = {
  id: string;
  name: string;
  slug: string;
  title: string;
  bio: string;
  photo: string | null;
  experienceYears: number;
  qualifications: string;
  languages: string;
  places: string[];
  published: boolean;
  order: number;
  /** One row per session option; a service's options share its session length. */
  services: ({ serviceId: string; durationMinutes: number } & Fee)[];
  availability: { weekday: number; startMinute: number; endMinute: number }[];
  /** YYYY-MM-DD */
  timeOff: string[];
};

const DURATIONS = [30, 45, 60, 75, 90, 120, 150, 180];

/** A session-option row in the form: saved values, or blank for one just added. */
type OptionRow = Partial<Fee> & { key: number };

// Native controls, styled like the kit's Input.
const controlClass =
  "h-8 min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 md:text-sm";
const checkClass = "size-4 shrink-0 accent-[var(--brand-purple)]";

export function HealerForm({
  healer,
  services,
  readOnly,
}: {
  healer?: HealerValues;
  services: { id: string; title: string }[];
  readOnly?: boolean;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(saveHealer, {});
  const onSubmit = usePreservingSubmit(formAction);

  // Which service and weekday rows are switched on (their price/time fields only apply then).
  const [offered, setOffered] = useState(() => new Set(healer?.services.map((s) => s.serviceId)));
  // Each service's session options (1 session, 4 sessions, …); always at least one row.
  const [options, setOptions] = useState<Record<string, OptionRow[]>>(() =>
    Object.fromEntries(
      services.map((service) => {
        const saved = (healer?.services ?? []).filter((s) => s.serviceId === service.id).sort((a, b) => a.sessions - b.sessions);
        return [service.id, saved.length ? saved.map((s, key) => ({ key, price: s.price, sessions: s.sessions, feeType: s.feeType })) : [{ key: 0, sessions: 1 }]];
      }),
    ),
  );
  const [workdays, setWorkdays] = useState(() => new Set(healer?.availability.map((a) => a.weekday)));
  const [timeOff, setTimeOff] = useState<string[]>(healer?.timeOff ?? []);
  const today = nepalDate(new Date());

  const toggle = <T,>(set: Set<T>, value: T) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  };

  return (
    <form action={formAction} onSubmit={onSubmit}>
      {healer && <input type="hidden" name="id" value={healer.id} />}
      <fieldset disabled={readOnly} className={FORM_SECTIONS}>
        <FormSection title="Profile" description="Who they are, as shown on the Our Healers page and their own profile.">
          <TitleSlugFields defaultTitle={healer?.name} defaultSlug={healer?.slug} pathPrefix="/healers/" titleMaxLength={120} titleName="name" titleLabel="Name" />
          <Field id="title" label="Speciality" hint="One line under the name, e.g. “Hypnotherapist & Energy Healer”.">
            <Input id="title" name="title" defaultValue={healer?.title} required maxLength={160} />
          </Field>
          <Field id="bio" label="Bio" hint="A few short paragraphs in a warm, calm tone. Leave a blank line between paragraphs.">
            <Textarea id="bio" name="bio" defaultValue={healer?.bio} required maxLength={4000} rows={7} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="experienceYears" label="Years of experience">
              <Input id="experienceYears" name="experienceYears" type="number" min={0} max={80} defaultValue={healer?.experienceYears ?? 0} className="w-28" />
            </Field>
            <Field id="languages" label="Languages" hint="Separate with commas, e.g. Nepali, English, Hindi.">
              <Input id="languages" name="languages" defaultValue={healer?.languages} maxLength={200} />
            </Field>
          </div>
          <Field id="qualifications" label="Qualifications and training" hint="One per line.">
            <Textarea id="qualifications" name="qualifications" defaultValue={healer?.qualifications} maxLength={2000} rows={4} />
          </Field>
        </FormSection>

        <FormSection title="Photo" description="Optional. A portrait works best.">
          <div className="max-w-52">
            <ImageUploadField name="photo" label="Photo" defaultValue={healer?.photo ?? undefined} aspect="aspect-[4/5]" readOnly={readOnly} removable />
          </div>
        </FormSection>

        <FormSection title="Where they work" description="Visitors choose one of these when booking.">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {BOOKING_PLACES.map((place) => (
              <label key={place} className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" name="places" value={place} defaultChecked={healer?.places.includes(place)} className={checkClass} />
                {place === "Online" ? "Online sessions" : place}
              </label>
            ))}
          </div>
        </FormSection>

        <FormSection title="Services and pricing" description="Tick what this healer offers and set how long a session takes. Then add the options visitors can choose from: a number of sessions and its price (in rupees), per session or for all of them. Visitors book the first session online; you arrange the rest.">
          {services.length === 0 ? (
            <p className="text-sm text-muted-foreground">Add services first (Website content → Services).</p>
          ) : (
            <ul className="grid gap-3">
              {services.map((service) => {
                const current = healer?.services.find((s) => s.serviceId === service.id);
                const on = offered.has(service.id);
                const rows = options[service.id] ?? [];
                const setRows = (next: (rows: OptionRow[]) => OptionRow[]) => setOptions((all) => ({ ...all, [service.id]: next(all[service.id] ?? []) }));
                return (
                  <li key={service.id} className="grid gap-3 rounded-lg border p-3">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <label className="inline-flex min-w-48 flex-1 items-center gap-2 text-sm font-medium">
                        <input
                          type="checkbox"
                          name={`service:${service.id}`}
                          checked={on}
                          onChange={() => setOffered((set) => toggle(set, service.id))}
                          className={checkClass}
                        />
                        {service.title}
                      </label>
                      {on && (
                        <select
                          name={`duration:${service.id}`}
                          defaultValue={current?.durationMinutes ?? 60}
                          aria-label={`Session length for ${service.title}`}
                          className={controlClass}
                        >
                          {[...new Set([...DURATIONS, current?.durationMinutes ?? 60])].sort((a, b) => a - b).map((minutes) => (
                            <option key={minutes} value={minutes}>
                              {minutes} min per session
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    {on && (
                      <>
                        <ul className="grid gap-2 pl-6">
                          {rows.map((row, index) => {
                            // The first option keeps the plain label; later ones say which option they are.
                            const which = index === 0 ? "" : `, option ${index + 1}`;
                            return (
                              // Each box carries its own label: on a phone the row wraps, and unlabelled boxes get mixed up.
                              <li key={row.key} className="flex flex-wrap items-end gap-x-3 gap-y-2 text-xs text-muted-foreground">
                                <label className="grid gap-1">
                                  Sessions
                                  <input
                                    type="number"
                                    name={`sessions:${service.id}`}
                                    min={1}
                                    max={50}
                                    required
                                    defaultValue={row.sessions}
                                    aria-label={`Number of sessions for ${service.title}${which}`}
                                    className={`${controlClass} w-20`}
                                  />
                                </label>
                                <label className="grid gap-1">
                                  Price (Rs)
                                  <input
                                    type="number"
                                    name={`price:${service.id}`}
                                    min={0}
                                    max={1000000}
                                    step={50}
                                    required
                                    defaultValue={row.price}
                                    aria-label={`Price for ${service.title} in rupees${which}`}
                                    className={`${controlClass} w-28`}
                                  />
                                </label>
                                <label className="grid gap-1">
                                  Price is
                                  <select
                                    name={`feeType:${service.id}`}
                                    defaultValue={row.feeType ?? "PER_SESSION"}
                                    aria-label={`What the price for ${service.title} covers${which}`}
                                    className={controlClass}
                                  >
                                    <option value="PER_SESSION">per session</option>
                                    <option value="PACKAGE">for all sessions</option>
                                  </select>
                                </label>
                                {rows.length > 1 && !readOnly && (
                                  <button
                                    type="button"
                                    aria-label={`Remove option ${index + 1} for ${service.title}`}
                                    onClick={() => setRows((list) => list.filter((r) => r.key !== row.key))}
                                    className="mb-1 grid size-6 place-items-center rounded-full hover:bg-accent hover:text-foreground"
                                  >
                                    <X className="size-3.5" />
                                  </button>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                        {!readOnly && (
                          <button
                            type="button"
                            onClick={() => setRows((list) => [...list, { key: Math.max(...list.map((r) => r.key)) + 1 }])}
                            className="ml-6 inline-flex w-fit items-center gap-1 text-sm font-medium text-brand hover:underline"
                          >
                            <Plus className="size-3.5" /> Add session option
                          </button>
                        )}
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </FormSection>

        <FormSection title="Weekly hours" description="The days and hours visitors can book, in Nepal time. Time slots are offered every 30 minutes within these hours.">
          <ul className="grid gap-2">
            {WEEKDAYS.map((label, weekday) => {
              const current = healer?.availability.find((a) => a.weekday === weekday);
              const on = workdays.has(weekday);
              return (
                <li key={label} className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <label className="inline-flex w-36 items-center gap-2 text-sm font-medium">
                    <input type="checkbox" name={`day:${weekday}`} checked={on} onChange={() => setWorkdays((set) => toggle(set, weekday))} className={checkClass} />
                    {label}
                  </label>
                  {on ? (
                    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <input type="time" name={`start:${weekday}`} required defaultValue={toClock(current?.startMinute ?? 11 * 60)} aria-label={`${label} start`} className={controlClass} />
                      to
                      <input type="time" name={`end:${weekday}`} required defaultValue={toClock(current?.endMinute ?? 17 * 60)} aria-label={`${label} end`} className={controlClass} />
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Not working</span>
                  )}
                </li>
              );
            })}
          </ul>
        </FormSection>

        <FormSection title="Days off" description="Click the dates this healer can't be booked: leave, holidays, festivals.">
          {/* Click a day to mark it off; click it again to bring it back. */}
          <Calendar
            label="Days off"
            min={today}
            max={addDays(today, 365)}
            selected={timeOff}
            isSelectable={() => !readOnly}
            onSelect={(day) => setTimeOff((dates) => (dates.includes(day) ? dates.filter((d) => d !== day) : [...dates, day].sort()))}
          />
          {timeOff.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {timeOff.map((date) => (
                <li key={date} className="inline-flex items-center gap-1 rounded-full border py-1 pr-1 pl-3 text-sm">
                  <input type="hidden" name="timeOff" value={date} />
                  {new Intl.DateTimeFormat("en", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`))}
                  {!readOnly && (
                    <button
                      type="button"
                      aria-label={`Remove day off ${date}`}
                      onClick={() => setTimeOff((dates) => dates.filter((d) => d !== date))}
                      className="grid size-6 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </FormSection>

        <FormSection title="Visibility">
          <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
            <div>
              <label htmlFor="published" className="text-sm font-medium">Show on the website</label>
              <p className="text-xs text-muted-foreground">Needs at least one service with a price and one working day. Hidden healers can&apos;t be booked.</p>
            </div>
            <Switch id="published" name="published" value="on" defaultChecked={healer?.published ?? false} />
          </div>
          <Field id="order" label="Display order" hint="Lower numbers appear first.">
            <Input id="order" name="order" type="number" min={0} max={999} defaultValue={healer?.order ?? 0} className="w-28" />
          </Field>
        </FormSection>
      </fieldset>
      <FormActions pending={pending} cancelHref="/admin/healers" error={state.error} readOnly={readOnly} label={healer ? "Save changes" : "Add healer"} />
    </form>
  );
}
