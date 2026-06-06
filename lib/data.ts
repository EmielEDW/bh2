// Server-side datalaag. Leest de MAR-database en alle thema-bestanden uit /data.
import fs from "fs";
import path from "path";
import type { MarData, MarRekening, Thema } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

let _mar: MarData | null = null;

export function getMar(): MarData {
  if (_mar) return _mar;
  const raw = fs.readFileSync(path.join(DATA_DIR, "mar.json"), "utf-8");
  _mar = JSON.parse(raw) as MarData;
  return _mar;
}

export function getRekeningen(): MarRekening[] {
  return getMar().rekeningen;
}

export function getRekening(code: string): MarRekening | undefined {
  return getRekeningen().find((r) => r.code === code);
}

// Volgorde van de thema's in de UI (didactisch opgebouwd).
export const THEMA_VOLGORDE = [
  "grondbeginselen",
  "btw",
  "aankoop-verkoop",
  "voorraden",
  "mva",
  "dubieuze-debiteuren",
  "lt-schulden",
  "schulden-kt",
  "overlopende-rekeningen",
  "voorzieningen-subsidies",
  "fva-geldbeleggingen",
  "belastingen-winstbestemming",
];

let _themas: Thema[] | null = null;

export function getThemas(): Thema[] {
  if (_themas) return _themas;
  const dir = path.join(DATA_DIR, "themes");
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  } catch {
    files = [];
  }
  const themas: Thema[] = [];
  for (const f of files) {
    try {
      const raw = fs.readFileSync(path.join(dir, f), "utf-8");
      const t = JSON.parse(raw) as Thema;
      if (t && t.slug) themas.push(normalizeThema(t));
    } catch (e) {
      // sla corrupt bestand over zodat de build niet faalt
      console.warn("Kon thema niet laden:", f, e);
    }
  }
  themas.sort((a, b) => {
    const ia = THEMA_VOLGORDE.indexOf(a.slug);
    const ib = THEMA_VOLGORDE.indexOf(b.slug);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });
  _themas = themas;
  return themas;
}

// Vul ontbrekende velden defensief in zodat de UI nooit crasht.
function normalizeThema(t: Partial<Thema>): Thema {
  return {
    slug: t.slug as string,
    titel: t.titel ?? t.slug ?? "Thema",
    korteOmschrijving: t.korteOmschrijving ?? "",
    leerdoelen: t.leerdoelen ?? [],
    samenvatting: t.samenvatting ?? "",
    kernrekeningen: t.kernrekeningen ?? [],
    boekingsschemas: t.boekingsschemas ?? [],
    oefeningen: (t.oefeningen ?? []).map((o, i) => ({
      ...o,
      id: o.id ?? `${t.slug}-${i + 1}`,
      stappen: o.stappen ?? [],
      boekingen: o.boekingen ?? [],
    })),
    flashcards: t.flashcards ?? [],
    veelgemaakteFouten: t.veelgemaakteFouten ?? [],
    controlevragen: t.controlevragen ?? [],
    cursus: t.cursus,
    meerkeuze: t.meerkeuze ?? [],
  };
}

export function getThema(slug: string): Thema | undefined {
  return getThemas().find((t) => t.slug === slug);
}

export function getAlleFlashcards() {
  return getThemas().flatMap((t) =>
    t.flashcards.map((f) => ({ ...f, thema: t.titel, themaSlug: t.slug }))
  );
}

export function getAlleOefeningen() {
  return getThemas().flatMap((t) =>
    t.oefeningen.map((o) => ({ ...o, thema: t.titel, themaSlug: t.slug }))
  );
}

export function getAlleBegrippen() {
  const out = getThemas().flatMap((t) =>
    (t.cursus?.begrippen ?? []).map((b) => ({
      ...b,
      thema: t.titel,
      themaSlug: t.slug,
    }))
  );
  // dedupe op term (eerste wint), alfabetisch sorteren
  const seen = new Set<string>();
  const uniek = out.filter((b) => {
    const k = b.term.trim().toLowerCase();
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  uniek.sort((a, b) => a.term.localeCompare(b.term, "nl"));
  return uniek;
}

export function getAlleMeerkeuze() {
  return getThemas().flatMap((t) =>
    t.meerkeuze.map((m) => ({ ...m, thema: t.titel, themaSlug: t.slug }))
  );
}
