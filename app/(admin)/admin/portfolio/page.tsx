import Image from "next/image";
import Link from "next/link";
import { ImagePlus, Images } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState, Panel } from "@/features/admin/components/kit";
import { PageHeader } from "@/features/admin/components/page-header";
import { RowActions } from "@/features/admin/components/row-actions";
import { deleteGalleryItem } from "@/features/admin/server/gallery";
import { getViewer } from "@/features/admin/server/viewer";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Portfolio" };

export default async function AdminPortfolioPage() {
  const [viewer, items] = await Promise.all([getViewer(), container().gallery.listForAdmin()]);
  const addButton = viewer.isVerified && (
    <Link href="/admin/portfolio/new" className={buttonVariants()}>
      <ImagePlus /> Add photo
    </Link>
  );

  return (
    <>
      <PageHeader title="Portfolio" description="The photo gallery on the website's Portfolio page, in display order.">
        {addButton}
      </PageHeader>
      {items.length === 0 ? (
        <Panel>
          <EmptyState icon={Images} title="No photos yet" description="Upload photos of your space, sessions and events for the Portfolio page." action={addButton} />
        </Panel>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <li key={item.id} className="group overflow-hidden rounded-xl border bg-card">
              <Link href={`/admin/portfolio/${item.id}`} className="relative block aspect-square overflow-hidden bg-muted">
                <Image src={item.image} alt={item.alt} fill sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand/80 to-transparent p-3 pt-10">
                  <span className="block truncate text-sm font-medium text-white">{item.title}</span>
                  <span className="block truncate text-xs text-white/75">{item.category}</span>
                </span>
              </Link>
              {viewer.isVerified && (
                <div className="flex items-center justify-between border-t px-2 py-1">
                  <span className="pl-1 text-xs text-muted-foreground tabular-nums">#{item.order}</span>
                  <RowActions
                    canEdit
                    editHref={`/admin/portfolio/${item.id}`}
                    remove={{ id: item.id, itemName: item.title, action: deleteGalleryItem }}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
