import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/components/login-form";
import { WebxLogo } from "@/features/shared/components/webx-logo";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Sign in" };

export default async function LoginPage(props: PageProps<"/login">) {
  if (await container().sessions.current()) redirect("/admin");
  const { next } = await props.searchParams;

  return (
    <main className="grid min-h-svh flex-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <aside className="relative hidden overflow-hidden bg-[oklch(0.19_0.055_295)] lg:block">
        <Image src="/images/himalaya.jpg" alt="" fill priority sizes="55vw" className="object-cover opacity-45" />
        <div className="absolute inset-0 bg-[linear-gradient(160deg,oklch(0.19_0.055_295/0.35),oklch(0.16_0.06_295/0.92)_70%)]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <Image src="/white_logo.png" alt="" width={40} height={40} className="rounded-full" />
            <span className="font-semibold">HEX Healing Hub</span>
          </div>
          <div className="max-w-md">
            <p className="text-sm tracking-wider text-[oklch(0.82_0.09_82)] uppercase">Admin dashboard</p>
            <p className="mt-3 text-3xl leading-tight font-semibold">Manage the website, answer inquiries and share new writing.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/55">
            <span>Powered by:</span>
            <WebxLogo width={52} height={16} />
          </div>
        </div>
      </aside>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Image src="/colorful_logo.png" alt="" width={48} height={48} className="mb-8 size-12 rounded-full lg:hidden" />
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1.5 mb-8 text-sm text-muted-foreground">Sign in to the HEX Healing Hub dashboard.</p>
          <LoginForm next={typeof next === "string" ? next : undefined} />
        </div>
      </section>
    </main>
  );
}
