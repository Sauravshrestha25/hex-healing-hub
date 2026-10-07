import Link from "next/link";
import { CircleHelp, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState, Panel, Pill } from "@/features/admin/components/kit";
import { PageHeader } from "@/features/admin/components/page-header";
import { RowActions } from "@/features/admin/components/row-actions";
import { deleteFaq } from "@/features/admin/server/faqs";
import { getViewer } from "@/features/admin/server/viewer";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "FAQs" };

export default async function AdminFaqsPage() {
  const [viewer, items] = await Promise.all([getViewer(), container().faqs.listForAdmin()]);
  const addButton = viewer.isVerified && (
    <Link href="/admin/faqs/new" className={buttonVariants()}>
      <Plus /> Add question
    </Link>
  );

  return (
    <>
      <PageHeader title="FAQs" description="Common questions, shown on the Services and Contact pages in display order.">
        {addButton}
      </PageHeader>
      <Panel bodyClassName="p-0">
        {items.length === 0 ? (
          <EmptyState icon={CircleHelp} title="No questions yet" description="Add the questions visitors ask most. The FAQ section stays hidden until there is one." action={addButton} />
        ) : (
          <ul className="divide-y">
            {items.map((item) => (
              <li key={item.id} className="flex items-center transition-colors hover:bg-muted/60">
                <Link href={`/admin/faqs/${item.id}`} className="min-w-0 flex-1 py-4 pl-5">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="font-medium">{item.question}</span>
                    {!item.published && <Pill tone="grey">Hidden</Pill>}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{item.answer}</p>
                </Link>
                <div className="flex shrink-0 items-center gap-2 pr-3 pl-2">
                  <span className="text-xs text-muted-foreground tabular-nums">#{item.order}</span>
                  {viewer.isVerified && (
                    <RowActions canEdit editHref={`/admin/faqs/${item.id}`} remove={{ id: item.id, itemName: `question “${item.question}”`, action: deleteFaq }} />
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
