import type { GeneratorInput, LetterSections } from "@/types/case";
import { buildLetterSkeleton } from "../baseTemplate";
import { valueOrPlaceholder } from "../sections";

export function repairServiceTemplate(input: GeneratorInput): LetterSections {
  const company = input.companyName.trim() || "[Nazwa serwisu]";
  const date = valueOrPlaceholder(input.purchaseDate, "uzupełnij datę zlecenia naprawy");
  const order = valueOrPlaceholder(input.orderNumber, "uzupełnij numer zlecenia / RMA");
  const productName = valueOrPlaceholder(
    input.details.productName,
    "uzupełnij nazwę / model urządzenia",
  );
  const defect = valueOrPlaceholder(
    input.details.defectDescription,
    "uzupełnij opis zgłoszonego problemu",
  );
  const serviceResponse = input.details.serviceResponse?.trim() ?? "";
  const expectedSolution = valueOrPlaceholder(
    input.details.expectedSolution,
    "uzupełnij oczekiwane rozwiązanie",
  );

  const factsParagraphs: string[] = [
    `W dniu ${date} zleciłem(-am) serwisowi ${company} naprawę / obsługę urządzenia: ${productName} (numer zlecenia: ${order}).`,
    `Zgłoszony pierwotnie problem: ${defect}.`,
    `Opis aktualnej sytuacji: ${input.shortProblemDescription.trim()}`,
  ];

  if (serviceResponse) {
    factsParagraphs.push(
      `Dotychczasowa reakcja serwisu: ${serviceResponse}. Reakcja ta nie odpowiada oczekiwanej jakości usługi serwisowej.`,
    );
  } else {
    factsParagraphs.push(
      "Pomimo zgłoszeń serwis nie zaproponował konkretnego rozwiązania problemu.",
    );
  }

  factsParagraphs.push(
    `Oczekiwane rozwiązanie: ${expectedSolution}.`,
  );

  return buildLetterSkeleton(input, {
    subjectText: `Reklamacja usługi serwisowej – ${productName} (zlecenie ${order})`,
    introText:
      "Niniejszym składam reklamację dotyczącą wykonanej (lub niewykonanej) usługi serwisowej. Wnoszę o pisemne rozpatrzenie sprawy i podjęcie działań naprawczych w opisanym zakresie.",
    factsParagraphs,
    demandIntro: "Wnoszę o:",
    demandItems: [
      `rozpatrzenie reklamacji zgodnie z moim żądaniem: ${expectedSolution}`,
      "ponowne, prawidłowe wykonanie usługi serwisowej lub naprawienie skutków jej wadliwego wykonania na koszt serwisu",
      "udzielenie pisemnej odpowiedzi w terminie 14 dni od dnia otrzymania pisma",
      "informację o sposobie odbioru / dostawy urządzenia po rozpatrzeniu reklamacji",
    ],
  });
}
