import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { container } from "@/features/shared/server/container";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const { sessions, inquiries } = container();
  const user = await sessions.requirePage();
  const newInquiries = await inquiries.countNew();

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AdminSidebar newInquiries={newInquiries} user={{ name: user.name, email: user.email }} />
        <SidebarInset>
          <header className="flex h-14 items-center gap-2 border-b px-4">
            <SidebarTrigger />
          </header>
          <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
