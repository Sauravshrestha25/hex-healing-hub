import { NavBar } from "@/features/shared/components/nav-bar";
import { Footer } from "@/features/shared/components/footer";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="frame-lines flex min-h-full flex-1 flex-col">
      <NavBar />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
