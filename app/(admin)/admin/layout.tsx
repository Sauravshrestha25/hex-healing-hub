import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { ReadOnlyBanner } from "@/features/admin/components/kit";
import { getViewer } from "@/features/admin/server/viewer";
import { container } from "@/features/shared/server/container";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await getViewer();
  const newBookings = await container().bookings.countNew();

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AdminSidebar newBookings={newBookings} />
        <SidebarInset className="bg-background">
          <AdminTopbar user={{ name: user.name, email: user.email, isVerified: user.isVerified }} />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
            {!user.isVerified && <ReadOnlyBanner />}
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
