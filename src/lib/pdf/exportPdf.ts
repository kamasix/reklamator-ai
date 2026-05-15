import type { Case } from "@/types/case";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/types/case";
import { formatDateTime, formatHumanDate } from "@/lib/utils/date";

const PDF_STYLES = `
  .pdf-page {
    font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
    color: #111827;
    background-color: #ffffff;
    padding: 28mm 22mm 24mm 22mm;
    width: 210mm;
    box-sizing: border-box;
    line-height: 1.55;
    font-size: 11.5pt;
  }
  .pdf-meta {
    font-family: ui-sans-serif, system-ui, sans-serif;
    font-size: 9pt;
    color: #6b7280;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 6mm;
    margin-bottom: 8mm;
  }
  .pdf-meta strong { color: #111827; }
  .pdf-meta-row { display: flex; gap: 12mm; flex-wrap: wrap; }
  .pdf-meta-row > div { min-width: 50mm; }
  .pdf-letter {
    white-space: pre-wrap;
    word-wrap: break-word;
    page-break-inside: auto;
  }
  .pdf-letter p { margin: 0 0 4mm 0; page-break-inside: avoid; }
  .pdf-footer {
    margin-top: 14mm;
    font-family: ui-sans-serif, system-ui, sans-serif;
    font-size: 8.5pt;
    color: #6b7280;
    border-top: 1px solid #e5e7eb;
    padding-top: 6mm;
  }
`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildPdfHtml(caseItem: Case, letterText: string): HTMLElement {
  const container = document.createElement("div");
  container.className = "pdf-page";
  container.innerHTML = `
    <style>${PDF_STYLES}</style>
    <div class="pdf-meta">
      <div class="pdf-meta-row">
        <div><strong>Sprawa:</strong> ${escapeHtml(caseItem.title)}</div>
        <div><strong>Kategoria:</strong> ${escapeHtml(CATEGORY_LABELS[caseItem.category])}</div>
      </div>
      <div class="pdf-meta-row" style="margin-top:2mm;">
        <div><strong>Firma:</strong> ${escapeHtml(caseItem.companyName || "—")}</div>
        <div><strong>Status:</strong> ${escapeHtml(STATUS_LABELS[caseItem.status])}</div>
      </div>
      <div class="pdf-meta-row" style="margin-top:2mm;">
        <div><strong>Utworzono:</strong> ${escapeHtml(formatHumanDate(caseItem.createdAt))}</div>
        <div><strong>Wyeksportowano:</strong> ${escapeHtml(formatDateTime(new Date().toISOString()))}</div>
      </div>
    </div>
    <div class="pdf-letter">${escapeHtml(letterText)}</div>
    <div class="pdf-footer">
      Wygenerowano w Reklamator AI. Sprawdź poprawność danych przed wysłaniem. Aplikacja nie zastępuje porady prawnika.
    </div>
  `;
  return container;
}

export async function exportCaseLetterAsPdf(
  caseItem: Case,
  letterText: string,
): Promise<void> {
  const element = buildPdfHtml(caseItem, letterText);
  element.style.position = "fixed";
  element.style.left = "-10000px";
  element.style.top = "0";
  document.body.appendChild(element);

  try {
    const { default: html2pdf } = await import("html2pdf.js");
    const slug = caseItem.title
      .toLowerCase()
      .replace(/[ąàáâ]/g, "a")
      .replace(/[ćč]/g, "c")
      .replace(/[ęèé]/g, "e")
      .replace(/[ł]/g, "l")
      .replace(/[ńñ]/g, "n")
      .replace(/[óòô]/g, "o")
      .replace(/[śš]/g, "s")
      .replace(/[źż]/g, "z")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "reklamacja";
    const filename = `reklamacja-${slug}.pdf`;

    await html2pdf()
      .from(element)
      .set({
        margin: 0,
        filename,
        image: { type: "jpeg", quality: 0.96 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      })
      .save();
  } finally {
    document.body.removeChild(element);
  }
}
