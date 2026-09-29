"use server";

import { redirect } from "next/navigation";
import { container } from "@/features/shared/server/container";
import { attempt, type FormState } from "@/features/shared/server/form-action";
import { clientIp } from "@/features/shared/server/request";

export type ResetRequestState = FormState & { sent?: boolean };

export async function requestPasswordReset(_prev: ResetRequestState, formData: FormData): Promise<ResetRequestState> {
  const ip = await clientIp();
  const result = await attempt(() => container().passwordResets.request(formData.get("email"), ip));
  return result.error ? result : { sent: true };
}

export async function resetPassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const result = await attempt(() => container().passwordResets.reset(Object.fromEntries(formData)));
  if (result.error) return result;
  redirect("/login?reset=1");
}
