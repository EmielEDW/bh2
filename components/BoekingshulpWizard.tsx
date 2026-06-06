"use client";

import { useState } from "react";
import Link from "next/link";

type Resultaat = {
  titel: string;
  schema: { code: string; naam: string; kant: "debet" | "credit"; bedrag?: string }[];
  uitleg: string;
  thema?: string;
};

type Knoop = {
  vraag: string;
  opties: { label: string; volgende?: string; resultaat?: Resultaat }[];
};

const BOOM: Record<string, Knoop> = {
  start: {
    vraag: "Welke soort verrichting wil je boeken?",
    opties: [
      { label: "📥 Aankoop / inkomende factuur", volgende: "aankoop" },
      { label: "📤 Verkoop / uitgaande factuur", volgende: "verkoop" },
      { label: "💳 Betaling / ontvangst (bank of kas)", volgende: "betaling" },
      { label: "🏭 Investering in materieel (MVA)", volgende: "mva" },
      { label: "🏦 Lening (lange termijn)", volgende: "lening" },
      { label: "📆 Eindejaarsverrichting", volgende: "eindejaar" },
    ],
  },
  aankoop: {
    vraag: "Wat koop je / wat voor document?",
    opties: [
      {
        label: "Handelsgoederen (gewone aankoopfactuur)",
        resultaat: {
          titel: "Aankoopfactuur handelsgoederen",
          schema: [
            { code: "604000", naam: "Aankopen van handelsgoederen", kant: "debet", bedrag: "excl. btw" },
            { code: "411590", naam: "Aftrekbare btw (ABTW)", kant: "debet", bedrag: "btw" },
            { code: "440000", naam: "Leveranciers", kant: "credit", bedrag: "incl. btw" },
          ],
          uitleg: "De kost (klasse 6) en de aftrekbare btw (vordering) staan debet; de schuld aan de leverancier credit.",
          thema: "aankoop-verkoop",
        },
      },
      {
        label: "Diensten en diverse goederen",
        resultaat: {
          titel: "Aankoopfactuur diensten (D&DG)",
          schema: [
            { code: "610000", naam: "Diensten en diverse goederen", kant: "debet", bedrag: "excl. btw" },
            { code: "411590", naam: "Aftrekbare btw (ABTW)", kant: "debet", bedrag: "btw" },
            { code: "440000", naam: "Leveranciers", kant: "credit", bedrag: "incl. btw" },
          ],
          uitleg: "Diensten boek je op klasse 61 i.p.v. 60. Btw en leverancier idem als bij goederen.",
          thema: "aankoop-verkoop",
        },
      },
      {
        label: "Inkomende creditnota (op een aankoop)",
        resultaat: {
          titel: "Inkomende creditnota (ICN)",
          schema: [
            { code: "440000", naam: "Leveranciers", kant: "debet", bedrag: "incl. btw" },
            { code: "604001", naam: "Inkomende creditnota (ICN)", kant: "credit", bedrag: "excl. btw" },
            { code: "411590", naam: "Aftrekbare btw (ABTW)", kant: "credit", bedrag: "btw" },
          ],
          uitleg: "Een creditnota draait de aankoop (deels) terug → alle bedragen staan aan de tegenovergestelde kant van de aankoop.",
          thema: "btw",
        },
      },
    ],
  },
  verkoop: {
    vraag: "Wat voor document?",
    opties: [
      {
        label: "Gewone verkoopfactuur",
        resultaat: {
          titel: "Verkoopfactuur",
          schema: [
            { code: "400000", naam: "Klanten", kant: "debet", bedrag: "incl. btw" },
            { code: "700000", naam: "Verkopen", kant: "credit", bedrag: "excl. btw" },
            { code: "451540", naam: "Verschuldigde btw (VBTW)", kant: "credit", bedrag: "btw" },
          ],
          uitleg: "De vordering op de klant (incl. btw) staat debet; de opbrengst (excl.) en de verschuldigde btw credit.",
          thema: "aankoop-verkoop",
        },
      },
      {
        label: "Uitgaande creditnota (op een verkoop)",
        resultaat: {
          titel: "Uitgaande creditnota (UCN)",
          schema: [
            { code: "700001", naam: "Uitgaande creditnota (UCN)", kant: "debet", bedrag: "excl. btw" },
            { code: "451540", naam: "Verschuldigde btw (VBTW)", kant: "debet", bedrag: "btw" },
            { code: "400000", naam: "Klanten", kant: "credit", bedrag: "incl. btw" },
          ],
          uitleg: "Spiegelt de verkoop: je vermindert je opbrengst en je verschuldigde btw, en de klant moet minder betalen.",
          thema: "btw",
        },
      },
      {
        label: "Verkoop van een vast actief (machine, auto…)",
        resultaat: {
          titel: "Verkoop materieel vast actief",
          schema: [
            { code: "400000", naam: "Klanten", kant: "debet", bedrag: "incl. btw" },
            { code: "707000", naam: "Verkoop VA", kant: "credit", bedrag: "excl. btw" },
            { code: "451540", naam: "Verschuldigde btw (VBTW)", kant: "credit", bedrag: "btw" },
          ],
          uitleg: "De verkoopprijs gaat naar 707 (niet 700!). Daarna boek je apart de aanschaffingswaarde + afschrijvingen uit en bepaal je de meer-/minderwaarde (763/663).",
          thema: "mva",
        },
      },
    ],
  },
  betaling: {
    vraag: "Wat gebeurt er?",
    opties: [
      {
        label: "Klant betaalt onze verkoopfactuur",
        resultaat: {
          titel: "Ontvangst van een klant",
          schema: [
            { code: "550000", naam: "Kredietinstellingen (bank)", kant: "debet", bedrag: "incl." },
            { code: "400000", naam: "Klanten", kant: "credit", bedrag: "incl." },
          ],
          uitleg: "De bank stijgt (debet, actief); de vordering op de klant verdwijnt (credit).",
          thema: "grondbeginselen",
        },
      },
      {
        label: "Wij betalen een leverancier",
        resultaat: {
          titel: "Betaling aan een leverancier",
          schema: [
            { code: "440000", naam: "Leveranciers", kant: "debet", bedrag: "incl." },
            { code: "550000", naam: "Kredietinstellingen (bank)", kant: "credit", bedrag: "incl." },
          ],
          uitleg: "De schuld verdwijnt (debet); de bank daalt (credit).",
          thema: "grondbeginselen",
        },
      },
    ],
  },
  mva: {
    vraag: "Welke stap van het vast actief?",
    opties: [
      {
        label: "Aankoop / verwerving",
        resultaat: {
          titel: "Verwerving van een machine",
          schema: [
            { code: "231000", naam: "Machines – aanschaffingswaarde", kant: "debet", bedrag: "excl. btw" },
            { code: "411590", naam: "Aftrekbare btw (ABTW)", kant: "debet", bedrag: "btw" },
            { code: "440000", naam: "Leveranciers", kant: "credit", bedrag: "incl. btw" },
          ],
          uitleg: "Het actief komt op de aanschaffingswaarde-rekening (klasse 2). Bijkomende kosten gaan mee in de aanschaffingswaarde.",
          thema: "mva",
        },
      },
      {
        label: "Jaarlijkse afschrijving",
        resultaat: {
          titel: "Afschrijving (einde boekjaar)",
          schema: [
            { code: "630200", naam: "Afschrijvingen op materiële vaste activa", kant: "debet", bedrag: "afschrijvingsbedrag" },
            { code: "231900", naam: "Machines – geboekte afschrijvingen", kant: "credit", bedrag: "afschrijvingsbedrag" },
          ],
          uitleg: "De afschrijving is een kost (6302, debet). De tegenpost is de (-)-rekening 'geboekte afschrijvingen' die de waarde van het actief vermindert (credit).",
          thema: "mva",
        },
      },
    ],
  },
  lening: {
    vraag: "Welke stap van de lening?",
    opties: [
      {
        label: "Opname van de lening",
        resultaat: {
          titel: "Lening opnemen",
          schema: [
            { code: "550000", naam: "Kredietinstellingen (bank)", kant: "debet", bedrag: "ontvangen bedrag" },
            { code: "173000", naam: "Kredietinstellingen (schuld LT)", kant: "credit", bedrag: "ontvangen bedrag" },
          ],
          uitleg: "De bank stijgt (debet); je krijgt een schuld op lange termijn (173, credit).",
          thema: "lt-schulden",
        },
      },
      {
        label: "Aflossing + interest",
        resultaat: {
          titel: "Periodieke aflossing",
          schema: [
            { code: "173000", naam: "Kredietinstellingen (schuld LT)", kant: "debet", bedrag: "kapitaaldeel" },
            { code: "650000", naam: "Kosten van schulden (interest)", kant: "debet", bedrag: "interestdeel" },
            { code: "550000", naam: "Kredietinstellingen (bank)", kant: "credit", bedrag: "totale mensualiteit" },
          ],
          uitleg: "Splits de mensualiteit in kapitaalaflossing (vermindert de schuld) en interest (kost, klasse 65).",
          thema: "lt-schulden",
        },
      },
    ],
  },
  eindejaar: {
    vraag: "Welke eindejaarsverrichting?",
    opties: [
      {
        label: "Voorraadwijziging (handelsgoederen)",
        resultaat: {
          titel: "Voorraadwijziging op einde boekjaar",
          schema: [
            { code: "340000", naam: "Handelsgoederen (voorraad)", kant: "debet", bedrag: "= eindvoorraad" },
            { code: "609400", naam: "Voorraadwijziging van HG", kant: "credit", bedrag: "= toename" },
          ],
          uitleg: "Toename van de voorraad → 34 debet, 6094 credit (vermindert de kost). Bij afname net omgekeerd. Je boekt het verschil tussen begin- en eindvoorraad.",
          thema: "voorraden",
        },
      },
      {
        label: "Over te dragen kost (vooruitbetaald)",
        resultaat: {
          titel: "Overlopende rekening – over te dragen kost",
          schema: [
            { code: "490000", naam: "Over te dragen kosten", kant: "debet", bedrag: "deel volgend jaar" },
            { code: "610000", naam: "(de betrokken kostenrekening)", kant: "credit", bedrag: "deel volgend jaar" },
          ],
          uitleg: "Het deel van de kost dat bij volgend jaar hoort, haal je dit jaar weg (credit kost) en parkeer je op 490 (actief).",
          thema: "overlopende-rekeningen",
        },
      },
      {
        label: "Klant wordt dubieus",
        resultaat: {
          titel: "Overboeking naar dubieuze debiteuren",
          schema: [
            { code: "407000", naam: "Dubieuze debiteuren", kant: "debet", bedrag: "excl. btw" },
            { code: "400000", naam: "Klanten", kant: "credit", bedrag: "incl. btw" },
            { code: "409200", naam: "Teruggevraagde btw", kant: "credit", bedrag: "btw" },
          ],
          uitleg: "De vordering wordt apart gezet als dubieus. Daarna boek je een waardevermindering (634/409100) voor het vermoedelijke verlies.",
          thema: "dubieuze-debiteuren",
        },
      },
    ],
  },
};

