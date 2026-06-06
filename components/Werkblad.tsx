"use client";

import { useMemo, useState } from "react";
import type { Boeking, MarRekening } from "@/lib/types";
import { euro, balanceert } from "@/lib/format";

type Rek = Pick<MarRekening, "code" | "naam" | "natuur">;
type Side = "debet" | "credit";
type Post = { id: number; code: string; naam: string; side: Side; amount: number };
type ModelLine = { code: string; naam: string; side: Side; amount: number };
type Feedback = {
  status: Record<number, "ok" | "fout">;
  missing: ModelLine[];
  correct: number;
  total: number;
} | null;

let _id = 1;

function flattenModel(model?: Boeking[]): ModelLine[] {
  const out: ModelLine[] = [];
  if (!model) return out;
  for (const b of model)
    for (const r of b.regels) {
      if (r.debet) out.push({ code: r.code, naam: r.naam, side: "debet", amount: r.debet });
      if (r.credit) out.push({ code: r.code, naam: r.naam, side: "credit", amount: r.credit });
    }
  return out;
}

export default function Werkblad({
  rekeningen,
  model,
}: {
  rekeningen: Rek[];
  model?: Boeking[];
}) {
  const [mode, setMode] = useState<"journaal" | "t">("journaal");
  const [posts, setPosts] = useState<Post[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);

  // invoer
  const [zoek, setZoek] = useState("");
  const [gekozen, setGekozen] = useState<Rek | null>(null);
  const [open, setOpen] = useState(false);
  const [bedrag, setBedrag] = useState("");
  const [side, setSide] = useState<Side>("debet");

  const suggesties = useMemo(() => {
    const t = zoek.trim().toLowerCase();
    if (!t || (gekozen && `${gekozen.code} ${gekozen.naam}`.toLowerCase() === t)) return [];
    return rekeningen
      .filter((r) => r.code.includes(t) || r.naam.toLowerCase().includes(t))
      .slice(0, 7);
  }, [zoek, rekeningen, gekozen]);

  const totDebet = posts.filter((p) => p.side === "debet").reduce((a, p) => a + p.amount, 0);
  const totCredit = posts.filter((p) => p.side === "credit").reduce((a, p) => a + p.amount, 0);
  const inEvenwicht = balanceert(totDebet, totCredit) && totDebet > 0;

  function voegToe() {
    const n = parseFloat(bedrag);
    if (!gekozen || !n || n <= 0) return;
    setPosts((p) => [
      ...p,
      { id: _id++, code: gekozen.code, naam: gekozen.naam, side, amount: +n.toFixed(2) },
    ]);
    setZoek("");
    setGekozen(null);
    setBedrag("");
    setFeedback(null);
  }

  function verwijder(id: number) {
    setPosts((p) => p.filter((x) => x.id !== id));
    setFeedback(null);
  }

  function wis() {
    setPosts([]);
    setFeedback(null);
  }

  function verbeter() {
    const modelL = flattenModel(model);
    const used = new Array(modelL.length).fill(false);
    const status: Record<number, "ok" | "fout"> = {};
    for (const p of posts) {
      const idx = modelL.findIndex(
        (m, i) =>
          !used[i] && m.code === p.code && m.side === p.side && Math.abs(m.amount - p.amount) < 0.01
      );
      if (idx >= 0) {
        used[idx] = true;
        status[p.id] = "ok";
      } else {
        status[p.id] = "fout";
      }
    }
    const missing = modelL.filter((_, i) => !used[i]);
    setFeedback({ status, missing, correct: modelL.length - missing.length, total: modelL.length });
  }

  const codes = useMemo(() => {
    const seen: string[] = [];
    posts.forEach((p) => {
      if (!seen.includes(p.code)) seen.push(p.code);
    });
    return seen;
  }, [posts]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-900/[0.02]">
      {/* Kop + modus */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-slate-900">🛠️ Maak zelf de boeking</h4>
        <div className="flex rounded-lg border border-slate-300 bg-white p-0.5 text-sm">
          <button
            onClick={() => setMode("journaal")}
            className={`rounded-md px-3 py-1 font-medium transition ${
              mode === "journaal" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            📋 Journaalpost
          </button>
          <button
            onClick={() => setMode("t")}
            className={`rounded-md px-3 py-1 font-medium transition ${
              mode === "t" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            ⊤ T-rekeningen
          </button>
        </div>
      </div>

      {/* Invoer */}
      <div className="rounded-xl bg-slate-50 p-3">
        <div className="flex flex-wrap items-stretch gap-2">
          <div className="relative min-w-[12rem] flex-1">
            <input
              value={zoek}
              onChange={(e) => {
                setZoek(e.target.value);
                setGekozen(null);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              placeholder="Zoek rekening (code of naam)…"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
            {open && suggesties.length > 0 && (
              <ul className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                {suggesties.map((s) => (
                  <li key={s.code}>
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setGekozen(s);
                        setZoek(`${s.code} ${s.naam}`);
                        setOpen(false);
                      }}
                      className="flex w-full items-baseline gap-2 px-3 py-1.5 text-left text-sm hover:bg-brand-50"
                    >
                      <span className="font-mono text-xs font-semibold text-brand-700">{s.code}</span>
                      <span className="truncate">{s.naam}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <input
            type="number"
            inputMode="decimal"
            value={bedrag}
            onChange={(e) => setBedrag(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && voegToe()}
            placeholder="Bedrag"
            className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-right text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          />

          <div className="flex rounded-lg border border-slate-300 bg-white p-0.5">
            {(["debet", "credit"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSide(s)}
                className={`rounded-md px-3 py-1.5 text-sm font-semibold capitalize transition ${
                  side === s
                    ? s === "debet"
                      ? "bg-debet-bg text-debet"
                      : "bg-credit-bg text-credit"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={voegToe}
            disabled={!gekozen || !parseFloat(bedrag)}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            + Toevoegen
          </button>
        </div>
      </div>

      {/* Visualisatie */}
      <div className="mt-3">
        {posts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-400">
            Nog niets geboekt. Zoek een rekening, vul een bedrag in en kies debet of credit.
          </p>
        ) : mode === "journaal" ? (
          <JournaalWeergave posts={posts} feedback={feedback} onRemove={verwijder} />
        ) : (
          <TWeergave posts={posts} codes={codes} feedback={feedback} onRemove={verwijder} />
        )}
      </div>

      {/* Totalen + acties */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {posts.length > 0 && (
          <button onClick={wis} className="text-sm text-slate-400 hover:text-slate-600">
            Wissen
          </button>
        )}
        <div className="ml-auto flex items-center gap-3 text-sm">
          <span>
            D <span className="font-mono font-semibold text-debet">{euro(totDebet)}</span>
          </span>
          <span>
            C <span className="font-mono font-semibold text-credit">{euro(totCredit)}</span>
          </span>
          <span
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
              inEvenwicht ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
            }`}
          >
            {inEvenwicht
              ? "✓ In evenwicht"
              : posts.length === 0
              ? "—"
              : `Verschil ${euro(Math.abs(totDebet - totCredit))}`}
          </span>
          {model && model.length > 0 && (
            <button
              onClick={verbeter}
              disabled={posts.length === 0}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-40"
            >
              ✅ Verbeter
            </button>
          )}
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="mt-3 space-y-2">
          <div
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
              feedback.missing.length === 0 &&
              Object.values(feedback.status).every((s) => s === "ok")
                ? "bg-emerald-50 text-emerald-800"
                : "bg-amber-50 text-amber-800"
            }`}
          >
            {feedback.correct}/{feedback.total} juiste regels
            {feedback.missing.length === 0 &&
            Object.values(feedback.status).every((s) => s === "ok")
              ? " — alles juist! 🎉"
              : ""}
          </div>
          {feedback.missing.length > 0 && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/60 px-4 py-3 text-sm">
              <p className="mb-1 font-semibold text-rose-800">Nog ontbrekend:</p>
              <ul className="space-y-0.5">
                {feedback.missing.map((m, i) => (
                  <li key={i} className="text-slate-700">
                    <span className="font-mono text-xs font-semibold text-brand-700">{m.code}</span>{" "}
                    {m.naam} —{" "}
                    <span className={m.side === "debet" ? "text-debet" : "text-credit"}>
                      {m.side} {euro(m.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Journaalpost-weergave ---------- */
function JournaalWeergave({
  posts,
  feedback,
  onRemove,
}: {
  posts: Post[];
  feedback: Feedback;
  onRemove: (id: number) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-xs uppercase text-slate-500">
            <th className="px-3 py-1.5 text-left">Rekening</th>
            <th className="px-3 py-1.5 text-right">Debet</th>
            <th className="px-3 py-1.5 text-right">Credit</th>
            <th className="w-8" />
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => {
            const st = feedback?.status[p.id];
            return (
              <tr
                key={p.id}
                className={`border-t border-slate-100 ${
                  st === "ok" ? "bg-emerald-50/60" : st === "fout" ? "bg-rose-50/60" : ""
                }`}
              >
                <td className="px-3 py-2">
                  <span className="font-mono text-xs font-semibold text-brand-700">{p.code}</span>{" "}
                  <span className="text-slate-800">{p.naam}</span>
                  {st === "ok" && <span className="ml-1 text-emerald-600">✓</span>}
                  {st === "fout" && <span className="ml-1 text-rose-500">✗</span>}
                </td>
                <td className="px-3 py-2 text-right font-mono text-debet">
                  {p.side === "debet" ? euro(p.amount) : ""}
                </td>
                <td className="px-3 py-2 text-right font-mono text-credit">
                  {p.side === "credit" ? euro(p.amount) : ""}
                </td>
                <td className="pr-2 text-center">
                  <button
                    onClick={() => onRemove(p.id)}
                    className="text-slate-300 hover:text-rose-500"
                    aria-label="Verwijder"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- T-rekening-weergave ---------- */
function TWeergave({
  posts,
  codes,
  feedback,
  onRemove,
}: {
  posts: Post[];
  codes: string[];
  feedback: Feedback;
  onRemove: (id: number) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {codes.map((code) => {
        const groep = posts.filter((p) => p.code === code);
        const naam = groep[0]?.naam ?? "";
        const debet = groep.filter((p) => p.side === "debet");
        const credit = groep.filter((p) => p.side === "credit");
        const sd = debet.reduce((a, p) => a + p.amount, 0);
        const sc = credit.reduce((a, p) => a + p.amount, 0);
        const saldo = sd - sc;
        const rows = Math.max(debet.length, credit.length, 1);
        return (
          <div key={code} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 bg-slate-50 px-3 py-1.5 text-center">
              <span className="font-mono text-xs font-semibold text-brand-700">{code}</span>{" "}
              <span className="text-sm font-semibold text-slate-800">{naam}</span>
            </div>
            <div className="grid grid-cols-2">
              <div className="border-r border-slate-300">
                <div className="border-b border-slate-100 bg-debet-bg/50 px-2 py-0.5 text-center text-[11px] font-bold uppercase text-debet">
                  Debet
                </div>
                {Array.from({ length: rows }).map((_, i) => {
                  const p = debet[i];
                  const st = p && feedback?.status[p.id];
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-between px-2 py-1 text-sm ${
                        st === "ok" ? "bg-emerald-50" : st === "fout" ? "bg-rose-50" : ""
                      }`}
                    >
                      {p ? (
                        <>
                          <span className="font-mono text-debet">{euro(p.amount)}</span>
                          <button
                            onClick={() => onRemove(p.id)}
                            className="text-slate-300 hover:text-rose-500"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-200">·</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div>
                <div className="border-b border-slate-100 bg-credit-bg/50 px-2 py-0.5 text-center text-[11px] font-bold uppercase text-credit">
                  Credit
                </div>
                {Array.from({ length: rows }).map((_, i) => {
                  const p = credit[i];
                  const st = p && feedback?.status[p.id];
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-between px-2 py-1 text-sm ${
                        st === "ok" ? "bg-emerald-50" : st === "fout" ? "bg-rose-50" : ""
                      }`}
                    >
                      {p ? (
                        <>
                          <span className="font-mono text-credit">{euro(p.amount)}</span>
                          <button
                            onClick={() => onRemove(p.id)}
                            className="text-slate-300 hover:text-rose-500"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-200">·</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="border-t border-slate-200 bg-slate-50 px-2 py-1 text-center text-xs text-slate-600">
              saldo:{" "}
              <span className={`font-mono font-semibold ${saldo >= 0 ? "text-debet" : "text-credit"}`}>
                {euro(Math.abs(saldo))} {saldo >= 0 ? "D" : "C"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
