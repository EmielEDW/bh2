import type { Boekingsschema } from "@/lib/types";

export default function BoekingsschemaCard({ schema }: { schema: Boekingsschema }) {
  const debet = schema.regels.filter((r) => r.kant === "debet");
  const credit = schema.regels.filter((r) => r.kant === "credit");
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-2">
        <h4 className="font-semibold text-slate-800">{schema.titel}</h4>
        {schema.situatie && (
          <p className="text-xs text-slate-500">{schema.situatie}</p>
        )}
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs uppercase text-slate-400">
            <th className="px-4 py-1.5 text-left font-medium text-debet">Debet</th>
            <th className="px-4 py-1.5 text-left font-medium text-credit">Credit</th>
          </tr>
        </thead>
        <tbody>
          <tr className="align-top">
            <td className="border-r border-slate-100 px-4 py-2">
              <ul className="space-y-1.5">
                {debet.map((r, i) => (
                  <li key={i}>
                    <span className="font-mono text-xs font-semibold text-brand-700">
                      {r.code}
                    </span>{" "}
                    <span className="font-medium text-slate-800">{r.naam}</span>
                    {r.bedrag && (
                      <span className="ml-1 text-xs text-slate-400">({r.bedrag})</span>
                    )}
                    {r.toelichting && (
                      <div className="text-xs text-slate-500">{r.toelichting}</div>
                    )}
                  </li>
                ))}
              </ul>
            </td>
            <td className="px-4 py-2">
              <ul className="space-y-1.5">
                {credit.map((r, i) => (
                  <li key={i} className="pl-3">
                    <span className="font-mono text-xs font-semibold text-brand-700">
                      {r.code}
                    </span>{" "}
                    <span className="font-medium text-slate-800">{r.naam}</span>
                    {r.bedrag && (
                      <span className="ml-1 text-xs text-slate-400">({r.bedrag})</span>
                    )}
                    {r.toelichting && (
                      <div className="text-xs text-slate-500">{r.toelichting}</div>
                    )}
                  </li>
                ))}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
