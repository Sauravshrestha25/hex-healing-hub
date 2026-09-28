import "server-only";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { ConflictError, ValidationError } from "@/features/shared/server/errors";

export const imageField = z
  .string()
  .trim()
  .min(1, "Add an image.")
  .max(500)
  .refine((v) => v.startsWith("/images/") || v.startsWith("https://"), "Use an uploaded image.");

export const orderField = z.coerce.number().int().min(0).max(999).default(0);

export function parseOrThrow<T extends z.ZodType>(schema: T, input: unknown): z.infer<T> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) throw new ValidationError(parsed.error.issues[0]?.message ?? "Please check the form.");
  return parsed.data;
}

/** Runs a write, turning a unique-constraint violation into a friendly ConflictError. */
export async function withUniqueGuard<T>(write: () => Promise<T>, message: string) {
  try {
    return await write();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") throw new ConflictError(message);
    throw error;
  }
}
