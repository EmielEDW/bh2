"use client";

import { useMemo, useState } from "react";
import type { MarRekening } from "@/lib/types";

type Vraag = Pick<MarRekening, "code" | "naam" | "natuur" | "soort" | "klasse" | "klasseNaam">;

const UITLEG: Record<string, string> = {
  "1": "Klasse 1 = eigen vermogen & schulden LT → passief → stijgt in CREDIT (tenzij een (-)-rekening).",
  "2": "Klasse 2 = vaste activa → actief → stijgt in DEBET (geboekte afschrijvingen staan credit).",
  "3": "Klasse 3 = voorraden → actief → stijgt in DEBET.",
  "4": "Klasse 4: vorderingen (40-41) zijn actief → DEBET; schulden (42-48) zijn passief → CREDIT.",
  "5": "Klasse 5 = geldbeleggingen & liquide middelen → actief → stijgt in DEBET.",
  "6": "Klasse 6 = kosten → stijgt in DEBET.",
  "7": "Klasse 7 = opbrengsten → stijgt in CREDIT.",
};

export default function DebetCreditTrainer({
  rekeningen,
}: {
  rekeningen: MarRekening[];
}) {
  const pool = useMemo(
    () => rekeningen.filter((r) => r.natuur === "debet" || r.natuur === "credit"),
    [rekeningen]
  );

  const [vraag, setVraag] = useState<Vraag>(() => pool[Math.floor(Math.random() * pool.length)]);
  const [antwoord, setAntwoord] = useState<null | "debet" | "credit">(null);
  const [score, setScore] = useState({ goed: 0, totaal: 0 });
  const [streak, setStreak] = useState(0);

  function kies(keuze: "debet" | "credit") {
    if (antwoord) return;
    const juist = keuze === vraag.natuur;
    setAntwoord(keuze);
    setScore((s) => ({ goed: s.goed + (juist ? 1 : 0), totaal: s.totaal + 1 }));
    setStreak((st) => (juist ? st + 1 : 0));
  }

  function volgende() {
    setVraag(pool[Math.floor(Math.random() * pool.length)]);
    setAntwoord(null);
  }

  const juist = antwoord === vraag.natuur;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="text-slate-500">
          Score: <span className="font-semibold text-slate-800">{score.goed}/{score.totaal}</span>
        </span>
        <span className="text-slate-500">
          🔥 Streak: <span className="font-semibold text-slate-800">{streak}</span>
        </span>
      </div>

      <p className="mb-1 text-center text-sm text-slate-500">
        Stijgt deze rekening normaal in debet of credit?
      </p>
      <div className="mb-5 rounded-xl bg-slate-50 px-4 py-5 text-center">
        <div className="font-mono text-sm font-semibold text-brand-700">
          {vraag.code}
        </div>
        <div className="text-xl font-bold text-slate-900">{vraag.naam}</div>
        <div className="mt-1 text-xs text-slate-500">{vraag.soort}</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {(["debet", "credit"] as const).map((k) => {
          const isJuist = vraag.natuur === k;
          const gekozen = antwoord === k;
          let cls = "border-slate-300 hover:bg-slate-50";
          if (antwoord) {
            if (isJuist) cls = "border-emerald-400 bg-emerald-50 text-emerald-700";
            else if (gekozen) cls = "border-rose-400 bg-rose-50 text-rose-700";
            else cls = "border-slate-200 text-slate-400";
          }
          return (
            <button
              key={k}
              onClick={() => kies(k)}
              disabled={!!antwoord}
              className={`rounded-xl border-2 py-4 text-base font-bold uppercase transition ${cls}`}
            >
              {k}
            </button>
          );
        })}
      </div>

      {antwoord && (
        <div
          className={`mt-4 rounded-xl px-4 py-3 text-sm ${
            juist ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
          }`}
        >
          <p className="font-semibold">
            {juist ? "✅ Juist!" : `❌ Fout — het juiste antwoord is ${vraag.natuur}.`}
          </p>
          <p className="mt-1 text-slate-600">{UITLEG[vraag.klasse]}</p>
        </div>
      )}

      <button
        onClick={volgende}
        className="mt-4 w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
      >
        {antwoord ? "Volgende rekening →" : "Sla over →"}
      </button>
    </div>
  );
}
