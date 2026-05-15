export type CaseCategory =
  | "refund"
  | "product_complaint"
  | "warranty"
  | "missing_delivery"
  | "subscription_charge"
  | "blocked_account"
  | "service_provider"
  | "repair_service"
  | "other";

export type CaseStatus =
  | "draft"
  | "generated"
  | "sent"
  | "waiting"
  | "escalated"
  | "closed";

export type Tone =
  | "formalny"
  | "stanowczy"
  | "krotki"
  | "bardzo_dokladny"
  | "spokojny";

export type Evidence = {
  id: string;
  title: string;
  description: string;
  fileName?: string;
  evidenceDate?: string;
  createdAt: string;
};

export type Note = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
};

export type ChecklistItem = {
  id: string;
  title: string;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
};

export type Case = {
  id: string;
  title: string;
  category: CaseCategory;
  companyName: string;
  status: CaseStatus;
  amount?: string;
  purchaseDate?: string;
  orderNumber?: string;
  contactEmail?: string;
  userGoal: string;
  shortProblemDescription: string;
  details: Record<string, string>;
  generatedLetter: string;
  tone: Tone;
  evidence: Evidence[];
  notes: Note[];
  checklist: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
};

export type LetterSectionKind =
  | "header"
  | "subject"
  | "salutation"
  | "intro"
  | "facts"
  | "demand"
  | "evidence_list"
  | "expected_response"
  | "closing"
  | "disclaimer";

export type LetterSection =
  | { kind: "header"; senderPlaceholder: string; recipient: string; date: string }
  | { kind: "subject"; text: string }
  | { kind: "salutation"; text: string }
  | { kind: "intro"; text: string }
  | { kind: "facts"; paragraphs: string[] }
  | { kind: "demand"; intro: string; items: string[] }
  | { kind: "evidence_list"; intro: string; items: string[] }
  | { kind: "expected_response"; text: string }
  | { kind: "closing"; text: string }
  | { kind: "disclaimer"; text: string };

export type LetterSections = LetterSection[];

export type GeneratorInput = {
  category: CaseCategory;
  companyName: string;
  orderNumber?: string;
  amount?: string;
  purchaseDate?: string;
  contactEmail?: string;
  userGoal: string;
  shortProblemDescription: string;
  details: Record<string, string>;
  evidence: Evidence[];
  tone: Tone;
};

export const CASE_CATEGORIES: readonly CaseCategory[] = [
  "refund",
  "product_complaint",
  "warranty",
  "missing_delivery",
  "subscription_charge",
  "blocked_account",
  "service_provider",
  "repair_service",
  "other",
] as const;

export const CASE_STATUSES: readonly CaseStatus[] = [
  "draft",
  "generated",
  "sent",
  "waiting",
  "escalated",
  "closed",
] as const;

export const TONES: readonly Tone[] = [
  "formalny",
  "stanowczy",
  "krotki",
  "bardzo_dokladny",
  "spokojny",
] as const;

export const CATEGORY_LABELS: Record<CaseCategory, string> = {
  refund: "Zwrot pieniędzy",
  product_complaint: "Reklamacja produktu",
  warranty: "Gwarancja / rękojmia",
  missing_delivery: "Brak dostawy",
  subscription_charge: "Subskrypcja / nieautoryzowana opłata",
  blocked_account: "Zablokowane konto online",
  service_provider: "Problem z operatorem / usługą",
  repair_service: "Problem z serwisem",
  other: "Inne",
};

export const STATUS_LABELS: Record<CaseStatus, string> = {
  draft: "Szkic",
  generated: "Wygenerowane",
  sent: "Wysłane",
  waiting: "Oczekiwanie",
  escalated: "Eskalacja",
  closed: "Zamknięte",
};

export const TONE_LABELS: Record<Tone, string> = {
  formalny: "Formalny",
  stanowczy: "Stanowczy",
  krotki: "Krótki",
  bardzo_dokladny: "Bardzo dokładny",
  spokojny: "Spokojny",
};
