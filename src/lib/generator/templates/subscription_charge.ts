import type { GeneratorInput, LetterSections } from "@/types/case";
import { buildLetterSkeleton } from "../baseTemplate";
import { valueOrPlaceholder } from "../sections";

export function subscriptionChargeTemplate(input: GeneratorInput): LetterSections {
  const company = input.companyName.trim() || "[Nazwa firmy]";
  const subName = valueOrPlaceholder(
    input.details.subscriptionName,
    "uzupełnij nazwę usługi / subskrypcji",
  );
  const chargeDate = valueOrPlaceholder(
    input.details.chargeDate,
    "uzupełnij datę pobrania opłaty",
  );
  const chargeAmount = valueOrPlaceholder(
    input.details.chargeAmount || input.amount,
    "uzupełnij kwotę opłaty",
  );
  const consent = (input.details.didUserConsent || "").trim().toLowerCase();
  const cancellation = input.details.cancellationAttemptDate?.trim() ?? "";

  const factsParagraphs: string[] = [
    `Stwierdziłem(-am), że w dniu ${chargeDate} firma ${company} pobrała ze środków na moim rachunku / karcie kwotę ${chargeAmount} z tytułu usługi: ${subName}.`,
    `Opis problemu: ${input.shortProblemDescription.trim()}`,
  ];

  if (consent.startsWith("n") || consent === "no") {
    factsParagraphs.push(
      "Oświadczam, że nie wyraziłem(-am) zgody na pobranie tej opłaty. Nie zawierałem(-am) umowy uprawniającej firmę do takiego obciążenia ani nie przedłużałem(-am) świadomie żadnej subskrypcji w tym zakresie.",
    );
  } else if (consent.startsWith("t") || consent === "yes") {
    factsParagraphs.push(
      "Wprawdzie w przeszłości korzystałem(-am) z tej usługi, jednak w aktualnych okolicznościach pobranie opłaty uważam za nieuzasadnione i sprzeczne z moim zamiarem dalszego korzystania z subskrypcji.",
    );
  } else {
    factsParagraphs.push(
      "Mam wątpliwości co do podstawy prawnej i faktycznej tej opłaty oraz proszę o jej szczegółowe wyjaśnienie.",
    );
  }

  if (cancellation) {
    factsParagraphs.push(
      `Próbowałem(-am) anulować subskrypcję / wycofać zgodę w dniu ${cancellation}. Pomimo tego opłata została pobrana.`,
    );
  }

  factsParagraphs.push(
    `Moje oczekiwanie wobec firmy: ${input.userGoal.trim()}`,
  );

  return buildLetterSkeleton(input, {
    subjectText: `Reklamacja nieautoryzowanej opłaty – ${subName}`,
    introText:
      "Niniejszym składam reklamację dotyczącą pobrania przez Państwa firmę opłaty, której nie autoryzowałem(-am) lub której podstawa jest dla mnie niejasna. Wnoszę o wyjaśnienie sprawy oraz zwrot środków.",
    factsParagraphs,
    demandIntro: "W związku z powyższym wnoszę o:",
    demandItems: [
      `zwrot pobranej kwoty ${chargeAmount} na rachunek, z którego dokonano płatności, w terminie 14 dni od dnia otrzymania pisma`,
      "natychmiastowe zaprzestanie pobierania kolejnych opłat z tytułu wskazanej usługi",
      "wskazanie konkretnej podstawy prawnej i faktycznej (np. zaakceptowanego regulaminu, daty zawarcia umowy) ewentualnego obciążenia",
      "potwierdzenie usunięcia danych płatniczych z systemu, jeżeli ich przechowywanie nie jest dłużej konieczne",
    ],
  });
}
