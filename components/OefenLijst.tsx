"use client";

import { useMemo, useState } from "react";
import type { Oefening, MarRekening } from "@/lib/types";
import OefeningKaart from "@/components/OefeningKaart";

type OefeningMet = Oefening & { thema?: string };

export default function OefenLijst({
  oefeningen,
  rekeningen,
  toonThema = false,
}: {
  oefeningen: OefeningMet[];
  rekeningen?: Pick<MarRekening, "code" | "naam" | "natuur">[];
  toonThema?: boolean;
}) {
  const [niveau, setNiveau] = useState<string>("");
  const [modus, setModus] = useState<"oefen" | "correctie">("oefen");

  const gefilterd = useMemo(
    () => oefeningen.filter((o) => !niveau || o.niveau === niveau),
    [oefeningen, niveau]
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border border-slate-300 bg-white p-0.5">
          {[
            { v: "", l: "Alle" },
            { v: "basis", l: "Basis" },
            { v: "midden", l: "Midden" },
            { v: "examen", l: "Examen" },
          ].map((n) => (
            <button
              key={n.v}
              onClick={() => setNiveau(n.v)}
              className={`rounded-md px-3 py-1 text-sm font-medium ${
                niveau === n.v
                  ? "bg-brand-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {n.l}
            </button>
          ))}
        </div>

        <div className="ml-auto flex rounded-lg border border-slate-300 bg-white p-0.5">
          <button
            onClick={() => setModus("oefen")}
            className={`rounded-md px-3 py-1 text-sm font-medium ${
              modus === "oefen"
                ? "bg-slate-800 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            ✍️ Oefenmodus
          </button>
          <button
            onClick={() => setModus("correctie")}
            className={`rounded-md px-3 py-1 text-sm font-medium ${
              modus === "correctie"
                ? "bg-emerald-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            ✅ Correctiemodus
          </button>
        </div>
      </div>

      <p className="mb-3 text-sm text-slate-500">
        {modus === "oefen"
          ? "Oefenmodus: oplossingen zijn verborgen. Probeer eerst zelf, klik dan om te corrigeren."
          : "Correctiemodus: alle oplossingen en redeneringen staan open."}
      </p>

      <div className="space-y-4">
        {gefilterd.map((o) => (
          <OefeningKaart
            key={o.id}
            oefening={o}
            thema={toonThema ? o.thema : undefined}
            rekeningen={rekeningen}
            defaultOpen={modus === "correctie"}
          />
        ))}
        {gefilterd.length === 0 && (
          <p className="py-8 text-center text-slate-500">
            Geen oefeningen voor dit niveau.
          </p>
        )}
      </div>
    </div>
  );
}
