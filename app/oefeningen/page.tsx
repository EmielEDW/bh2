import Link from "next/link";
import { getThemas } from "@/lib/data";
import { Card } from "@/components/ui";

export const metadata = { title: "Oefeningen — Boekhouden 2" };

export default function OefeningenOverzicht() {
  const themas = getThemas();
  const totaal = themas.reduce((a, t) => a + t.oefeningen.length, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Oefeningen</h1>
        <p className="mt-1 text-slate-500">
          {totaal} uitgewerkte oefeningen over {themas.length} thema&apos;s. Kies een
          thema en oefen in oefen- of correctiemodus, met volledige redenering en
          de juiste MAR-rekeningen.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {themas.map((t) => {
          const perNiveau = {
            basis: t.oefeningen.filter((o) => o.niveau === "basis").length,
            midden: t.oefeningen.filter((o) => o.niveau === "midden").length,
            examen: t.oefeningen.filter((o) => o.niveau === "examen").length,
          };
          return (
            <Link key={t.slug} href={`/oefeningen/${t.slug}`}>
              <Card className="h-full transition hover:border-brand-300 hover:shadow-md">
                <h2 className="font-bold text-slate-900">{t.titel}</h2>
                <p className="mt-1 text-2xl font-extrabold text-brand-700">
                  {t.oefeningen.length}
                  <span className="ml-1 text-sm font-normal text-slate-400">
                    oefeningen
                  </span>
                </p>
                <div className="mt-2 flex gap-1.5 text-xs">
                  {perNiveau.basis > 0 && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
                      {perNiveau.basis} basis
                    </span>
                  )}
                  {perNiveau.midden > 0 && (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">
                      {perNiveau.midden} midden
                    </span>
                  )}
                  {perNiveau.examen > 0 && (
                    <span className="rounded-full bg-rose-50 px-2 py-0.5 text-rose-700">
                      {perNiveau.examen} examen
                    </span>
                  )}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
