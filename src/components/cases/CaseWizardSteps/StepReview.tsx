import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_LABELS, type CaseCategory, type Evidence } from "@/types/case";
import type { StepBasicInfoValues } from "@/types/schemas";

type StepReviewProps = {
  category: CaseCategory;
  basic: StepBasicInfoValues;
  details: Record<string, string>;
  evidence: Evidence[];
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
      <div className="text-sm sm:col-span-2 whitespace-pre-wrap">
        {value || <span className="text-muted-foreground">—</span>}
      </div>
    </div>
  );
}

export function StepReview({
  category,
  basic,
  details,
  evidence,
}: StepReviewProps) {
  const detailEntries = Object.entries(details).filter(
    ([, v]) => v && v.trim().length > 0,
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Podstawowe informacje</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Row label="Kategoria" value={CATEGORY_LABELS[category]} />
          <Row label="Firma / sklep" value={basic.companyName} />
          <Row label="Data zakupu" value={basic.purchaseDate ?? ""} />
          <Row label="Numer zamówienia" value={basic.orderNumber ?? ""} />
          <Row label="Kwota" value={basic.amount ?? ""} />
          <Row label="E-mail kontaktowy" value={basic.contactEmail ?? ""} />
          <Row label="Oczekiwany rezultat" value={basic.userGoal} />
          <Row label="Krótki opis" value={basic.shortProblemDescription} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Szczegóły sprawy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {detailEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nie podano dodatkowych szczegółów. Pismo zostanie wygenerowane na
              podstawie podstawowych informacji.
            </p>
          ) : (
            detailEntries.map(([key, value]) => (
              <Row key={key} label={key} value={value} />
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dowody</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {evidence.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nie dodano dowodów. Możesz dodać je później w sprawie.
            </p>
          ) : (
            evidence.map((e) => (
              <div key={e.id} className="rounded-md border border-border p-3">
                <div className="font-medium">{e.title}</div>
                {e.fileName ? (
                  <div className="text-xs text-muted-foreground">
                    plik: {e.fileName}
                  </div>
                ) : null}
                {e.description ? (
                  <p className="mt-1 text-sm">{e.description}</p>
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
