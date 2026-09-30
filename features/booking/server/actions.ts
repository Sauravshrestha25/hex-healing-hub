"use server";

import { revalidatePath } from "next/cache";
import { whatsappUrl } from "@/features/shared/lib/whatsapp";
import { container } from "@/features/shared/server/container";
import { attempt } from "@/features/shared/server/form-action";
import { clientIp } from "@/features/shared/server/request";

export type BookingState = {
  status: "idle" | "sent" | "error";
  message?: string;
  /** Prefilled WhatsApp chat with the booking summary, offered after a successful request. */
  whatsapp?: string;
};

export async function submitBooking(_prev: BookingState, formData: FormData): Promise<BookingState> {
  const ip = await clientIp();
  let whatsapp: string | undefined;
  const result = await attempt(async () => {
    const booking = await container().bookings.submit(Object.fromEntries(formData), ip);
    if (!booking) return;
    const when = [booking.preferredDate, booking.timeOfDay].filter(Boolean).join(", ");
    whatsapp = whatsappUrl(
      [
        `Hi HEX Healing Hub! I just requested a booking for ${booking.service}.`,
        booking.centre ? `Centre: ${booking.centre}` : null,
        when ? `Preferred: ${when}` : null,
        `Name: ${booking.name}`,
      ]
        .filter(Boolean)
        .join("\n"),
    );
  });
  if (result.error) return { status: "error", message: result.error };
  if (whatsapp) revalidatePath("/admin", "layout");
  return { status: "sent", whatsapp };
}
