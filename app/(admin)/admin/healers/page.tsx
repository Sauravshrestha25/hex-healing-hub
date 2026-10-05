import Image from "next/image";
import Link from "next/link";
import { HeartHandshake, MapPin, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState, InitialsAvatar, Panel, Pill } from "@/features/admin/components/kit";
import { PageHeader } from "@/features/admin/components/page-header";
import { RowActions } from "@/features/admin/components/row-actions";
import { deleteHealer } from "@/features/admin/server/healers";
import { getViewer } from "@/features/admin/server/viewer";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Healers" };

export default async function AdminHealersPage() {
  const [viewer, healers] = await Promise.all([getViewer(), container().healers.listForAdmin()]);
  const addButton = viewer.isVerified && (
    <Link href="/admin/healers/new" className={buttonVariants()}>
      <Plus /> Add healer
    </Link>
  );

  return (
    <>
      <PageHeader title="Healers" description="The people visitors can read about and book: their services, prices and working hours.">
        {addButton}
      </PageHeader>
      <Panel bodyClassName="p-0">
        {healers.length === 0 ? (
          <EmptyState
            icon={HeartHandshake}
            title="No healers yet"
            description="Add a healer with their services, prices and weekly hours. The Our Healers page appears on the website once one is published."
            action={addButton}
          />
        ) : (
          <ul className="divide-y">
            {healers.map((healer) => (
              <li key={healer.id} className="flex items-center transition-colors hover:bg-muted/60">
                <Link href={`/admin/healers/${healer.id}`} className="flex min-w-0 flex-1 items-center gap-3 py-4 pl-5">
                  {healer.photo ? (
                    <Image src={healer.photo} alt="" width={44} height={44} className="size-11 shrink-0 rounded-full object-cover" />
                  ) : (
                    <InitialsAvatar name={healer.name} className="size-11 text-sm" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="truncate font-medium">{healer.name}</span>
                      {healer.published ? <Pill tone="sage">Published</Pill> : <Pill tone="grey">Hidden</Pill>}
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">{healer.title}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                      <span>
                        {healer._count.services} {healer._count.services === 1 ? "service" : "services"}
                      </span>
                      {healer.places.length > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3" aria-hidden="true" />
                          {healer.places.join(", ")}
                        </span>
                      )}
                    </p>
                  </div>
                </Link>
                <div className="flex shrink-0 items-center gap-2 pr-3 pl-2">
                  <span className="text-xs text-muted-foreground tabular-nums">#{healer.order}</span>
                  {viewer.isVerified && (
                    <RowActions canEdit editHref={`/admin/healers/${healer.id}`} remove={{ id: healer.id, itemName: healer.name, action: deleteHealer }} />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
