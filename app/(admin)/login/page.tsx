import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/components/login-form";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Sign in" };

export default async function LoginPage(props: PageProps<"/login">) {
  if (await container().sessions.current()) redirect("/admin");
  const { next } = await props.searchParams;

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <Image src="/colorful_logo.png" alt="" width={44} height={44} className="mx-auto mb-2 h-11 w-11 rounded-full" />
          <CardTitle className="text-xl">HEX Healing Hub admin</CardTitle>
          <CardDescription>Sign in to manage the website.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm next={typeof next === "string" ? next : undefined} />
        </CardContent>
      </Card>
    </main>
  );
}
