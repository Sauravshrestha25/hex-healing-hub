"use server";

import { revalidatePath } from "next/cache";
import { container } from "@/features/shared/server/container";
import { attempt } from "@/features/shared/server/form-action";
import { clientIp } from "@/features/shared/server/request";

export type InquiryState = { status: "idle" | "sent" | "error"; message?: string };

export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const ip = await clientIp();
  let saved = false;
  const result = await attempt(async () => {
    saved = await container().inquiries.submit(Object.fromEntries(formData), ip);
  });
  if (result.error) return { status: "error", message: result.error };
  if (saved) revalidatePath("/admin", "layout");
  return { status: "sent" };
}
