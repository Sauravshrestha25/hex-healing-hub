import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteButton } from "@/features/admin/components/delete-button";
import { PageHeader } from "@/features/admin/components/page-header";
import { deleteGalleryItem } from "@/features/admin/server/gallery";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Gallery" };

export default async function AdminGalleryPage() {
  const items = await container().gallery.listForAdmin();

  return (
    <>
      <PageHeader title="Gallery" description="Images shown on the Portfolio page." action={{ href: "/admin/gallery/new", label: "Add image" }} />
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No images yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <Card key={item.id} className="gap-0 overflow-hidden py-0">
              <Link href={`/admin/gallery/${item.id}`} className="relative block aspect-[4/3] bg-muted">
                <Image src={item.image} alt={item.alt} fill sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              </Link>
              <CardContent className="flex items-start gap-2 py-3">
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/gallery/${item.id}`} className="block truncate font-medium hover:text-primary hover:underline">{item.title}</Link>
                  <p className="truncate text-xs text-muted-foreground">{item.category} · order {item.order}</p>
                </div>
                <DeleteButton id={item.id} itemName={item.title} action={deleteGalleryItem} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
