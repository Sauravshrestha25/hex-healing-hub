"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { parseClock } from "@/features/healers/lib/slots";
import { container } from "@/features/shared/server/container";
import { attempt, type FormState } from "@/features/shared/server/form-action";

const text = (formData: FormData, name: string) => {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
};

/**
 * Turns the healer form into the shape HealerService validates. Repeated rows use suffixed names:
 * `service:<id>` (ticked) with `price:<id>` / `duration:<id>`, and `day:<0-6>` with `start:` / `end:`.
 */
function healerInput(formData: FormData) {
  const services = [...formData.keys()]
    .filter((key) => key.startsWith("service:"))
    .map((key) => key.slice("service:".length))
    .map((serviceId) => ({ serviceId, price: text(formData, `price:${serviceId}`), durationMinutes: text(formData, `duration:${serviceId}`) }));

  const availability = [0, 1, 2, 3, 4, 5, 6]
    .filter((weekday) => formData.has(`day:${weekday}`))
    .map((weekday) => ({
      weekday,
      // Unparseable times become an impossible range, which validation reports.
      startMinute: parseClock(text(formData, `start:${weekday}`)) ?? 0,
      endMinute: parseClock(text(formData, `end:${weekday}`)) ?? 0,
    }));

  return {
    name: text(formData, "name"),
    slug: text(formData, "slug"),
    title: text(formData, "title"),
    bio: text(formData, "bio"),
    photo: text(formData, "photo"),
    experienceYears: text(formData, "experienceYears") || "0",
    qualifications: text(formData, "qualifications"),
    languages: text(formData, "languages"),
    places: formData.getAll("places").filter((v): v is string => typeof v === "string"),
    published: text(formData, "published"),
    order: text(formData, "order") || "0",
    services,
    availability,
    timeOff: formData.getAll("timeOff").filter((v): v is string => typeof v === "string" && v !== ""),
  };
}

export async function saveHealer(_prev: FormState, formData: FormData): Promise<FormState> {
  const { sessions, healers } = container();
  const id = text(formData, "id") || undefined;
  const result = await attempt(async () => {
    await sessions.requireEditor();
    await healers.save(id, healerInput(formData));
  });
  if (result.error) return result;
  revalidatePath("/", "layout");
  redirect("/admin/healers");
}

export async function deleteHealer(id: string): Promise<FormState> {
  const { sessions, healers } = container();
  const result = await attempt(async () => {
    await sessions.requireEditor();
    await healers.remove(id);
  });
  if (!result.error) revalidatePath("/", "layout");
  return result;
}
