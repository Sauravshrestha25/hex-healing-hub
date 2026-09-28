"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveService } from "@/features/admin/server/services";
import type { FormState } from "@/features/shared/lib/form-state";
import { Field, FormActions } from "./form-bits";
import { ImageUploadField } from "./image-upload-field";
import { usePreservingSubmit } from "@/features/shared/lib/use-preserving-submit";

type ServiceValues = { id: string; title: string; slug: string; description: string; image: string; order: number };

export function ServiceForm({ service }: { service?: ServiceValues }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(saveService, {});
  const onSubmit = usePreservingSubmit(formAction);

  return (
    <form action={formAction} onSubmit={onSubmit} className="grid max-w-3xl gap-6">
      {service && <input type="hidden" name="id" value={service.id} />}
      <div className="grid gap-6 md:grid-cols-2">
        <Field id="title" label="Title">
          <Input id="title" name="title" defaultValue={service?.title} required maxLength={120} />
        </Field>
        <Field id="slug" label="URL slug" hint="Leave blank to generate from the title.">
          <Input id="slug" name="slug" defaultValue={service?.slug} maxLength={80} />
        </Field>
      </div>
      <Field id="description" label="Description">
        <Textarea id="description" name="description" defaultValue={service?.description} required maxLength={600} rows={4} />
      </Field>
      <Field id="order" label="Display order" hint="Lower numbers appear first.">
        <Input id="order" name="order" type="number" min={0} max={999} defaultValue={service?.order ?? 0} className="w-32" />
      </Field>
      <ImageUploadField name="image" label="Image" defaultValue={service?.image} aspect="aspect-[4/3]" />
      <FormActions pending={pending} cancelHref="/admin/services" error={state.error} />
    </form>
  );
}
