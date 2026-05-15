import { useState } from "react";
import { Plus, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { ListChecks } from "lucide-react";
import { caseRepository } from "@/lib/storage/caseRepository";
import type { Case } from "@/types/case";
import { checklistItemCreateSchema } from "@/types/schemas";
import { cn } from "@/lib/utils/cn";
import { formatShortDate } from "@/lib/utils/date";

type ChecklistListProps = {
  caseItem: Case;
  onChange: (next: Case) => void;
};

export function ChecklistList({ caseItem, onChange }: ChecklistListProps) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleAdd = async () => {
    const parsed = checklistItemCreateSchema.safeParse({ title, dueDate });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Sprawdź dane");
      return;
    }
    const updated = await caseRepository.addChecklistItem(caseItem.id, {
      title: parsed.data.title,
      dueDate: parsed.data.dueDate || undefined,
    });
    if (updated) {
      onChange(updated);
      setTitle("");
      setDueDate("");
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    const updated = await caseRepository.updateChecklistItem(
      caseItem.id,
      id,
      { completed },
    );
    if (updated) onChange(updated);
  };

  const handleDelete = async (id: string) => {
    const updated = await caseRepository.deleteChecklistItem(caseItem.id, id);
    if (updated) onChange(updated);
  };

  const completed = caseItem.checklist.filter((it) => it.completed).length;
  const total = caseItem.checklist.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Checklist</h2>
          <p className="text-sm text-muted-foreground">
            {total > 0
              ? `Ukończono ${completed} z ${total} kroków.`
              : "Dodaj kroki, które pomogą Ci doprowadzić sprawę do końca."}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-[1fr_180px_auto]">
          <div className="space-y-1.5">
            <Label htmlFor="newChecklistTitle">Nowy krok</Label>
            <Input
              id="newChecklistTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="np. Wysłać list polecony"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="newChecklistDue">Termin</Label>
            <Input
              id="newChecklistDue"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              onClick={handleAdd}
              disabled={!title.trim()}
              className="w-full md:w-auto"
            >
              <Plus className="size-4" />
              Dodaj
            </Button>
          </div>
        </CardContent>
      </Card>

      {total === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="Pusta lista zadań"
          description="Możesz dodać własne kroki – np. wysyłka pisma, zapis potwierdzenia, eskalacja."
        />
      ) : (
        <ul className="space-y-2">
          {caseItem.checklist.map((item) => (
            <li
              key={item.id}
              className={cn(
                "flex items-start gap-3 rounded-lg border bg-card p-3 transition-colors",
                item.completed ? "border-success/40 bg-success/5" : "border-border",
              )}
            >
              <Checkbox
                id={`checklist-${item.id}`}
                checked={item.completed}
                onCheckedChange={(checked) =>
                  handleToggle(item.id, checked === true)
                }
                className="mt-0.5"
              />
              <div className="flex-1">
                <Label
                  htmlFor={`checklist-${item.id}`}
                  className={cn(
                    "block cursor-pointer text-sm",
                    item.completed && "text-muted-foreground line-through",
                  )}
                >
                  {item.title}
                </Label>
                {item.dueDate ? (
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarIcon className="size-3" />
                    Termin: {formatShortDate(item.dueDate)}
                  </div>
                ) : null}
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="size-4 text-destructive" />
                <span className="sr-only">Usuń krok</span>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
