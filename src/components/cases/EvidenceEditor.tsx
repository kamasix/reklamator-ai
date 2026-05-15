import { useState } from "react";
import { Plus, Trash2, Pencil, X, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { Folder } from "lucide-react";
import { caseRepository } from "@/lib/storage/caseRepository";
import type { Case, Evidence } from "@/types/case";
import { evidenceCreateSchema } from "@/types/schemas";
import { formatHumanDate } from "@/lib/utils/date";

type EvidenceEditorProps = {
  caseItem: Case;
  onChange: (next: Case) => void;
};

type Draft = {
  title: string;
  description: string;
  fileName: string;
  evidenceDate: string;
};

const emptyDraft: Draft = {
  title: "",
  description: "",
  fileName: "",
  evidenceDate: "",
};

function evidenceToDraft(e: Evidence): Draft {
  return {
    title: e.title,
    description: e.description ?? "",
    fileName: e.fileName ?? "",
    evidenceDate: e.evidenceDate ?? "",
  };
}

export function EvidenceEditor({ caseItem, onChange }: EvidenceEditorProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Draft>(emptyDraft);

  const validate = (d: Draft) => evidenceCreateSchema.safeParse(d);

  const handleAdd = async () => {
    const parsed = validate(draft);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Sprawdź dane");
      return;
    }
    const updated = await caseRepository.addEvidence(caseItem.id, {
      title: parsed.data.title,
      description: parsed.data.description ?? "",
      fileName: parsed.data.fileName || undefined,
      evidenceDate: parsed.data.evidenceDate || undefined,
    });
    if (updated) {
      onChange(updated);
      setDraft(emptyDraft);
      setAdding(false);
      toast.success("Dodano dowód");
    }
  };

  const startEdit = (e: Evidence) => {
    setEditingId(e.id);
    setEditDraft(evidenceToDraft(e));
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    const parsed = validate(editDraft);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Sprawdź dane");
      return;
    }
    const updated = await caseRepository.updateEvidence(caseItem.id, editingId, {
      title: parsed.data.title,
      description: parsed.data.description ?? "",
      fileName: parsed.data.fileName || undefined,
      evidenceDate: parsed.data.evidenceDate || undefined,
    });
    if (updated) {
      onChange(updated);
      setEditingId(null);
      toast.success("Zaktualizowano dowód");
    }
  };

  const handleDelete = async (id: string) => {
    const updated = await caseRepository.deleteEvidence(caseItem.id, id);
    if (updated) {
      onChange(updated);
      toast.success("Usunięto dowód");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Dowody i załączniki</h2>
          <p className="text-sm text-muted-foreground">
            Wersja przeglądarkowa nie przesyła plików – wpisuj nazwę pliku lub
            opisz dowód.
          </p>
        </div>
        {!adding ? (
          <Button type="button" onClick={() => setAdding(true)}>
            <Plus className="size-4" />
            Dodaj dowód
          </Button>
        ) : null}
      </div>

      {adding ? (
        <Card>
          <CardContent className="grid gap-3 p-4 md:grid-cols-2">
            <div className="md:col-span-2 space-y-1.5">
              <Label htmlFor="newEvidenceTitle">Tytuł</Label>
              <Input
                id="newEvidenceTitle"
                value={draft.title}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, title: e.target.value }))
                }
                placeholder="np. Korespondencja e-mail z BOK"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="newEvidenceFile">Nazwa pliku</Label>
              <Input
                id="newEvidenceFile"
                value={draft.fileName}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, fileName: e.target.value }))
                }
                placeholder="opcjonalnie"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="newEvidenceDate">Data dowodu</Label>
              <Input
                id="newEvidenceDate"
                type="date"
                value={draft.evidenceDate}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, evidenceDate: e.target.value }))
                }
              />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <Label htmlFor="newEvidenceDesc">Opis</Label>
              <Textarea
                id="newEvidenceDesc"
                rows={2}
                value={draft.description}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, description: e.target.value }))
                }
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <Button type="button" onClick={handleAdd}>
                <Save className="size-4" />
                Zapisz dowód
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setAdding(false);
                  setDraft(emptyDraft);
                }}
              >
                Anuluj
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {caseItem.evidence.length === 0 && !adding ? (
        <EmptyState
          icon={Folder}
          title="Brak dowodów"
          description="Możesz dodać tytuły dowodów, nazwy plików i krótkie opisy. To ułatwi rozpatrywanie reklamacji."
        />
      ) : null}

      <div className="space-y-2">
        {caseItem.evidence.map((evidence) => {
          const isEditing = editingId === evidence.id;
          return (
            <Card key={evidence.id}>
              <CardContent className="p-4">
                {isEditing ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="md:col-span-2 space-y-1.5">
                      <Label>Tytuł</Label>
                      <Input
                        value={editDraft.title}
                        onChange={(e) =>
                          setEditDraft((d) => ({ ...d, title: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Nazwa pliku</Label>
                      <Input
                        value={editDraft.fileName}
                        onChange={(e) =>
                          setEditDraft((d) => ({
                            ...d,
                            fileName: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Data dowodu</Label>
                      <Input
                        type="date"
                        value={editDraft.evidenceDate}
                        onChange={(e) =>
                          setEditDraft((d) => ({
                            ...d,
                            evidenceDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <Label>Opis</Label>
                      <Textarea
                        rows={2}
                        value={editDraft.description}
                        onChange={(e) =>
                          setEditDraft((d) => ({
                            ...d,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-2">
                      <Button type="button" onClick={handleSaveEdit}>
                        <Save className="size-4" />
                        Zapisz zmiany
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="size-4" />
                        Anuluj
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-0.5">
                      <div className="font-medium">{evidence.title}</div>
                      {evidence.fileName ? (
                        <div className="text-xs text-muted-foreground">
                          plik: {evidence.fileName}
                        </div>
                      ) : null}
                      {evidence.evidenceDate ? (
                        <div className="text-xs text-muted-foreground">
                          data: {formatHumanDate(evidence.evidenceDate)}
                        </div>
                      ) : null}
                      {evidence.description ? (
                        <p className="mt-1 text-sm text-foreground/90">
                          {evidence.description}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => startEdit(evidence)}
                      >
                        <Pencil className="size-4" />
                        <span className="sr-only">Edytuj</span>
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(evidence.id)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                        <span className="sr-only">Usuń</span>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
