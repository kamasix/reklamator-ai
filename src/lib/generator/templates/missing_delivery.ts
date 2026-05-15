import type { GeneratorInput, LetterSections } from "@/types/case";
import { buildLetterSkeleton } from "../baseTemplate";
import { valueOrPlaceholder } from "../sections";

export function missingDeliveryTemplate(input: GeneratorInput): LetterSections {
  const date = valueOrPlaceholder(input.purchaseDate, "uzupełnij datę zamówienia");
  const order = valueOrPlaceholder(input.orderNumber, "uzupełnij numer zamówienia");
  const amount = valueOrPlaceholder(input.amount, "uzupełnij kwotę zamówienia");
  const company = input.companyName.trim() || "[Nazwa firmy]";
  const promised = valueOrPlaceholder(
    input.details.promisedDeliveryDate,
    "uzupełnij obiecaną datę dostawy",
  );
  const tracking = input.details.trackingNumber?.trim() ?? "";
  const sellerResponded = (input.details.didSellerRespond || "").trim().toLowerCase();
  const whatSellerSaid = input.details.whatSellerSaid?.trim() ?? "";

  const factsParagraphs: string[] = [
    `W dniu ${date} złożyłem(-am) w firmie ${company} zamówienie o numerze ${order} na kwotę ${amount}.`,
    `Sprzedawca zobowiązał się dostarczyć przesyłkę do dnia ${promised}. Do dnia dzisiejszego nie otrzymałem(-am) zamówionego towaru.`,
    `Opis sytuacji: ${input.shortProblemDescription.trim()}`,
  ];

  if (tracking) {
    factsParagraphs.push(
      `Numer śledzenia przesyłki: ${tracking}. Na podstawie statusu śledzenia przesyłka nie została mi doręczona.`,
    );
  } else {
    factsParagraphs.push(
      "Sprzedawca nie udostępnił mi numeru śledzenia przesyłki lub status śledzenia nie potwierdza doręczenia.",
    );
  }

  if (sellerResponded.startsWith("t") || sellerResponded === "yes") {
    factsParagraphs.push(
      `Kontaktowałem(-am) się ze sprzedawcą w tej sprawie. Stanowisko sprzedawcy: ${whatSellerSaid || "[uzupełnij stanowisko sprzedawcy]"}. Stanowisko to nie rozwiązuje sprawy.`,
    );
  } else {
    factsParagraphs.push(
      "Pomimo prób kontaktu sprzedawca nie udzielił mi konkretnej informacji dotyczącej dostawy.",
    );
  }

  factsParagraphs.push(
    `Moje oczekiwanie wobec firmy: ${input.userGoal.trim()}`,
  );

  return buildLetterSkeleton(input, {
    subjectText: `Reklamacja – niedostarczona przesyłka (zamówienie ${order})`,
    introText:
      "Niniejszym zgłaszam reklamację dotyczącą niewykonania umowy sprzedaży w zakresie dostarczenia zamówionego towaru. Wnoszę o pilne podjęcie działań opisanych poniżej.",
    factsParagraphs,
    demandIntro: "W związku z powyższym wnoszę o:",
    demandItems: [
      "natychmiastową dostawę zamówionego towaru w nowym, wiążącym terminie wskazanym przez sprzedawcę",
      `lub – jeżeli dostawa nie jest możliwa – pełny zwrot kwoty ${amount} w terminie 14 dni od dnia otrzymania pisma`,
      "udzielenie pisemnej informacji o aktualnym statusie zamówienia oraz o przyczynach opóźnienia",
    ],
  });
}
