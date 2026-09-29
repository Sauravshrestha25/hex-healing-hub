"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/features/admin/components/form-bits";
import { MIN_PASSWORD_LENGTH } from "@/features/auth/lib/password-policy";
import { usePreservingSubmit } from "@/features/shared/lib/use-preserving-submit";
import { changePassword, type PasswordState } from "@/features/users/server/actions";

export function PasswordForm() {
  const [state, formAction, pending] = useActionState<PasswordState, FormData>(changePassword, {});
  const onSubmit = usePreservingSubmit(formAction);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.saved) return;
    form.current?.reset();
    toast.success("Password changed. Other devices have been signed out.");
  }, [state]);

  return (
    <form ref={form} action={formAction} onSubmit={onSubmit} className="grid gap-5">
      <Field id="currentPassword" label="Current password">
        <Input id="currentPassword" name="currentPassword" type="password" required autoComplete="current-password" />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="newPassword" label="New password" hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}>
          <Input id="newPassword" name="newPassword" type="password" required minLength={MIN_PASSWORD_LENGTH} maxLength={200} autoComplete="new-password" />
        </Field>
        <Field id="confirmPassword" label="Confirm new password">
          <Input id="confirmPassword" name="confirmPassword" type="password" required maxLength={200} autoComplete="new-password" />
        </Field>
      </div>
      <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">Other devices signed in to this account will be signed out.</p>
        {state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
        <Button type="submit" disabled={pending} className="w-fit">{pending ? "Saving…" : "Change password"}</Button>
      </div>
    </form>
  );
}
