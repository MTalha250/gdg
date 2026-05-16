import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";

export const TEMPLATE_URL = "/certificates/Template.pdf";

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return rgb(
    ((n >> 16) & 255) / 255,
    ((n >> 8) & 255) / 255,
    (n & 255) / 255
  );
}


/** Layout tuned to admin/public/certificates/Template.pdf (A4 landscape, 842×595 pt) */
export const CERT_LAYOUT = {
  name: { y: 275, fontSize: 28, maxWidth: 620,color: rgb(0, 0, 0) },
  category: {
    x: 250,
    y: 195,
    fontSize: 20,
    maxWidth: 200,
  },
} as const;

export type CertificateRecipient = {
  name: string;
  email: string;
  category: string;
};

let templateBytesCache: ArrayBuffer | null = null;

export async function loadTemplateBytes(): Promise<ArrayBuffer> {
  if (templateBytesCache) return templateBytesCache;
  const res = await fetch(TEMPLATE_URL);
  if (!res.ok) throw new Error("Failed to load certificate template");
  templateBytesCache = await res.arrayBuffer();
  return templateBytesCache;
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

function centerX(text: string, font: PDFFont, size: number, pageWidth: number): number {
  const w = font.widthOfTextAtSize(text, size);
  return (pageWidth - w) / 2;
}

export async function generateCertificatePdf(
  name: string,
  category: string
): Promise<Uint8Array> {
  const templateBytes = await loadTemplateBytes();
  const pdfDoc = await PDFDocument.load(templateBytes);
  const page = pdfDoc.getPages()[0];
  const { width } = page.getSize();

  const nameFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const categoryFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const displayName = name.trim();
  const displayCategory = category.trim();

  const nameSize = fitFontSize(
    displayName,
    nameFont,
    CERT_LAYOUT.name.maxWidth,
    CERT_LAYOUT.name.fontSize
  );
  page.drawText(displayName, {
    x: centerX(displayName, nameFont, nameSize, width),
    y: CERT_LAYOUT.name.y,
    size: nameSize,
    font: nameFont,
    color: hexToRgb("#FFBA5B"),
  });

  const categorySize = fitFontSize(
    displayCategory,
    categoryFont,
    CERT_LAYOUT.category.maxWidth,
    CERT_LAYOUT.category.fontSize
  );
  page.drawText(displayCategory, {
    x: CERT_LAYOUT.category.x,
    y: CERT_LAYOUT.category.y,
    size: categorySize,
    font: categoryFont,
    color: hexToRgb("#FFBA5B"),
  });

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

/** Parse CSV with required columns: name, email, category (header row, case-insensitive) */
export function parseCertificateCsv(text: string): CertificateRecipient[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
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

  const headers = parseRow(lines[0]).map((h) => h.toLowerCase().replace(/^\ufeff/, ""));
  const nameIdx = headers.indexOf("name");
  const emailIdx = headers.indexOf("email");
  const categoryIdx = headers.indexOf("category");

  if (nameIdx === -1 || emailIdx === -1 || categoryIdx === -1) {
    throw new Error('CSV must have columns: name, email, category');
  }

  const recipients: CertificateRecipient[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseRow(lines[i]);
    const name = cols[nameIdx]?.trim();
    const email = cols[emailIdx]?.trim();
    const category = cols[categoryIdx]?.trim();
    if (!name && !email && !category) continue;
    if (!name || !email || !category) {
      throw new Error(`Row ${i + 1}: name, email, and category are all required`);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error(`Row ${i + 1}: invalid email "${email}"`);
    }
    recipients.push({ name, email, category });
  }

  if (recipients.length === 0) {
    throw new Error("No valid rows found in CSV");
  }

  return recipients;
}
