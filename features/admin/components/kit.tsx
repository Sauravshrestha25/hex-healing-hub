import type { LucideIcon } from "lucide-react";
import { Lock } from "lucide-react";
import { cn } from "cn";
import { initials } from "@/features/admin/lib/format";

/** White surface with an optional titled header row. */
export function Panel({
  title,
  description,
  action,
  className,
  bodyClassName,
  children,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-lg border bg-card", className)}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="text-sm font-semibold">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

// Muted tones that sit inside the dashboard palette: gold = needs attention, plum = active/in hand,
// sage = done/live, grey = inactive. (See the admin palette notes in globals.css.)
const PILL_TONES = {
  gold: { pill: "bg-brand-gold/15 text-brand ring-brand-gold/55", dot: "bg-brand-gold" },
  plum: { pill: "bg-brand/[0.07] text-brand ring-brand/20", dot: "bg-brand" },
  sage: {
    pill: "bg-[color-mix(in_srgb,var(--admin-sage)_10%,transparent)] text-[var(--admin-sage)] ring-[color-mix(in_srgb,var(--admin-sage)_30%,transparent)]",
    dot: "bg-[var(--admin-sage)]",
  },
  grey: { pill: "bg-transparent text-brand/60 ring-brand/15", dot: "bg-brand/35" },
} as const;

export type PillTone = keyof typeof PILL_TONES;

export function Pill({ tone, children, dot = true }: { tone: PillTone; children: React.ReactNode; dot?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset",
        PILL_TONES[tone].pill,
      )}
    >
      {dot && <span className={cn("size-1.5 rounded-full", PILL_TONES[tone].dot)} aria-hidden="true" />}
      {children}
    </span>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-accent text-brand">
        <Icon className="size-5" />
      </span>
      <p className="mt-4 font-medium">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function InitialsAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-brand",
        className,
      )}
    >
      {initials(name) || "?"}
    </span>
  );
}

export function ReadOnlyBanner() {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-lg border border-brand-gold/60 bg-brand-gold/10 px-4 py-3 text-sm text-brand">
      <Lock className="mt-0.5 size-4 shrink-0" />
      <p>
        <span className="font-medium">View-only access.</span> Your account isn&apos;t verified yet, so you can look
        around but not make changes. Ask an administrator to verify you.
      </p>
    </div>
  );
}
