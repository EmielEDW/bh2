"use client";

import { useMemo, useState } from "react";
import type { MeerkeuzeVraag } from "@/lib/types";

type Vraag = MeerkeuzeVraag & { thema?: string };

export default function MeerkeuzeQuiz({
  vragen,
  toonThema = false,
}: {
  vragen: Vraag[];
  toonThema?: boolean;
}) {
  const [volgorde, setVolgorde] = useState(() => vragen.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [gekozen, setGekozen] = useState<number | null>(null);
  const [score, setScore] = useState({ goed: 0, beantwoord: 0 });
  const [klaar, setKlaar] = useState(false);

  const v = vragen[volgorde[pos]];

  const letters = ["A", "B", "C", "D", "E", "F"];

  function kies(i: number) {
    if (gekozen !== null) return;
    setGekozen(i);
    setScore((s) => ({
      goed: s.goed + (i === v.juist ? 1 : 0),
      beantwoord: s.beantwoord + 1,
    }));
  }

  function volgende() {
    if (pos + 1 >= volgorde.length) {
      setKlaar(true);
      return;
    }
    setPos((p) => p + 1);
    setGekozen(null);
  }

  function herstart() {
    const arr = vragen.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setVolgorde(arr);
    setPos(0);
    setGekozen(null);
    setScore({ goed: 0, beantwoord: 0 });
    setKlaar(false);
  }

  if (vragen.length === 0) return null;

  if (klaar) {
    const pct = Math.round((score.goed / vragen.length) * 100);
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-slate-500">Resultaat</p>
        <p className="my-2 text-4xl font-extrabold text-brand-700">
          {score.goed}/{vragen.length}
        </p>
        <p className="text-slate-600">
          {pct >= 80
            ? "🎉 Sterk! Dit beheers je goed."
            : pct >= 50
            ? "👍 Op de goede weg — herhaal de foute nog eens."
            : "💪 Nog wat oefenen met dit thema."}
        </p>
        <button
          onClick={herstart}
          className="mt-4 rounded-xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          🔁 Opnieuw (geschud)
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
        <span>
          Vraag {pos + 1} / {vragen.length}
        </span>
        <span>
          Score: <span className="font-semibold text-slate-800">{score.goed}/{score.beantwoord}</span>
        </span>
      </div>

      {toonThema && v.thema && (
        <span className="mb-2 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
          {v.thema}
        </span>
      )}
      <p className="mb-4 text-base font-semibold text-slate-900">{v.vraag}</p>

      <div className="space-y-2">
        {v.opties.map((opt, i) => {
          const isJuist = i === v.juist;
          const isGekozen = i === gekozen;
          let cls = "border-slate-200 hover:border-brand-300 hover:bg-brand-50/50";
          if (gekozen !== null) {
            if (isJuist) cls = "border-emerald-400 bg-emerald-50";
            else if (isGekozen) cls = "border-rose-400 bg-rose-50";
            else cls = "border-slate-200 opacity-60";
          }
          return (
            <button
              key={i}
              onClick={() => kies(i)}
              disabled={gekozen !== null}
              className={`flex w-full items-start gap-3 rounded-xl border-2 px-4 py-2.5 text-left text-sm transition ${cls}`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  gekozen !== null && isJuist
                    ? "bg-emerald-500 text-white"
                    : gekozen !== null && isGekozen
                    ? "bg-rose-500 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {letters[i]}
              </span>
              <span className="text-slate-800">{opt}</span>
              {gekozen !== null && isJuist && <span className="ml-auto text-emerald-600">✓</span>}
              {gekozen !== null && isGekozen && !isJuist && (
                <span className="ml-auto text-rose-500">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {gekozen !== null && (
        <div
          className={`mt-3 rounded-xl px-4 py-3 text-sm ${
            gekozen === v.juist ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"
          }`}
        >
          <p className="font-semibold">
            {gekozen === v.juist ? "✅ Juist!" : `❌ Het juiste antwoord is ${letters[v.juist]}.`}
          </p>
          {v.uitleg && <p className="mt-1 text-slate-700">{v.uitleg}</p>}
        </div>
      )}

      <button
        onClick={volgende}
        disabled={gekozen === null}
        className="mt-4 w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-40"
      >
        {pos + 1 >= vragen.length ? "Toon resultaat →" : "Volgende vraag →"}
      </button>
    </div>
  );
}
