import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";

export type CertificateVariant = "participation" | "top_team";

export const PARTICIPATION_TEMPLATE_URL = "/certificates/Template.pdf";
export const TOP_TEAM_TEMPLATE_URL = "/certificates/Template-2.pdf";

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return rgb(
    ((n >> 16) & 255) / 255,
    ((n >> 8) & 255) / 255,
    (n & 255) / 255
  );
}

const ACCENT = hexToRgb("#FFBA5B");

/** Participation — admin/public/certificates/Template.pdf (A4 landscape, 842×595 pt) */
export const PARTICIPATION_LAYOUT = {
  name: { y: 275, fontSize: 28, maxWidth: 620 },
  category: { x: 250, y: 195, fontSize: 20, maxWidth: 200 },
} as const;

/**
 * Top teams / appreciation — admin/public/certificates/Template-2.pdf
 * Placeholders from PDF text layer: "position" (line 1) and "category" (line 2).
 */
export const TOP_TEAM_LAYOUT = {
  name: { y: 275, fontSize: 28, maxWidth: 620 },
  position:{ x: 560, y: 230, fontSize: 20, maxWidth: 168 },
  category: { x: 250, y: 195, fontSize: 20, maxWidth: 200 },
} as const;

export type CertificateRecipient = {
  name: string;
  email: string;
  category: string;
  /** Required when variant is `top_team` */
  position?: string;
};

const templateCache: Partial<Record<CertificateVariant, ArrayBuffer>> = {};

export async function loadTemplateBytes(
  variant: CertificateVariant
): Promise<ArrayBuffer> {
  const url =
    variant === "top_team"
      ? TOP_TEAM_TEMPLATE_URL
      : PARTICIPATION_TEMPLATE_URL;
  const cached = templateCache[variant];
  if (cached) return cached;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load certificate template (${variant})`);
  const buf = await res.arrayBuffer();
  templateCache[variant] = buf;
  return buf;
}

function fitFontSize(
  text: string,
  font: PDFFont,
  maxWidth: number,
  startSize: number
): number {
  let size = startSize;
  while (size > 8 && font.widthOfTextAtSize(text, size) > maxWidth) {
    size -= 0.5;
  }
  return size;
}

function centerX(
  text: string,
  font: PDFFont,
  size: number,
  pageWidth: number
): number {
  const w = font.widthOfTextAtSize(text, size);
  return (pageWidth - w) / 2;
}

export type GenerateCertificateOptions = {
  variant?: CertificateVariant;
  /** e.g. "1st Place", "Runner-up" — required when variant is `top_team` */
  position?: string;
};

export async function generateCertificatePdf(
  name: string,
  category: string,
  options: GenerateCertificateOptions = {}
): Promise<Uint8Array> {
  const variant = options.variant ?? "participation";
  const displayName = name.trim();
  const displayCategory = category.trim();
  const displayPosition = (options.position ?? "").trim();

  if (variant === "top_team" && !displayPosition) {
    throw new Error("Position is required for top team certificates");
  }

  const templateBytes = await loadTemplateBytes(variant);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const page = pdfDoc.getPages()[0];
  const { width } = page.getSize();

  const nameFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const bodyFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const nameSize = fitFontSize(
    displayName,
    nameFont,
    PARTICIPATION_LAYOUT.name.maxWidth,
    PARTICIPATION_LAYOUT.name.fontSize
  );
  page.drawText(displayName, {
    x: centerX(displayName, nameFont, nameSize, width),
    y: PARTICIPATION_LAYOUT.name.y,
    size: nameSize,
    font: nameFont,
    color: ACCENT,
  });

  if (variant === "participation") {
    const categorySize = fitFontSize(
      displayCategory,
      bodyFont,
      PARTICIPATION_LAYOUT.category.maxWidth,
      PARTICIPATION_LAYOUT.category.fontSize
    );
    page.drawText(displayCategory, {
      x: PARTICIPATION_LAYOUT.category.x,
      y: PARTICIPATION_LAYOUT.category.y,
      size: categorySize,
      font: bodyFont,
      color: ACCENT,
    });
  } else {
    const posSize = fitFontSize(
      displayPosition,
      bodyFont,
      TOP_TEAM_LAYOUT.position.maxWidth,
      TOP_TEAM_LAYOUT.position.fontSize
    );
    page.drawText(displayPosition, {
      x: TOP_TEAM_LAYOUT.position.x,
      y: TOP_TEAM_LAYOUT.position.y,
      size: posSize,
      font: bodyFont,
      color: ACCENT,
    });

    const catSize = fitFontSize(
      displayCategory,
      bodyFont,
      TOP_TEAM_LAYOUT.category.maxWidth,
      TOP_TEAM_LAYOUT.category.fontSize
    );
    page.drawText(displayCategory, {
      x: TOP_TEAM_LAYOUT.category.x,
      y: TOP_TEAM_LAYOUT.category.y,
      size: catSize,
      font: bodyFont,
      color: ACCENT,
    });
  }

  return pdfDoc.save();
}

export function certificatePdfToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function certificatePdfToBlob(bytes: Uint8Array): Blob {
  const copy = new Uint8Array(bytes);
  return new Blob([copy], { type: "application/pdf" });
}

/** Parse CSV; `position` column required when variant is `top_team` */
export function parseCertificateCsv(
  text: string,
  variant: CertificateVariant = "participation"
): CertificateRecipient[] {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
  if (lines.length < 2) {
    throw new Error("CSV must include a header row and at least one data row");
  }

  const parseRow = (line: string): string[] => {
    const cells: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        cells.push(cur.trim());
        cur = "";
      } else {
        cur += ch;
      }
    }
    cells.push(cur.trim());
    return cells;
  };

  const headers = parseRow(lines[0]).map((h) =>
    h.toLowerCase().replace(/^\ufeff/, "")
  );
  const nameIdx = headers.indexOf("name");
  const emailIdx = headers.indexOf("email");
  const categoryIdx = headers.indexOf("category");
  const positionIdx = headers.indexOf("position");

  if (nameIdx === -1 || emailIdx === -1 || categoryIdx === -1) {
    throw new Error("CSV must have columns: name, email, category");
  }

  if (variant === "top_team" && positionIdx === -1) {
    throw new Error(
      "Top team CSV must also include a position column (e.g. 1st Place, Runner-up)"
    );
  }

  const recipients: CertificateRecipient[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseRow(lines[i]);
    const rowName = cols[nameIdx]?.trim();
    const email = cols[emailIdx]?.trim();
    const category = cols[categoryIdx]?.trim();
    const position =
      positionIdx >= 0 ? cols[positionIdx]?.trim() : undefined;

    if (!rowName && !email && !category && !position) continue;

    if (!rowName || !email || !category) {
      throw new Error(`Row ${i + 1}: name, email, and category are all required`);
    }

    if (variant === "top_team") {
      if (!position) {
        throw new Error(`Row ${i + 1}: position is required for top team certificates`);
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error(`Row ${i + 1}: invalid email "${email}"`);
    }

    recipients.push({
      name: rowName,
      email,
      category,
      ...(variant === "top_team" && position ? { position } : {}),
    });
  }

  if (recipients.length === 0) {
    throw new Error("No valid rows found in CSV");
  }

  return recipients;
}
