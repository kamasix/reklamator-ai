import type { GeneratorInput, LetterSections } from "@/types/case";
import { buildLetterSkeleton } from "../baseTemplate";
import { valueOrPlaceholder } from "../sections";

export function warrantyTemplate(input: GeneratorInput): LetterSections {
  const date = valueOrPlaceholder(input.purchaseDate, "uzupełnij datę zakupu");
  const order = valueOrPlaceholder(input.orderNumber, "uzupełnij numer zamówienia / dowodu zakupu");
  const company = input.companyName.trim() || "[Nazwa firmy]";
  const productName = valueOrPlaceholder(input.details.productName, "uzupełnij nazwę produktu");
  const defect = valueOrPlaceholder(input.details.defectDescription, "uzupełnij opis wady");
  const basis = (input.details.warrantyOrStatutoryChoice || "rekojmia").toLowerCase();
  const serviceResponse = input.details.serviceResponse?.trim() ?? "";
  const expectedSolution = valueOrPlaceholder(
    input.details.expectedSolution,
    "uzupełnij oczekiwane rozwiązanie",
  );

  const basisDescription =
    basis.startsWith("gwa")
      ? "z tytułu gwarancji udzielonej przy zakupie"
      : "z tytułu rękojmi za wady (art. 556 i nast. Kodeksu cywilnego oraz odpowiednie przepisy ustawy o prawach konsumenta)";

  const factsParagraphs: string[] = [
    `W dniu ${date} w firmie ${company} nabyłem(-am) produkt: ${productName} (potwierdzenie zakupu: ${order}).`,
    `Opis problemu: ${input.shortProblemDescription.trim()}`,
    `Stwierdzona wada: ${defect}.`,
    `Niniejsze pismo składam ${basisDescription}.`,
  ];

  if (serviceResponse) {
    factsParagraphs.push(
      `Dotychczasowe stanowisko sprzedawcy / serwisu: ${serviceResponse}. Nie zgadzam się z tym stanowiskiem i wnoszę o jego ponowne rozpatrzenie.`,
    );
  }

  factsParagraphs.push(
    `Oczekiwany sposób rozpatrzenia zgłoszenia: ${expectedSolution}.`,
  );

  return buildLetterSkeleton(input, {
    subjectText: `Reklamacja ${basis.startsWith("gwa") ? "z tytułu gwarancji" : "z tytułu rękojmi"} – ${productName}`,
    introText:
      "Niniejszym składam reklamację towaru. Wnoszę o jej rozpatrzenie w terminie ustawowym, a w przypadku odmowy – o szczegółowe uzasadnienie podstaw decyzji.",
    factsParagraphs,
    demandIntro: "Wnoszę o:",
    demandItems: [
      `rozpatrzenie zgłoszenia zgodnie z moim żądaniem: ${expectedSolution}`,
      "udzielenie pisemnej odpowiedzi w terminie 14 dni; brak odpowiedzi w tym terminie potraktuję jako uznanie reklamacji",
      "pokrycie kosztów ewentualnej wysyłki produktu w ramach rozpatrywania reklamacji",
    ],
  });
}
