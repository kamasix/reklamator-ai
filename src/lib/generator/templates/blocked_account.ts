import type { GeneratorInput, LetterSections } from "@/types/case";
import { buildLetterSkeleton } from "../baseTemplate";
import { valueOrPlaceholder } from "../sections";

export function blockedAccountTemplate(input: GeneratorInput): LetterSections {
  const company = input.companyName.trim() || "[Nazwa platformy]";
  const platform = valueOrPlaceholder(
    input.details.platformName || input.companyName,
    "uzupełnij nazwę platformy",
  );
  const handle = valueOrPlaceholder(
    input.details.accountHandle,
    "uzupełnij login / nazwę konta / adres e-mail",
  );
  const blockDate = valueOrPlaceholder(
    input.details.blockDate,
    "uzupełnij datę blokady",
  );
  const reason = input.details.reasonGiven?.trim() ?? "";
  const impact = input.details.businessImpact?.trim() ?? "";

  const factsParagraphs: string[] = [
    `Jestem użytkownikiem platformy ${platform} prowadzonej przez ${company}. Identyfikator mojego konta: ${handle}.`,
    `W dniu ${blockDate} dostęp do mojego konta został zablokowany.`,
    `Opis problemu: ${input.shortProblemDescription.trim()}`,
  ];

  if (reason) {
    factsParagraphs.push(
      `Otrzymany ode mnie komunikat / uzasadnienie blokady: ${reason}. Nie zgadzam się z tą decyzją – w mojej ocenie podane uzasadnienie jest niewystarczające lub nieadekwatne do mojej sytuacji.`,
    );
  } else {
    factsParagraphs.push(
      "Nie otrzymałem(-am) konkretnego uzasadnienia decyzji o blokadzie konta. Z dotychczasowej komunikacji nie wynika, jakie regulaminowe podstawy zostały zastosowane.",
    );
  }

  if (impact) {
    factsParagraphs.push(
      `Brak dostępu do konta powoduje konkretne skutki: ${impact}. W związku z tym sprawa wymaga pilnego rozpatrzenia.`,
    );
  }

  factsParagraphs.push(
    `Moje oczekiwanie wobec firmy: ${input.userGoal.trim()}`,
  );

  return buildLetterSkeleton(input, {
    subjectText: `Odwołanie od decyzji o zablokowaniu konta – ${handle}`,
    introText:
      "Niniejszym wnoszę odwołanie od decyzji o zablokowaniu mojego konta na Państwa platformie. Proszę o ponowną weryfikację sprawy i udzielenie pisemnej odpowiedzi.",
    factsParagraphs,
    demandIntro: "W związku z powyższym wnoszę o:",
    demandItems: [
      "ponowną weryfikację sprawy i odblokowanie konta lub jednoznaczne wskazanie konkretnej podstawy regulaminowej blokady",
      "udostępnienie procedury odwoławczej oraz informacji o dalszych krokach, jeżeli odblokowanie nie jest możliwe",
      "udostępnienie kopii moich danych i treści zapisanych na koncie (np. wiadomości, zamówień, historii), o ile dostęp do nich nie zostanie przywrócony",
      "udzielenie pisemnej odpowiedzi w terminie 14 dni od dnia otrzymania pisma",
    ],
  });
}
