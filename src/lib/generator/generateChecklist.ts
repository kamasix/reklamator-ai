import type { CaseCategory, ChecklistItem } from "@/types/case";
import { newId } from "@/lib/utils/id";
import { nowIso } from "@/lib/utils/date";

const TITLES_BY_CATEGORY: Record<CaseCategory, string[]> = {
  refund: [
    "Sprawdź dane sprzedawcy i numer zamówienia w piśmie",
    "Dołącz potwierdzenie zakupu / fakturę",
    "Dołącz potwierdzenie płatności (rachunek bankowy / karta)",
    "Wyślij pismo do firmy (e-mail lub list polecony)",
    "Zapisz potwierdzenie wysyłki / numer nadania",
    "Poczekaj na pisemną odpowiedź (do 14 dni)",
    "Jeśli brak odpowiedzi, przygotuj eskalację lub zgłoszenie do rzecznika konsumentów",
  ],
  product_complaint: [
    "Sprawdź dane w piśmie i opis wady",
    "Dołącz dowód zakupu i zdjęcia / opis wady",
    "Wyślij pismo do sprzedawcy",
    "Zapisz potwierdzenie wysyłki",
    "Ustal sposób dostarczenia produktu, jeżeli sprzedawca o niego prosi",
    "Poczekaj na odpowiedź w terminie 14 dni",
    "Jeśli brak odpowiedzi, traktuj reklamację jako uznaną i upomnij się o realizację",
  ],
  warranty: [
    "Sprawdź, czy korzystasz z rękojmi czy gwarancji",
    "Dołącz dowód zakupu i kartę gwarancyjną, jeżeli ją masz",
    "Opisz wadę i daty wystąpienia",
    "Wyślij pismo do sprzedawcy lub gwaranta",
    "Zapisz potwierdzenie wysyłki",
    "Poczekaj na rozpatrzenie reklamacji w terminie 14 dni",
    "Jeśli odmowa – rozważ kolejne pismo, mediację lub rzecznika konsumentów",
  ],
  missing_delivery: [
    "Sprawdź numer zamówienia i numer śledzenia",
    "Dołącz potwierdzenie zakupu i historię kontaktu ze sprzedawcą",
    "Wyślij pismo do sklepu",
    "Zapisz potwierdzenie wysyłki pisma",
    "Poczekaj na odpowiedź",
    "Jeśli brak odpowiedzi w 14 dni, przygotuj kolejne pismo o zwrot pieniędzy",
    "Rozważ zgłoszenie do rzecznika konsumentów lub UOKiK",
  ],
  subscription_charge: [
    "Zrób zrzut ekranu wyciągu z opłatą",
    "Zapisz datę i kwotę pobranej opłaty",
    "Anuluj subskrypcję (jeśli to możliwe) i zapisz potwierdzenie",
    "Wyślij reklamację do firmy o zwrot środków",
    "Zapisz potwierdzenie wysyłki",
    "Jeśli firma nie zwróci środków – zgłoś chargeback w banku / u operatora karty",
    "Rozważ zgłoszenie do UOKiK, jeżeli praktyka się powtarza",
  ],
  blocked_account: [
    "Zrób zrzut ekranu komunikatu blokady",
    "Zapisz datę blokady i podany powód",
    "Opisz wpływ blokady (utracone dane, zamówienia, kontakty)",
    "Wyślij odwołanie przez oficjalny formularz / kanał wsparcia",
    "Zapisz numer zgłoszenia / ticketu",
    "Jeśli brak odpowiedzi, wyślij pismo na adres siedziby firmy",
    "Rozważ eskalację – mediacja, RODO (dostęp do danych), UODO, sąd",
  ],
  service_provider: [
    "Sprawdź umowę, cennik i regulamin usługi",
    "Zapisz daty awarii / problemu",
    "Dołącz historię kontaktu z BOK",
    "Wyślij pismo reklamacyjne",
    "Zapisz potwierdzenie wysyłki",
    "Poczekaj na odpowiedź (w usługach telekomunikacyjnych zwykle do 30 dni)",
    "Jeśli odmowa – rozważ Prezesa UKE / rzecznika konsumentów",
  ],
  repair_service: [
    "Sprawdź dane zlecenia i karty serwisowej",
    "Dołącz opis pierwotnego problemu oraz aktualnego stanu",
    "Dołącz zdjęcia / dowody jakości naprawy",
    "Wyślij reklamację do serwisu",
    "Zapisz potwierdzenie wysyłki",
    "Poczekaj na odpowiedź (do 14 dni)",
    "Jeśli odmowa – rozważ niezależną opinię techniczną i kolejne pismo",
  ],
  other: [
    "Sprawdź dane w piśmie",
    "Dołącz dowody",
    "Wyślij pismo do firmy",
    "Zapisz potwierdzenie wysyłki",
    "Zapisz odpowiedź firmy",
    "Jeśli brak odpowiedzi, przygotuj eskalację",
  ],
};

export function generateChecklist(category: CaseCategory): ChecklistItem[] {
  const titles = TITLES_BY_CATEGORY[category] ?? TITLES_BY_CATEGORY.other;
  const now = nowIso();
  return titles.map((title) => ({
    id: newId(),
    title,
    completed: false,
    createdAt: now,
  }));
}
