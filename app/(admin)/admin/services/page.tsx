import Image from "next/image";
import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState, Panel } from "@/features/admin/components/kit";
import { PageHeader } from "@/features/admin/components/page-header";
import { RowActions } from "@/features/admin/components/row-actions";
import { deleteService } from "@/features/admin/server/services";
import { getViewer } from "@/features/admin/server/viewer";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Services" };

export default async function AdminServicesPage() {
  const [viewer, services] = await Promise.all([getViewer(), container().services.listForAdmin()]);
  const addButton = viewer.isVerified && (
    <Link href="/admin/services/new" className={buttonVariants()}>
      <Plus /> New service
    </Link>
  );

  return (
    <>
      <PageHeader title="Services" description="The practices shown on the homepage and the Services page, in display order.">
        {addButton}
      </PageHeader>
      {services.length === 0 ? (
        <Panel>
          <EmptyState icon={Sparkles} title="No services yet" description="Add the healing practices you offer." action={addButton} />
        </Panel>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <li key={service.id} className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-[0_8px_24px_-12px_oklch(0.3_0.11_295/0.25)]">
              <Link href={`/admin/services/${service.id}`} className="relative aspect-[16/10] overflow-hidden bg-muted">
                <Image src={service.image} alt="" fill sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                <span className="absolute top-3 left-3 grid size-7 place-items-center rounded-full bg-black/55 text-xs font-semibold text-white backdrop-blur-sm tabular-nums">
                  {index + 1}
                </span>
              </Link>
              <div className="flex flex-1 flex-col p-4">
                <Link href={`/admin/services/${service.id}`} className="font-semibold hover:text-brand hover:underline">{service.title}</Link>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{service.description}</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <span className="truncate font-mono text-xs text-muted-foreground">/{service.slug}</span>
                  <RowActions
                    canEdit={viewer.isVerified}
                    editHref={`/admin/services/${service.id}`}
                    remove={{ id: service.id, itemName: service.title, action: deleteService }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
