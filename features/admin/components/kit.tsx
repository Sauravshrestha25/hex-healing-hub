import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Lock } from "lucide-react";
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
    <section className={cn("rounded-xl border bg-card shadow-[0_1px_2px_oklch(0.3_0.05_295/0.04)]", className)}>
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

export function StatCard({
  label,
  value,
  note,
  icon: Icon,
  href,
  highlight,
}: {
  label: string;
  value: number;
  note?: string;
  icon: LucideIcon;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col gap-4 overflow-hidden rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-[0_8px_24px_-12px_oklch(0.3_0.11_295/0.25)]",
        highlight && "border-brand-gold/60 bg-[linear-gradient(135deg,oklch(0.99_0.02_85),oklch(1_0_0))]",
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "grid size-9 place-items-center rounded-lg bg-accent text-brand",
            highlight && "bg-brand-gold/20 text-[oklch(0.45_0.09_75)]",
          )}
        >
          <Icon className="size-[18px]" />
        </span>
        <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div>
        <p className="text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {label}
          {note && <span className="text-muted-foreground/80"> · {note}</span>}
        </p>
      </div>
    </Link>
  );
}

const PILL_TONES = {
  gold: "bg-[oklch(0.95_0.05_85)] text-[oklch(0.42_0.09_70)] ring-[oklch(0.85_0.08_80)]",
  green: "bg-[oklch(0.95_0.04_155)] text-[oklch(0.4_0.1_155)] ring-[oklch(0.85_0.07_155)]",
  blue: "bg-[oklch(0.95_0.03_255)] text-[oklch(0.42_0.11_255)] ring-[oklch(0.86_0.05_255)]",
  grey: "bg-muted text-muted-foreground ring-border",
  plum: "bg-accent text-brand ring-[oklch(0.86_0.04_295)]",
} as const;

export type PillTone = keyof typeof PILL_TONES;

export function Pill({ tone, children, dot = true }: { tone: PillTone; children: React.ReactNode; dot?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset",
        PILL_TONES[tone],
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />}
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
        "grid size-9 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,oklch(0.36_0.12_295),oklch(0.26_0.09_290))] text-xs font-semibold text-[oklch(0.92_0.06_85)]",
        className,
      )}
    >
      {initials(name) || "?"}
    </span>
  );
}

export function ReadOnlyBanner() {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-[oklch(0.85_0.08_80)] bg-[oklch(0.97_0.035_85)] px-4 py-3 text-sm text-[oklch(0.38_0.08_70)]">
      <Lock className="mt-0.5 size-4 shrink-0" />
      <p>
        <span className="font-medium">View-only access.</span> Your account isn&apos;t verified yet, so you can look
        around but not make changes. Ask an administrator to verify you.
      </p>
    </div>
  );
}
