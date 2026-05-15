import type { Evidence, LetterSection } from "@/types/case";
import { formatHumanDate } from "@/lib/utils/date";

export function placeholder(label: string): string {
  return `[${label}]`;
}

export function valueOrPlaceholder(value: string | undefined, label: string): string {
  if (!value || !value.trim()) return placeholder(label);
  return value.trim();
}

export function header(args: {
  recipient: string;
  date?: string;
}): LetterSection {
  const today = new Date();
  const dateString = args.date && args.date.trim()
    ? formatHumanDate(args.date)
    : formatHumanDate(today.toISOString());
  return {
    kind: "header",
    senderPlaceholder: "[Imię i nazwisko]\n[Adres korespondencyjny]\n[E-mail / telefon]",
    recipient: args.recipient,
    date: dateString,
  };
}

export function subject(text: string): LetterSection {
  return { kind: "subject", text };
}

export function salutation(text: string): LetterSection {
  return { kind: "salutation", text };
}

export function intro(text: string): LetterSection {
  return { kind: "intro", text };
}

export function facts(paragraphs: string[]): LetterSection {
  return { kind: "facts", paragraphs: paragraphs.filter((p) => p.trim().length > 0) };
}

export function demand(intro: string, items: string[]): LetterSection {
  return { kind: "demand", intro, items: items.filter((i) => i.trim().length > 0) };
}

export function evidenceList(items: Evidence[]): LetterSection {
  const formatted = items.map((e) => {
    const parts = [e.title.trim()];
    if (e.fileName && e.fileName.trim()) parts.push(`plik: ${e.fileName.trim()}`);
    if (e.evidenceDate && e.evidenceDate.trim())
      parts.push(`data: ${formatHumanDate(e.evidenceDate)}`);
    if (e.description && e.description.trim())
      parts.push(`opis: ${e.description.trim()}`);
    return parts.join(" — ");
  });
  return {
    kind: "evidence_list",
    intro:
      formatted.length > 0
        ? "Do pisma załączam (lub jestem w stanie udostępnić) następujące dowody:"
        : "Jestem w stanie udostępnić dowody potwierdzające opisane okoliczności (np. potwierdzenie zakupu, korespondencję e-mail, zrzuty ekranu).",
    items: formatted,
  };
}

export function expectedResponse(
  text = "Proszę o pisemną odpowiedź na powyższe żądanie w terminie 14 dni od dnia otrzymania niniejszego pisma, na podany powyżej adres e-mail lub korespondencyjny. Brak odpowiedzi w tym terminie potraktuję jako uznanie reklamacji.",
): LetterSection {
  return { kind: "expected_response", text };
}

export function closing(text = "Z poważaniem,\n[Imię i nazwisko]"): LetterSection {
  return { kind: "closing", text };
}

export function disclaimer(): LetterSection {
  return {
    kind: "disclaimer",
    text:
      "— — — — —\nPismo zostało przygotowane w aplikacji Reklamator AI. Sprawdź poprawność danych przed wysłaniem. Aplikacja nie zastępuje porady prawnika.",
  };
}

export function recipientBlock(companyName: string): string {
  const name = companyName.trim() || placeholder("Nazwa firmy / sklepu");
  return `${name}\n[Adres siedziby]\n[E-mail lub adres do reklamacji]`;
}
