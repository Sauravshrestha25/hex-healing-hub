import Image from "next/image";
import { WebxLogo } from "@/features/shared/components/webx-logo";

/** Split layout shared by sign-in, forgot-password and reset-password. */
export function AuthShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <main className="grid min-h-svh flex-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <aside className="relative hidden overflow-hidden bg-brand lg:block">
        <Image src="/images/himalaya.jpg" alt="" fill priority sizes="55vw" className="object-cover opacity-45" />
        <div className="absolute inset-0 bg-brand/85" />
        <div className="relative flex h-full flex-col justify-between p-12 text-brand-cream">
          <div className="flex items-center gap-3">
            <Image src="/images/hex-mark.svg" alt="" width={40} height={40} className="size-10" />
            <span className="font-semibold">HEX Healing Hub</span>
          </div>
          <div className="max-w-md">
            <p className="text-sm tracking-wider text-brand-gold uppercase">Admin dashboard</p>
            <p className="mt-3 text-3xl leading-tight font-semibold">Manage the website, manage bookings and share new writing.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-brand-cream/60">
            <span>Powered by:</span>
            <WebxLogo width={52} height={16} />
          </div>
        </div>
      </aside>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Image src="/images/hex-mark.svg" alt="" width={48} height={48} className="mb-8 size-12 lg:hidden" />
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1.5 mb-8 text-sm text-muted-foreground">{description}</p>
          {children}
        </div>
      </section>
    </main>
  );
}
