import type { GeneratorInput, LetterSections } from "@/types/case";
import { buildLetterSkeleton } from "../baseTemplate";
import { valueOrPlaceholder } from "../sections";

export function serviceProviderTemplate(input: GeneratorInput): LetterSections {
  const company = input.companyName.trim() || "[Nazwa operatora / usługodawcy]";
  const serviceName = valueOrPlaceholder(
    input.details.serviceName,
    "uzupełnij nazwę usługi",
  );
  const contractDate = valueOrPlaceholder(
    input.details.contractDate || input.purchaseDate,
    "uzupełnij datę zawarcia umowy",
  );
  const problemStart = valueOrPlaceholder(
    input.details.problemStartDate,
    "uzupełnij datę wystąpienia problemu",
  );
  const unexpectedFee = input.details.unexpectedFee?.trim() ?? "";
  const supportResponse = input.details.supportResponse?.trim() ?? "";

  const factsParagraphs: string[] = [
    `Jestem klientem firmy ${company} i korzystam z usługi: ${serviceName} (umowa zawarta w dniu ${contractDate}).`,
    `W dniu ${problemStart} stwierdziłem(-am) następujący problem: ${input.shortProblemDescription.trim()}`,
  ];

  if (unexpectedFee) {
    factsParagraphs.push(
      `W ramach problemu wystąpiła także sporna opłata: ${unexpectedFee}. Nie znajduję dla niej podstawy w warunkach umowy i cenniku, które akceptowałem(-am).`,
    );
  }

  if (supportResponse) {
    factsParagraphs.push(
      `Dotychczasowa reakcja obsługi klienta: ${supportResponse}. Stanowisko to nie rozwiązuje sprawy.`,
    );
  } else {
    factsParagraphs.push(
      "Pomimo prób kontaktu z obsługą klienta nie otrzymałem(-am) konkretnego rozwiązania sprawy.",
    );
  }

  factsParagraphs.push(
    `Moje oczekiwanie wobec firmy: ${input.userGoal.trim()}`,
  );

  return buildLetterSkeleton(input, {
    subjectText: `Reklamacja usługi – ${serviceName}`,
    introText:
      "Niniejszym składam reklamację dotyczącą świadczonej przez Państwa usługi. Wnoszę o pisemne rozpatrzenie sprawy i podjęcie działań naprawczych.",
    factsParagraphs,
    demandIntro: "W związku z powyższym wnoszę o:",
    demandItems: [
      "usunięcie opisanych nieprawidłowości oraz przywrócenie pełnej funkcjonalności usługi",
      unexpectedFee
        ? `korektę faktury / zwrot kwoty ${unexpectedFee} jako pobranej bez podstawy`
        : "korektę faktury, jeżeli w okresie awarii / problemu naliczono nienależne opłaty",
      "udzielenie pisemnej odpowiedzi w terminie 14 dni od dnia otrzymania niniejszego pisma",
      "przyznanie należnej rekompensaty / obniżki za okres, w którym usługa nie była świadczona prawidłowo",
    ],
  });
}
