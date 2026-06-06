"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { MarData, MarRekening } from "@/lib/types";
import { NatuurBadge, KlasseBadge } from "@/components/ui";

const THEMA_LABELS: Record<string, string> = {
  grondbeginselen: "Grondbeginselen",
  btw: "BTW",
  "aankoop-verkoop": "Aankoop/verkoop",
  voorraden: "Voorraden",
  mva: "MVA",
  "dubieuze-debiteuren": "Dubieuze debiteuren",
  "lt-schulden": "LT-schulden",
  "schulden-kt": "Schulden KT",
  "overlopende-rekeningen": "Overlopende rek.",
  "voorzieningen-subsidies": "Voorzieningen/subsidies",
  "fva-geldbeleggingen": "FVA/geldbeleggingen",
  "belastingen-winstbestemming": "Belastingen/winst",
  personeel: "Personeel",
};

export default function MarZoeker({ mar }: { mar: MarData }) {
  const params = useSearchParams();
  const [q, setQ] = useState("");
  const [klasse, setKlasse] = useState<string>("");
  const [thema, setThema] = useState<string>("");
  const [enkelEigen, setEnkelEigen] = useState(false);

  useEffect(() => {
    const initial = params.get("q");
    if (initial) setQ(initial);
  }, [params]);

  const resultaten = useMemo(() => {
    const term = q.trim().toLowerCase();
    return mar.rekeningen.filter((r) => {
      if (klasse && r.klasse !== klasse) return false;
      if (thema && !r.themas.includes(thema)) return false;
      if (enkelEigen && !r.custom) return false;
      if (!term) return true;
      return (
        r.code.includes(term) ||
        r.naam.toLowerCase().includes(term) ||
        r.rubriekNaam.toLowerCase().includes(term)
      );
    });
  }, [q, klasse, thema, enkelEigen, mar.rekeningen]);

  const klassen = Object.keys(mar.klassen).sort();

  return (
    <div>
      <div className="sticky top-[57px] z-20 -mx-4 mb-4 border-b border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Zoek op code of naam… (bv. 411590, klanten, afschrijving, btw)"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          autoFocus
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <select
            value={klasse}
            onChange={(e) => setKlasse(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
          >
            <option value="">Alle klassen</option>
            {klassen.map((k) => (
              <option key={k} value={k}>
                Klasse {k} — {mar.klassen[k]}
              </option>
            ))}
          </select>
          <select
            value={thema}
            onChange={(e) => setThema(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
          >
            <option value="">Alle thema's</option>
            {Object.entries(THEMA_LABELS).map(([slug, label]) => (
              <option key={slug} value={slug}>
                {label}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm">
            <input
              type="checkbox"
              checked={enkelEigen}
              onChange={(e) => setEnkelEigen(e.target.checked)}
            />
            Enkel eigen rekeningen
          </label>
          <span className="ml-auto text-sm text-slate-500">
            {resultaten.length} rekening{resultaten.length === 1 ? "" : "en"}
          </span>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {resultaten.map((r) => (
          <RekeningKaart key={r.code} r={r} />
        ))}
      </div>
      {resultaten.length === 0 && (
        <p className="py-12 text-center text-slate-500">
          Geen rekening gevonden voor &ldquo;{q}&rdquo;. Probeer een andere term.
        </p>
      )}
    </div>
  );
}

function RekeningKaart({ r }: { r: MarRekening }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-start gap-2">
        <KlasseBadge klasse={r.klasse} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-mono text-sm font-bold text-brand-700">
              {r.code}
            </span>
            <span className="font-semibold text-slate-900">{r.naam}</span>
          </div>
          <div className="mt-0.5 text-xs text-slate-500">
            {r.rubriek} · {r.rubriekNaam}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <NatuurBadge natuur={r.natuur} />
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
              {r.soort}
            </span>
            {r.custom && (
              <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700">
                eigen rekening (leerkracht)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
