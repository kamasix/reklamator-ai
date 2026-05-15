import { useState } from "react";
import { Copy, Download, RefreshCw, Wand2, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DisclaimerBox } from "@/components/common/DisclaimerBox";
import {
  TONES,
  TONE_LABELS,
  type Case,
  type Tone,
} from "@/types/case";
import { caseRepository } from "@/lib/storage/caseRepository";
import { generateComplaintLetter } from "@/lib/generator/generateComplaintLetter";
import { exportCaseLetterAsPdf } from "@/lib/pdf/exportPdf";

type GeneratedLetterEditorProps = {
  caseItem: Case;
  onChange: (next: Case) => void;
};

export function GeneratedLetterEditor({
  caseItem,
  onChange,
}: GeneratedLetterEditorProps) {
  const [letter, setLetter] = useState(caseItem.generatedLetter);
  const [tone, setTone] = useState<Tone>(caseItem.tone);
  const [savingLetter, setSavingLetter] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const dirty = letter !== caseItem.generatedLetter;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(letter);
      toast.success("Skopiowano treść pisma do schowka");
    } catch {
      toast.error("Nie udało się skopiować");
    }
  };

  const persistLetter = async (
    nextLetter: string,
    nextTone: Tone,
  ): Promise<Case | undefined> => {
    return caseRepository.updateCase(caseItem.id, {
      generatedLetter: nextLetter,
      tone: nextTone,
    });
  };

  const handleSaveLetter = async () => {
    setSavingLetter(true);
    try {
      const updated = await persistLetter(letter, tone);
      if (updated) {
        onChange(updated);
        toast.success("Zapisano zmiany w piśmie");
      }
    } finally {
      setSavingLetter(false);
    }
  };

  const regenerateWith = async (nextTone: Tone) => {
    setRegenerating(true);
    try {
      const nextLetter = generateComplaintLetter({
        category: caseItem.category,
        companyName: caseItem.companyName,
        orderNumber: caseItem.orderNumber,
        amount: caseItem.amount,
        purchaseDate: caseItem.purchaseDate,
        contactEmail: caseItem.contactEmail,
        userGoal: caseItem.userGoal,
        shortProblemDescription: caseItem.shortProblemDescription,
        details: caseItem.details,
        evidence: caseItem.evidence,
        tone: nextTone,
      });
      const updated = await persistLetter(nextLetter, nextTone);
      if (updated) {
        setLetter(nextLetter);
        setTone(nextTone);
        onChange(updated);
        toast.success("Wygenerowano pismo na nowo");
      }
    } finally {
      setRegenerating(false);
    }
  };

  const handleToneChange = (value: string) => {
    const next = value as Tone;
    if (next === tone) return;
    void regenerateWith(next);
  };

  const handleRegenerate = () => {
    void regenerateWith(tone);
  };

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      await exportCaseLetterAsPdf(
        { ...caseItem, generatedLetter: letter, tone },
        letter,
      );
      toast.success("Wyeksportowano PDF");
    } catch (e) {
      console.error(e);
      toast.error("Nie udało się wyeksportować PDF");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="toneSelect">Ton pisma</Label>
          <Select value={tone} onValueChange={handleToneChange}>
            <SelectTrigger id="toneSelect" className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TONES.map((t) => (
                <SelectItem key={t} value={t}>
                  {TONE_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleRegenerate}
            disabled={regenerating}
          >
            {regenerating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            Wygeneruj ponownie
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => void regenerateWith(tone)}
            disabled={regenerating}
          >
            <Wand2 className="size-4" />
            Ulepsz ton
          </Button>
        </div>
      </div>

      <Textarea
        value={letter}
        onChange={(e) => setLetter(e.target.value)}
        rows={22}
        className="letter-paper min-h-[28rem]"
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" onClick={handleCopy}>
          <Copy className="size-4" />
          Kopiuj
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleExportPdf}
          disabled={exporting}
        >
          {exporting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
          Eksportuj PDF
        </Button>
        {dirty ? (
          <Button
            type="button"
            onClick={handleSaveLetter}
            disabled={savingLetter}
          >
            {savingLetter ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Zapisz zmiany
          </Button>
        ) : null}
      </div>

      <DisclaimerBox variant="compact" />
    </div>
  );
}
