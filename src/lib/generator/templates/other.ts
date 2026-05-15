import type { GeneratorInput, LetterSections } from "@/types/case";
import { buildLetterSkeleton } from "../baseTemplate";
import { valueOrPlaceholder } from "../sections";

export function otherTemplate(input: GeneratorInput): LetterSections {
  const company = input.companyName.trim() || "[Nazwa firmy]";
  const date = valueOrPlaceholder(input.purchaseDate, "uzupełnij datę zdarzenia / zakupu");
  const order = input.orderNumber?.trim() ?? "";
  const amount = input.amount?.trim() ?? "";

  const factsParagraphs: string[] = [
    `Sprawa dotyczy mojej relacji z firmą ${company}${date ? ` w związku ze zdarzeniem z dnia ${date}` : ""}.`,
    `Opis sprawy: ${input.shortProblemDescription.trim()}`,
  ];

  if (order) {
    factsParagraphs.push(`Numer referencyjny / zamówienia: ${order}.`);
  }
  if (amount) {
    factsParagraphs.push(`Kwota związana ze sprawą: ${amount}.`);
  }

  const extra = input.details.additionalContext?.trim();
  if (extra) {
    factsParagraphs.push(`Dodatkowy kontekst: ${extra}`);
  }

  factsParagraphs.push(
    `Moje oczekiwanie wobec firmy: ${input.userGoal.trim()}`,
  );

  return buildLetterSkeleton(input, {
    subjectText: "Reklamacja / pismo wyjaśniające",
    introText:
      "Niniejszym zwracam się do Państwa z prośbą o rozpatrzenie opisanej poniżej sprawy i zajęcie pisemnego stanowiska.",
    factsParagraphs,
    demandIntro: "W związku z powyższym wnoszę o:",
    demandItems: [
      `podjęcie działań prowadzących do rozwiązania sprawy zgodnie z moim oczekiwaniem: ${input.userGoal.trim()}`,
      "udzielenie pisemnej odpowiedzi w terminie 14 dni od dnia otrzymania niniejszego pisma",
      "wskazanie dalszych kroków, jeżeli rozwiązanie sprawy wymaga dodatkowych informacji",
    ],
  });
}
