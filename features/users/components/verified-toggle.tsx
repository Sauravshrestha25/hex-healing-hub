"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { setUserVerified } from "@/features/users/server/actions";

export function VerifiedToggle({ id, name, verified }: { id: string; name: string; verified: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <Switch
      checked={verified}
      disabled={pending}
      aria-label={`${name} can make changes`}
      onCheckedChange={(next) =>
        startTransition(async () => {
          const { error } = await setUserVerified(id, next);
          if (error) toast.error(error);
          else toast.success(next ? `${name} can now make changes` : `${name} is now view-only`);
        })
      }
    />
  );
}
