"use client";

import { useMemo, useState } from "react";
import type { MarRekening } from "@/lib/types";
import { euro, balanceert } from "@/lib/format";

type Regel = {
  id: number;
  code: string;
  naam: string;
  natuur: string;
  debet: string;
  credit: string;
};

let _id = 1;
const nieuweRegel = (): Regel => ({
  id: _id++,
  code: "",
  naam: "",
  natuur: "",
  debet: "",
  credit: "",
});

export default function JournaalpostBuilder({
  rekeningen,
}: {
  rekeningen: Pick<MarRekening, "code" | "naam" | "natuur">[];
}) {
  const [regels, setRegels] = useState<Regel[]>(() => [
    nieuweRegel(),
    nieuweRegel(),
  ]);

  const totDebet = regels.reduce((a, r) => a + (parseFloat(r.debet) || 0), 0);
  const totCredit = regels.reduce((a, r) => a + (parseFloat(r.credit) || 0), 0);
  const ok = balanceert(totDebet, totCredit) && totDebet > 0;

  function update(id: number, patch: Partial<Regel>) {
    setRegels((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function verwijder(id: number) {
    setRegels((rs) => (rs.length > 1 ? rs.filter((r) => r.id !== id) : rs));
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-3 text-sm text-slate-600">
        Bouw zelf een journaalpost. Zoek een rekening, vul debet óf credit in, en
        kijk of de boeking in evenwicht is.
      </p>

      <div className="space-y-2">
        {regels.map((r) => (
          <RegelRij
            key={r.id}
            regel={r}
            rekeningen={rekeningen}
            onUpdate={(p) => update(r.id, p)}
            onVerwijder={() => verwijder(r.id)}
          />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setRegels((rs) => [...rs, nieuweRegel()])}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-50"
        >
          + Regel toevoegen
        </button>
        <button
          onClick={() => setRegels([nieuweRegel(), nieuweRegel()])}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-50"
        >
          Wissen
        </button>

        <div className="ml-auto flex items-center gap-4 text-sm">
          <span>
            Debet:{" "}
            <span className="font-mono font-semibold text-debet">
              {euro(totDebet)}
            </span>
          </span>
          <span>
            Credit:{" "}
            <span className="font-mono font-semibold text-credit">
              {euro(totCredit)}
            </span>
          </span>
          <span
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
              ok
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {ok
              ? "✓ In evenwicht"
              : totDebet === 0 && totCredit === 0
              ? "Vul bedragen in"
              : `Verschil ${euro(Math.abs(totDebet - totCredit))}`}
          </span>
        </div>
      </div>
    </div>
  );
}

function RegelRij({
  regel,
  rekeningen,
  onUpdate,
  onVerwijder,
}: {
  regel: Regel;
  rekeningen: Pick<MarRekening, "code" | "naam" | "natuur">[];
  onUpdate: (p: Partial<Regel>) => void;
  onVerwijder: () => void;
}) {
  const [zoek, setZoek] = useState(regel.code ? `${regel.code} ${regel.naam}` : "");
  const [open, setOpen] = useState(false);

  const suggesties = useMemo(() => {
    const t = zoek.trim().toLowerCase();
    if (!t || (regel.code && `${regel.code} ${regel.naam}`.toLowerCase() === t))
      return [];
    return rekeningen
      .filter(
        (r) => r.code.includes(t) || r.naam.toLowerCase().includes(t)
      )
      .slice(0, 8);
  }, [zoek, rekeningen, regel.code, regel.naam]);

  return (
    <div className="flex flex-wrap items-start gap-2 sm:flex-nowrap">
      <div className="relative min-w-0 flex-1">
        <input
          value={zoek}
          onChange={(e) => {
            setZoek(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Zoek rekening (code of naam)…"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        />
        {open && suggesties.length > 0 && (
          <ul className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
            {suggesties.map((s) => (
              <li key={s.code}>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onUpdate({ code: s.code, naam: s.naam, natuur: s.natuur });
                    setZoek(`${s.code} ${s.naam}`);
                    setOpen(false);
                  }}
                  className="flex w-full items-baseline gap-2 px-3 py-1.5 text-left text-sm hover:bg-brand-50"
                >
                  <span className="font-mono text-xs font-semibold text-brand-700">
                    {s.code}
                  </span>
                  <span className="truncate">{s.naam}</span>
                  <span className="ml-auto text-xs text-slate-400">
                    {s.natuur}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <input
        type="number"
        inputMode="decimal"
        value={regel.debet}
        onChange={(e) =>
          onUpdate({ debet: e.target.value, credit: e.target.value ? "" : regel.credit })
        }
        placeholder="Debet"
        className="w-24 rounded-lg border border-slate-300 px-2 py-2 text-right text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
      />
      <input
        type="number"
        inputMode="decimal"
        value={regel.credit}
        onChange={(e) =>
          onUpdate({ credit: e.target.value, debet: e.target.value ? "" : regel.debet })
        }
        placeholder="Credit"
        className="w-24 rounded-lg border border-slate-300 px-2 py-2 text-right text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
      />
      <button
        onClick={onVerwijder}
        className="rounded-lg px-2 py-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
        aria-label="Verwijder regel"
      >
        ✕
      </button>
    </div>
  );
}
