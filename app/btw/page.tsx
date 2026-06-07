import Link from "next/link";
import { getThema } from "@/lib/data";
import BtwHelper from "@/components/BtwHelper";
import Markdown from "@/components/Markdown";
import BoekingsschemaCard from "@/components/BoekingsschemaCard";
import PaywallGate from "@/components/PaywallGate";
import { Card } from "@/components/ui";

export const metadata = { title: "BTW — Boekhouden 2" };

// Standaard roosters van de Belgische periodieke btw-aangifte.
// Let op: controleer de exacte vaknummers tegen je eigen cursus.
const VAKKEN = {
  uitgaand: [
    { vak: "00", oms: "Verkopen aan 0% / bijzondere regeling" },
    { vak: "01", oms: "Verkopen aan 6%" },
    { vak: "02", oms: "Verkopen aan 12%" },
    { vak: "03", oms: "Verkopen aan 21%" },
    { vak: "44", oms: "Diensten binnen EU (B2B, verlegd)" },
    { vak: "45", oms: "Handelingen medecontractant (uitgaand)" },
    { vak: "46", oms: "Intracommunautaire leveringen / ABC" },
    { vak: "47", oms: "Andere vrijgestelde handelingen / uitvoer" },
    { vak: "48", oms: "Creditnota's op vak 46 (uitgaand)" },
    { vak: "49", oms: "Creditnota's op andere uitgaande handelingen" },
  ],
  verschuldigd: [
    { vak: "54", oms: "Verschuldigde btw op vakken 01-03 (VBTW)" },
    { vak: "55", oms: "Verschuldigde btw op IC-verwervingen" },
    { vak: "56", oms: "Verschuldigde btw medecontractant (verlegd)" },
    { vak: "57", oms: "Verschuldigde btw op invoer (verlegd)" },
    { vak: "61", oms: "Diverse btw-regularisaties in het nadeel" },
    { vak: "63", oms: "Terug te storten btw (op ontvangen CN)" },
  ],
  inkomend: [
    { vak: "81", oms: "Aankopen handelsgoederen, grond- en hulpstoffen" },
    { vak: "82", oms: "Diensten en diverse goederen" },
    { vak: "83", oms: "Bedrijfsmiddelen (investeringen)" },
    { vak: "84", oms: "Creditnota's op IC-verwervingen (inkomend)" },
    { vak: "85", oms: "Creditnota's op andere inkomende handelingen" },
    { vak: "86", oms: "Intracommunautaire verwervingen" },
    { vak: "87", oms: "Andere inkomende handelingen (medecontractant)" },
  ],
  aftrekbaar: [
    { vak: "59", oms: "Aftrekbare btw (ABTW)" },
    { vak: "62", oms: "Diverse btw-regularisaties in het voordeel" },
    { vak: "64", oms: "Terug te vorderen btw (op uitgereikte CN)" },
  ],
};

function VakTabel({ titel, rijen, kleur }: { titel: string; rijen: { vak: string; oms: string }[]; kleur: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className={`px-4 py-2 text-sm font-bold text-white ${kleur}`}>{titel}</div>
      <table className="w-full text-sm">
        <tbody>
          {rijen.map((r) => (
            <tr key={r.vak} className="border-t border-slate-100">
              <td className="w-12 px-3 py-1.5 text-center font-mono font-bold text-slate-700">
                {r.vak}
              </td>
              <td className="px-3 py-1.5 text-slate-600">{r.oms}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BtwPagina() {
  const btw = getThema("btw");

  return (
    <PaywallGate titel="De BTW-tools zitten in de volledige pack">
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">BTW</h1>
        <p className="mt-1 text-slate-500">
          De belangrijkste btw-regels, de eigen rekeningen van de leerkracht
          (ABTW, VBTW, ICN/UCN…), een rekenmachine die meteen de juiste boeking
          toont, en een overzicht van de aangiftevakken.
        </p>
      </div>

      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-900">
        <p className="font-semibold">💡 411000 / 451000 mogen altijd</p>
        <p className="mt-1 text-brand-900/90">
          De leerkracht splitst de btw in aparte rekeningen (411590 ABTW, 451540 VBTW, 451550
          verlegd, 451560 intracommunautair, 451570 invoer …) zodat je in één oogopslag ziet welke
          soort btw het is. Dat is <strong>optioneel</strong>: je mag de aftrekbare btw altijd op{" "}
          <span className="font-mono">411000</span> (terug te vorderen btw) en de verschuldigde btw op{" "}
          <span className="font-mono">451000</span> (te betalen btw) boeken. In de oefeningen keurt
          de <strong>Verbeter</strong>-knop beide manieren goed.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-900">🧮 BTW-helper</h2>
        <BtwHelper />
      </section>

      {btw && btw.boekingsschemas.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold text-slate-900">📐 Boekingsschema&apos;s</h2>
          <div className="grid gap-3 lg:grid-cols-2">
            {btw.boekingsschemas.map((s, i) => (
              <BoekingsschemaCard key={i} schema={s} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-1 text-lg font-bold text-slate-900">
          🧾 Vakken van de periodieke btw-aangifte
        </h2>
        <p className="mb-3 text-sm text-amber-700">
          ⚠️ Dit is het standaard schema van de Belgische btw-aangifte. De exacte
          vaknummers staan niet allemaal letterlijk in de lesdocumenten — controleer
          ze tegen je eigen cursus.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <VakTabel titel="Uitgaande handelingen (omzet)" rijen={VAKKEN.uitgaand} kleur="bg-rose-500" />
          <VakTabel titel="Verschuldigde btw" rijen={VAKKEN.verschuldigd} kleur="bg-orange-500" />
          <VakTabel titel="Inkomende handelingen (aankopen)" rijen={VAKKEN.inkomend} kleur="bg-brand-600" />
          <VakTabel titel="Aftrekbare btw" rijen={VAKKEN.aftrekbaar} kleur="bg-emerald-600" />
        </div>
      </section>

      {btw && btw.samenvatting && (
        <section>
          <h2 className="mb-3 text-lg font-bold text-slate-900">📘 Theorie</h2>
          <Card>
            <Markdown>{btw.samenvatting}</Markdown>
          </Card>
        </section>
      )}

      {btw && btw.veelgemaakteFouten.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold text-slate-900">⚠️ Veelgemaakte fouten</h2>
          <div className="space-y-2">
            {btw.veelgemaakteFouten.map((f, i) => (
              <div key={i} className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
                <p className="text-sm font-semibold text-rose-800">❌ {f.fout}</p>
                <p className="mt-1 text-sm text-slate-700">✅ {f.correctie}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="text-sm text-slate-500">
        Meer oefeningen?{" "}
        <Link href="/oefeningen/btw" className="font-medium text-brand-600 hover:underline">
          BTW-oefeningen →
        </Link>
      </p>
    </div>
    </PaywallGate>
  );
}
