import { PageHeader } from "@/features/admin/components/page-header";
import { container } from "@/features/shared/server/container";
import { PasswordForm } from "@/features/users/components/password-form";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await container().sessions.requirePage();

  return (
    <>
      <PageHeader title="Account" description={`Signed in as ${user.name} (${user.email}).`} />
      <PasswordForm />
    </>
  );
}
