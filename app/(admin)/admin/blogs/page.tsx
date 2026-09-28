import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteButton } from "@/features/admin/components/delete-button";
import { PageHeader } from "@/features/admin/components/page-header";
import { PublishedBadge } from "@/features/admin/components/status-badge";
import { formatDate } from "@/features/admin/lib/format";
import { deleteBlog } from "@/features/admin/server/blogs";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Blogs" };

export default async function AdminBlogsPage() {
  const blogs = await container().blogs.listForAdmin();

  return (
    <>
      <PageHeader title="Blogs" description="Write and publish articles for the HEX Blogs page." action={{ href: "/admin/blogs/new", label: "New post" }} />
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Published</TableHead>
              <TableHead className="w-12"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No posts yet.</TableCell>
              </TableRow>
            )}
            {blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell className="max-w-72 font-medium">
                  <Link href={`/admin/blogs/${blog.id}`} className="block truncate hover:text-primary hover:underline">{blog.title}</Link>
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">{blog.category}</TableCell>
                <TableCell><PublishedBadge published={blog.published} /></TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">{blog.publishedAt ? formatDate(blog.publishedAt) : "—"}</TableCell>
                <TableCell><DeleteButton id={blog.id} itemName={`“${blog.title}”`} action={deleteBlog} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
