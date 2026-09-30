"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, CheckCircle2, RotateCcw, Trash2, XCircle } from "lucide-react";
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
import { deleteBooking, setBookingStatus } from "@/features/admin/server/bookings";

type Status = "NEW" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export function BookingActions({ id, status }: { id: string; status: Status }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function update(next: Status, message: string) {
    startTransition(async () => {
      const { error } = await setBookingStatus(id, next);
      if (error) toast.error(error);
      else toast.success(message);
    });
  }

  function remove() {
    startTransition(async () => {
      const { error } = await deleteBooking(id);
      if (error) return void toast.error(error);
      toast.success("Booking deleted");
      router.push("/admin/bookings");
    });
  }

  const isOpen = status === "NEW" || status === "CONFIRMED";

  return (
    <div className="grid gap-2">
      {status === "NEW" && (
        <Button className="w-full justify-start" disabled={pending} onClick={() => update("CONFIRMED", "Booking confirmed")}>
          <CalendarCheck /> Confirm booking
        </Button>
      )}
      {status === "CONFIRMED" && (
        <Button className="w-full justify-start" disabled={pending} onClick={() => update("COMPLETED", "Marked as completed")}>
          <CheckCircle2 /> Mark as completed
        </Button>
      )}
      {isOpen ? (
        <Button variant="outline" className="w-full justify-start" disabled={pending} onClick={() => update("CANCELLED", "Booking cancelled")}>
          <XCircle /> Cancel booking
        </Button>
      ) : (
        <Button variant="outline" className="w-full justify-start" disabled={pending} onClick={() => update("CONFIRMED", "Reopened as confirmed")}>
          <RotateCcw /> Reopen
        </Button>
      )}
      <AlertDialog>
        <AlertDialogTrigger
          render={<Button variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive" disabled={pending} />}
        >
          <Trash2 /> Delete this booking
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this booking?</AlertDialogTitle>
            <AlertDialogDescription>The request and contact details are removed permanently.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={remove} disabled={pending}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
