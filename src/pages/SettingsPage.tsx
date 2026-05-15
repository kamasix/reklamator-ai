import { useEffect, useState } from "react";
import { Trash2, Moon, Sun, MonitorSmartphone, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DataExportImport } from "@/components/common/DataExportImport";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { LocalStorageBadge } from "@/components/common/LocalStorageBadge";
import { DisclaimerBox } from "@/components/common/DisclaimerBox";
import { caseRepository } from "@/lib/storage/caseRepository";
import { useTheme, type Theme } from "@/hooks/useTheme";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [count, setCount] = useState<number | null>(null);

  const refreshCount = async () => {
    const list = await caseRepository.exportCases();
    setCount(list.length);
  };

  useEffect(() => {
    void refreshCount();
  }, []);

  const handleClear = async () => {
    await caseRepository.clearAllCases();
    await refreshCount();
    toast.success("Wszystkie sprawy zostały usunięte.");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Ustawienia</h1>
        <p className="text-sm text-muted-foreground">
          Zarządzaj danymi przechowywanymi w tej przeglądarce.
        </p>
        <LocalStorageBadge />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dane lokalne</CardTitle>
          <CardDescription>
            Reklamator AI zapisuje sprawy w pamięci tej przeglądarki. Możesz
            wyeksportować je do pliku JSON i przenieść na inne urządzenie.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="muted">
              Liczba spraw: {count === null ? "…" : count}
            </Badge>
          </div>
          <DataExportImport onChanged={refreshCount} />
          <div className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning-foreground" />
              <p className="text-foreground/90">
                Dane są zapisane tylko w tej przeglądarce. Jeśli wyczyścisz dane
                strony lub usuniesz aplikację, możesz je stracić. Regularnie rób
                kopię JSON.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Strefa niebezpieczna</CardTitle>
          <CardDescription>
            Usunięcie wszystkich spraw jest nieodwracalne. Najpierw wyeksportuj
            kopię JSON.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConfirmDialog
            trigger={
              <Button type="button" variant="destructive">
                <Trash2 className="size-4" />
                Usuń wszystkie dane lokalne
              </Button>
            }
            title="Usunąć wszystkie sprawy?"
            description="Tej operacji nie da się cofnąć. Stracisz wszystkie pisma, dowody, checklisty i notatki."
            confirmLabel="Tak, usuń wszystko"
            destructive
            onConfirm={handleClear}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wygląd</CardTitle>
          <CardDescription>
            Wybierz motyw aplikacji – jasny, ciemny lub zgodny z systemem.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:max-w-xs">
          <div className="space-y-1.5">
            <Label htmlFor="themeSelect">Motyw</Label>
            <Select
              value={theme}
              onValueChange={(value) => setTheme(value as Theme)}
            >
              <SelectTrigger id="themeSelect">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <span className="inline-flex items-center gap-2">
                    <Sun className="size-4" />
                    Jasny
                  </span>
                </SelectItem>
                <SelectItem value="dark">
                  <span className="inline-flex items-center gap-2">
                    <Moon className="size-4" />
                    Ciemny
                  </span>
                </SelectItem>
                <SelectItem value="system">
                  <span className="inline-flex items-center gap-2">
                    <MonitorSmartphone className="size-4" />
                    Systemowy
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <DisclaimerBox />
    </div>
  );
}
