"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { container } from "@/features/shared/server/container";
import { attempt, formFields, type FormState } from "@/features/shared/server/form-action";

export async function saveService(_prev: FormState, formData: FormData): Promise<FormState> {
  const { sessions, services } = container();
  await sessions.require();
  const { id, fields } = formFields(formData);
  const result = await attempt(() => services.save(id, fields));
  if (result.error) return result;
  revalidatePath("/", "layout");
  redirect("/admin/services");
}

export async function deleteService(id: string) {
  const { sessions, services } = container();
  await sessions.require();
  await services.remove(id);
  revalidatePath("/", "layout");
}
