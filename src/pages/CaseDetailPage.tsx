import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Tag,
  Trash2,
  Loader2,
  Mail,
  Hash,
  Wallet,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CaseStatusBadge } from "@/components/cases/CaseStatusBadge";
import { LocalStorageBadge } from "@/components/common/LocalStorageBadge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { GeneratedLetterEditor } from "@/components/cases/GeneratedLetterEditor";
import { EvidenceEditor } from "@/components/cases/EvidenceEditor";
import { ChecklistList } from "@/components/cases/ChecklistList";
import { NotesList } from "@/components/cases/NotesList";
import { EmptyState } from "@/components/common/EmptyState";
import { useCase } from "@/hooks/useCase";
import { caseRepository } from "@/lib/storage/caseRepository";
import {
  CASE_STATUSES,
  CATEGORY_LABELS,
  STATUS_LABELS,
  type CaseStatus,
} from "@/types/case";
import { formatHumanDate } from "@/lib/utils/date";

export function CaseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { caseItem, loading, refresh, setCaseItem } = useCase(id);

  const summary = useMemo(() => {
    if (!caseItem) return null;
    return {
      total: caseItem.checklist.length,
      done: caseItem.checklist.filter((it) => it.completed).length,
      evidenceCount: caseItem.evidence.length,
      notesCount: caseItem.notes.length,
    };
  }, [caseItem]);

  const handleStatusChange = async (next: string) => {
    if (!caseItem) return;
    const updated = await caseRepository.updateCase(caseItem.id, {
      status: next as CaseStatus,
    });
    if (updated) {
      setCaseItem(updated);
      toast.success("Zaktualizowano status sprawy");
    }
  };

  const handleDelete = async () => {
    if (!caseItem) return;
    await caseRepository.deleteCase(caseItem.id);
    toast.success("Sprawa usunięta");
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin" />
        Wczytywanie sprawy…
      </div>
    );
  }

  if (!caseItem) {
    return (
      <EmptyState
        icon={FileText}
        title="Nie znaleziono sprawy"
        description="Sprawa mogła zostać usunięta lub link jest nieprawidłowy."
        action={
          <Button asChild>
            <Link to="/dashboard">
              <ArrowLeft className="size-4" />
              Wróć do listy
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/dashboard">
            <ArrowLeft className="size-4" />
            Wszystkie sprawy
          </Link>
        </Button>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {caseItem.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <CaseStatusBadge status={caseItem.status} />
              <LocalStorageBadge />
            </div>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <div className="space-y-1.5">
              <Label htmlFor="statusSelect" className="text-xs uppercase tracking-wide text-muted-foreground">
                Status sprawy
              </Label>
              <Select
                value={caseItem.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger id="statusSelect" className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CASE_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ConfirmDialog
              trigger={
                <Button type="button" variant="outline">
                  <Trash2 className="size-4 text-destructive" />
                  Usuń sprawę
                </Button>
              }
              title="Usunąć sprawę?"
              description="Tej operacji nie da się cofnąć. Usuniesz pismo, dowody, checklistę i notatki."
              confirmLabel="Usuń sprawę"
              destructive
              onConfirm={handleDelete}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="flex w-full flex-wrap">
          <TabsTrigger value="summary">Podsumowanie</TabsTrigger>
          <TabsTrigger value="letter">Wygenerowane pismo</TabsTrigger>
          <TabsTrigger value="evidence">
            Dowody{summary ? ` (${summary.evidenceCount})` : ""}
          </TabsTrigger>
          <TabsTrigger value="checklist">
            Checklist{summary ? ` (${summary.done}/${summary.total})` : ""}
          </TabsTrigger>
          <TabsTrigger value="notes">
            Notatki{summary ? ` (${summary.notesCount})` : ""}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Podstawowe informacje</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <SummaryRow
                icon={Tag}
                label="Kategoria"
                value={CATEGORY_LABELS[caseItem.category]}
              />
              <SummaryRow
                icon={Building2}
                label="Firma"
                value={caseItem.companyName || "—"}
              />
              <SummaryRow
                icon={Calendar}
                label="Utworzono"
                value={formatHumanDate(caseItem.createdAt)}
              />
              <SummaryRow
                icon={Calendar}
                label="Ostatnia zmiana"
                value={formatHumanDate(caseItem.updatedAt)}
              />
              {caseItem.purchaseDate ? (
                <SummaryRow
                  icon={Calendar}
                  label="Data zakupu"
                  value={formatHumanDate(caseItem.purchaseDate)}
                />
              ) : null}
              {caseItem.orderNumber ? (
                <SummaryRow
                  icon={Hash}
                  label="Numer zamówienia"
                  value={caseItem.orderNumber}
                />
              ) : null}
              {caseItem.amount ? (
                <SummaryRow
                  icon={Wallet}
                  label="Kwota"
                  value={caseItem.amount}
                />
              ) : null}
              {caseItem.contactEmail ? (
                <SummaryRow
                  icon={Mail}
                  label="E-mail kontaktowy"
                  value={caseItem.contactEmail}
                />
              ) : null}
              <div className="sm:col-span-2 space-y-1">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Twoje oczekiwanie
                </div>
                <div className="text-sm">{caseItem.userGoal}</div>
              </div>
              <div className="sm:col-span-2 space-y-1">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Opis problemu
                </div>
                <p className="whitespace-pre-wrap text-sm">
                  {caseItem.shortProblemDescription}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="letter">
          <GeneratedLetterEditor caseItem={caseItem} onChange={setCaseItem} />
        </TabsContent>

        <TabsContent value="evidence">
          <EvidenceEditor caseItem={caseItem} onChange={setCaseItem} />
        </TabsContent>

        <TabsContent value="checklist">
          <ChecklistList caseItem={caseItem} onChange={setCaseItem} />
        </TabsContent>

        <TabsContent value="notes">
          <NotesList caseItem={caseItem} onChange={setCaseItem} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

type SummaryRowProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function SummaryRow({ icon: Icon, label, value }: SummaryRowProps) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-border bg-muted/30 p-3">
      <Icon className="mt-0.5 size-4 text-muted-foreground" />
      <div className="space-y-0.5">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}
