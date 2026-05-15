import type { LetterSection, LetterSections } from "@/types/case";

function renderOne(section: LetterSection): string {
  switch (section.kind) {
    case "header": {
      return [
        section.senderPlaceholder,
        "",
        section.date,
        "",
        section.recipient,
      ].join("\n");
    }
    case "subject":
      return `Dotyczy: ${section.text}`;
    case "salutation":
      return section.text;
    case "intro":
      return section.text;
    case "facts":
      return section.paragraphs.join("\n\n");
    case "demand": {
      const items = section.items.map((it) => `– ${it}`).join("\n");
      return [section.intro, items].filter(Boolean).join("\n\n");
    }
    case "evidence_list": {
      if (section.items.length === 0) return section.intro;
      const items = section.items.map((it) => `– ${it}`).join("\n");
      return [section.intro, items].join("\n\n");
    }
    case "expected_response":
      return section.text;
    case "closing":
      return section.text;
    case "disclaimer":
      return section.text;
  }
}

export function renderSections(sections: LetterSections): string {
  return sections.map(renderOne).join("\n\n");
}
