import { Badge } from "@/components/ui/badge";

const INQUIRY_STYLES = {
  NEW: { label: "New", variant: "default" },
  READ: { label: "Read", variant: "secondary" },
  RESOLVED: { label: "Resolved", variant: "outline" },
} as const;

export function InquiryStatusBadge({ status }: { status: keyof typeof INQUIRY_STYLES }) {
  const { label, variant } = INQUIRY_STYLES[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function PublishedBadge({ published }: { published: boolean }) {
  return <Badge variant={published ? "default" : "secondary"}>{published ? "Published" : "Draft"}</Badge>;
}
