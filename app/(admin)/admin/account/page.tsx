import { FormSection } from "@/features/admin/components/form-bits";
import { InitialsAvatar, Pill } from "@/features/admin/components/kit";
import { PageHeader } from "@/features/admin/components/page-header";
import { getViewer } from "@/features/admin/server/viewer";
import { PasswordForm } from "@/features/users/components/password-form";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await getViewer();

  return (
    <>
      <PageHeader title="Your account" />
      <div className="grid gap-8">
        <FormSection title="Profile">
          <div className="flex items-center gap-4">
            <InitialsAvatar name={user.name} className="size-14 text-base" />
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold">{user.name}</p>
              <p className="truncate text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-2">
                {user.isVerified ? <Pill tone="plum">Can make changes</Pill> : <Pill tone="gold">View only</Pill>}
              </div>
            </div>
          </div>
        </FormSection>
        <FormSection title="Password" description="Use a long password you don't use anywhere else.">
          <PasswordForm />
        </FormSection>
      </div>
    </>
  );
}
