import Link from "next/link";
import { UserPlus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InitialsAvatar, Panel, Pill } from "@/features/admin/components/kit";
import { PageHeader } from "@/features/admin/components/page-header";
import { RowActions } from "@/features/admin/components/row-actions";
import { formatDate } from "@/features/admin/lib/format";
import { getViewer } from "@/features/admin/server/viewer";
import { container } from "@/features/shared/server/container";
import { VerifiedToggle } from "@/features/users/components/verified-toggle";
import { removeUser } from "@/features/users/server/actions";

export const metadata = { title: "Users" };

export default async function AdminUsersPage() {
  const viewer = await getViewer();
  const people = await container().users.list(viewer);

  return (
    <>
      <PageHeader
        title="Users"
        description="People who can sign in to this dashboard. Only verified users can make changes; unverified users can view."
      >
        {viewer.isVerified && (
          <Link href="/admin/users/new" className={buttonVariants()}>
            <UserPlus /> New user
          </Link>
        )}
      </PageHeader>
      <Panel bodyClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5">User</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead>Can make changes</TableHead>
              <TableHead className="hidden sm:table-cell">Added</TableHead>
              <TableHead className="w-16 pr-5"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {people.map((person) => (
              <TableRow key={person.id}>
                <TableCell className="pl-5">
                  <div className="flex items-center gap-3">
                    <InitialsAvatar name={person.name} />
                    <div className="grid min-w-0">
                      <span className="flex items-center gap-2 truncate font-medium">
                        {person.name}
                        {person.isSelf && <Pill tone="plum" dot={false}>You</Pill>}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">{person.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">{person.phone ?? "—"}</TableCell>
                <TableCell>
                  {viewer.isVerified && !person.isSelf ? (
                    <VerifiedToggle id={person.id} name={person.name} verified={person.isVerified} />
                  ) : person.isVerified ? (
                    <Pill tone="green">Verified</Pill>
                  ) : (
                    <Pill tone="gold">View only</Pill>
                  )}
                </TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">{formatDate(person.createdAt)}</TableCell>
                <TableCell className="pr-5">
                  {!person.isSelf && (
                    <RowActions canEdit={viewer.isVerified} remove={{ id: person.id, itemName: person.name, action: removeUser }} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>
    </>
  );
}
