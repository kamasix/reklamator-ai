import {
  Banknote,
  Box,
  ShieldCheck,
  Truck,
  CreditCard,
  Lock,
  Wifi,
  Wrench,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { CASE_CATEGORIES, CATEGORY_LABELS, type CaseCategory } from "@/types/case";

type StepCategoryProps = {
  value: CaseCategory | null;
  onChange: (value: CaseCategory) => void;
};

const ICONS: Record<CaseCategory, LucideIcon> = {
  refund: Banknote,
  product_complaint: Box,
  warranty: ShieldCheck,
  missing_delivery: Truck,
  subscription_charge: CreditCard,
  blocked_account: Lock,
  service_provider: Wifi,
  repair_service: Wrench,
  other: HelpCircle,
};

const DESCRIPTIONS: Record<CaseCategory, string> = {
  refund: "Sklep nie chce oddać pieniędzy lub nie zwrócił środków po anulowaniu zamówienia.",
  product_complaint: "Produkt ma wadę, jest niezgodny z opisem lub nie działa zgodnie z umową.",
  warranty: "Serwis lub sprzedawca odrzucił reklamację z tytułu gwarancji lub rękojmi.",
  missing_delivery: "Zamówiona paczka nie dotarła lub utknęła w transporcie.",
  subscription_charge: "Pobrano nieautoryzowaną opłatę za subskrypcję lub usługę abonamentową.",
  blocked_account: "Twoje konto online zostało zablokowane bez jasnego powodu.",
  service_provider: "Problem z operatorem (internet, telefon, prąd) lub usługą cykliczną.",
  repair_service: "Serwis nie naprawił urządzenia lub naprawa pogorszyła stan sprzętu.",
  other: "Inna sprawa, której nie znalazłeś(-aś) na liście.",
};

export function StepCategory({ value, onChange }: StepCategoryProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {CASE_CATEGORIES.map((category) => {
        const Icon = ICONS[category];
        const active = value === category;
        return (
          <button
            type="button"
            key={category}
            onClick={() => onChange(category)}
            className={cn(
              "group flex h-full flex-col gap-2 rounded-xl border bg-card p-4 text-left transition-colors",
              active
                ? "border-primary ring-2 ring-primary/20"
                : "border-border hover:border-primary/50 hover:bg-accent/40",
            )}
          >
            <div
              className={cn(
                "flex size-9 items-center justify-center rounded-lg",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <Icon className="size-4" />
            </div>
            <div className="font-medium leading-tight">
              {CATEGORY_LABELS[category]}
            </div>
            <p className="text-sm text-muted-foreground">
              {DESCRIPTIONS[category]}
            </p>
          </button>
        );
      })}
    </div>
  );
}
