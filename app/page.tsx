import Link from "next/link";
import { getThemas, getMar, getAlleOefeningen } from "@/lib/data";
import { Card } from "@/components/ui";

const THEMA_ICONS: Record<string, string> = {
  grondbeginselen: "⚖️",
  btw: "🧾",
  "aankoop-verkoop": "🛒",
  voorraden: "📦",
  mva: "🏭",
  "dubieuze-debiteuren": "⚠️",
  "lt-schulden": "🏦",
  "schulden-kt": "📅",
  "overlopende-rekeningen": "🔁",
  "voorzieningen-subsidies": "🛡️",
  "fva-geldbeleggingen": "💹",
  "belastingen-winstbestemming": "💰",
};

export default function Dashboard() {
  const themas = getThemas();
  const mar = getMar();
  const oef = getAlleOefeningen();
  const eigen = mar.rekeningen.filter((r) => r.custom).length;

  const stats = [
    { label: "Thema's", waarde: themas.length, href: "/samenvatting" },
    { label: "Oefeningen", waarde: oef.length, href: "/oefeningen" },
    { label: "MAR-rekeningen", waarde: mar.rekeningen.length, href: "/mar" },
    { label: "Eigen rekeningen", waarde: eigen, href: "/mar" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-10 text-white shadow-lg shadow-brand-900/20 ring-1 ring-white/10 md:px-10 md:py-12">
        <div
          className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-sky-300/10 blur-3xl"
          aria-hidden
        />
        <h1 className="relative text-3xl font-extrabold tracking-tight md:text-4xl">
          Boekhouden 2 — alles om te slagen
        </h1>
        <p className="relative mt-3 max-w-2xl text-brand-50">
          Samenvattingen, uitgewerkte oefeningen met redenering, een complete
          MAR-zoeker en interactieve trainers. Alles gebaseerd op jouw
          lesdocumenten en het ITAA Rekeningenstelsel.
        </p>
        <div className="relative mt-6 flex flex-wrap gap-3">
          <Link
            href="/examen"
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
          >
            🎯 Last-minute examenoverzicht
          </Link>
          <Link
            href="/oefeningen"
            className="rounded-xl bg-brand-500/40 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/40 hover:bg-brand-500/60"
          >
            ✍️ Begin met oefenen
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="text-center transition hover:border-brand-300 hover:shadow-md">
              <div className="text-3xl font-extrabold text-brand-700">
                {s.waarde}
              </div>
              <div className="mt-1 text-sm text-slate-500">{s.label}</div>
            </Card>
          </Link>
        ))}
      </section>

      {/* Studeeradvies */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-slate-900">📋 Hoe studeer je efficiënt?</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            {
              n: "1",
              t: "Begrijp de logica",
              d: "Lees de samenvatting per thema. Snap je waaróm iets debet of credit staat? Train dat met de Debet/Credit-trainer.",
              href: "/samenvatting",
            },
            {
              n: "2",
              t: "Oefen actief",
              d: "Maak de oefeningen eerst in oefenmodus (zonder oplossing). Corrigeer dan met de uitgewerkte redenering.",
              href: "/oefeningen",
            },
            {
              n: "3",
              t: "Automatiseer",
              d: "Train je debet/credit-reflex op de MAR-pagina en loop de examenchecklist door vlak voor de toets.",
              href: "/examen",
            },
          ].map((s) => (
            <Link key={s.n} href={s.href}>
              <Card className="h-full transition hover:border-brand-300 hover:shadow-md">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
                  {s.n}
                </div>
                <h3 className="font-bold text-slate-900">{s.t}</h3>
                <p className="mt-1 text-sm text-slate-600">{s.d}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Thema's */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-slate-900">📚 Thema's</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {themas.map((t) => (
            <Link key={t.slug} href={`/samenvatting/${t.slug}`}>
              <Card className="h-full transition hover:border-brand-300 hover:shadow-md">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{THEMA_ICONS[t.slug] ?? "📒"}</span>
                  <div className="min-w-0">
                    <h3 className="font-bold leading-tight text-slate-900">
                      {t.titel}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                      {t.korteOmschrijving}
                    </p>
                    <div className="mt-2 flex gap-2 text-xs text-slate-400">
                      <span>{t.oefeningen.length} oef.</span>
                      <span>·</span>
                      <span>{t.kernrekeningen.length} rekeningen</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Snelle tools */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-slate-900">🧰 Snelle tools</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { t: "MAR-zoeker", d: "Zoek elke rekening", href: "/mar", icon: "🔢" },
            { t: "Boekingshulp", d: "Welke boeking?", href: "/boekingshulp", icon: "🧭" },
            { t: "BTW-helper", d: "Bereken & boek btw", href: "/btw", icon: "🧾" },
            { t: "Examenchecklist", d: "Wat moet ik kennen?", href: "/examen", icon: "🎯" },
          ].map((t) => (
            <Link key={t.t} href={t.href}>
              <Card className="flex h-full items-center gap-3 transition hover:border-brand-300 hover:shadow-md">
                <span className="text-2xl">{t.icon}</span>
                <div>
                  <h3 className="font-semibold text-slate-900">{t.t}</h3>
                  <p className="text-xs text-slate-500">{t.d}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
