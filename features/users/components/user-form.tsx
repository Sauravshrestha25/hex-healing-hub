"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/features/auth/components/password-input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FORM_SECTIONS, Field, FormActions, FormSection } from "@/features/admin/components/form-bits";
import { MIN_PASSWORD_LENGTH } from "@/features/auth/lib/password-policy";
import type { FormState } from "@/features/shared/lib/form-state";
import { usePreservingSubmit } from "@/features/shared/lib/use-preserving-submit";
import { createUser } from "@/features/users/server/actions";

export function UserForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(createUser, {});
  const onSubmit = usePreservingSubmit(formAction);

  return (
    <form action={formAction} onSubmit={onSubmit}>
      <div className={FORM_SECTIONS}>
        <FormSection title="Profile" description="Who this account belongs to.">
          <Field id="name" label="Full name">
            <Input id="name" name="name" required maxLength={120} autoComplete="off" />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="email" label="Email" hint="They sign in with this.">
              <Input id="email" name="email" type="email" required maxLength={200} autoComplete="off" />
            </Field>
            <Field id="phone" label="Phone" hint="Optional.">
              <Input id="phone" name="phone" type="tel" maxLength={30} autoComplete="off" placeholder="98XXXXXXXX" />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Sign-in" description="Share the password with them privately. They can change it from their account page.">
          <Field id="password" label="Password" hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}>
            <PasswordInput id="password" name="password" required minLength={MIN_PASSWORD_LENGTH} maxLength={200} autoComplete="new-password" />
          </Field>
        </FormSection>

        <FormSection title="Access">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Label htmlFor="isVerified">Verified: can make changes</Label>
              <p className="mt-1 text-sm text-muted-foreground">
                Verified users can edit content, handle bookings and manage users. Unverified users can only view.
              </p>
            </div>
            <Switch id="isVerified" name="isVerified" value="on" />
          </div>
        </FormSection>
      </div>

      <FormActions pending={pending} cancelHref="/admin/users" error={state.error} label="Create user" />
    </form>
  );
}
