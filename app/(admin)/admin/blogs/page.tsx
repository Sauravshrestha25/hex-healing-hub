import Image from "next/image";
import Link from "next/link";
import { Newspaper, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState, Panel } from "@/features/admin/components/kit";
import { PageHeader } from "@/features/admin/components/page-header";
import { RowActions } from "@/features/admin/components/row-actions";
import { PublishedBadge } from "@/features/admin/components/status-badge";
import { formatDate, timeAgo } from "@/features/admin/lib/format";
import { deleteBlog } from "@/features/admin/server/blogs";
import { getViewer } from "@/features/admin/server/viewer";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Blogs" };

export default async function AdminBlogsPage() {
  const [viewer, blogs] = await Promise.all([getViewer(), container().blogs.listForAdmin()]);
  const newPost = viewer.isVerified && (
    <Link href="/admin/blogs/new" className={buttonVariants()}>
      <Plus /> New post
    </Link>
  );

  return (
    <>
      <PageHeader title="Blogs" description="Articles on the HEX Blogs page. Drafts stay hidden until you publish them.">
        {newPost}
      </PageHeader>
      <Panel bodyClassName="p-0">
        {blogs.length === 0 ? (
          <EmptyState icon={Newspaper} title="No posts yet" description="Write your first article to share on the website." action={newPost} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Post</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden lg:table-cell">Published</TableHead>
                <TableHead className="hidden sm:table-cell">Last edited</TableHead>
                <TableHead className="w-28 pr-5"><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell className="pl-5">
                    <Link href={`/admin/blogs/${blog.id}`} className="group flex items-center gap-3">
                      <span className="relative h-11 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image src={blog.coverImage} alt="" fill sizes="64px" className="object-cover" />
                      </span>
                      <span className="grid min-w-0">
                        <span className="truncate font-medium group-hover:text-brand group-hover:underline">{blog.title}</span>
                        <span className="truncate text-xs text-muted-foreground">{blog.category}</span>
                        <span className="mt-1 md:hidden"><PublishedBadge published={blog.published} /></span>
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell"><PublishedBadge published={blog.published} /></TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">{blog.publishedAt ? formatDate(blog.publishedAt) : "—"}</TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">{timeAgo(blog.updatedAt)}</TableCell>
                  <TableCell className="pr-5">
                    <RowActions
                      canEdit={viewer.isVerified}
                      editHref={`/admin/blogs/${blog.id}`}
                      remove={{ id: blog.id, itemName: blog.title, action: deleteBlog }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Panel>
    </>
  );
}
