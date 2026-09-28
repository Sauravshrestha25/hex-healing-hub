import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteButton } from "@/features/admin/components/delete-button";
import { PageHeader } from "@/features/admin/components/page-header";
import { deleteService } from "@/features/admin/server/services";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Services" };

export default async function AdminServicesPage() {
  const services = await container().services.listForAdmin();

  return (
    <>
      <PageHeader title="Services" description="The practices shown on the homepage and the Services page." action={{ href: "/admin/services/new", label: "New service" }} />
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden lg:table-cell">Description</TableHead>
              <TableHead className="w-16">Order</TableHead>
              <TableHead className="w-12"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No services yet.</TableCell>
              </TableRow>
            )}
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>
                  <div className="relative size-12 overflow-hidden rounded-md bg-muted">
                    <Image src={service.image} alt="" fill sizes="48px" className="object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <Link href={`/admin/services/${service.id}`} className="hover:text-primary hover:underline">{service.title}</Link>
                </TableCell>
                <TableCell className="hidden max-w-md truncate text-muted-foreground lg:table-cell">{service.description}</TableCell>
                <TableCell className="tabular-nums">{service.order}</TableCell>
                <TableCell><DeleteButton id={service.id} itemName={service.title} action={deleteService} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
