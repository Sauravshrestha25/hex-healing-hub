"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveService } from "@/features/admin/server/services";
import type { FormState } from "@/features/shared/lib/form-state";
import { usePreservingSubmit } from "@/features/shared/lib/use-preserving-submit";
import { Field, FormActions, FormSection } from "./form-bits";
import { ImageUploadField } from "./image-upload-field";
import { RichTextEditor } from "./rich-text-editor";
import { TitleSlugFields } from "./title-slug-fields";

type ServiceValues = { id: string; title: string; slug: string; description: string; content: string; image: string; order: number };

export function ServiceForm({ service, readOnly }: { service?: ServiceValues; readOnly?: boolean }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(saveService, {});
  const onSubmit = usePreservingSubmit(formAction);

  return (
    <form action={formAction} onSubmit={onSubmit}>
      {service && <input type="hidden" name="id" value={service.id} />}
      <fieldset disabled={readOnly} className="grid min-w-0 gap-8">
        <FormSection title="Details" description="How the service appears on the homepage and Services page.">
          <TitleSlugFields defaultTitle={service?.title} defaultSlug={service?.slug} pathPrefix="/services/" titleMaxLength={120} />
          <Field id="description" label="Summary" hint="Two or three sentences, shown on the homepage, the Services list and at the top of the service's page.">
            <Textarea id="description" name="description" defaultValue={service?.description} required maxLength={600} rows={4} />
          </Field>
          <Field id="order" label="Display order" hint="Lower numbers appear first.">
            <Input id="order" name="order" type="number" min={0} max={999} defaultValue={service?.order ?? 0} className="w-28" />
          </Field>
        </FormSection>
        <FormSection title="Image">
          <ImageUploadField name="image" label="Image" defaultValue={service?.image} aspect="aspect-[16/10]" readOnly={readOnly} />
        </FormSection>
        <FormSection title="Page content" description="The full write-up on the service's own page: what it is, what a session looks like, who it helps.">
          <RichTextEditor name="content" defaultValue={service?.content} readOnly={readOnly} />
        </FormSection>
      </fieldset>
      <FormActions pending={pending} cancelHref="/admin/services" error={state.error} readOnly={readOnly} label={service ? "Save changes" : "Create service"} />
    </form>
  );
}
