import Link from "next/link";
import { notFound } from "next/navigation";
import { getThemas, getThema, getRekeningen } from "@/lib/data";
import OefenLijst from "@/components/OefenLijst";
import MeerkeuzeQuiz from "@/components/MeerkeuzeQuiz";

export function generateStaticParams() {
  return getThemas().map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const t = getThema(params.slug);
  return { title: t ? `Oefeningen — ${t.titel}` : "Oefeningen" };
}

export default function OefeningenThema({ params }: { params: { slug: string } }) {
  const t = getThema(params.slug);
  if (!t) notFound();

  const rekeningen = getRekeningen().map((r) => ({
    code: r.code,
    naam: r.naam,
    natuur: r.natuur,
  }));

  return (
    <div className="space-y-5">
      <div>
        <Link href="/oefeningen" className="text-sm text-brand-600 hover:underline">
          ← Alle oefeningen
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-bold text-slate-900">
            Oefeningen — {t.titel}
          </h1>
          <Link
            href={`/samenvatting/${t.slug}`}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            📘 Naar de samenvatting
          </Link>
        </div>
      </div>

      <OefenLijst oefeningen={t.oefeningen} rekeningen={rekeningen} />

      {t.meerkeuze.length > 0 && (
        <section className="pt-2">
          <h2 className="mb-1 text-xl font-bold text-slate-900">📝 Meerkeuzetoets</h2>
          <p className="mb-3 text-sm text-slate-500">
            Test je kennis met {t.meerkeuze.length} meerkeuzevragen uit de cursus.
          </p>
          <MeerkeuzeQuiz vragen={t.meerkeuze} />
        </section>
      )}
    </div>
  );
}
