import { Pill } from "./kit";

const BOOKING = {
  NEW: { label: "New", tone: "gold" },
  CONFIRMED: { label: "Confirmed", tone: "blue" },
  COMPLETED: { label: "Completed", tone: "plum" },
  CANCELLED: { label: "Cancelled", tone: "grey" },
} as const;

export function BookingStatusBadge({ status }: { status: keyof typeof BOOKING }) {
  const { label, tone } = BOOKING[status];
  return <Pill tone={tone}>{label}</Pill>;
}

export function PublishedBadge({ published }: { published: boolean }) {
  return published ? <Pill tone="plum">Published</Pill> : <Pill tone="grey">Draft</Pill>;
}
