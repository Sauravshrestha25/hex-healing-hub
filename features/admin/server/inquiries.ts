"use server";

import type { InquiryStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { container } from "@/features/shared/server/container";
import { attempt, type FormState } from "@/features/shared/server/form-action";

export async function setInquiryStatus(id: string, status: InquiryStatus): Promise<FormState> {
  const { sessions, inquiries } = container();
  const result = await attempt(async () => {
    await sessions.requireEditor();
    await inquiries.setStatus(id, status);
  });
  if (!result.error) revalidatePath("/admin", "layout");
  return result;
}

export async function deleteInquiry(id: string): Promise<FormState> {
  const { sessions, inquiries } = container();
  const result = await attempt(async () => {
    await sessions.requireEditor();
    await inquiries.remove(id);
  });
  if (!result.error) revalidatePath("/admin", "layout");
  return result;
}
