"use client";

import { useState } from "react";
import type { Controlevraag } from "@/lib/types";

export default function Controlevragen({ vragen }: { vragen: Controlevraag[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const [allesOpen, setAllesOpen] = useState(false);

  function toggle(i: number) {
    setOpen((s) => {
      const n = new Set(s);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  }

  const isOpen = (i: number) => allesOpen || open.has(i);

  return (
    <div>
      <button
        onClick={() => setAllesOpen((a) => !a)}
        className="mb-3 text-sm font-medium text-brand-600 hover:underline"
      >
        {allesOpen ? "Verberg alle antwoorden" : "Toon alle antwoorden"}
      </button>
      <div className="space-y-2">
        {vragen.map((v, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white"
          >
            <button
              onClick={() => toggle(i)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
            >
              <span className="text-sm font-medium text-slate-800">
                <span className="mr-2 text-slate-400">{i + 1}.</span>
                {v.vraag}
              </span>
              <span className="text-slate-400">{isOpen(i) ? "−" : "+"}</span>
            </button>
            {isOpen(i) && (
              <div className="border-t border-slate-100 bg-emerald-50/50 px-4 py-3 text-sm text-slate-700">
                {v.antwoord}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
