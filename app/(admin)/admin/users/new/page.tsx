import { PageHeader } from "@/features/admin/components/page-header";
import { UserForm } from "@/features/users/components/user-form";

export const metadata = { title: "New user" };

export default function NewUserPage() {
  return (
    <>
      <PageHeader title="New user" description="They can sign in at /login and manage all website content." />
      <UserForm />
    </>
  );
}
