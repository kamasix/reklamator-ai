import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CaseCategory } from "@/types/case";

type Field = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "textarea" | "date";
  hint?: string;
};

const FIELDS_BY_CATEGORY: Record<CaseCategory, Field[]> = {
  refund: [
    {
      name: "refundReason",
      label: "Powód, dla którego chcesz zwrot pieniędzy",
      type: "textarea",
      placeholder: "np. odstąpienie od umowy w 14 dni, towar wadliwy, usługa niewykonana",
    },
    {
      name: "previousContact",
      label: "Dotychczasowy kontakt ze sprzedawcą",
      type: "textarea",
      placeholder: "krótko: kiedy, kanał (mail, telefon), jaka była reakcja",
    },
  ],
  product_complaint: [
    {
      name: "productName",
      label: "Nazwa / model produktu",
      placeholder: "np. Pralka XYZ 1234",
    },
    {
      name: "defectDescription",
      label: "Opis wady / niezgodności z umową",
      type: "textarea",
      placeholder: "co dokładnie nie działa, kiedy się ujawniło",
    },
    {
      name: "whenDefectAppeared",
      label: "Kiedy wada się ujawniła",
      placeholder: "np. 5 dni po zakupie",
    },
    {
      name: "expectedSolution",
      label: "Oczekiwane rozwiązanie",
      placeholder: "wymiana, naprawa, zwrot pieniędzy",
    },
  ],
  warranty: [
    {
      name: "productName",
      label: "Nazwa / model produktu",
      placeholder: "np. Smartfon ABC",
    },
    {
      name: "defectDescription",
      label: "Opis wady",
      type: "textarea",
    },
    {
      name: "warrantyOrStatutoryChoice",
      label: "Podstawa zgłoszenia",
      placeholder: "rękojmia lub gwarancja",
      hint: "Jeżeli nie masz pewności, wpisz „rękojmia”.",
    },
    {
      name: "serviceResponse",
      label: "Dotychczasowa odpowiedź serwisu / sprzedawcy",
      type: "textarea",
    },
    {
      name: "expectedSolution",
      label: "Oczekiwane rozwiązanie",
    },
  ],
  missing_delivery: [
    {
      name: "promisedDeliveryDate",
      label: "Obiecana data dostawy",
      type: "date",
    },
    {
      name: "trackingNumber",
      label: "Numer śledzenia (jeśli jest)",
    },
    {
      name: "didSellerRespond",
      label: "Czy sprzedawca odpowiedział?",
      placeholder: "tak / nie",
    },
    {
      name: "whatSellerSaid",
      label: "Co powiedział sprzedawca?",
      type: "textarea",
    },
  ],
  subscription_charge: [
    {
      name: "subscriptionName",
      label: "Nazwa usługi / subskrypcji",
    },
    {
      name: "chargeDate",
      label: "Data pobrania opłaty",
      type: "date",
    },
    {
      name: "chargeAmount",
      label: "Kwota pobranej opłaty",
    },
    {
      name: "didUserConsent",
      label: "Czy wyrażałeś(-aś) zgodę?",
      placeholder: "tak / nie / nie pamiętam",
    },
    {
      name: "cancellationAttemptDate",
      label: "Data próby anulowania (jeśli była)",
      type: "date",
    },
  ],
  blocked_account: [
    {
      name: "platformName",
      label: "Nazwa platformy",
      placeholder: "np. Facebook, Allegro, Sklep XYZ",
    },
    {
      name: "accountHandle",
      label: "Login / adres e-mail / nazwa konta",
    },
    {
      name: "blockDate",
      label: "Data blokady",
      type: "date",
    },
    {
      name: "reasonGiven",
      label: "Podane uzasadnienie blokady",
      type: "textarea",
    },
    {
      name: "businessImpact",
      label: "Jaki jest wpływ blokady na Ciebie?",
      type: "textarea",
      placeholder: "np. utrata kontaktu z klientami, utracone zamówienia",
    },
  ],
  service_provider: [
    {
      name: "serviceName",
      label: "Nazwa usługi",
      placeholder: "np. internet domowy, abonament telefoniczny",
    },
    {
      name: "contractDate",
      label: "Data zawarcia umowy",
      type: "date",
    },
    {
      name: "problemStartDate",
      label: "Data wystąpienia problemu",
      type: "date",
    },
    {
      name: "unexpectedFee",
      label: "Sporna lub nieautoryzowana opłata (jeśli jest)",
      placeholder: "np. 49 zł za usługę dodatkową",
    },
    {
      name: "supportResponse",
      label: "Dotychczasowa reakcja obsługi klienta",
      type: "textarea",
    },
  ],
  repair_service: [
    {
      name: "productName",
      label: "Nazwa / model urządzenia",
    },
    {
      name: "defectDescription",
      label: "Pierwotnie zgłoszony problem",
      type: "textarea",
    },
    {
      name: "serviceResponse",
      label: "Co zrobił serwis i jaki jest aktualny stan?",
      type: "textarea",
    },
    {
      name: "expectedSolution",
      label: "Oczekiwane rozwiązanie",
      placeholder: "np. ponowna naprawa, zwrot kosztów, niezależna ekspertyza",
    },
  ],
  other: [
    {
      name: "additionalContext",
      label: "Dodatkowy kontekst sprawy",
      type: "textarea",
      placeholder: "Opisz szczegóły, daty, kwoty, osoby kontaktowe",
    },
  ],
};

type StepDetailsProps = {
  category: CaseCategory;
  values: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
};

export function StepDetails({ category, values, onChange }: StepDetailsProps) {
  const fields = FIELDS_BY_CATEGORY[category] ?? FIELDS_BY_CATEGORY.other;

  const setField = (name: string, value: string) => {
    onChange({ ...values, [name]: value });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Te pytania pomogą wygenerować dokładniejsze pismo. Możesz zostawić puste
        pola – w piśmie pojawią się wtedy oznaczenia „[uzupełnij ...]”.
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => {
          const id = `details-${field.name}`;
          const current = values[field.name] ?? "";
          if (field.type === "textarea") {
            return (
              <div key={field.name} className="md:col-span-2 space-y-1.5">
                <Label htmlFor={id}>{field.label}</Label>
                <Textarea
                  id={id}
                  rows={3}
                  value={current}
                  placeholder={field.placeholder}
                  onChange={(e) => setField(field.name, e.target.value)}
                />
                {field.hint ? (
                  <p className="text-xs text-muted-foreground">{field.hint}</p>
                ) : null}
              </div>
            );
          }
          return (
            <div key={field.name} className="space-y-1.5">
              <Label htmlFor={id}>{field.label}</Label>
              <Input
                id={id}
                type={field.type === "date" ? "date" : "text"}
                value={current}
                placeholder={field.placeholder}
                onChange={(e) => setField(field.name, e.target.value)}
              />
              {field.hint ? (
                <p className="text-xs text-muted-foreground">{field.hint}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
