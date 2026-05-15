import type { Case } from "@/types/case";
import { importPayloadSchema, type ImportPayload } from "@/types/schemas";
import { caseRepository } from "@/lib/storage/caseRepository";
import { nowIso } from "@/lib/utils/date";

export const EXPORT_VERSION = 1;

export type ExportPayload = {
  app: "reklamator-ai";
  version: number;
  exportedAt: string;
  cases: Case[];
};

export async function buildExportPayload(): Promise<ExportPayload> {
  const cases = await caseRepository.exportCases();
  return {
    app: "reklamator-ai",
    version: EXPORT_VERSION,
    exportedAt: nowIso(),
    cases,
  };
}

export async function exportToJsonString(): Promise<string> {
  const payload = await buildExportPayload();
  return JSON.stringify(payload, null, 2);
}

export async function downloadExportFile(): Promise<void> {
  const json = await exportToJsonString();
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  a.href = url;
  a.download = `reklamator-ai-backup-${ts}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export type ImportResult =
  | { ok: true; data: ImportPayload }
  | { ok: false; error: string };

export function parseImportPayload(raw: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: "Plik nie jest prawidłowym JSON-em." };
  }
  const result = importPayloadSchema.safeParse(parsed);
  if (!result.success) {
    return {
      ok: false,
      error:
        "Plik nie wygląda na poprawny backup Reklamator AI lub jego format nie jest obsługiwany.",
    };
  }
  return { ok: true, data: result.data };
}

export async function importReplace(payload: ImportPayload): Promise<number> {
  await caseRepository.replaceAll(payload.cases);
  return payload.cases.length;
}

export async function importMerge(payload: ImportPayload): Promise<number> {
  const existing = await caseRepository.exportCases();
  const byId = new Map(existing.map((c) => [c.id, c]));
  for (const incoming of payload.cases) {
    byId.set(incoming.id, incoming);
  }
  const merged = Array.from(byId.values());
  await caseRepository.replaceAll(merged);
  return payload.cases.length;
}
