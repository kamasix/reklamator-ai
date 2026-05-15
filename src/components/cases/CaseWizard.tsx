import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/common/LoadingButton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import {
  CATEGORY_LABELS,
  type Case,
  type CaseCategory,
  type Evidence,
  type Tone,
} from "@/types/case";
import type { StepBasicInfoValues } from "@/types/schemas";
import { StepCategory } from "./CaseWizardSteps/StepCategory";
import { StepBasicInfo } from "./CaseWizardSteps/StepBasicInfo";
import { StepDetails } from "./CaseWizardSteps/StepDetails";
import { StepEvidence } from "./CaseWizardSteps/StepEvidence";
import { StepReview } from "./CaseWizardSteps/StepReview";
import { caseRepository } from "@/lib/storage/caseRepository";
import { generateComplaintLetter } from "@/lib/generator/generateComplaintLetter";
import { generateChecklist } from "@/lib/generator/generateChecklist";

const STEP_LABELS = [
  "Kategoria",
  "Podstawowe dane",
  "Szczegóły",
  "Dowody",
  "Podsumowanie",
];

const DEFAULT_BASIC: StepBasicInfoValues = {
  companyName: "",
  purchaseDate: "",
  orderNumber: "",
  amount: "",
  contactEmail: "",
  userGoal: "",
  shortProblemDescription: "",
};

const DEFAULT_TONE: Tone = "formalny";

function buildTitle(category: CaseCategory, basic: StepBasicInfoValues): string {
  const company = basic.companyName.trim() || "Brak nazwy firmy";
  return `${CATEGORY_LABELS[category]} – ${company}`;
}

export function CaseWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<CaseCategory | null>(null);
  const [basic, setBasic] = useState<StepBasicInfoValues>(DEFAULT_BASIC);
  const [basicValid, setBasicValid] = useState(false);
  const [details, setDetails] = useState<Record<string, string>>({});
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleBasicChange = useCallback((next: StepBasicInfoValues) => {
    setBasic(next);
  }, []);

  const canGoNext = useMemo(() => {
    if (step === 0) return category !== null;
    if (step === 1) return basicValid;
    return true;
  }, [step, category, basicValid]);

  const handleNext = () => {
    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  };
  const handlePrev = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    if (!category) return;
    setSubmitting(true);
    try {
      const letter = generateComplaintLetter({
        category,
        companyName: basic.companyName,
        orderNumber: basic.orderNumber || undefined,
        amount: basic.amount || undefined,
        purchaseDate: basic.purchaseDate || undefined,
        contactEmail: basic.contactEmail || undefined,
        userGoal: basic.userGoal,
        shortProblemDescription: basic.shortProblemDescription,
        details,
        evidence,
        tone: DEFAULT_TONE,
      });

      const checklist = generateChecklist(category);
      const created: Omit<Case, "id" | "createdAt" | "updatedAt"> = {
        title: buildTitle(category, basic),
        category,
        companyName: basic.companyName.trim(),
        status: "generated",
        amount: basic.amount?.trim() || undefined,
        purchaseDate: basic.purchaseDate || undefined,
        orderNumber: basic.orderNumber?.trim() || undefined,
        contactEmail: basic.contactEmail?.trim() || undefined,
        userGoal: basic.userGoal.trim(),
        shortProblemDescription: basic.shortProblemDescription.trim(),
        details,
        generatedLetter: letter,
        tone: DEFAULT_TONE,
        evidence,
        notes: [],
        checklist,
      };

      const saved = await caseRepository.createCase(created);
      toast.success("Sprawa zapisana lokalnie. Pismo wygenerowane.");
      navigate(`/cases/${saved.id}`);
    } catch (e) {
      console.error(e);
      toast.error("Nie udało się zapisać sprawy");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {STEP_LABELS.map((label, index) => {
          const active = index === step;
          const done = index < step;
          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex size-7 items-center justify-center rounded-full border text-xs font-semibold",
                  active && "border-primary bg-primary text-primary-foreground",
                  done && "border-success bg-success text-success-foreground",
                  !active && !done &&
                    "border-border bg-muted text-muted-foreground",
                )}
              >
                {index + 1}
              </div>
              <span
                className={cn(
                  "hidden text-sm sm:inline",
                  active ? "font-semibold" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
              {index < STEP_LABELS.length - 1 ? (
                <span className="hidden h-px w-6 bg-border sm:inline-block" />
              ) : null}
            </div>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-5 sm:p-6">
          {step === 0 ? (
            <StepCategory
              value={category}
              onChange={(c) => {
                setCategory(c);
                setDetails({});
              }}
            />
          ) : null}
          {step === 1 ? (
            <StepBasicInfo
              values={basic}
              onChange={handleBasicChange}
              onValidityChange={setBasicValid}
            />
          ) : null}
          {step === 2 && category ? (
            <StepDetails
              category={category}
              values={details}
              onChange={setDetails}
            />
          ) : null}
          {step === 3 ? (
            <StepEvidence values={evidence} onChange={setEvidence} />
          ) : null}
          {step === 4 && category ? (
            <StepReview
              category={category}
              basic={basic}
              details={details}
              evidence={evidence}
            />
          ) : null}
        </CardContent>
      </Card>

      <div className="flex flex-col items-stretch justify-between gap-2 sm:flex-row sm:items-center">
        <Button
          type="button"
          variant="ghost"
          onClick={handlePrev}
          disabled={step === 0 || submitting}
        >
          <ArrowLeft className="size-4" />
          Wstecz
        </Button>
        {step < STEP_LABELS.length - 1 ? (
          <Button
            type="button"
            onClick={handleNext}
            disabled={!canGoNext || submitting}
          >
            Dalej
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <LoadingButton
            type="button"
            onClick={handleSubmit}
            loading={submitting}
            loadingText="Generuję pismo…"
            disabled={!category}
          >
            <Sparkles className="size-4" />
            Wygeneruj pismo
          </LoadingButton>
        )}
      </div>
    </div>
  );
}
