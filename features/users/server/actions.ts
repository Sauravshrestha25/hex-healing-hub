"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { container } from "@/features/shared/server/container";
import { attempt, type FormState } from "@/features/shared/server/form-action";

export async function createUser(_prev: FormState, formData: FormData): Promise<FormState> {
  const { sessions, users } = container();
  const result = await attempt(async () => {
    const actor = await sessions.requireEditor();
    await users.create(actor, Object.fromEntries(formData));
  });
  if (result.error) return result;
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function removeUser(id: string): Promise<FormState> {
  const { sessions, users } = container();
  const result = await attempt(async () => {
    const actor = await sessions.requireEditor();
    await users.remove(actor, id);
  });
  if (!result.error) revalidatePath("/admin/users");
  return result;
}

export async function setUserVerified(id: string, verified: boolean): Promise<FormState> {
  const { sessions, users } = container();
  const result = await attempt(async () => {
    const actor = await sessions.requireEditor();
    await users.setVerified(actor, id, verified);
  });
  if (!result.error) revalidatePath("/admin/users");
  return result;
}

export type PasswordState = FormState & { saved?: boolean };

/** Allowed for unverified users too: it only touches their own account. */
export async function changePassword(_prev: PasswordState, formData: FormData): Promise<PasswordState> {
  const { sessions, users } = container();
  const actor = await sessions.require();
  let version = 0;
  const result = await attempt(async () => {
    version = await users.changeOwnPassword(actor, Object.fromEntries(formData));
  });
  if (result.error) return result;
  // Other sessions are now invalid; re-issue this one so the user stays signed in here.
  await sessions.start(actor.id, version);
  return { saved: true };
}
