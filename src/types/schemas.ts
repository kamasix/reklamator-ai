import { z } from "zod";
import {
  CASE_CATEGORIES,
  CASE_STATUSES,
  TONES,
  type CaseCategory,
  type CaseStatus,
  type Tone,
} from "./case";

export const categorySchema = z.enum(
  CASE_CATEGORIES as unknown as [CaseCategory, ...CaseCategory[]],
);

export const statusSchema = z.enum(
  CASE_STATUSES as unknown as [CaseStatus, ...CaseStatus[]],
);

export const toneSchema = z.enum(
  TONES as unknown as [Tone, ...Tone[]],
);

export const stepCategorySchema = z.object({
  category: categorySchema,
});

export const stepBasicInfoSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "Wpisz nazwę firmy lub sklepu (min. 2 znaki)")
    .max(200, "Maksymalnie 200 znaków"),
  purchaseDate: z.string().optional().or(z.literal("")),
  orderNumber: z.string().trim().max(120).optional().or(z.literal("")),
  amount: z.string().trim().max(40).optional().or(z.literal("")),
  contactEmail: z
    .string()
    .trim()
    .email("Nieprawidłowy adres e-mail")
    .max(200)
    .optional()
    .or(z.literal("")),
  userGoal: z
    .string()
    .trim()
    .min(3, "Opisz krótko, czego oczekujesz")
    .max(400, "Maksymalnie 400 znaków"),
  shortProblemDescription: z
    .string()
    .trim()
    .min(10, "Opisz problem (min. 10 znaków)")
    .max(2000, "Maksymalnie 2000 znaków"),
});

export const stepDetailsSchema = z.record(z.string(), z.string().max(2000));

export const evidenceCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Krótki tytuł dowodu (min. 2 znaki)")
    .max(200),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  fileName: z.string().trim().max(200).optional().or(z.literal("")),
  evidenceDate: z.string().optional().or(z.literal("")),
});

export const noteCreateSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Notatka nie może być pusta")
    .max(5000, "Maksymalnie 5000 znaków"),
});

export const checklistItemUpdateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  dueDate: z.string().optional().or(z.literal("")),
  completed: z.boolean().optional(),
});

export const checklistItemCreateSchema = z.object({
  title: z.string().trim().min(1, "Treść zadania").max(200),
  dueDate: z.string().optional().or(z.literal("")),
});

export const evidenceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  fileName: z.string().optional(),
  evidenceDate: z.string().optional(),
  createdAt: z.string(),
});

export const noteSchema = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export const checklistItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  dueDate: z.string().optional(),
  completed: z.boolean(),
  createdAt: z.string(),
});

export const caseSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: categorySchema,
  companyName: z.string(),
  status: statusSchema,
  amount: z.string().optional(),
  purchaseDate: z.string().optional(),
  orderNumber: z.string().optional(),
  contactEmail: z.string().optional(),
  userGoal: z.string(),
  shortProblemDescription: z.string(),
  details: z.record(z.string(), z.string()),
  generatedLetter: z.string(),
  tone: toneSchema,
  evidence: z.array(evidenceSchema),
  notes: z.array(noteSchema),
  checklist: z.array(checklistItemSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const importPayloadSchema = z.object({
  app: z.literal("reklamator-ai"),
  version: z.number().int().min(1),
  exportedAt: z.string(),
  cases: z.array(caseSchema),
});

export type StepBasicInfoValues = z.infer<typeof stepBasicInfoSchema>;
export type EvidenceCreateValues = z.infer<typeof evidenceCreateSchema>;
export type NoteCreateValues = z.infer<typeof noteCreateSchema>;
export type ChecklistItemCreateValues = z.infer<typeof checklistItemCreateSchema>;
export type ImportPayload = z.infer<typeof importPayloadSchema>;
