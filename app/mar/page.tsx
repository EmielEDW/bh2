import { Suspense } from "react";
import { getMar } from "@/lib/data";
import MarZoeker from "@/components/MarZoeker";
import { Card } from "@/components/ui";

export const metadata = { title: "MAR-zoeker — Boekhouden 2" };

export default function MarPagina() {
  const mar = getMar();
  const eigen = mar.rekeningen.filter((r) => r.custom).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">MAR-zoeker</h1>
        <p className="mt-1 text-slate-500">
          Doorzoek alle {mar.rekeningen.length} rekeningen uit het
          rekeningenstelsel — inclusief {eigen} eigen rekeningen van de leerkracht
          (zoals ABTW, VBTW, ICN/UCN). Bron: {mar.bron}.
        </p>
      </div>

      <Suspense fallback={<div className="py-12 text-center text-slate-400">Laden…</div>}>
        <MarZoeker mar={mar} />
      </Suspense>

      <Card>
        <h2 className="mb-2 font-bold text-slate-900">Hoe lees je een MAR-code?</h2>
        <p className="text-sm text-slate-600">
          De <strong>eerste cijfer</strong> is de klasse (1 = eigen vermogen &
          schulden LT, 2 = vaste activa, 3 = voorraden, 4 = vorderingen/schulden KT,
          5 = geld, 6 = kosten, 7 = opbrengsten). De <strong>eerste twee
          cijfers</strong> zijn de rubriek. Rekeningen die eindigen op{" "}
          <span className="font-mono">…9</span> zijn vaak (-)-rekeningen (geboekte
          afschrijvingen/waardeverminderingen) en staan aan de tegenovergestelde
          kant.
        </p>
      </Card>
    </div>
  );
}
