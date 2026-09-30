"use server";

import type { BookingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { container } from "@/features/shared/server/container";
import { attempt, type FormState } from "@/features/shared/server/form-action";

export async function setBookingStatus(id: string, status: BookingStatus): Promise<FormState> {
  const { sessions, bookings } = container();
  const result = await attempt(async () => {
    await sessions.requireEditor();
    await bookings.setStatus(id, status);
  });
  if (!result.error) revalidatePath("/admin", "layout");
  return result;
}

export async function deleteBooking(id: string): Promise<FormState> {
  const { sessions, bookings } = container();
  const result = await attempt(async () => {
    await sessions.requireEditor();
    await bookings.remove(id);
  });
  if (!result.error) revalidatePath("/admin", "layout");
  return result;
}
