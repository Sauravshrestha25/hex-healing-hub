"use server";

import { redirect } from "next/navigation";
import { container } from "@/features/shared/server/container";
import { attempt, type FormState } from "@/features/shared/server/form-action";
import { clientIp } from "@/features/shared/server/request";

function safeNext(next: FormDataEntryValue | null) {
  return typeof next === "string" && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const ip = await clientIp();
  const result = await attempt(() =>
    container().auth.signIn({ email: formData.get("email"), password: formData.get("password") }, ip),
  );
  if (result.error) return result;
  redirect(safeNext(formData.get("next")));
}

export async function logout() {
  await container().auth.signOut();
  redirect("/login");
}
