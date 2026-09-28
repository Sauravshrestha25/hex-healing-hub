"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { container } from "@/features/shared/server/container";
import { attempt, formFields, type FormState } from "@/features/shared/server/form-action";

export async function saveGalleryItem(_prev: FormState, formData: FormData): Promise<FormState> {
  const { sessions, gallery } = container();
  await sessions.require();
  const { id, fields } = formFields(formData);
  const result = await attempt(() => gallery.save(id, fields));
  if (result.error) return result;
  revalidatePath("/", "layout");
  redirect("/admin/gallery");
}

export async function deleteGalleryItem(id: string) {
  const { sessions, gallery } = container();
  await sessions.require();
  await gallery.remove(id);
  revalidatePath("/", "layout");
}
