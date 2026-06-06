import type { Boeking } from "@/lib/types";
import { euro, sum, balanceert } from "@/lib/format";

export default function BoekingTable({
  boeking,
  toonReden = true,
}: {
  boeking: Boeking;
  toonReden?: boolean;
}) {
  const totDebet = sum(boeking.regels.map((r) => r.debet));
  const totCredit = sum(boeking.regels.map((r) => r.credit));
  const ok = balanceert(totDebet, totCredit);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {boeking.omschrijving && (
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2">
          <span className="text-sm font-semibold text-slate-700">
            {boeking.omschrijving}
          </span>
          {boeking.datum && (
            <span className="text-xs text-slate-500">{boeking.datum}</span>
          )}
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-slate-500">
            <th className="px-3 py-1.5 text-left font-medium">Rekening</th>
            <th className="px-3 py-1.5 text-right font-medium">Debet</th>
            <th className="px-3 py-1.5 text-right font-medium">Credit</th>
          </tr>
        </thead>
        <tbody>
          {boeking.regels.map((r, i) => {
            const isDebet = (r.debet ?? 0) > 0;
            return (
              <tr key={i} className="border-t border-slate-100 align-top">
                <td className="px-3 py-2">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-mono text-xs font-semibold text-brand-700">
                      {r.code}
                    </span>
                    <span
                      className={`font-medium ${
                        isDebet ? "text-debet" : "text-credit"
                      }`}
                    >
                      {r.naam}
                    </span>
                  </div>
                  {toonReden && r.reden && (
                    <div className="mt-0.5 text-xs text-slate-500">{r.reden}</div>
                  )}
                </td>
                <td className="px-3 py-2 text-right font-mono tabular-nums text-debet">
                  {r.debet ? euro(r.debet) : ""}
                </td>
                <td className="px-3 py-2 text-right font-mono tabular-nums text-credit">
                  {r.credit ? euro(r.credit) : ""}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold">
            <td className="px-3 py-1.5 text-right text-xs uppercase text-slate-500">
              Totaal
            </td>
            <td className="px-3 py-1.5 text-right font-mono tabular-nums">
              {euro(totDebet)}
            </td>
            <td className="px-3 py-1.5 text-right font-mono tabular-nums">
              {euro(totCredit)}
            </td>
          </tr>
        </tfoot>
      </table>
      {!ok && (
        <div className="border-t border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-700">
          ⚠️ Let op: debet ({euro(totDebet)}) en credit ({euro(totCredit)}) zijn
          niet gelijk — deze boeking is mogelijk nog na te kijken.
        </div>
      )}
    </div>
  );
}
