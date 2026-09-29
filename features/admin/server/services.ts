"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { container } from "@/features/shared/server/container";
import { attempt, formFields, type FormState } from "@/features/shared/server/form-action";

export async function saveService(_prev: FormState, formData: FormData): Promise<FormState> {
  const { sessions, services } = container();
  const { id, fields } = formFields(formData);
  const result = await attempt(async () => {
    await sessions.requireEditor();
    await services.save(id, fields);
  });
  if (result.error) return result;
  revalidatePath("/", "layout");
  redirect("/admin/services");
}

export async function deleteService(id: string): Promise<FormState> {
  const { sessions, services } = container();
  const result = await attempt(async () => {
    await sessions.requireEditor();
    await services.remove(id);
  });
  if (!result.error) revalidatePath("/", "layout");
  return result;
}
