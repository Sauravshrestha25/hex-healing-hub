import { redirect } from "next/navigation";
import { PageHeader } from "@/features/admin/components/page-header";
import { getViewer } from "@/features/admin/server/viewer";
import { UserForm } from "@/features/users/components/user-form";

export const metadata = { title: "New user" };

export default async function NewUserPage() {
  if (!(await getViewer()).isVerified) redirect("/admin/users");
  return (
    <>
      <PageHeader title="New user" back={{ href: "/admin/users", label: "Users" }} description="They'll sign in at /login." />
      <UserForm />
    </>
  );
}
