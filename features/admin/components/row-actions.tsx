import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DeleteButton } from "./delete-button";

/** Edit / view / delete icons for a list row. Edit and delete only render for users who can make changes. */
export function RowActions({
  canEdit,
  editHref,
  viewHref,
  remove,
}: {
  canEdit: boolean;
  editHref?: string;
  viewHref?: string;
  remove?: { id: string; itemName: string; action: (id: string) => Promise<{ error?: string }> };
}) {
  return (
    <div className="flex items-center justify-end gap-0.5">
      {viewHref && (
        <Link href={viewHref} target="_blank" aria-label="View on website" title="View on website" className={buttonVariants({ variant: "ghost", size: "icon-sm" })}>
          <ExternalLink />
        </Link>
      )}
      {canEdit && editHref && (
        <Link href={editHref} aria-label="Edit" title="Edit" className={buttonVariants({ variant: "ghost", size: "icon-sm" })}>
          <Pencil />
        </Link>
      )}
      {canEdit && remove && <DeleteButton {...remove} />}
    </div>
  );
}
