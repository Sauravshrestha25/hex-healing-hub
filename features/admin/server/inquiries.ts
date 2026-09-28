"use server";

import type { InquiryStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { container } from "@/features/shared/server/container";

export async function setInquiryStatus(id: string, status: InquiryStatus) {
  const { sessions, inquiries } = container();
  await sessions.require();
  await inquiries.setStatus(id, status);
  revalidatePath("/admin", "layout");
}

export async function deleteInquiry(id: string) {
  const { sessions, inquiries } = container();
  await sessions.require();
  await inquiries.remove(id);
  revalidatePath("/admin", "layout");
}
