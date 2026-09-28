"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Field, FormActions } from "@/features/admin/components/form-bits";
import { MIN_PASSWORD_LENGTH } from "@/features/auth/lib/password-policy";
import type { FormState } from "@/features/shared/lib/form-state";
import { usePreservingSubmit } from "@/features/shared/lib/use-preserving-submit";
import { createUser } from "@/features/users/server/actions";

export function UserForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(createUser, {});
  const onSubmit = usePreservingSubmit(formAction);

  return (
    <form action={formAction} onSubmit={onSubmit} className="grid max-w-md gap-6">
      <Field id="name" label="Name">
        <Input id="name" name="name" required maxLength={120} autoComplete="off" />
      </Field>
      <Field id="email" label="Email">
        <Input id="email" name="email" type="email" required maxLength={200} autoComplete="off" />
      </Field>
      <Field id="password" label="Password" hint={`At least ${MIN_PASSWORD_LENGTH} characters. Share it with them privately.`}>
        <Input id="password" name="password" type="password" required minLength={MIN_PASSWORD_LENGTH} maxLength={200} autoComplete="new-password" />
      </Field>
      <FormActions pending={pending} cancelHref="/admin/users" error={state.error} />
    </form>
  );
}
