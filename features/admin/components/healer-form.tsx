"use client";

import { useActionState, useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { saveHealer } from "@/features/admin/server/healers";
import { toClock, WEEKDAYS } from "@/features/healers/lib/slots";
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
  services: { serviceId: string; price: number; durationMinutes: number }[];
  availability: { weekday: number; startMinute: number; endMinute: number }[];
  /** YYYY-MM-DD */
  timeOff: string[];
};

const DURATIONS = [30, 45, 60, 75, 90, 120, 150, 180];

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
  const [workdays, setWorkdays] = useState(() => new Set(healer?.availability.map((a) => a.weekday)));
  const [timeOff, setTimeOff] = useState<string[]>(healer?.timeOff ?? []);
  const [newDayOff, setNewDayOff] = useState("");

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

        <FormSection title="Services and pricing" description="Tick what this healer offers, then set their price (in rupees) and how long a session takes.">
          {services.length === 0 ? (
            <p className="text-sm text-muted-foreground">Add services first (Website content → Services).</p>
          ) : (
            <ul className="grid gap-3">
              {services.map((service) => {
                const current = healer?.services.find((s) => s.serviceId === service.id);
                const on = offered.has(service.id);
                return (
                  <li key={service.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border p-3">
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
                    <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      Rs
                      <input
                        type="number"
                        name={`price:${service.id}`}
                        min={0}
                        max={1000000}
                        step={50}
                        required={on}
                        disabled={!on}
                        defaultValue={current?.price}
                        aria-label={`Price for ${service.title} in rupees`}
                        className={`${controlClass} w-28`}
                      />
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <select
                        name={`duration:${service.id}`}
                        disabled={!on}
                        defaultValue={current?.durationMinutes ?? 60}
                        aria-label={`Session length for ${service.title}`}
                        className={controlClass}
                      >
                        {[...new Set([...DURATIONS, current?.durationMinutes ?? 60])].sort((a, b) => a - b).map((minutes) => (
                          <option key={minutes} value={minutes}>
                            {minutes} min
                          </option>
                        ))}
                      </select>
                    </label>
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

        <FormSection title="Days off" description="Single dates this healer can't be booked: leave, holidays, festivals.">
          <div className="flex flex-wrap items-end gap-3">
            <Field id="new-day-off" label="Add a date">
              <input id="new-day-off" type="date" value={newDayOff} onChange={(event) => setNewDayOff(event.target.value)} className={controlClass} />
            </Field>
            <Button
              type="button"
              variant="outline"
              disabled={!newDayOff || timeOff.includes(newDayOff)}
              onClick={() => {
                setTimeOff((dates) => [...dates, newDayOff].sort());
                setNewDayOff("");
              }}
            >
              <Plus /> Add
            </Button>
          </div>
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
