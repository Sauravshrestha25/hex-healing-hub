"use client";

import { useActionState } from "react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { savePaymentSettings, type PaymentFormState } from "@/features/admin/server/payment";
import { usePreservingSubmit } from "@/features/shared/lib/use-preserving-submit";
import { Field, FormActions, FormSection } from "./form-bits";
import { ImageUploadField } from "./image-upload-field";

type PaymentValues = { qrImage: string | null; instructions: string; required: boolean };

export function PaymentForm({ settings, readOnly }: { settings: PaymentValues; readOnly?: boolean }) {
  const [state, formAction, pending] = useActionState<PaymentFormState, FormData>(savePaymentSettings, {});
  const onSubmit = usePreservingSubmit(formAction);

  return (
    <form action={formAction} onSubmit={onSubmit}>
      <fieldset disabled={readOnly} className="min-w-0 max-w-3xl">
        <FormSection title="Payment QR" description="Visitors booking with a healer scan this to pay, then upload a screenshot of the payment. Without a QR, booking works as before and no payment is asked.">
          <div className="grid max-w-52 gap-2">
            <ImageUploadField name="qrImage" label="QR code" defaultValue={settings.qrImage ?? undefined} aspect="aspect-[9/16]" readOnly={readOnly} removable />
            <p className="text-xs text-muted-foreground">
              Use the standard portrait Fonepay QR image (9:16). It shows small on the booking form; visitors tap it to see it full size.
            </p>
          </div>
          <Field id="instructions" label="Note under the QR" hint="Optional. E.g. the account name to check before paying, or which apps work.">
            <Textarea id="instructions" name="instructions" defaultValue={settings.instructions} maxLength={500} rows={3} placeholder="eSewa / Fonepay. Account name: HEX Healing Hub" />
          </Field>
          <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
            <div>
              <label htmlFor="required" className="text-sm font-medium">Require payment to book</label>
              <p className="text-xs text-muted-foreground">Off: visitors can pay now or later. On: a booking needs a payment screenshot.</p>
            </div>
            <Switch id="required" name="required" value="on" defaultChecked={settings.required} />
          </div>
          {state.saved && (
            <p role="status" className="text-sm text-muted-foreground">
              Saved.
            </p>
          )}
        </FormSection>
      </fieldset>
      <FormActions pending={pending} cancelHref="/admin" error={state.error} readOnly={readOnly} />
    </form>
  );
}
