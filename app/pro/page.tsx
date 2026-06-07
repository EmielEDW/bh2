import Link from "next/link";
import { getThemas, getAlleOefeningen, getMar, getAlleBegrippen, getAlleMeerkeuze } from "@/lib/data";
import { PRIJS } from "@/lib/access";
import ProActions from "@/components/ProActions";

export const metadata = {
  title: "De volledige pack — Boekhouden 2",
  description:
    "Ontgrendel alle thema's, oefeningen, de MAR-zoeker, boekingshulp, BTW-tools, begrippenlijst en meerkeuzetoetsen voor je examen Boekhouden 2.",
};

export default function ProPagina() {
  const themas = getThemas();
  const oef = getAlleOefeningen().length;
  const mar = getMar().rekeningen.length;
  const begrippen = getAlleBegrippen().length;
  const mc = getAlleMeerkeuze().length;

  const inhoud = [
    { i: "📘", t: `Alle ${themas.length} thema's`, d: "Volledige samenvattingen + verdieping volgens de cursus." },
    { i: "✍️", t: `${oef} uitgewerkte oefeningen`, d: "Met stappenplan, redenering en de juiste MAR-rekeningen." },
    { i: "🛠️", t: "Werkblad + Verbeter", d: "Maak zelf de boeking (journaalpost én T-rekeningen) en laat ze nakijken." },
    { i: "🔢", t: `MAR-zoeker (${mar} rekeningen)`, d: "Plus de debet/credit-trainer." },
    { i: "🧭", t: "Boekingshulp & BTW-tools", d: "Wizard 'welke boeking?' + btw-rekenmachine." },
    { i: "📖", t: `Begrippenlijst (${begrippen})`, d: "Alle definities uit de cursus, doorzoekbaar." },
    { i: "📝", t: `${mc} meerkeuzevragen`, d: "Toets jezelf per thema, met directe feedback." },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-10 text-center text-white shadow-lg shadow-brand-900/20 md:px-10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden />
        <h1 className="relative text-3xl font-extrabold tracking-tight md:text-4xl">
          Slaag voor Boekhouden 2 💪
        </h1>
        <p className="relative mx-auto mt-3 max-w-xl text-brand-50">
          Alles op één plek: duidelijke samenvattingen, uitgewerkte oefeningen met
          redenering, en interactieve tools. <strong>Heel handig als je niet weet
          waar te beginnen</strong> — of net om eindeloos oefeningen in te oefenen.
        </p>
        <div className="relative mt-6">
          <ProActions />
        </div>
        <p className="relative mt-3 text-xs text-brand-100">
          Eénmalig {PRIJS} · werkt op max. 2 toestellen · code meteen per e-mail
        </p>
      </section>

      {/* Gratis vs pack */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-slate-900">🆓 Gratis uitproberen</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
            <li>✅ Thema 1, 2 en 3 — samenvatting + oefeningen</li>
            <li>✅ De rekenmachine</li>
            <li>✅ De examen-tab</li>
          </ul>
          <p className="mt-3 text-xs text-slate-400">Geen account of code nodig.</p>
        </div>
        <div className="rounded-2xl border-2 border-brand-300 bg-brand-50/40 p-5">
          <h2 className="font-bold text-brand-900">🔓 De volledige pack — {PRIJS}</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
            <li>⭐ Alles uit gratis, plus:</li>
            <li>✅ Alle overige thema&apos;s + oefeningen</li>
            <li>✅ MAR-zoeker, boekingshulp & BTW-tools</li>
            <li>✅ Begrippenlijst + alle meerkeuzetoetsen</li>
          </ul>
        </div>
      </section>

      {/* Wat zit erin */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-slate-900">Wat zit er in de pack?</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {inhoud.map((x) => (
            <div key={x.t} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
              <span className="text-xl">{x.i}</span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{x.t}</p>
                <p className="text-xs text-slate-500">{x.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hoe werkt het */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Hoe werkt het?</h2>
        <ol className="space-y-2 text-sm text-slate-600">
          <li><strong>1.</strong> Klik op &ldquo;Koop de pack&rdquo; en betaal veilig via Stripe.</li>
          <li><strong>2.</strong> Je krijgt meteen een <strong>code per e-mail</strong>.</li>
          <li><strong>3.</strong> Vul de code in op de site (knop 🔓 Pro). Klaar — op max. 2 toestellen.</li>
        </ol>
      </section>

      {/* CTA onderaan */}
      <section className="text-center">
        <ProActions />
        <p className="mt-4 text-sm text-slate-500">
          Even snuffelen? <Link href="/" className="text-brand-600 hover:underline">Begin gratis met thema 1-3</Link>.
        </p>
      </section>
    </div>
  );
}
