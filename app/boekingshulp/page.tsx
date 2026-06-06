import { getRekeningen } from "@/lib/data";
import BoekingshulpWizard from "@/components/BoekingshulpWizard";
import JournaalpostBuilder from "@/components/JournaalpostBuilder";

export const metadata = { title: "Boekingshulp — Boekhouden 2" };

export default function BoekingshulpPagina() {
  const rekeningen = getRekeningen().map((r) => ({
    code: r.code,
    naam: r.naam,
    natuur: r.natuur,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Boekingshulp</h1>
        <p className="mt-1 text-slate-500">
          Weet je niet welke boeking je nodig hebt? Laat je leiden door de wizard,
          of bouw zelf een journaalpost en controleer of die in evenwicht is.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-900">
          🧭 Welke boeking heb ik nodig?
        </h2>
        <BoekingshulpWizard />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-900">
          🛠️ Journaalpost-builder
        </h2>
        <JournaalpostBuilder rekeningen={rekeningen} />
      </section>
    </div>
  );
}
