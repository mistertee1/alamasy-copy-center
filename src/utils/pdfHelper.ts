/**
 * Helper utilities for client-side PDF file analysis, page count extraction, and range calculations.
 */

export interface PdfPageCountResult {
  pageCount: number;
  isExact: boolean;
}

/**
 * Parses an ArrayBuffer of a PDF to accurately detect the number of pages.
 */
export async function extractPdfPageCount(file: File): Promise<PdfPageCountResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const text = new TextDecoder('latin1').decode(bytes);

    // Method 1: Count occurrences of "/Type /Page" or "/Type/Page" (excluding "/Pages")
    // Match /Type\s*\/Page(?![s\w])
    const pageMatches = text.match(/\/Type\s*\/Page(?![s\w])/g);
    if (pageMatches && pageMatches.length > 0) {
      return { pageCount: pageMatches.length, isExact: true };
    }

    // Method 2: Match /Count in the Catalog or Page Tree: /Count\s+(\d+)
    const countMatches = [...text.matchAll(/\/Count\s+(\d+)/g)];
    if (countMatches.length > 0) {
      const counts = countMatches
        .map((m) => parseInt(m[1], 10))
        .filter((n) => !isNaN(n) && n > 0);
      if (counts.length > 0) {
        // Typically the root Pages node has the total count
        return { pageCount: Math.max(...counts), isExact: true };
      }
    }
  } catch (err) {
    console.warn('Unable to parse PDF page count:', err);
  }

  // Fallback heuristic estimation (roughly 120KB per page in mixed PDFs)
  const estimated = Math.max(1, Math.round(file.size / (120 * 1024)));
  return { pageCount: estimated, isExact: false };
}

/**
 * Converts Arabic digits (٠-٩) to standard ASCII digits (0-9)
 */
export function normalizeDigits(input: string): string {
  return input
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
    .replace(/[،]/g, ',');
}

export interface PageRangeResult {
  validPages: number[];
  count: number;
  formattedDisplay: string;
  hasError?: boolean;
}

/**
 * Parses user input like "1-5, 8, 11-14" and calculates total valid pages.
 */
export function parsePageRange(rangeStr: string, totalPages: number): PageRangeResult {
  const normalized = normalizeDigits(rangeStr.trim());
  if (!normalized) {
    return {
      validPages: Array.from({ length: totalPages }, (_, i) => i + 1),
      count: totalPages,
      formattedDisplay: `جميع الصفحات (1-${totalPages})`,
    };
  }

  const parts = normalized.split(',');
  const selectedPages = new Set<number>();
  let hasError = false;

  for (const part of parts) {
    const segment = part.trim();
    if (!segment) continue;

    if (segment.includes('-')) {
      const [startStr, endStr] = segment.split('-');
      const start = parseInt(startStr?.trim() || '', 10);
      const end = parseInt(endStr?.trim() || '', 10);

      if (!isNaN(start) && !isNaN(end) && start > 0 && end > 0) {
        const from = Math.max(1, Math.min(start, end));
        const to = Math.min(Math.max(start, end), totalPages);
        for (let i = from; i <= to; i++) {
          selectedPages.add(i);
        }
      } else {
        hasError = true;
      }
    } else {
      const pageNum = parseInt(segment, 10);
      if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
        selectedPages.add(pageNum);
      } else {
        hasError = true;
      }
    }
  }

  const sortedPages = Array.from(selectedPages).sort((a, b) => a - b);
  const count = sortedPages.length > 0 ? sortedPages.length : totalPages;

  return {
    validPages: sortedPages.length > 0 ? sortedPages : Array.from({ length: totalPages }, (_, i) => i + 1),
    count,
    formattedDisplay: sortedPages.length > 0 ? `${count} صفحة محددة` : `كامل الملف (${totalPages} صفحة)`,
    hasError,
  };
}
