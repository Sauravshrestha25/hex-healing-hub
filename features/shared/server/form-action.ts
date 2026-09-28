import "server-only";
import type { FormState } from "@/features/shared/lib/form-state";
import { AppError } from "./errors";

export type { FormState };

/**
 * Runs `work` and reports expected failures (AppError) as a form message.
 * Unexpected errors still throw. Call `redirect()` after this returns, never inside `work`.
 */
export async function attempt(work: () => Promise<unknown>): Promise<FormState> {
  try {
    await work();
    return {};
  } catch (error) {
    if (error instanceof AppError) return { error: error.message };
    throw error;
  }
}

export function formFields(formData: FormData) {
  const { id, ...fields } = Object.fromEntries(formData) as Record<string, unknown>;
  return { id: typeof id === "string" && id ? id : undefined, fields };
}
