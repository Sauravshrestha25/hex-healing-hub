"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { saveGalleryItem } from "@/features/admin/server/gallery";
import type { FormState } from "@/features/shared/lib/form-state";
import { usePreservingSubmit } from "@/features/shared/lib/use-preserving-submit";
import { Field, FormActions, FormSection } from "./form-bits";
import { ImageUploadField } from "./image-upload-field";

type GalleryValues = { id: string; image: string; title: string; category: string; alt: string; order: number };

export function GalleryForm({ item, readOnly }: { item?: GalleryValues; readOnly?: boolean }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(saveGalleryItem, {});
  const onSubmit = usePreservingSubmit(formAction);

  return (
    <form action={formAction} onSubmit={onSubmit}>
      {item && <input type="hidden" name="id" value={item.id} />}
      <fieldset disabled={readOnly} className="grid min-w-0 gap-8">
        <FormSection title="Photo" description="Portrait or square photos look best in the gallery.">
          <div className="max-w-sm">
            <ImageUploadField name="image" label="Image" defaultValue={item?.image} aspect="aspect-[4/5]" readOnly={readOnly} />
          </div>
        </FormSection>
        <FormSection title="Details">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="title" label="Title">
              <Input id="title" name="title" defaultValue={item?.title} required maxLength={120} />
            </Field>
            <Field id="category" label="Category">
              <Input id="category" name="category" defaultValue={item?.category} required maxLength={80} />
            </Field>
          </div>
          <Field id="alt" label="Image description" hint="Describe the photo for people using screen readers, e.g. “Sound bowls laid out for a group session”.">
            <Input id="alt" name="alt" defaultValue={item?.alt} required maxLength={300} />
          </Field>
          <Field id="order" label="Display order" hint="Lower numbers appear first.">
            <Input id="order" name="order" type="number" min={0} max={999} defaultValue={item?.order ?? 0} className="w-28" />
          </Field>
        </FormSection>
      </fieldset>
      <FormActions pending={pending} cancelHref="/admin/gallery" error={state.error} readOnly={readOnly} label={item ? "Save changes" : "Add photo"} />
    </form>
  );
}
