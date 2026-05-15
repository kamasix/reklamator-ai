import { useState } from "react";
import { Plus, Trash2, Pencil, Save, X, StickyNote } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { caseRepository } from "@/lib/storage/caseRepository";
import type { Case } from "@/types/case";
import { noteCreateSchema } from "@/types/schemas";
import { formatDateTime } from "@/lib/utils/date";

type NotesListProps = {
  caseItem: Case;
  onChange: (next: Case) => void;
};

export function NotesList({ caseItem, onChange }: NotesListProps) {
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");

  const handleAdd = async () => {
    const parsed = noteCreateSchema.safeParse({ content: draft });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Sprawdź treść notatki");
      return;
    }
    const updated = await caseRepository.addNote(caseItem.id, {
      content: parsed.data.content,
    });
    if (updated) {
      onChange(updated);
      setDraft("");
      toast.success("Dodano notatkę");
    }
  };

  const handleEditSave = async () => {
    if (!editingId) return;
    const parsed = noteCreateSchema.safeParse({ content: editDraft });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Sprawdź treść notatki");
      return;
    }
    const updated = await caseRepository.updateNote(caseItem.id, editingId, {
      content: parsed.data.content,
    });
    if (updated) {
      onChange(updated);
      setEditingId(null);
      toast.success("Zaktualizowano notatkę");
    }
  };

  const handleDelete = async (id: string) => {
    const updated = await caseRepository.deleteNote(caseItem.id, id);
    if (updated) {
      onChange(updated);
      toast.success("Usunięto notatkę");
    }
  };

  const notesDesc = [...caseItem.notes].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Notatki</h2>
        <p className="text-sm text-muted-foreground">
          Zapisuj odpowiedzi firmy, terminy i własne uwagi związane ze sprawą.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-3 p-4">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            placeholder="np. 12 marca otrzymałem e-mail z informacją, że sprawa wymaga dodatkowych dokumentów…"
          />
          <Button
            type="button"
            onClick={handleAdd}
            disabled={!draft.trim()}
          >
            <Plus className="size-4" />
            Dodaj notatkę
          </Button>
        </CardContent>
      </Card>

      {notesDesc.length === 0 ? (
        <EmptyState
          icon={StickyNote}
          title="Brak notatek"
          description="Pierwsza notatka pomoże Ci śledzić rozwój sprawy w czasie."
        />
      ) : (
        <div className="space-y-2">
          {notesDesc.map((note) => {
            const editing = editingId === note.id;
            return (
              <Card key={note.id}>
                <CardContent className="p-4">
                  {editing ? (
                    <div className="space-y-2">
                      <Textarea
                        rows={3}
                        value={editDraft}
                        onChange={(e) => setEditDraft(e.target.value)}
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        <Button type="button" onClick={handleEditSave}>
                          <Save className="size-4" />
                          Zapisz
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
                    <div className="space-y-2">
                      <p className="whitespace-pre-wrap text-sm">
                        {note.content}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs text-muted-foreground">
                          {formatDateTime(note.createdAt)}
                          {note.updatedAt
                            ? ` • edytowano: ${formatDateTime(note.updatedAt)}`
                            : null}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditingId(note.id);
                              setEditDraft(note.content);
                            }}
                          >
                            <Pencil className="size-4" />
                            <span className="sr-only">Edytuj</span>
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(note.id)}
                          >
                            <Trash2 className="size-4 text-destructive" />
                            <span className="sr-only">Usuń</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
