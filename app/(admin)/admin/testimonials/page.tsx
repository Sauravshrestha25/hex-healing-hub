import Image from "next/image";
import Link from "next/link";
import { MessageSquareQuote, Plus, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState, InitialsAvatar, Panel, Pill } from "@/features/admin/components/kit";
import { PageHeader } from "@/features/admin/components/page-header";
import { RowActions } from "@/features/admin/components/row-actions";
import { deleteTestimonial } from "@/features/admin/server/testimonials";
import { getViewer } from "@/features/admin/server/viewer";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  const [viewer, items] = await Promise.all([getViewer(), container().testimonials.listForAdmin()]);
  const addButton = viewer.isVerified && (
    <Link href="/admin/testimonials/new" className={buttonVariants()}>
      <Plus /> Add testimonial
    </Link>
  );

  return (
    <>
      <PageHeader title="Testimonials" description="Kind words from visitors, shown on the homepage and About page in display order.">
        {addButton}
      </PageHeader>
      <Panel bodyClassName="p-0">
        {items.length === 0 ? (
          <EmptyState icon={MessageSquareQuote} title="No testimonials yet" description="Add what visitors have said about their sessions." action={addButton} />
        ) : (
          <ul className="divide-y">
            {items.map((item) => (
              <li key={item.id} className="flex items-center transition-colors hover:bg-muted/60">
                <Link href={`/admin/testimonials/${item.id}`} className="flex min-w-0 flex-1 gap-3 py-4 pl-5">
                  {item.photo ? (
                    <Image src={item.photo} alt="" width={40} height={40} className="size-10 shrink-0 rounded-full object-cover" />
                  ) : (
                    <InitialsAvatar name={item.name} />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="truncate font-medium">{item.name}</span>
                      <span className="inline-flex items-center gap-0.5 text-xs text-brand-gold" aria-label={`${item.rating} out of 5 stars`}>
                        {Array.from({ length: item.rating }, (_, i) => (
                          <Star key={i} className="size-3 fill-current" aria-hidden="true" />
                        ))}
                      </span>
                      {!item.published && <Pill tone="grey">Hidden</Pill>}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">“{item.quote}”</p>
                    {(item.service || item.centre) && (
                      <p className="mt-1 text-xs text-muted-foreground">{[item.service, item.centre].filter(Boolean).join(" · ")}</p>
                    )}
                  </div>
                </Link>
                <div className="flex shrink-0 items-center gap-2 pr-3 pl-2">
                  <span className="text-xs text-muted-foreground tabular-nums">#{item.order}</span>
                  {viewer.isVerified && (
                    <RowActions canEdit editHref={`/admin/testimonials/${item.id}`} remove={{ id: item.id, itemName: `testimonial from ${item.name}`, action: deleteTestimonial }} />
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
