import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, type CaseStatus } from "@/types/case";

type CaseStatusBadgeProps = {
  status: CaseStatus;
};

const variantByStatus: Record<
  CaseStatus,
  "default" | "secondary" | "success" | "warning" | "destructive" | "muted"
> = {
  draft: "muted",
  generated: "default",
  sent: "secondary",
  waiting: "warning",
  escalated: "destructive",
  closed: "success",
};

export function CaseStatusBadge({ status }: CaseStatusBadgeProps) {
  return <Badge variant={variantByStatus[status]}>{STATUS_LABELS[status]}</Badge>;
}
