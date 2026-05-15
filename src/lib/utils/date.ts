import { format, parseISO } from "date-fns";
import { pl } from "date-fns/locale";

export function nowIso(): string {
  return new Date().toISOString();
}

export function formatHumanDate(value?: string): string {
  if (!value) return "";
  try {
    const date = value.includes("T") ? parseISO(value) : parseISO(`${value}T00:00:00`);
    return format(date, "d MMMM yyyy", { locale: pl });
  } catch {
    return value;
  }
}

export function formatShortDate(value?: string): string {
  if (!value) return "";
  try {
    const date = value.includes("T") ? parseISO(value) : parseISO(`${value}T00:00:00`);
    return format(date, "dd.MM.yyyy", { locale: pl });
  } catch {
    return value;
  }
}

export function formatDateTime(value?: string): string {
  if (!value) return "";
  try {
    const date = parseISO(value);
    return format(date, "d MMMM yyyy, HH:mm", { locale: pl });
  } catch {
    return value;
  }
}

export function todayDateInputValue(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
