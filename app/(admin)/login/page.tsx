import { redirect } from "next/navigation";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Sign in" };

export default async function LoginPage(props: PageProps<"/login">) {
  if (await container().sessions.current()) redirect("/admin");
  const { next, reset } = await props.searchParams;

  return (
    <AuthShell title="Welcome back" description="Sign in to the HEX Healing Hub dashboard.">
      {reset === "1" && (
        <p role="status" className="mb-6 rounded-lg border border-[oklch(0.85_0.07_155)] bg-[oklch(0.96_0.03_155)] px-3 py-2 text-sm text-[oklch(0.38_0.1_155)]">
          Password changed. Sign in with your new password.
        </p>
      )}
      <LoginForm next={typeof next === "string" ? next : undefined} />
    </AuthShell>
  );
}
