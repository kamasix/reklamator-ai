import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Building2, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CaseStatusBadge } from "./CaseStatusBadge";
import { CATEGORY_LABELS, type Case } from "@/types/case";
import { formatHumanDate } from "@/lib/utils/date";

type DashboardCaseCardProps = {
  caseItem: Case;
};

export function DashboardCaseCard({ caseItem }: DashboardCaseCardProps) {
  const nextChecklist = caseItem.checklist.find((it) => !it.completed);
  const completedCount = caseItem.checklist.filter((it) => it.completed).length;
  const total = caseItem.checklist.length;

  return (
    <Card className="group flex h-full flex-col transition-shadow hover:shadow-md">
      <Link
        to={`/cases/${caseItem.id}`}
        className="flex flex-1 flex-col gap-3 p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <Badge variant="outline" className="text-[11px]">
              {CATEGORY_LABELS[caseItem.category]}
            </Badge>
            <h3 className="line-clamp-2 text-base font-semibold leading-tight">
              {caseItem.title}
            </h3>
          </div>
          <CaseStatusBadge status={caseItem.status} />
        </div>

        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Building2 className="size-3.5" />
            <span className="line-clamp-1">
              {caseItem.companyName || "Brak nazwy firmy"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            <span>{formatHumanDate(caseItem.createdAt)}</span>
          </div>
        </div>

        {total > 0 ? (
          <div className="mt-auto space-y-2 border-t border-border pt-3 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="size-3.5 text-success" />
              <span>
                Checklist: {completedCount} / {total}
              </span>
            </div>
            {nextChecklist ? (
              <p className="line-clamp-2 text-foreground/90">
                Następny krok:{" "}
                <span className="font-medium">{nextChecklist.title}</span>
              </p>
            ) : (
              <p className="text-success">Wszystkie kroki ukończone.</p>
            )}
          </div>
        ) : (
          <div className="mt-auto" />
        )}

        <div className="flex items-center gap-1 text-sm font-medium text-primary">
          Otwórz sprawę
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>
    </Card>
  );
}
