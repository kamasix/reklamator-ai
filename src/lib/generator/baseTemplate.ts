import type { GeneratorInput, LetterSections } from "@/types/case";
import {
  closing,
  disclaimer,
  evidenceList,
  expectedResponse,
  facts,
  header,
  intro,
  recipientBlock,
  salutation,
  subject,
} from "./sections";

export type TemplateBody = {
  subjectText: string;
  introText: string;
  factsParagraphs: string[];
  demandIntro: string;
  demandItems: string[];
};

export function buildLetterSkeleton(
  input: GeneratorInput,
  body: TemplateBody,
): LetterSections {
  return [
    header({
      recipient: recipientBlock(input.companyName),
      date: undefined,
    }),
    subject(body.subjectText),
    salutation("Szanowni Państwo,"),
    intro(body.introText),
    facts(body.factsParagraphs),
    {
      kind: "demand",
      intro: body.demandIntro,
      items: body.demandItems,
    },
    evidenceList(input.evidence),
    expectedResponse(),
    closing(),
    disclaimer(),
  ];
}
