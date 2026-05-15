import type { GeneratorInput, LetterSections } from "@/types/case";
import { buildLetterSkeleton } from "../baseTemplate";
import { valueOrPlaceholder } from "../sections";

export function productComplaintTemplate(input: GeneratorInput): LetterSections {
  const date = valueOrPlaceholder(input.purchaseDate, "uzupełnij datę zakupu");
  const order = valueOrPlaceholder(input.orderNumber, "uzupełnij numer zamówienia");
  const company = input.companyName.trim() || "[Nazwa firmy]";
  const productName = valueOrPlaceholder(input.details.productName, "uzupełnij nazwę produktu");
  const defect = valueOrPlaceholder(input.details.defectDescription, "uzupełnij opis wady");
  const whenDefect = valueOrPlaceholder(
    input.details.whenDefectAppeared,
    "uzupełnij datę / okoliczności wykrycia wady",
  );
  const expectedSolution = valueOrPlaceholder(
    input.details.expectedSolution,
    "uzupełnij oczekiwane rozwiązanie",
  );

  const factsParagraphs: string[] = [
    `W dniu ${date} zakupiłem(-am) w firmie ${company} produkt: ${productName} (numer zamówienia: ${order}).`,
    `Opis problemu: ${input.shortProblemDescription.trim()}`,
    `Stwierdzona wada / niezgodność z umową: ${defect}`,
    `Wada ujawniła się: ${whenDefect}.`,
    `Oczekiwany przeze mnie sposób rozpatrzenia reklamacji: ${expectedSolution}.`,
  ];

  return buildLetterSkeleton(input, {
    subjectText: `Reklamacja produktu – ${productName} (zamówienie ${order})`,
    introText:
      "Niniejszym składam reklamację zakupionego produktu z powodu jego niezgodności z umową. Zgłoszenie opieram na przepisach ustawy o prawach konsumenta dotyczących odpowiedzialności sprzedawcy za zgodność towaru z umową.",
    factsParagraphs,
    demandIntro: "W związku z powyższym wnoszę o:",
    demandItems: [
      `rozpatrzenie reklamacji zgodnie z moim żądaniem: ${expectedSolution}`,
      "udzielenie pisemnej odpowiedzi w terminie 14 dni od dnia otrzymania niniejszego pisma",
      "wskazanie sposobu dostarczenia produktu w celu rozpatrzenia reklamacji oraz pokrycie kosztów ewentualnej wysyłki",
    ],
  });
}
