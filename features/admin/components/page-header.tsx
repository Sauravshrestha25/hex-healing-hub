import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function PageHeader({
  title,
  description,
  back,
  meta,
  children,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  back?: { href: string; label: string };
  /** Small inline element next to the title, e.g. a status pill. */
  meta?: React.ReactNode;
  /** Actions on the right. */
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-8">
      {back && (
        <Link
          href={back.href}
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight [overflow-wrap:anywhere] sm:text-[1.75rem]">{title}</h1>
            {meta}
          </div>
          {description && <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>}
        </div>
        {children && <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div>}
      </div>
    </header>
  );
}
