import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, FolderOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/common/EmptyState";
import { LocalStorageBadge } from "@/components/common/LocalStorageBadge";
import { DataExportImport } from "@/components/common/DataExportImport";
import { DashboardCaseCard } from "@/components/cases/DashboardCaseCard";
import { useCases } from "@/hooks/useCases";
import {
  CASE_STATUSES,
  STATUS_LABELS,
  type CaseStatus,
} from "@/types/case";

type StatusFilter = "all" | CaseStatus;

export function DashboardPage() {
  const { cases, loading, refresh } = useCases();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return cases.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (!query) return true;
      const haystack = [
        c.title,
        c.companyName,
        c.shortProblemDescription,
        c.userGoal,
        c.orderNumber ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [cases, search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Twoje sprawy</h1>
          <p className="text-sm text-muted-foreground">
            Wszystkie sprawy są przechowywane wyłącznie w Twojej przeglądarce.
          </p>
          <LocalStorageBadge />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DataExportImport onChanged={() => void refresh()} />
          <Button asChild>
            <Link to="/cases/new">
              <Plus className="size-4" />
              Nowa sprawa
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
        <div className="space-y-1.5">
          <Label htmlFor="searchInput">Szukaj</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="searchInput"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="po tytule, firmie, numerze zamówienia"
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="statusFilter">Status</Label>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as StatusFilter)}
          >
            <SelectTrigger id="statusFilter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie statusy</SelectItem>
              {CASE_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="mr-2 size-4 animate-spin" />
          Wczytywanie spraw…
        </div>
      ) : cases.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Nie masz jeszcze żadnych spraw"
          description="Rozpocznij pierwszą sprawę – w kilku krokach przygotujemy pismo i checklistę."
          action={
            <Button asChild>
              <Link to="/cases/new">
                <Plus className="size-4" />
                Rozpocznij sprawę
              </Link>
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Brak wyników"
          description="Spróbuj zmienić frazę wyszukiwania lub status."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((caseItem) => (
            <DashboardCaseCard key={caseItem.id} caseItem={caseItem} />
          ))}
        </div>
      )}
    </div>
  );
}
