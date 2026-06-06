import Link from "next/link";
import { notFound } from "next/navigation";
import { getThemas, getThema } from "@/lib/data";
import Markdown from "@/components/Markdown";
import BoekingsschemaCard from "@/components/BoekingsschemaCard";
import Controlevragen from "@/components/Controlevragen";
import { NatuurBadge } from "@/components/ui";

export function generateStaticParams() {
  return getThemas().map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const t = getThema(params.slug);
  return { title: t ? `${t.titel} — Samenvatting` : "Samenvatting" };
}

export default function ThemaPagina({ params }: { params: { slug: string } }) {
  const t = getThema(params.slug);
  if (!t) notFound();

  const themas = getThemas();
  const idx = themas.findIndex((x) => x.slug === t.slug);
  const vorige = themas[idx - 1];
  const volgende = themas[idx + 1];

  return (
    <article className="space-y-8">
      <header>
        <Link href="/samenvatting" className="text-sm text-brand-600 hover:underline">
          ← Alle thema&apos;s
        </Link>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
          {t.titel}
        </h1>
        <p className="mt-2 text-slate-600">{t.korteOmschrijving}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/oefeningen/${t.slug}`} className="btn-primary">
            ✍️ Oefeningen ({t.oefeningen.length})
          </Link>
          <Link href="/mar" className="btn-ghost">
            🔢 MAR-zoeker
          </Link>
        </div>
      </header>

      {t.leerdoelen.length > 0 && (
        <section className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
          <h2 className="mb-2 font-bold text-brand-900">🎯 Na dit thema kan je…</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-brand-900/90">
            {t.leerdoelen.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </section>
      )}

      {t.samenvatting && (
        <section>
          <Markdown>{t.samenvatting}</Markdown>
        </section>
      )}

      {t.kernrekeningen.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-900">
            🔢 Kernrekeningen (MAR)
          </h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase text-slate-500">
                  <th className="px-4 py-2 text-left">Code</th>
                  <th className="px-4 py-2 text-left">Naam</th>
                  <th className="px-4 py-2 text-left">Natuur</th>
                  <th className="px-4 py-2 text-left">Wanneer gebruiken</th>
                </tr>
              </thead>
              <tbody>
                {t.kernrekeningen.map((k) => (
                  <tr key={k.code} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-2">
                      <Link
                        href={`/mar?q=${k.code}`}
                        className="font-mono text-xs font-semibold text-brand-700 hover:underline"
                      >
                        {k.code}
                      </Link>
                    </td>
                    <td className="px-4 py-2 font-medium text-slate-800">{k.naam}</td>
                    <td className="px-4 py-2">
                      <NatuurBadge natuur={k.natuur} />
                    </td>
                    <td className="px-4 py-2 text-slate-600">{k.wanneer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {t.boekingsschemas.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-900">
            📐 Boekingsschema&apos;s
          </h2>
          <div className="grid gap-3 lg:grid-cols-2">
            {t.boekingsschemas.map((s, i) => (
              <BoekingsschemaCard key={i} schema={s} />
            ))}
          </div>
        </section>
      )}

      {t.veelgemaakteFouten.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-900">
            ⚠️ Veelgemaakte fouten
          </h2>
          <div className="space-y-2">
            {t.veelgemaakteFouten.map((f, i) => (
              <div
                key={i}
                className="rounded-xl border border-rose-200 bg-rose-50/60 p-4"
              >
                <p className="text-sm font-semibold text-rose-800">❌ {f.fout}</p>
                <p className="mt-1 text-sm text-slate-700">✅ {f.correctie}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {t.controlevragen.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-900">
            ❓ Controlevragen
          </h2>
          <Controlevragen vragen={t.controlevragen} />
        </section>
      )}

      <nav className="flex justify-between border-t border-slate-200 pt-5 text-sm">
        {vorige ? (
          <Link href={`/samenvatting/${vorige.slug}`} className="text-brand-600 hover:underline">
            ← {vorige.titel}
          </Link>
        ) : (
          <span />
        )}
        {volgende ? (
          <Link href={`/samenvatting/${volgende.slug}`} className="text-right text-brand-600 hover:underline">
            {volgende.titel} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
