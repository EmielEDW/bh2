import Link from "next/link";
import { getThemas } from "@/lib/data";
import { Card } from "@/components/ui";

export const metadata = { title: "Samenvatting — Boekhouden 2" };

export default function SamenvattingOverzicht() {
  const themas = getThemas();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Samenvatting per thema</h1>
        <p className="mt-1 text-slate-500">
          Elk thema bevat een uitgelegde samenvatting, de kernrekeningen,
          boekingsschema&apos;s, veelgemaakte fouten en controlevragen.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {themas.map((t, i) => (
          <Link key={t.slug} href={`/samenvatting/${t.slug}`}>
            <Card className="h-full transition hover:border-brand-300 hover:shadow-md">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-brand-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-bold text-slate-900">{t.titel}</h2>
              </div>
              <p className="mt-1 text-sm text-slate-600">{t.korteOmschrijving}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {t.kernrekeningen.slice(0, 5).map((k) => (
                  <span
                    key={k.code}
                    className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-600"
                  >
                    {k.code}
                  </span>
                ))}
                {t.kernrekeningen.length > 5 && (
                  <span className="px-1 text-xs text-slate-400">
                    +{t.kernrekeningen.length - 5}
                  </span>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
