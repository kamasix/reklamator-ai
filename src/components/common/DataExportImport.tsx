import { useRef, useState } from "react";
import { Download, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  downloadExportFile,
  importMerge,
  importReplace,
  parseImportPayload,
  type ImportResult,
} from "@/lib/json/exportImport";

type DataExportImportProps = {
  onChanged?: () => void;
};

export function DataExportImport({ onChanged }: DataExportImportProps) {
  const [exporting, setExporting] = useState(false);
  const [importPending, setImportPending] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<
    Extract<ImportResult, { ok: true }>["data"] | null
  >(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleExport = async () => {
    setExporting(true);
    try {
      await downloadExportFile();
      toast.success("Pobrano kopię zapasową JSON");
    } catch {
      toast.error("Nie udało się wyeksportować danych");
    } finally {
      setExporting(false);
    }
  };

  const handleFileSelected = async (file: File) => {
    setImportPending(true);
    try {
      const text = await file.text();
      const result = parseImportPayload(text);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setPendingPayload(result.data);
    } catch {
      toast.error("Nie udało się odczytać pliku");
    } finally {
      setImportPending(false);
    }
  };

  const handleReplace = async () => {
    if (!pendingPayload) return;
    setImportPending(true);
    try {
      const count = await importReplace(pendingPayload);
      toast.success(`Zaimportowano ${count} spraw (zastąpiono dane).`);
      setPendingPayload(null);
      onChanged?.();
    } catch {
      toast.error("Nie udało się zaimportować danych");
    } finally {
      setImportPending(false);
    }
  };

  const handleMerge = async () => {
    if (!pendingPayload) return;
    setImportPending(true);
    try {
      const count = await importMerge(pendingPayload);
      toast.success(`Zaimportowano / scalono ${count} spraw.`);
      setPendingPayload(null);
      onChanged?.();
    } catch {
      toast.error("Nie udało się scalić danych");
    } finally {
      setImportPending(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={handleExport}
        disabled={exporting}
      >
        {exporting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Download className="size-4" />
        )}
        Eksportuj dane (JSON)
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={importPending}
      >
        {importPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Upload className="size-4" />
        )}
        Importuj dane (JSON)
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void handleFileSelected(file);
        }}
      />

      <Dialog
        open={pendingPayload !== null}
        onOpenChange={(open) => {
          if (!open) setPendingPayload(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importowanie kopii zapasowej</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2">
                <div>
                  Wykryto plik backup z {pendingPayload?.cases.length ?? 0}{" "}
                  sprawami (wersja {pendingPayload?.version}).
                </div>
                <div>
                  Wybierz, w jaki sposób chcesz dodać dane do tej przeglądarki.
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setPendingPayload(null)}
              disabled={importPending}
            >
              Anuluj
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleMerge}
              disabled={importPending}
            >
              Scal (dodaj do istniejących)
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleReplace}
              disabled={importPending}
            >
              Zastąp wszystkie sprawy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
