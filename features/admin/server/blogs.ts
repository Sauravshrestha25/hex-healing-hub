"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { container } from "@/features/shared/server/container";
import { attempt, formFields, type FormState } from "@/features/shared/server/form-action";

export async function saveBlog(_prev: FormState, formData: FormData): Promise<FormState> {
  const { sessions, blogs } = container();
  await sessions.require();
  const { id, fields } = formFields(formData);
  const result = await attempt(() => blogs.save(id, fields));
  if (result.error) return result;
  revalidatePath("/", "layout");
  redirect("/admin/blogs");
}

export async function deleteBlog(id: string) {
  const { sessions, blogs } = container();
  await sessions.require();
  await blogs.remove(id);
  revalidatePath("/", "layout");
}
