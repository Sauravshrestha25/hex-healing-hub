import Link from "next/link";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Reset password", referrer: "no-referrer" };

export default async function ResetPasswordPage(props: PageProps<"/reset-password">) {
  const { token } = await props.searchParams;
  const valid = typeof token === "string" && (await container().passwordResets.isValid(token));

  if (!valid) {
    return (
      <AuthShell title="Link expired" description="This reset link is invalid, already used, or older than 30 minutes.">
        <Link href="/forgot-password" className="text-sm font-medium text-brand hover:underline">Request a new link</Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Choose a new password" description="You'll be signed out on every device and can sign in with the new password.">
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
