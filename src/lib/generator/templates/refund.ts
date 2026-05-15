import type { GeneratorInput, LetterSections } from "@/types/case";
import { buildLetterSkeleton } from "../baseTemplate";
import { valueOrPlaceholder } from "../sections";

export function refundTemplate(input: GeneratorInput): LetterSections {
  const date = valueOrPlaceholder(input.purchaseDate, "uzupełnij datę zakupu");
  const order = valueOrPlaceholder(input.orderNumber, "uzupełnij numer zamówienia");
  const amount = valueOrPlaceholder(input.amount, "uzupełnij kwotę");
  const company = input.companyName.trim() || "[Nazwa firmy]";

  const factsParagraphs: string[] = [
    `W dniu ${date} dokonałem(-am) zakupu w firmie ${company} (numer zamówienia: ${order}). Łączna kwota transakcji wyniosła ${amount}.`,
    `Krótki opis sprawy: ${input.shortProblemDescription.trim()}`,
  ];

  if (input.details.refundReason && input.details.refundReason.trim()) {
    factsParagraphs.push(
      `Powód, dla którego wnoszę o zwrot pieniędzy: ${input.details.refundReason.trim()}`,
    );
  }
  if (input.details.previousContact && input.details.previousContact.trim()) {
    factsParagraphs.push(
      `Dotychczasowy kontakt ze sprzedawcą: ${input.details.previousContact.trim()}`,
    );
  }

  factsParagraphs.push(
    `Moje oczekiwanie wobec firmy: ${input.userGoal.trim()}`,
  );

  return buildLetterSkeleton(input, {
    subjectText: `Żądanie zwrotu pieniędzy – zamówienie ${order}`,
    introText:
      "Niniejszym wnoszę o zwrot uiszczonej przeze mnie kwoty w związku z transakcją opisaną poniżej. Podstawą żądania są obowiązujące przepisy o ochronie konsumentów oraz uzgodnienia poczynione przy zakupie.",
    factsParagraphs,
    demandIntro:
      "W związku z powyższym wnoszę o:",
    demandItems: [
      `zwrot pełnej kwoty ${amount} w terminie 14 dni od dnia otrzymania niniejszego pisma`,
      "zwrot środków na rachunek bankowy, z którego dokonano płatności (lub na inny wskazany przeze mnie sposób, jeżeli płatność była dokonana inną metodą)",
      "potwierdzenie przyjęcia reklamacji oraz informację o sposobie jej rozpatrzenia",
    ],
  });
}
