"use server";

import { revalidatePath } from "next/cache";
import { formatRupees, formatSlot, isDateString } from "@/features/healers/lib/slots";
import { whatsappUrl } from "@/features/shared/lib/whatsapp";
import { container } from "@/features/shared/server/container";
import { attempt } from "@/features/shared/server/form-action";
import { clientIp } from "@/features/shared/server/request";

/** Days in the booking window with at least one free slot for this healer and service. */
export async function getAvailableDates(healerId: string, serviceId: string): Promise<string[]> {
  if (typeof healerId !== "string" || typeof serviceId !== "string") return [];
  return container().healers.availableDates(healerId, serviceId);
}

/** Free start times (minutes from Nepal midnight) on one day. */
export async function getSlots(healerId: string, serviceId: string, date: string): Promise<number[]> {
  if (typeof healerId !== "string" || typeof serviceId !== "string" || typeof date !== "string" || !isDateString(date)) return [];
  return container().healers.slots(healerId, serviceId, date);
}

export type SlotBookingState = {
  status: "idle" | "booked" | "error";
  message?: string;
  /** Shown on the confirmation screen. */
  summary?: { reference: string; healer: string; service: string; when: string; place: string; length: string; price: string };
  /** Prefilled WhatsApp chat with the booking summary. */
  whatsapp?: string;
};

export async function bookHealerSlot(_prev: SlotBookingState, formData: FormData): Promise<SlotBookingState> {
  const ip = await clientIp();
  let state: SlotBookingState = { status: "booked" };
  const result = await attempt(async () => {
    const booking = await container().bookings.bookSlot(Object.fromEntries(formData), ip);
    // A filled honeypot: a quiet "success" with nothing saved.
    if (!booking?.startsAt) return;
    const summary = {
      reference: booking.reference,
      healer: booking.healerName ?? "",
      service: booking.service,
      when: `${formatSlot(booking.startsAt)} (Nepal time)`,
      place: booking.centre ?? "",
      length: `${booking.durationMinutes} minutes`,
      price: formatRupees(booking.price ?? 0),
    };
    state = {
      status: "booked",
      summary,
      whatsapp: whatsappUrl(
        [
          `Hi HEX Healing Hub! I just requested a booking (${summary.reference}).`,
          `Healer: ${summary.healer}`,
          `Service: ${summary.service}`,
          `When: ${summary.when}`,
          `Where: ${summary.place}`,
          `Name: ${booking.name}`,
        ].join("\n"),
      ),
    };
  });
  if (result.error) return { status: "error", message: result.error };
  revalidatePath("/admin", "layout");
  return state;
}
