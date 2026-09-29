import { Pill } from "./kit";

const INQUIRY = {
  NEW: { label: "New", tone: "gold" },
  READ: { label: "In progress", tone: "blue" },
  RESOLVED: { label: "Resolved", tone: "green" },
} as const;

export function InquiryStatusBadge({ status }: { status: keyof typeof INQUIRY }) {
  const { label, tone } = INQUIRY[status];
  return <Pill tone={tone}>{label}</Pill>;
}

export function PublishedBadge({ published }: { published: boolean }) {
  return published ? <Pill tone="green">Published</Pill> : <Pill tone="grey">Draft</Pill>;
}
