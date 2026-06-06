"use client";

import { useState } from "react";
import { euro } from "@/lib/format";

type Scenario = {
  id: string;
  label: string;
  uitleg: string;
  regels: (excl: number, btw: number, incl: number) => {
    code: string;
    naam: string;
    debet?: number;
    credit?: number;
  }[];
};

const SCENARIOS: Scenario[] = [
  {
    id: "aankoop",
    label: "Aankoopfactuur (handelsgoederen)",
    uitleg:
      "Je koopt handelsgoederen. De aftrekbare btw is een vordering op de Staat (411590 ABTW, debet).",
    regels: (excl, btw, incl) => [
      { code: "604000", naam: "Aankopen van handelsgoederen", debet: excl },
      { code: "411590", naam: "Aftrekbare btw (ABTW)", debet: btw },
      { code: "440000", naam: "Leveranciers", credit: incl },
    ],
  },
  {
    id: "verkoop",
    label: "Verkoopfactuur",
    uitleg:
      "Je verkoopt. De verschuldigde btw is een schuld aan de Staat (451540 VBTW, credit).",
    regels: (excl, btw, incl) => [
      { code: "400000", naam: "Klanten", debet: incl },
      { code: "700000", naam: "Verkopen", credit: excl },
      { code: "451540", naam: "Verschuldigde btw (VBTW)", credit: btw },
    ],
  },
  {
    id: "icn",
    label: "Inkomende creditnota (op aankoop)",
    uitleg:
      "Een creditnota van je leverancier draait de aankoop (deels) terug. Alles spiegelt de aankoop.",
    regels: (excl, btw, incl) => [
      { code: "440000", naam: "Leveranciers", debet: incl },
      { code: "604100", naam: "Inkomende creditnota (ICN)", credit: excl },
      { code: "411590", naam: "Aftrekbare btw (ABTW)", credit: btw },
    ],
  },
  {
    id: "ucn",
    label: "Uitgaande creditnota (op verkoop)",
    uitleg:
      "Je stuurt zelf een creditnota naar je klant. Dit spiegelt de verkoop.",
    regels: (excl, btw, incl) => [
      { code: "700100", naam: "Uitgaande creditnota (UCN)", debet: excl },
      { code: "451540", naam: "Verschuldigde btw (VBTW)", debet: btw },
      { code: "400000", naam: "Klanten", credit: incl },
    ],
  },
  {
    id: "medecontractant",
    label: "Aankoop met btw verlegd (medecontractant)",
    uitleg:
      "Bij medecontractant betaal je geen btw aan de leverancier, maar geef je ze zelf aan én trek je ze af. Netto btw = 0.",
    regels: (excl, btw) => [
      { code: "604000", naam: "Aankopen van handelsgoederen", debet: excl },
      { code: "411590", naam: "Aftrekbare btw (ABTW)", debet: btw },
      { code: "440000", naam: "Leveranciers", credit: excl },
      { code: "451550", naam: "Te betalen btw – verlegd", credit: btw },
    ],
  },
];

const TARIEVEN = [0, 6, 12, 21];

export default function BtwHelper() {
  const [bedrag, setBedrag] = useState("1000");
  const [basis, setBasis] = useState<"excl" | "incl">("excl");
  const [tarief, setTarief] = useState(21);
  const [scenarioId, setScenarioId] = useState("aankoop");

  const x = parseFloat(bedrag) || 0;
  let excl: number, btw: number, incl: number;
  if (basis === "excl") {
    excl = x;
    btw = +(x * (tarief / 100)).toFixed(2);
    incl = +(excl + btw).toFixed(2);
  } else {
    incl = x;
    excl = +(x / (1 + tarief / 100)).toFixed(2);
    btw = +(incl - excl).toFixed(2);
  }

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;
  const regels = scenario.regels(excl, btw, incl);
  const totD = regels.reduce((a, r) => a + (r.debet || 0), 0);
  const totC = regels.reduce((a, r) => a + (r.credit || 0), 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
            Bedrag
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={bedrag}
              onChange={(e) => setBedrag(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <select
              value={basis}
              onChange={(e) => setBasis(e.target.value as "excl" | "incl")}
              className="rounded-lg border border-slate-300 px-2 py-2 text-sm"
            >
              <option value="excl">excl. btw</option>
              <option value="incl">incl. btw</option>
            </select>
          </div>
          <div className="mt-3">
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
              Btw-tarief
            </label>
            <div className="flex gap-1.5">
              {TARIEVEN.map((t) => (
                <button
                  key={t}
                  onClick={() => setTarief(t)}
                  className={`flex-1 rounded-lg border py-1.5 text-sm font-medium ${
                    tarief === t
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {t}%
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex justify-between py-1 text-sm">
            <span className="text-slate-500">Maatstaf (excl. btw)</span>
            <span className="font-mono font-semibold">{euro(excl)}</span>
          </div>
          <div className="flex justify-between py-1 text-sm">
            <span className="text-slate-500">Btw ({tarief}%)</span>
            <span className="font-mono font-semibold text-brand-700">
              {euro(btw)}
            </span>
          </div>
          <div className="mt-1 flex justify-between border-t border-slate-200 py-1 text-sm">
            <span className="font-semibold text-slate-700">Totaal (incl.)</span>
            <span className="font-mono font-bold">{euro(incl)}</span>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
          Scenario
        </label>
        <select
          value={scenarioId}
          onChange={(e) => setScenarioId(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          {SCENARIOS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-slate-600">{scenario.uitleg}</p>

        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase text-slate-500">
                <th className="px-3 py-1.5 text-left">Rekening</th>
                <th className="px-3 py-1.5 text-right">Debet</th>
                <th className="px-3 py-1.5 text-right">Credit</th>
              </tr>
            </thead>
            <tbody>
              {regels.map((r, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="px-3 py-2">
                    <span className="font-mono text-xs font-semibold text-brand-700">
                      {r.code}
                    </span>{" "}
                    {r.naam}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-debet">
                    {r.debet ? euro(r.debet) : ""}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-credit">
                    {r.credit ? euro(r.credit) : ""}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold">
                <td className="px-3 py-1.5 text-right text-xs uppercase text-slate-500">
                  Totaal
                </td>
                <td className="px-3 py-1.5 text-right font-mono">{euro(totD)}</td>
                <td className="px-3 py-1.5 text-right font-mono">{euro(totC)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
