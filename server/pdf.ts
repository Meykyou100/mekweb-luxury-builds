import PDFDocument from "pdfkit";
import { resolve } from "node:path";
import type { Snapshot, Version, QuoteRow, Client } from "./models.js";
import { dbError, hash, HttpError, serviceDb } from "./core.js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { calculateQuote } from "../shared/money.js";
import { formatMoney } from "../shared/catalog.js";
const asset = (name: string) => resolve(process.cwd(), "server/assets", name);
const date = (s: string) =>
  new Intl.DateTimeFormat("fr-MA", {
    dateStyle: "long",
    timeZone: "Africa/Casablanca",
  }).format(new Date(s));
const arabic = /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff]/u;
/** Server-only renderer. Explicit page chrome is stamped after body pagination. */
export function renderQuote(s: Snapshot, draft = false): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      autoFirstPage: false,
      bufferPages: true,
      margins: { top: 112, bottom: 65, left: 44, right: 44 },
      font: asset("NotoSans-Regular.ttf"),
      info: {
        Title: `${draft ? "Brouillon" : "Devis"} ${s.reference}`,
        Author: s.agency.name,
        CreationDate: new Date(s.issued_at),
      },
    });
    const chunks: Buffer[] = [];
    doc.on("data", (b: Buffer) => chunks.push(b));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.registerFont("Regular", asset("NotoSans-Regular.ttf"));
    doc.registerFont("Bold", asset("NotoSans-Bold.ttf"));
    doc.registerFont("Arabic", asset("NotoNaskhArabic-Regular.ttf"));
    const left = 44,
      width = 507.28,
      bottom = 776.89;
    let tablePage = -1;
    function page() {
      doc.addPage();
      doc.x = left;
      doc.y = 112;
    }
    function reserve(height: number) {
      if (doc.y + height > bottom) page();
    }
    function text(
      value: string,
      size = 9,
      color = "#30352b",
      bold = false,
      options: PDFKit.Mixins.TextOptions = {},
    ) {
      doc
        .font(bold ? "Bold" : "Regular")
        .fontSize(size)
        .fillColor(color);
      if (arabic.test(value)) {
        const parts = value
          .split(/([\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff]+)/u)
          .filter(Boolean);
        parts.forEach((part, i) =>
          doc
            .font(arabic.test(part) ? "Arabic" : bold ? "Bold" : "Regular")
            .text(part, {
              width,
              lineGap: 3,
              ...options,
              continued: i < parts.length - 1,
            }),
        );
      } else doc.text(value, { width, lineGap: 3, ...options });
    }
    function label(value: string) {
      text(value, 7, "#8c6b35", false, { characterSpacing: 1 });
      doc.y += 6;
    }
    function height(value: string, w: number, size = 9) {
      return doc
        .font("Regular")
        .fontSize(size)
        .heightOfString(value, { width: w, lineGap: 3 });
    }
    function tableHeading() {
      reserve(35);
      const y = doc.y;
      doc.rect(left, y, width, 27).fill("#1b2018");
      const xs = [left + 10, left + 218, left + 268, left + 359, left + 415],
        ws = [198, 40, 80, 45, 82];
      ["PRESTATIONS", "QTÉ", "P.U. DH", "REMISE", "MONTANT"].forEach(
        (value, i) => {
          doc
            .font("Regular")
            .fontSize(7)
            .fillColor("#ffffff")
            .text(value, xs[i], y + 8, {
              width: ws[i],
              align: i ? "right" : "left",
              lineBreak: false,
            });
        },
      );
      doc.x = left;
      doc.y = y + 27;
      tablePage = doc.bufferedPageRange().count;
    }
    page();
    if (draft) {
      text("BROUILLON - DOCUMENT NON ÉMIS", 9, "#8c6b35", true);
      doc.y += 15;
    }
    label("PROPOSITION COMMERCIALE");
    text(s.title, 24, "#22271e", true);
    doc.y += 8;
    if (s.description) {
      text(s.description, 9);
      doc.y += 15;
    }
    const clientLines = [
      s.client.company_name || s.client.full_name,
      s.client.full_name,
      s.client.email,
      s.client.phone,
      s.client.city,
    ].filter(Boolean);
    const agencyLines = [
      s.agency.name,
      s.agency.email,
      s.agency.phone,
      s.agency.address || s.agency.city,
      `Date : ${date(s.issued_at)}`,
      `Valable jusqu’au : ${date(s.expires_on)}`,
    ];
    const colWidth = 235,
      clientHeight = clientLines.reduce(
        (h, t) => h + height(t, colWidth) + 4,
        20,
      ),
      agencyHeight = agencyLines.reduce(
        (h, t) => h + height(t, colWidth) + 4,
        20,
      );
    reserve(Math.max(clientHeight, agencyHeight) + 30);
    const contactY = doc.y;
    [clientLines, agencyLines].forEach((lines, i) => {
      doc.x = left + i * 272;
      doc.y = contactY;
      label(i ? s.agency.name.toUpperCase() : "PRÉPARÉ POUR");
      lines.forEach((value, index) => {
        text(value, 9, "#30352b", index === 0, { width: colWidth });
        doc.y += 3;
      });
    });
    doc.x = left;
    doc.y = contactY + Math.max(clientHeight, agencyHeight) + 20;
    tableHeading();
    s.items.forEach((item, index) => {
      const long = height(item.description, 198, 8.5) > 350;
      const description = long
        ? `${item.description.slice(0, 200)}… (détail ci-dessous)`
        : item.description;
      const rowHeight = Math.max(34, height(description, 198, 8.5) + 20);
      if (doc.y + rowHeight > bottom) {
        page();
        tableHeading();
      } else if (tablePage !== doc.bufferedPageRange().count) tableHeading();
      const y = doc.y;
      doc.x = left + 10;
      doc.y = y + 10;
      text(description, 8.5, "#30352b", false, { width: 198 });
      const values = [
        String(item.quantity),
        formatMoney(item.unit_price_cents),
        item.discount_bps ? `${item.discount_bps / 100} %` : "-",
        formatMoney(item.net_cents),
      ];
      const xs = [left + 218, left + 268, left + 359, left + 415],
        ws = [40, 80, 45, 82];
      values.forEach((v, i) =>
        doc
          .font("Regular")
          .fontSize(8)
          .fillColor("#30352b")
          .text(v, xs[i], y + 10, {
            width: ws[i],
            align: "right",
            lineBreak: false,
          }),
      );
      doc
        .moveTo(left, y + rowHeight)
        .lineTo(left + width, y + rowHeight)
        .lineWidth(0.4)
        .strokeColor("#e0ded5")
        .stroke();
      doc.x = left;
      doc.y = y + rowHeight;
      if (long) {
        doc.y += 12;
        text(`Détail de la prestation ${index + 1} : ${item.description}`, 8.5);
        doc.y += 15;
      }
    });
    doc.y += 22;
    const totalX = left + 240,
      totalWidth = width - 240,
      taxLabel =
        s.tax_mode === "standard"
          ? `Taxe (${s.tax_bps / 100} %)`
          : s.tax_mode === "unconfigured"
            ? "Fiscalité à confirmer"
            : s.tax_mode === "exempt"
              ? "Exonération configurée"
              : "Taxe non applicable (configurée)";
    const totalHeight =
      105 + (s.tax_note ? height(s.tax_note, totalWidth - 30, 7.5) + 10 : 0);
    reserve(totalHeight + 5);
    const totalY = doc.y;
    doc.rect(totalX, totalY, totalWidth, totalHeight).fill("#f3f0e8");
    [
      ["Sous-total après remises", s.subtotal_cents],
      [taxLabel, s.tax_cents],
      ["TOTAL MAD", s.total_cents],
    ].forEach(([name, value], index) => {
      doc
        .font(index === 2 ? "Bold" : "Regular")
        .fontSize(index === 2 ? 11 : 8.5)
        .fillColor("#30352b");
      const y = totalY + 15 + index * 25;
      doc.text(String(name), totalX + 14, y, {
        width: totalWidth - 28,
        lineBreak: false,
      });
      const amount = formatMoney(Number(value));
      const tw = doc.widthOfString(amount);
      doc.text(amount, totalX + totalWidth - 14 - tw, y, { lineBreak: false });
    });
    if (s.tax_note) {
      doc.x = totalX + 14;
      doc.y = totalY + 91;
      text(s.tax_note, 7.5, "#65695f", false, { width: totalWidth - 28 });
    }
    doc.x = left;
    doc.y = totalY + totalHeight + 22;
    for (const [heading, value] of [
      ["DÉLAI ESTIMÉ", s.delivery_estimate],
      ["CONDITIONS DE PAIEMENT", s.payment_terms],
      ["NOTES", s.notes],
      ["ACCEPTATION DU DEVIS", s.agency.acceptance_instructions],
    ]) {
      if (!value) continue;
      reserve(55);
      label(heading);
      text(value, 9);
      doc.y += 20;
    }
    const legal = [
      ["ICE", s.agency.ice],
      ["IF", s.agency.tax_id],
      ["RC", s.agency.rc],
      ["CNSS", s.agency.cnss],
    ]
      .filter(([, v]) => v)
      .map(([k, v]) => `${k} : ${v}`)
      .join(" | ");
    if (legal) {
      reserve(height(legal, width, 7) + 15);
      text(legal, 7, "#65695f");
    }
    const count = doc.bufferedPageRange().count;
    for (let i = 0; i < count; i++) {
      doc.switchToPage(i);
      const oldBottom = doc.page.margins.bottom;
      doc.page.margins.bottom = 0;
      doc.rect(44, 30, 35, 35).fill("#171c13");
      doc.image(asset("agency-mark.png"), 49, 35, { width: 25, height: 25 });
      doc
        .font("Bold")
        .fontSize(19)
        .fillColor("#22271e")
        .text("MekWeb", 89, 28, { lineBreak: false });
      doc
        .font("Regular")
        .fontSize(7)
        .fillColor("#65695f")
        .text("STUDIO DIGITAL · MAROC", 89, 55, { lineBreak: false });
      doc.font("Bold").fontSize(9).fillColor("#22271e");
      doc.text(s.reference, 551.28 - doc.widthOfString(s.reference), 31, {
        lineBreak: false,
      });
      const revision = `Révision ${s.version} · MAD`;
      doc
        .font("Regular")
        .fontSize(7)
        .fillColor("#65695f")
        .text(revision, 551.28 - doc.widthOfString(revision), 48, {
          lineBreak: false,
        });
      doc
        .moveTo(44, 82)
        .lineTo(551.28, 82)
        .lineWidth(0.5)
        .strokeColor("#c5b08b")
        .stroke();
      doc
        .moveTo(44, 794.89)
        .lineTo(551.28, 794.89)
        .lineWidth(0.4)
        .strokeColor("#d6d3c8")
        .stroke();
      doc
        .font("Regular")
        .fontSize(7)
        .fillColor("#65695f")
        .text(`${s.agency.email} · ${s.agency.phone}`, 44, 805, {
          lineBreak: false,
        });
      const counter = `${draft ? "Brouillon" : s.reference} · ${i + 1} / ${count}`;
      doc.text(counter, 551.28 - doc.widthOfString(counter), 805, {
        lineBreak: false,
      });
      doc.page.margins.bottom = oldBottom;
    }
    doc.end();
  });
}
export async function issuedPdf(version: Version) {
  const db = serviceDb();
  const { data: existing, error } = await db
    .from("documents")
    .select("*")
    .eq("version_id", version.id)
    .maybeSingle();
  dbError(error);
  if (existing)
    return {
      path: existing.object_path as string,
      filename: existing.filename as string,
    };
  const filename = `${version.snapshot.reference}-R${version.version}.pdf`,
    path = `quotes/${version.quote_id}/${version.id}.pdf`;
  let bytes = await renderQuote(version.snapshot);
  if (bytes.length > 5242880)
    throw new HttpError(
      413,
      "PDF_SIZE",
      "Le document dépasse la limite autorisée.",
    );
  const upload = await db.storage
    .from("crm-documents")
    .upload(path, bytes, { contentType: "application/pdf", upsert: false });
  if (upload.error) {
    const old = await db.storage.from("crm-documents").download(path);
    if (old.error)
      throw new HttpError(
        502,
        "PDF_STORAGE",
        "Le PDF n’a pas pu être enregistré.",
      );
    bytes = Buffer.from(await old.data.arrayBuffer());
  }
  const result = await db
    .from("documents")
    .upsert(
      {
        version_id: version.id,
        object_path: path,
        filename,
        mime_type: "application/pdf",
        size_bytes: bytes.length,
        scan_status: "clean",
        sha256: hash(bytes),
      },
      { onConflict: "version_id", ignoreDuplicates: true },
    );
  dbError(result.error);
  return { path, filename };
}
export async function draftSnapshot(
  db: SupabaseClient,
  id: string,
): Promise<Snapshot> {
  const q = await db.from("quotes").select("*").eq("id", id).single();
  dbError(q.error);
  const quote = q.data as QuoteRow;
  if (quote.status !== "draft") {
    const v = await db
      .from("quote_versions")
      .select("*")
      .eq("id", quote.current_version_id)
      .single();
    dbError(v.error);
    return (v.data as Version).snapshot;
  }
  const [client, agency, items] = await Promise.all([
    db.from("clients").select("*").eq("id", quote.client_id).single(),
    db.from("agency_settings").select("*").single(),
    db.from("quote_items").select("*").eq("quote_id", id).order("position"),
  ]);
  [client, agency, items].forEach((r) => dbError(r.error));
  const rows = (items.data ?? []).map((i) => ({
    ...i,
    quantity: String(i.quantity),
  }));
  const totals = calculateQuote(
    rows,
    quote.tax_mode === "standard" ? quote.tax_bps : 0,
  );
  return {
    ...quote,
    reference: quote.reference ?? "NON ÉMIS",
    version: 0,
    issued_at: new Date().toISOString(),
    currency: "MAD",
    client: client.data as Client,
    agency: agency.data as Snapshot["agency"],
    items: rows.map((i, index) => ({ ...i, ...totals.lines[index] })),
    ...totals,
  };
}
