"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { saveGalleryItem } from "@/features/admin/server/gallery";
import type { FormState } from "@/features/shared/lib/form-state";
import { Field, FormActions } from "./form-bits";
import { ImageUploadField } from "./image-upload-field";
import { usePreservingSubmit } from "@/features/shared/lib/use-preserving-submit";

type GalleryValues = { id: string; image: string; title: string; category: string; alt: string; order: number };

export function GalleryForm({ item }: { item?: GalleryValues }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(saveGalleryItem, {});
  const onSubmit = usePreservingSubmit(formAction);

  return (
    <form action={formAction} onSubmit={onSubmit} className="grid max-w-3xl gap-6">
      {item && <input type="hidden" name="id" value={item.id} />}
      <ImageUploadField name="image" label="Image" defaultValue={item?.image} aspect="aspect-[4/5] max-w-sm" />
      <div className="grid gap-6 md:grid-cols-2">
        <Field id="title" label="Title">
          <Input id="title" name="title" defaultValue={item?.title} required maxLength={120} />
        </Field>
        <Field id="category" label="Category">
          <Input id="category" name="category" defaultValue={item?.category} required maxLength={80} />
        </Field>
      </div>
      <Field id="alt" label="Image description" hint="Describe the photo for people using screen readers.">
        <Input id="alt" name="alt" defaultValue={item?.alt} required maxLength={300} />
      </Field>
      <Field id="order" label="Display order" hint="Lower numbers appear first.">
        <Input id="order" name="order" type="number" min={0} max={999} defaultValue={item?.order ?? 0} className="w-32" />
      </Field>
      <FormActions pending={pending} cancelHref="/admin/gallery" error={state.error} />
    </form>
  );
}
