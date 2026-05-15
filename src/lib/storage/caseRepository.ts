import type {
  Case,
  ChecklistItem,
  Evidence,
  Note,
} from "@/types/case";
import { caseSchema } from "@/types/schemas";
import { newId } from "@/lib/utils/id";
import { nowIso } from "@/lib/utils/date";
import { ensureStorageReady, getStore } from "./storageDriver";

const CASES_KEY = "cases";

async function readAll(): Promise<Case[]> {
  await ensureStorageReady();
  const raw = await getStore().getItem<unknown>(CASES_KEY);
  if (!raw || !Array.isArray(raw)) return [];
  const parsed: Case[] = [];
  for (const item of raw) {
    const result = caseSchema.safeParse(item);
    if (result.success) parsed.push(result.data);
  }
  return parsed;
}

async function writeAll(cases: Case[]): Promise<void> {
  await ensureStorageReady();
  await getStore().setItem(CASES_KEY, cases);
}

function sortByUpdatedDesc(cases: Case[]): Case[] {
  return [...cases].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
}

export const caseRepository = {
  async getCases(): Promise<Case[]> {
    const cases = await readAll();
    return sortByUpdatedDesc(cases);
  },

  async getCase(id: string): Promise<Case | undefined> {
    const cases = await readAll();
    return cases.find((c) => c.id === id);
  },

  async createCase(
    data: Omit<Case, "id" | "createdAt" | "updatedAt">,
  ): Promise<Case> {
    const cases = await readAll();
    const now = nowIso();
    const created: Case = {
      ...data,
      id: newId(),
      createdAt: now,
      updatedAt: now,
    };
    cases.push(created);
    await writeAll(cases);
    return created;
  },

  async updateCase(
    id: string,
    data: Partial<Omit<Case, "id" | "createdAt">>,
  ): Promise<Case | undefined> {
    const cases = await readAll();
    const idx = cases.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    const next: Case = {
      ...cases[idx],
      ...data,
      updatedAt: nowIso(),
    };
    cases[idx] = next;
    await writeAll(cases);
    return next;
  },

  async deleteCase(id: string): Promise<void> {
    const cases = await readAll();
    const filtered = cases.filter((c) => c.id !== id);
    await writeAll(filtered);
  },

  async addEvidence(
    caseId: string,
    data: Omit<Evidence, "id" | "createdAt">,
  ): Promise<Case | undefined> {
    const cases = await readAll();
    const idx = cases.findIndex((c) => c.id === caseId);
    if (idx === -1) return undefined;
    const evidence: Evidence = {
      ...data,
      id: newId(),
      createdAt: nowIso(),
    };
    cases[idx] = {
      ...cases[idx],
      evidence: [...cases[idx].evidence, evidence],
      updatedAt: nowIso(),
    };
    await writeAll(cases);
    return cases[idx];
  },

  async updateEvidence(
    caseId: string,
    evidenceId: string,
    data: Partial<Omit<Evidence, "id" | "createdAt">>,
  ): Promise<Case | undefined> {
    const cases = await readAll();
    const idx = cases.findIndex((c) => c.id === caseId);
    if (idx === -1) return undefined;
    cases[idx] = {
      ...cases[idx],
      evidence: cases[idx].evidence.map((e) =>
        e.id === evidenceId ? { ...e, ...data } : e,
      ),
      updatedAt: nowIso(),
    };
    await writeAll(cases);
    return cases[idx];
  },

  async deleteEvidence(
    caseId: string,
    evidenceId: string,
  ): Promise<Case | undefined> {
    const cases = await readAll();
    const idx = cases.findIndex((c) => c.id === caseId);
    if (idx === -1) return undefined;
    cases[idx] = {
      ...cases[idx],
      evidence: cases[idx].evidence.filter((e) => e.id !== evidenceId),
      updatedAt: nowIso(),
    };
    await writeAll(cases);
    return cases[idx];
  },

  async addNote(
    caseId: string,
    data: Omit<Note, "id" | "createdAt" | "updatedAt">,
  ): Promise<Case | undefined> {
    const cases = await readAll();
    const idx = cases.findIndex((c) => c.id === caseId);
    if (idx === -1) return undefined;
    const note: Note = {
      ...data,
      id: newId(),
      createdAt: nowIso(),
    };
    cases[idx] = {
      ...cases[idx],
      notes: [...cases[idx].notes, note],
      updatedAt: nowIso(),
    };
    await writeAll(cases);
    return cases[idx];
  },

  async updateNote(
    caseId: string,
    noteId: string,
    data: Partial<Omit<Note, "id" | "createdAt">>,
  ): Promise<Case | undefined> {
    const cases = await readAll();
    const idx = cases.findIndex((c) => c.id === caseId);
    if (idx === -1) return undefined;
    cases[idx] = {
      ...cases[idx],
      notes: cases[idx].notes.map((n) =>
        n.id === noteId ? { ...n, ...data, updatedAt: nowIso() } : n,
      ),
      updatedAt: nowIso(),
    };
    await writeAll(cases);
    return cases[idx];
  },

  async deleteNote(
    caseId: string,
    noteId: string,
  ): Promise<Case | undefined> {
    const cases = await readAll();
    const idx = cases.findIndex((c) => c.id === caseId);
    if (idx === -1) return undefined;
    cases[idx] = {
      ...cases[idx],
      notes: cases[idx].notes.filter((n) => n.id !== noteId),
      updatedAt: nowIso(),
    };
    await writeAll(cases);
    return cases[idx];
  },

  async addChecklistItem(
    caseId: string,
    data: Omit<ChecklistItem, "id" | "createdAt" | "completed">,
  ): Promise<Case | undefined> {
    const cases = await readAll();
    const idx = cases.findIndex((c) => c.id === caseId);
    if (idx === -1) return undefined;
    const item: ChecklistItem = {
      ...data,
      id: newId(),
      completed: false,
      createdAt: nowIso(),
    };
    cases[idx] = {
      ...cases[idx],
      checklist: [...cases[idx].checklist, item],
      updatedAt: nowIso(),
    };
    await writeAll(cases);
    return cases[idx];
  },

  async updateChecklistItem(
    caseId: string,
    itemId: string,
    data: Partial<Omit<ChecklistItem, "id" | "createdAt">>,
  ): Promise<Case | undefined> {
    const cases = await readAll();
    const idx = cases.findIndex((c) => c.id === caseId);
    if (idx === -1) return undefined;
    cases[idx] = {
      ...cases[idx],
      checklist: cases[idx].checklist.map((it) =>
        it.id === itemId ? { ...it, ...data } : it,
      ),
      updatedAt: nowIso(),
    };
    await writeAll(cases);
    return cases[idx];
  },

  async deleteChecklistItem(
    caseId: string,
    itemId: string,
  ): Promise<Case | undefined> {
    const cases = await readAll();
    const idx = cases.findIndex((c) => c.id === caseId);
    if (idx === -1) return undefined;
    cases[idx] = {
      ...cases[idx],
      checklist: cases[idx].checklist.filter((it) => it.id !== itemId),
      updatedAt: nowIso(),
    };
    await writeAll(cases);
    return cases[idx];
  },

  async exportCases(): Promise<Case[]> {
    return readAll();
  },

  async replaceAll(cases: Case[]): Promise<void> {
    await writeAll(cases);
  },

  async clearAllCases(): Promise<void> {
    await writeAll([]);
  },
};
