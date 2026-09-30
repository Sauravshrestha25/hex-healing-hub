"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { saveTestimonial } from "@/features/admin/server/testimonials";
import { LOCATIONS } from "@/features/shared/lib/data";
import type { FormState } from "@/features/shared/lib/form-state";
import { usePreservingSubmit } from "@/features/shared/lib/use-preserving-submit";
import { Field, FormActions, FormSection } from "./form-bits";
import { ImageUploadField } from "./image-upload-field";

type TestimonialValues = {
  id: string;
  name: string;
  quote: string;
  photo: string | null;
  service: string | null;
  centre: string | null;
  rating: number;
  published: boolean;
  order: number;
};

// Native selects, styled like the kit's Input.
const selectClass =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 md:text-sm";

export function TestimonialForm({ item, services, readOnly }: { item?: TestimonialValues; services: string[]; readOnly?: boolean }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(saveTestimonial, {});
  const onSubmit = usePreservingSubmit(formAction);
  // Keep a service that was renamed or removed selectable, so saving doesn't silently drop it.
  const serviceOptions = item?.service && !services.includes(item.service) ? [item.service, ...services] : services;

  return (
    <form action={formAction} onSubmit={onSubmit}>
      {item && <input type="hidden" name="id" value={item.id} />}
      <fieldset disabled={readOnly} className="grid min-w-0 gap-8">
        <FormSection title="Testimonial" description="What they said, in their words.">
          <Field id="name" label="Name">
            <Input id="name" name="name" defaultValue={item?.name} required maxLength={120} placeholder="e.g. Sita K." />
          </Field>
          <Field id="quote" label="Quote">
            <Textarea id="quote" name="quote" defaultValue={item?.quote} required maxLength={1200} rows={5} />
          </Field>
          <Field id="rating" label="Rating">
            <select id="rating" name="rating" defaultValue={item?.rating ?? 5} className={`${selectClass} w-40`}>
              {[5, 4, 3, 2, 1].map((stars) => (
                <option key={stars} value={stars}>
                  {"★".repeat(stars)} ({stars})
                </option>
              ))}
            </select>
          </Field>
        </FormSection>
        <FormSection title="Photo" description="Optional. A square portrait works best; it's shown small and round.">
          <div className="max-w-44">
            <ImageUploadField name="photo" label="Photo" defaultValue={item?.photo ?? undefined} aspect="aspect-square" readOnly={readOnly} removable />
          </div>
        </FormSection>
        <FormSection title="Details" description="Optional context shown under the name.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="service" label="Service">
              <select id="service" name="service" defaultValue={item?.service ?? ""} className={selectClass}>
                <option value="">Not specified</option>
                {serviceOptions.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="centre" label="Centre">
              <select id="centre" name="centre" defaultValue={item?.centre ?? ""} className={selectClass}>
                <option value="">Not specified</option>
                {LOCATIONS.map((location) => (
                  <option key={location.city} value={location.city}>
                    {location.city}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field id="order" label="Display order" hint="Lower numbers appear first.">
            <Input id="order" name="order" type="number" min={0} max={999} defaultValue={item?.order ?? 0} className="w-28" />
          </Field>
          <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
            <div>
              <label htmlFor="published" className="text-sm font-medium">Show on the website</label>
              <p className="text-xs text-muted-foreground">Hidden testimonials stay here but don&apos;t appear on the site.</p>
            </div>
            <Switch id="published" name="published" value="on" defaultChecked={item?.published ?? true} />
          </div>
        </FormSection>
      </fieldset>
      <FormActions pending={pending} cancelHref="/admin/testimonials" error={state.error} readOnly={readOnly} label={item ? "Save changes" : "Add testimonial"} />
    </form>
  );
}
