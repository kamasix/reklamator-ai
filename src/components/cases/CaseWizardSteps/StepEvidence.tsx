import { useState } from "react";
import { Plus, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { newId } from "@/lib/utils/id";
import { nowIso } from "@/lib/utils/date";
import type { Evidence } from "@/types/case";

type StepEvidenceProps = {
  values: Evidence[];
  onChange: (next: Evidence[]) => void;
};

type DraftEvidence = {
  title: string;
  description: string;
  fileName: string;
  evidenceDate: string;
};

const emptyDraft: DraftEvidence = {
  title: "",
  description: "",
  fileName: "",
  evidenceDate: "",
};

export function StepEvidence({ values, onChange }: StepEvidenceProps) {
  const [draft, setDraft] = useState<DraftEvidence>(emptyDraft);

  const addEvidence = () => {
    if (!draft.title.trim()) return;
    const next: Evidence = {
      id: newId(),
      title: draft.title.trim(),
      description: draft.description.trim(),
      fileName: draft.fileName.trim() || undefined,
      evidenceDate: draft.evidenceDate || undefined,
      createdAt: nowIso(),
    };
    onChange([...values, next]);
    setDraft(emptyDraft);
  };

  const removeEvidence = (id: string) => {
    onChange(values.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-3 text-sm text-foreground/90">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>
          Wersja na GitHub Pages nie przesyła plików na serwer. Możesz wpisać
          nazwę pliku lub opisać dowód, np. „screen rozmowy”, „faktura PDF”,
          „potwierdzenie płatności”.
        </p>
      </div>

      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-2">
          <div className="md:col-span-2 space-y-1.5">
            <Label htmlFor="evidenceTitle">Tytuł dowodu</Label>
            <Input
              id="evidenceTitle"
              value={draft.title}
              onChange={(e) =>
                setDraft((d) => ({ ...d, title: e.target.value }))
              }
              placeholder="np. Potwierdzenie zakupu"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="evidenceFile">Nazwa pliku (opcjonalnie)</Label>
            <Input
              id="evidenceFile"
              value={draft.fileName}
              onChange={(e) =>
                setDraft((d) => ({ ...d, fileName: e.target.value }))
              }
              placeholder="np. faktura-2024-12-05.pdf"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="evidenceDate">Data dowodu</Label>
            <Input
              id="evidenceDate"
              type="date"
              value={draft.evidenceDate}
              onChange={(e) =>
                setDraft((d) => ({ ...d, evidenceDate: e.target.value }))
              }
            />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <Label htmlFor="evidenceDesc">Opis</Label>
            <Textarea
              id="evidenceDesc"
              rows={2}
              value={draft.description}
              onChange={(e) =>
                setDraft((d) => ({ ...d, description: e.target.value }))
              }
              placeholder="krótki opis tego, co potwierdza ten dowód"
            />
          </div>
          <div className="md:col-span-2">
            <Button
              type="button"
              variant="secondary"
              onClick={addEvidence}
              disabled={!draft.title.trim()}
            >
              <Plus className="size-4" />
              Dodaj dowód
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {values.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nie dodano jeszcze żadnych dowodów. Możesz pominąć ten krok i dodać
            dowody później.
          </p>
        ) : (
          values.map((evidence) => (
            <Card key={evidence.id}>
              <CardContent className="flex items-start gap-3 p-4">
                <div className="flex-1 space-y-0.5">
                  <div className="font-medium">{evidence.title}</div>
                  {evidence.fileName ? (
                    <div className="text-xs text-muted-foreground">
                      plik: {evidence.fileName}
                    </div>
                  ) : null}
                  {evidence.evidenceDate ? (
                    <div className="text-xs text-muted-foreground">
                      data: {evidence.evidenceDate}
                    </div>
                  ) : null}
                  {evidence.description ? (
                    <p className="text-sm text-foreground/90">
                      {evidence.description}
                    </p>
                  ) : null}
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => removeEvidence(evidence.id)}
                >
                  <Trash2 className="size-4 text-destructive" />
                  <span className="sr-only">Usuń</span>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
