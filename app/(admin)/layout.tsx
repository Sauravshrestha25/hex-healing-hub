import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-theme flex min-h-svh flex-1 flex-col bg-background font-sans text-foreground antialiased">
      {children}
      <Toaster theme="light" position="bottom-right" />
    </div>
  );
}
