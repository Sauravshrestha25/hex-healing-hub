"use client";

import { startTransition, type FormEvent } from "react";

/**
 * React resets a form after a server `action` runs, which wipes what people typed when
 * validation fails. Submitting through onSubmit keeps their input; the form's `action`
 * attribute still works as the no-JavaScript fallback.
 */
export function usePreservingSubmit(formAction: (formData: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };
}