export default function BoekingshulpWizard() {
  const [pad, setPad] = useState<string[]>(["start"]);
  const [resultaat, setResultaat] = useState<Resultaat | null>(null);

  const huidig = BOOM[pad[pad.length - 1]];

  function reset() {
    setPad(["start"]);
    setResultaat(null);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {pad.length > 1 || resultaat ? (
        <button
          onClick={reset}
          className="mb-3 text-sm text-brand-600 hover:underline"
        >
          ← Opnieuw beginnen
        </button>
      ) : null}

      {!resultaat ? (
        <>
          <h3 className="mb-3 text-lg font-bold text-slate-900">{huidig.vraag}</h3>
          <div className="grid gap-2">
            {huidig.opties.map((o, i) => (
              <button
                key={i}
                onClick={() => {
                  if (o.resultaat) setResultaat(o.resultaat);
                  else if (o.volgende) setPad((p) => [...p, o.volgende!]);
                }}
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-brand-400 hover:bg-brand-50"
              >
                {o.label}
                <span className="text-slate-400">→</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div>
          <h3 className="mb-1 text-lg font-bold text-slate-900">
            {resultaat.titel}
          </h3>
          <p className="mb-3 text-sm text-slate-600">{resultaat.uitleg}</p>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase text-slate-500">
                  <th className="px-3 py-1.5 text-left">Rekening</th>
                  <th className="px-3 py-1.5 text-left">Kant</th>
                  <th className="px-3 py-1.5 text-left">Bedrag</th>
                </tr>
              </thead>
              <tbody>
                {resultaat.schema.map((r, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="px-3 py-2">
                      <span className="font-mono text-xs font-semibold text-brand-700">
                        {r.code}
                      </span>{" "}
                      {r.naam}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-xs font-semibold ${
                          r.kant === "debet"
                            ? "bg-debet-bg text-debet"
                            : "bg-credit-bg text-credit"
                        }`}
                      >
                        {r.kant}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-500">{r.bedrag}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {resultaat.thema && (
            <Link
              href={`/samenvatting/${resultaat.thema}`}
              className="mt-3 inline-block text-sm font-medium text-brand-600 hover:underline"
            >
              → Meer uitleg in de samenvatting
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
