import Link from "next/link";
import { getThemas } from "@/lib/data";
import { Card } from "@/components/ui";
import LockBadge from "@/components/LockBadge";
import { isFreeTheme } from "@/lib/access";

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
            <Card className="h-full lift hover:border-brand-300">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-brand-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-bold text-slate-900">{t.titel}</h2>
                {!isFreeTheme(t.slug) && <LockBadge className="ml-auto self-center" />}
                {isFreeTheme(t.slug) && (
                  <span className="ml-auto self-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                    gratis
                  </span>
                )}
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
