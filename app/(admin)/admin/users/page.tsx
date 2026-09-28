import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteButton } from "@/features/admin/components/delete-button";
import { PageHeader } from "@/features/admin/components/page-header";
import { formatDate } from "@/features/admin/lib/format";
import { container } from "@/features/shared/server/container";
import { removeUser } from "@/features/users/server/actions";

export const metadata = { title: "Users" };

export default async function AdminUsersPage() {
  const { sessions, users } = container();
  const people = await users.list(await sessions.requirePage());

  return (
    <>
      <PageHeader title="Users" description="People who can sign in to this dashboard." action={{ href: "/admin/users/new", label: "New user" }} />
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden sm:table-cell">Added</TableHead>
              <TableHead className="w-12"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {people.map((person) => (
              <TableRow key={person.id}>
                <TableCell className="font-medium">
                  {person.name} {person.isSelf && <Badge variant="secondary" className="ml-1">You</Badge>}
                </TableCell>
                <TableCell className="max-w-56 truncate text-muted-foreground">{person.email}</TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">{formatDate(person.createdAt)}</TableCell>
                <TableCell>{!person.isSelf && <DeleteButton id={person.id} itemName={person.name} action={removeUser} />}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
