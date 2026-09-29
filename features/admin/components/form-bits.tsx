import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function Field({ id, label, hint, children }: { id: string; label: string; hint?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** A titled group of fields: heading on the left on wide screens, fields in a card on the right. */
export function FormSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-b pb-8 last-of-type:border-0 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="grid gap-5 rounded-xl border bg-card p-5 sm:p-6">{children}</div>
    </section>
  );
}

/** Save bar that stays in view at the bottom of long forms. Hidden when the user can't edit. */
export function FormActions({
  pending,
  cancelHref,
  error,
  readOnly,
  label = "Save changes",
}: {
  pending: boolean;
  cancelHref: string;
  error?: string;
  readOnly?: boolean;
  label?: string;
}) {
  if (readOnly) return null;
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-2 border-t bg-background/90 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        {error && (
          <p role="alert" className="text-sm text-destructive sm:mr-auto">
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <Link href={cancelHref} className={buttonVariants({ variant: "outline" })}>
            Cancel
          </Link>
          <Button type="submit" disabled={pending} className="min-w-32">
            {pending && <Loader2 className="animate-spin" />}
            {pending ? "Saving…" : label}
          </Button>
        </div>
      </div>
    </div>
  );
}
