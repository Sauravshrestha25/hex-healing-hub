"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { container } from "@/features/shared/server/container";
import { attempt, formFields, type FormState } from "@/features/shared/server/form-action";

export async function saveTestimonial(_prev: FormState, formData: FormData): Promise<FormState> {
  const { sessions, testimonials } = container();
  const { id, fields } = formFields(formData);
  const result = await attempt(async () => {
    await sessions.requireEditor();
    await testimonials.save(id, fields);
  });
  if (result.error) return result;
  revalidatePath("/", "layout");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string): Promise<FormState> {
  const { sessions, testimonials } = container();
  const result = await attempt(async () => {
    await sessions.requireEditor();
    await testimonials.remove(id);
  });
  if (!result.error) revalidatePath("/", "layout");
  return result;
}
