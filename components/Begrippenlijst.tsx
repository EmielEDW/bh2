"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Begrip = { term: string; uitleg: string; thema: string; themaSlug: string };

export default function Begrippenlijst({ begrippen }: { begrippen: Begrip[] }) {
  const [q, setQ] = useState("");

  const gefilterd = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return begrippen;
    return begrippen.filter(
      (b) => b.term.toLowerCase().includes(t) || b.uitleg.toLowerCase().includes(t)
    );
  }, [q, begrippen]);

  // groepeer op beginletter
  const groepen = useMemo(() => {
    const m = new Map<string, Begrip[]>();
    for (const b of gefilterd) {
      const l = (b.term[0] || "#").toUpperCase();
      (m.get(l) ?? m.set(l, []).get(l)!).push(b);
    }
    return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0], "nl"));
  }, [gefilterd]);

  return (
    <div>
      <div className="sticky top-[57px] z-20 -mx-4 mb-4 border-b border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Zoek een begrip… (bv. afschrijving, voorziening, creditnota)"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          autoFocus
        />
        <div className="mt-2 text-sm text-slate-500">
          {gefilterd.length} begrip{gefilterd.length === 1 ? "" : "pen"}
        </div>
      </div>

      <div className="space-y-6">
        {groepen.map(([letter, items]) => (
          <div key={letter}>
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-brand-600">
              {letter}
            </h2>
            <dl className="grid gap-2 sm:grid-cols-2">
              {items.map((b, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-3">
                  <dt className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-slate-900">{b.term}</span>
                    <Link
                      href={`/samenvatting/${b.themaSlug}`}
                      className="shrink-0 text-xs text-slate-400 hover:text-brand-600"
                    >
                      {b.thema}
                    </Link>
                  </dt>
                  <dd className="mt-0.5 text-sm text-slate-600">{b.uitleg}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
        {gefilterd.length === 0 && (
          <p className="py-12 text-center text-slate-500">
            Geen begrip gevonden voor &ldquo;{q}&rdquo;.
          </p>
        )}
      </div>
    </div>
  );
}
