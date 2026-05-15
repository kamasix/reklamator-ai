import type { LetterSection, LetterSections, Tone } from "@/types/case";

function transformSection(section: LetterSection, tone: Tone): LetterSection {
  switch (section.kind) {
    case "salutation": {
      if (tone === "spokojny") return { ...section, text: "Dzień dobry," };
      if (tone === "stanowczy") return { ...section, text: "Szanowni Państwo," };
      if (tone === "krotki") return { ...section, text: "Szanowni Państwo," };
      return { ...section, text: "Szanowni Państwo," };
    }
    case "intro": {
      if (tone === "stanowczy") {
        return {
          ...section,
          text:
            `W związku z zaistniałą sytuacją zwracam się ze stanowczym wezwaniem do podjęcia działań opisanych poniżej. ` +
            section.text,
        };
      }
      if (tone === "spokojny") {
        return {
          ...section,
          text:
            `Uprzejmie zwracam się z prośbą o rozpatrzenie poniższej sprawy. ` +
            section.text,
        };
      }
      if (tone === "krotki") {
        return { ...section, text: section.text };
      }
      if (tone === "bardzo_dokladny") {
        return {
          ...section,
          text:
            section.text +
            " Poniżej przedstawiam szczegółowy opis zdarzeń wraz z chronologią oraz listę posiadanych dowodów.",
        };
      }
      return section;
    }
    case "demand": {
      if (tone === "stanowczy") {
        return {
          ...section,
          intro:
            "W związku z powyższym wzywam Państwa do niezwłocznego, nie później niż w terminie 14 dni od dnia otrzymania tego pisma, podjęcia następujących działań:",
        };
      }
      if (tone === "spokojny") {
        return {
          ...section,
          intro: "Uprzejmie proszę o rozważenie i rozpatrzenie poniższych żądań:",
        };
      }
      if (tone === "krotki") {
        return {
          ...section,
          intro: "W związku z powyższym proszę o:",
        };
      }
      if (tone === "bardzo_dokladny") {
        return {
          ...section,
          intro:
            "Mając na uwadze opisane okoliczności, na podstawie obowiązujących przepisów prawa konsumenckiego, wnoszę o:",
        };
      }
      return section;
    }
    case "expected_response": {
      if (tone === "stanowczy") {
        return {
          ...section,
          text:
            "Oczekuję pisemnej odpowiedzi w terminie 14 dni od dnia doręczenia niniejszego pisma. Brak reakcji w tym terminie spowoduje konieczność skierowania sprawy na drogę dalszego dochodzenia roszczeń (m.in. Rzecznik Praw Konsumentów, UOKiK, polubowny sąd konsumencki, sąd powszechny).",
        };
      }
      if (tone === "spokojny") {
        return {
          ...section,
          text:
            "Będę wdzięczny za informację o decyzji w tej sprawie w terminie 14 dni od dnia doręczenia tego pisma.",
        };
      }
      if (tone === "krotki") {
        return {
          ...section,
          text: "Proszę o odpowiedź w terminie 14 dni.",
        };
      }
      return section;
    }
    case "closing": {
      if (tone === "spokojny") {
        return { ...section, text: "Z wyrazami szacunku,\n[Imię i nazwisko]" };
      }
      if (tone === "stanowczy") {
        return { ...section, text: "Z poważaniem,\n[Imię i nazwisko]" };
      }
      return section;
    }
    case "facts": {
      if (tone === "krotki") {
        const trimmed = section.paragraphs.slice(0, 2);
        return { ...section, paragraphs: trimmed };
      }
      return section;
    }
    case "evidence_list": {
      if (tone === "krotki" && section.items.length > 3) {
        return {
          ...section,
          items: [
            ...section.items.slice(0, 3),
            `oraz ${section.items.length - 3} dalszych dowodów do okazania na żądanie`,
          ],
        };
      }
      return section;
    }
    default:
      return section;
  }
}

export function applyTone(sections: LetterSections, tone: Tone): LetterSections {
  return sections.map((s) => transformSection(s, tone));
}
