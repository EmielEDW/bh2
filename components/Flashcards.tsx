"use client";

import { useMemo, useState } from "react";

type Card = {
  vraag: string;
  antwoord: string;
  type: string;
  thema: string;
  themaSlug: string;
};

export default function Flashcards({ cards }: { cards: Card[] }) {
  const themas = useMemo(() => {
    const m = new Map<string, string>();
    cards.forEach((c) => m.set(c.themaSlug, c.thema));
    return Array.from(m.entries());
  }, [cards]);

  const [thema, setThema] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [volgorde, setVolgorde] = useState<number[]>(() =>
    cards.map((_, i) => i)
  );
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const gefilterd = useMemo(() => {
    const idxs = cards
      .map((c, i) => ({ c, i }))
      .filter(({ c }) => (!thema || c.themaSlug === thema) && (!type || c.type === type))
      .map(({ i }) => i);
    return idxs;
  }, [cards, thema, type]);

  const actief = useMemo(() => {
    const set = new Set(gefilterd);
    return volgorde.filter((i) => set.has(i));
  }, [volgorde, gefilterd]);

  const huidige = actief.length > 0 ? cards[actief[pos % actief.length]] : null;

  function shuffle() {
    const arr = [...volgorde];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setVolgorde(arr);
    setPos(0);
    setFlipped(false);
  }

  function next() {
    setFlipped(false);
    setPos((p) => (p + 1) % Math.max(actief.length, 1));
  }
  function prev() {
    setFlipped(false);
    setPos((p) => (p - 1 + actief.length) % Math.max(actief.length, 1));
  }

  const typeLabels: Record<string, string> = {
    begrip: "Begrip",
    "mar-code": "MAR-code",
    logica: "Logica",
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select
          value={thema}
          onChange={(e) => {
            setThema(e.target.value);
            setPos(0);
            setFlipped(false);
          }}
          className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm"
        >
          <option value="">Alle thema's</option>
          {themas.map(([slug, label]) => (
            <option key={slug} value={slug}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPos(0);
            setFlipped(false);
          }}
          className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm"
        >
          <option value="">Alle types</option>
          <option value="begrip">Begrippen</option>
          <option value="mar-code">MAR-codes</option>
          <option value="logica">Boekingslogica</option>
        </select>
        <button
          onClick={shuffle}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-slate-50"
        >
          🔀 Shuffle
        </button>
        <span className="ml-auto text-sm text-slate-500">
          {actief.length > 0 ? `${(pos % actief.length) + 1} / ${actief.length}` : "0"}
        </span>
      </div>

      {huidige ? (
        <button
          onClick={() => setFlipped((f) => !f)}
          className="group flex min-h-[16rem] w-full flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:shadow-md"
        >
          <span className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-500">
              {typeLabels[huidige.type] ?? huidige.type}
            </span>
            {huidige.thema}
          </span>
          {!flipped ? (
            <p className="text-xl font-semibold text-slate-900">{huidige.vraag}</p>
          ) : (
            <p className="whitespace-pre-line text-lg text-brand-800">
              {huidige.antwoord}
            </p>
          )}
          <span className="mt-6 text-xs text-slate-400 group-hover:text-slate-500">
            {flipped ? "Klik om de vraag te zien" : "Klik om het antwoord te zien"}
          </span>
        </button>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
          Geen flashcards voor deze selectie.
        </div>
      )}

      <div className="mt-4 flex justify-center gap-3">
        <button
          onClick={prev}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-medium hover:bg-slate-50"
        >
          ← Vorige
        </button>
        <button
          onClick={next}
          className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Volgende →
        </button>
      </div>
    </div>
  );
}
