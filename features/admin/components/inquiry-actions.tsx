"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteInquiry, setInquiryStatus } from "@/features/admin/server/inquiries";

type Status = "NEW" | "READ" | "RESOLVED";

export function InquiryActions({ id, status }: { id: string; status: Status }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function update(next: Status, message: string) {
    startTransition(async () => {
      const { error } = await setInquiryStatus(id, next);
      if (error) toast.error(error);
      else toast.success(message);
    });
  }

  function remove() {
    startTransition(async () => {
      const { error } = await deleteInquiry(id);
      if (error) return void toast.error(error);
      toast.success("Inquiry deleted");
      router.push("/admin/inquiries");
    });
  }

  return (
    <div className="grid gap-2">
      {status === "NEW" && (
        <Button variant="outline" className="w-full justify-start" disabled={pending} onClick={() => update("READ", "Marked in progress")}>
          <Clock /> Mark in progress
        </Button>
      )}
      {status !== "RESOLVED" ? (
        <Button className="w-full justify-start" disabled={pending} onClick={() => update("RESOLVED", "Marked as resolved")}>
          <CheckCircle2 /> Mark as resolved
        </Button>
      ) : (
        <Button variant="outline" className="w-full justify-start" disabled={pending} onClick={() => update("READ", "Reopened")}>
          <RotateCcw /> Reopen
        </Button>
      )}
      <AlertDialog>
        <AlertDialogTrigger
          render={<Button variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive" disabled={pending} />}
        >
          <Trash2 /> Delete this inquiry
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this inquiry?</AlertDialogTitle>
            <AlertDialogDescription>The message and contact details are removed permanently.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={remove} disabled={pending}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
