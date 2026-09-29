"use client";

import { useActionState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset, type ResetRequestState } from "@/features/auth/server/password-reset-actions";
import { usePreservingSubmit } from "@/features/shared/lib/use-preserving-submit";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState<ResetRequestState, FormData>(requestPasswordReset, {});
  const onSubmit = usePreservingSubmit(formAction);

  if (state.sent) {
    return (
      <div className="grid gap-5">
        <div role="status" className="flex gap-3 rounded-lg border bg-card p-4 text-sm">
          <MailCheck className="mt-0.5 size-5 shrink-0 text-brand" />
          <p>If an account uses that email, a reset link is on its way. It works once and expires in 30 minutes. Check your spam folder too.</p>
        </div>
        <Link href="/login" className="text-sm font-medium text-brand hover:underline">Back to sign in</Link>
      </div>
    );
  }

  return (
    <form action={formAction} onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="username" required autoFocus className="h-10" placeholder="you@example.com" />
      </div>
      {state.error && <p role="alert" className="rounded-lg bg-destructive/8 px-3 py-2 text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} className="h-10 w-full">{pending ? "Sending…" : "Send reset link"}</Button>
      <Link href="/login" className="text-center text-sm text-muted-foreground hover:text-foreground">Back to sign in</Link>
    </form>
  );
}
