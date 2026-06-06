"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Item = { themaSlug: string; themaTitel: string; doel: string; key: string };

export default function ExamenChecklist({ items }: { items: Item[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [geladen, setGeladen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("bh2-checklist");
      if (raw) setChecked(JSON.parse(raw));
    } catch {}
    setGeladen(true);
  }, []);

  useEffect(() => {
    if (geladen) {
      try {
        localStorage.setItem("bh2-checklist", JSON.stringify(checked));
      } catch {}
    }
  }, [checked, geladen]);

  const totaal = items.length;
  const gedaan = items.filter((i) => checked[i.key]).length;
  const pct = totaal ? Math.round((gedaan / totaal) * 100) : 0;

  // groepeer per thema
  const groepen = items.reduce<Record<string, Item[]>>((acc, it) => {
    (acc[it.themaSlug] ||= []).push(it);
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-700">Voortgang</span>
          <span className="text-slate-500">
            {gedaan}/{totaal} ({pct}%)
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brand-600 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        {gedaan > 0 && (
          <button
            onClick={() => setChecked({})}
            className="mt-2 text-xs text-slate-400 hover:text-slate-600"
          >
            Reset
          </button>
        )}
      </div>

      <div className="space-y-4">
        {Object.entries(groepen).map(([slug, lijst]) => (
          <div key={slug} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">{lijst[0].themaTitel}</h3>
              <Link
                href={`/samenvatting/${slug}`}
                className="text-xs font-medium text-brand-600 hover:underline"
              >
                naar thema →
              </Link>
            </div>
            <ul className="space-y-1.5">
              {lijst.map((it) => (
                <li key={it.key}>
                  <label className="flex cursor-pointer items-start gap-2.5 text-sm">
                    <input
                      type="checkbox"
                      checked={!!checked[it.key]}
                      onChange={(e) =>
                        setChecked((c) => ({ ...c, [it.key]: e.target.checked }))
                      }
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600"
                    />
                    <span
                      className={
                        checked[it.key]
                          ? "text-slate-400 line-through"
                          : "text-slate-700"
                      }
                    >
                      {it.doel}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
