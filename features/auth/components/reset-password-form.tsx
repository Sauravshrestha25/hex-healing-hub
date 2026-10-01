"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/features/auth/components/password-input";
import { Label } from "@/components/ui/label";
import { MIN_PASSWORD_LENGTH } from "@/features/auth/lib/password-policy";
import { resetPassword } from "@/features/auth/server/password-reset-actions";
import type { FormState } from "@/features/shared/lib/form-state";
import { usePreservingSubmit } from "@/features/shared/lib/use-preserving-submit";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(resetPassword, {});
  const onSubmit = usePreservingSubmit(formAction);

  return (
    <form action={formAction} onSubmit={onSubmit} className="grid gap-5">
      <input type="hidden" name="token" value={token} />
      <div className="grid gap-2">
        <Label htmlFor="newPassword">New password</Label>
        <PasswordInput id="newPassword" name="newPassword" required minLength={MIN_PASSWORD_LENGTH} maxLength={200} autoComplete="new-password" autoFocus className="h-10" />
        <p className="text-xs text-muted-foreground">At least {MIN_PASSWORD_LENGTH} characters.</p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <PasswordInput id="confirmPassword" name="confirmPassword" required maxLength={200} autoComplete="new-password" className="h-10" />
      </div>
      {state.error && <p role="alert" className="rounded-lg bg-destructive/8 px-3 py-2 text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} className="h-10 w-full">{pending ? "Saving…" : "Set new password"}</Button>
    </form>
  );
}
