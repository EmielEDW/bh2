"use client";

import { useState } from "react";
import type { Oefening, MarRekening } from "@/lib/types";
import BoekingTable from "@/components/BoekingTable";
import Werkblad from "@/components/Werkblad";
import { NiveauBadge } from "@/components/ui";

export default function OefeningKaart({
  oefening,
  thema,
  rekeningen,
  defaultOpen = false,
}: {
  oefening: Oefening;
  thema?: string;
  rekeningen?: Pick<MarRekening, "code" | "naam" | "natuur">[];
  defaultOpen?: boolean;
}) {
  const [toonStappen, setToonStappen] = useState(defaultOpen);
  const [toonOplossing, setToonOplossing] = useState(defaultOpen);
  const [toonWerkblad, setToonWerkblad] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <NiveauBadge niveau={oefening.niveau} />
        {thema && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {thema}
          </span>
        )}
        <h3 className="text-base font-bold text-slate-900">{oefening.titel}</h3>
      </div>

      {oefening.context && (
        <p className="mb-2 text-sm text-slate-600">{oefening.context}</p>
      )}
      <div className="rounded-xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-900">
        <span className="mr-1 font-bold">Opgave:</span>
        {oefening.vraag}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => setToonStappen((s) => !s)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {toonStappen ? "Verberg stappenplan" : "💡 Toon stappenplan (hint)"}
        </button>
        {rekeningen && rekeningen.length > 0 && (
          <button
            onClick={() => setToonWerkblad((s) => !s)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {toonWerkblad ? "Verberg werkblad" : "🛠️ Zelf boeken"}
          </button>
        )}
        <button
          onClick={() => setToonOplossing((s) => !s)}
          className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          {toonOplossing ? "Verberg oplossing" : "✅ Toon oplossing & redenering"}
        </button>
      </div>

      {toonWerkblad && rekeningen && (
        <div className="mt-3">
          <Werkblad rekeningen={rekeningen} model={oefening.boekingen} />
          <p className="mt-1.5 text-xs text-slate-400">
            Tip: boek hierboven zelf en klik op <strong>Verbeter</strong> om je antwoord te
            vergelijken met de oplossing. Schakel met de toggle tussen journaalpost en T-rekeningen.
          </p>
        </div>
      )}

      {toonStappen && oefening.stappen.length > 0 && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-amber-700">
            Stappenplan
          </p>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
            {oefening.stappen.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      )}

      {toonOplossing && (
        <div className="mt-3 space-y-3">
          {oefening.boekingen.map((b, i) => (
            <BoekingTable key={i} boeking={b} />
          ))}
          {oefening.eindantwoord && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              <span className="font-bold">Eindantwoord: </span>
              {oefening.eindantwoord}
            </div>
          )}
          {oefening.valkuil && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
              <span className="font-bold">⚠️ Valkuil: </span>
              {oefening.valkuil}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
