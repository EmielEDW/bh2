// Gedeelde types voor de BH2-studiesite.

export type Natuur = "debet" | "credit" | "beide" | "n.t.b.";

export interface MarRekening {
  code: string;
  naam: string;
  klasse: string;
  klasseNaam: string;
  rubriek: string;
  rubriekNaam: string;
  soort: string;
  natuur: Natuur;
  custom: boolean;
  officieleRekening: string;
  themas: string[];
}

export interface MarData {
  bron: string;
  klassen: Record<string, string>;
  rubrieken: Record<string, string>;
  rekeningen: MarRekening[];
}

export interface Kernrekening {
  code: string;
  naam: string;
  natuur: string;
  wanneer: string;
}

export interface BoekingsschemaRegel {
  code: string;
  naam: string;
  kant: "debet" | "credit";
  bedrag?: string;
  toelichting?: string;
}

export interface Boekingsschema {
  titel: string;
  situatie: string;
  regels: BoekingsschemaRegel[];
}

export interface JournaalRegel {
  code: string;
  naam: string;
  debet: number | null;
  credit: number | null;
  reden?: string;
}

export interface Boeking {
  omschrijving: string;
  datum?: string;
  regels: JournaalRegel[];
}

export interface Oefening {
  id: string;
  titel: string;
  niveau: "basis" | "midden" | "examen";
  context?: string;
  vraag: string;
  stappen: string[];
  boekingen: Boeking[];
  eindantwoord?: string;
  valkuil?: string;
}

export interface Flashcard {
  vraag: string;
  antwoord: string;
  type: "begrip" | "mar-code" | "logica";
}

export interface FoutCorrectie {
  fout: string;
  correctie: string;
}

export interface Controlevraag {
  vraag: string;
  antwoord: string;
}

export interface Thema {
  slug: string;
  titel: string;
  korteOmschrijving: string;
  leerdoelen: string[];
  samenvatting: string;
  kernrekeningen: Kernrekening[];
  boekingsschemas: Boekingsschema[];
  oefeningen: Oefening[];
  flashcards: Flashcard[];
  veelgemaakteFouten: FoutCorrectie[];
  controlevragen: Controlevraag[];
}
