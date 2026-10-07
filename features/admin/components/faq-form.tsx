"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { saveFaq } from "@/features/admin/server/faqs";
import type { FormState } from "@/features/shared/lib/form-state";
import { usePreservingSubmit } from "@/features/shared/lib/use-preserving-submit";
import { Field, FormActions, FormSection } from "./form-bits";

type FaqValues = { id: string; question: string; answer: string; published: boolean; order: number };

export function FaqForm({ item, readOnly }: { item?: FaqValues; readOnly?: boolean }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(saveFaq, {});
  const onSubmit = usePreservingSubmit(formAction);

  return (
    <form action={formAction} onSubmit={onSubmit}>
      {item && <input type="hidden" name="id" value={item.id} />}
      <fieldset disabled={readOnly} className="min-w-0 max-w-3xl">
        <FormSection title="Question" description="Shown on the Services and Contact pages.">
          <Field id="question" label="Question">
            <Input id="question" name="question" defaultValue={item?.question} required maxLength={200} placeholder="e.g. Is hypnotherapy safe?" />
          </Field>
          <Field id="answer" label="Answer" hint="Plain text. Press Enter for a new line.">
            <Textarea id="answer" name="answer" defaultValue={item?.answer} required maxLength={2000} rows={6} />
          </Field>
          <Field id="order" label="Display order" hint="Lower numbers appear first.">
            <Input id="order" name="order" type="number" min={0} max={999} defaultValue={item?.order ?? 0} className="w-28" />
          </Field>
          <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
            <div>
              <label htmlFor="published" className="text-sm font-medium">Show on the website</label>
              <p className="text-xs text-muted-foreground">Hidden questions stay here but don&apos;t appear on the site.</p>
            </div>
            <Switch id="published" name="published" value="on" defaultChecked={item?.published ?? true} />
          </div>
        </FormSection>
      </fieldset>
      <FormActions pending={pending} cancelHref="/admin/faqs" error={state.error} readOnly={readOnly} label={item ? "Save changes" : "Add question"} />
    </form>
  );
}
