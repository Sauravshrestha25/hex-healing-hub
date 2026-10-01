import { NavBar } from "@/features/shared/components/nav-bar";
import { Preloader } from "@/features/shared/components/preloader";
import { Footer } from "@/features/shared/components/footer";
import { SiteMotion } from "@/features/shared/components/site-motion";
import { SmoothScroll } from "@/features/shared/components/smooth-scroll";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="site-type flex min-h-full flex-1 flex-col">
      <Preloader />
      <NavBar />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
      <SmoothScroll />
      <SiteMotion />
    </div>
  );
}
