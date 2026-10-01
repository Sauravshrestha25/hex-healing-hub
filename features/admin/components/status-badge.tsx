import { Pill } from "./kit";

const BOOKING = {
  NEW: { label: "New", tone: "gold" },
  CONFIRMED: { label: "Confirmed", tone: "plum" },
  COMPLETED: { label: "Completed", tone: "sage" },
  CANCELLED: { label: "Cancelled", tone: "grey" },
} as const;

export function BookingStatusBadge({ status }: { status: keyof typeof BOOKING }) {
  const { label, tone } = BOOKING[status];
  return <Pill tone={tone}>{label}</Pill>;
}

export function PublishedBadge({ published }: { published: boolean }) {
  return published ? <Pill tone="sage">Published</Pill> : <Pill tone="grey">Draft</Pill>;
}
