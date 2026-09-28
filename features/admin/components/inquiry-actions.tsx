"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteInquiry, setInquiryStatus } from "@/features/admin/server/inquiries";
import { DeleteButton } from "./delete-button";

type Status = "NEW" | "READ" | "RESOLVED";

export function InquiryActions({ id, status }: { id: string; status: Status }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function update(next: Status, message: string) {
    startTransition(async () => {
      await setInquiryStatus(id, next);
      toast.success(message);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === "NEW" && (
        <Button variant="outline" disabled={pending} onClick={() => update("READ", "Marked as read")}>
          Mark as read
        </Button>
      )}
      {status !== "RESOLVED" ? (
        <Button disabled={pending} onClick={() => update("RESOLVED", "Marked as resolved")}>
          Mark as resolved
        </Button>
      ) : (
        <Button variant="outline" disabled={pending} onClick={() => update("READ", "Reopened")}>
          Reopen
        </Button>
      )}
      <DeleteButton id={id} itemName="this inquiry" action={deleteInquiry} onDeleted={() => router.push("/admin/inquiries")} />
    </div>
  );
}
