import Link from "next/link";
import { getThemas } from "@/lib/data";
import ExamenChecklist from "@/components/ExamenChecklist";
import { Card } from "@/components/ui";

export const metadata = { title: "Examen — Boekhouden 2" };

// De allerbelangrijkste boekingen om uit het hoofd te kennen (last-minute).
const KERNBOEKINGEN = [
  {
    t: "Aankoopfactuur",
    d: "604000 Aankopen + 411590 ABTW (D) / 440000 Leveranciers (C)",
  },
  {
    t: "Verkoopfactuur",
    d: "400000 Klanten (D) / 700000 Verkopen + 451540 VBTW (C)",
  },
  {
    t: "Inkomende CN (ICN)",
    d: "440000 Leveranciers (D) / 604001 ICN + 411590 ABTW (C)",
  },
  {
    t: "Uitgaande CN (UCN)",
    d: "700001 UCN + 451540 VBTW (D) / 400000 Klanten (C)",
  },
  {
    t: "Afschrijving MVA",
    d: "630200 Afschrijvingen (D) / 22x9–23x9 Geboekte afschrijvingen (C)",
  },
  {
    t: "Verkoop vast actief",
    d: "400000 (D) / 707000 Verkoop VA + 451540 (C); daarna AW + afschr. uitboeken → 763/663",
  },
  {
    t: "Lening opnemen",
    d: "550000 Bank (D) / 173000 Kredietinstellingen LT (C)",
  },
  {
    t: "Aflossing lening",
    d: "173000 Kapitaaldeel + 650000 Interest (D) / 550000 Bank (C)",
  },
  {
    t: "Voorraadwijziging (toename HG)",
    d: "340000 Voorraad (D) / 609400 Voorraadwijziging HG (C)",
  },
  {
    t: "Klant wordt dubieus",
    d: "407000 Dubieuze deb. (D) / 400000 Klanten + 409200 Teruggevraagde btw (C)",
  },
  {
    t: "Waardevermindering dubieuze",
    d: "634000 Toevoeging (D) / 409100 Geboekte waardeverm. (C)",
  },
  {
    t: "Over te dragen kost",
    d: "490000 Over te dragen kosten (D) / 61x kostenrekening (C)",
  },
];

export default function ExamenPagina() {
  const themas = getThemas();

  const checklistItems = themas.flatMap((t) =>
    (t.leerdoelen.length ? t.leerdoelen : [t.korteOmschrijving]).map((doel, i) => ({
      themaSlug: t.slug,
      themaTitel: t.titel,
      doel,
      key: `${t.slug}-${i}`,
    }))
  );

  const valkuilen = themas.flatMap((t) =>
    t.veelgemaakteFouten.map((f) => ({ ...f, thema: t.titel }))
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          🎯 Examen — last minute
        </h1>
        <p className="mt-1 text-slate-500">
          Alles wat je vlak voor het examen wil checken: de kernboekingen uit het
          hoofd, je persoonlijke checklist en de belangrijkste valkuilen.
        </p>
      </div>

      {/* Kernboekingen */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-slate-900">
          ⚡ Ken deze boekingen uit het hoofd
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {KERNBOEKINGEN.map((b) => (
            <div
              key={b.t}
              className="rounded-xl border border-slate-200 bg-white p-3"
            >
              <p className="text-sm font-bold text-slate-900">{b.t}</p>
              <p className="mt-0.5 font-mono text-xs leading-relaxed text-slate-600">
                {b.d}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-400">
          (D) = debet, (C) = credit. Twijfel je over een code? Zoek hem in de{" "}
          <Link href="/mar" className="text-brand-600 hover:underline">
            MAR-zoeker
          </Link>
          .
        </p>
      </section>

      {/* Checklist */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-slate-900">
          ✅ Wat moet ik kennen? — checklist
        </h2>
        <p className="mb-3 text-sm text-slate-500">
          Vink af wat je al beheerst. Je voortgang wordt lokaal in je browser
          bewaard.
        </p>
        <ExamenChecklist items={checklistItems} />
      </section>

      {/* Valkuilen */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-slate-900">
          ⚠️ Belangrijkste valkuilen
        </h2>
        <div className="grid gap-2 md:grid-cols-2">
          {valkuilen.map((v, i) => (
            <div
              key={i}
              className="rounded-xl border border-amber-200 bg-amber-50/60 p-3"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
                {v.thema}
              </p>
              <p className="mt-1 text-sm font-medium text-rose-800">❌ {v.fout}</p>
              <p className="mt-0.5 text-sm text-slate-700">✅ {v.correctie}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Studieroute */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-slate-900">
          🗺️ Aanrader: studieroute
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          <Card>
            <h3 className="font-bold text-slate-900">Dag 1–2 — Begrijpen</h3>
            <p className="mt-1 text-sm text-slate-600">
              Lees alle{" "}
              <Link href="/samenvatting" className="text-brand-600 hover:underline">
                samenvattingen
              </Link>
              . Focus op het waarom van debet/credit en de boekingsschema&apos;s.
            </p>
          </Card>
          <Card>
            <h3 className="font-bold text-slate-900">Dag 3–4 — Oefenen</h3>
            <p className="mt-1 text-sm text-slate-600">
              Maak alle{" "}
              <Link href="/oefeningen" className="text-brand-600 hover:underline">
                oefeningen
              </Link>{" "}
              in oefenmodus. Noteer waar je vastloopt en herbekijk dat thema.
            </p>
          </Card>
          <Card>
            <h3 className="font-bold text-slate-900">Dag 5 — Automatiseren</h3>
            <p className="mt-1 text-sm text-slate-600">
              Doe de{" "}
              <Link href="/flashcards" className="text-brand-600 hover:underline">
                flashcards
              </Link>{" "}
              en de Debet/Credit-trainer. Loop deze pagina nog eens door.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
