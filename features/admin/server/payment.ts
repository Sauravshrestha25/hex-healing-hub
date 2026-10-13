"use server";

import { revalidatePath } from "next/cache";
import { container } from "@/features/shared/server/container";
import { attempt, formFields } from "@/features/shared/server/form-action";

export type PaymentFormState = { error?: string; saved?: boolean };

export async function savePaymentSettings(_prev: PaymentFormState, formData: FormData): Promise<PaymentFormState> {
  const { sessions, payments } = container();
  const result = await attempt(async () => {
    await sessions.requireEditor();
    await payments.save(formFields(formData).fields);
  });
  if (result.error) return result;
  revalidatePath("/", "layout");
  return { saved: true };
}
