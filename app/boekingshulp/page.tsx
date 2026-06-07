import { getRekeningen } from "@/lib/data";
import BoekingshulpWizard from "@/components/BoekingshulpWizard";
import Werkblad from "@/components/Werkblad";
import PaywallGate from "@/components/PaywallGate";

export const metadata = { title: "Boekingshulp — Boekhouden 2" };

export default function BoekingshulpPagina() {
  const rekeningen = getRekeningen().map((r) => ({
    code: r.code,
    naam: r.naam,
    natuur: r.natuur,
  }));

  return (
    <PaywallGate titel="De boekingshulp zit in de volledige pack">
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
        <h2 className="mb-1 text-lg font-bold text-slate-900">
          🛠️ Werkblad: journaalpost & T-rekeningen
        </h2>
        <p className="mb-3 text-sm text-slate-500">
          Boek vrij en controleer of je in evenwicht bent. Schakel met de toggle tussen de
          journaalpost- en de T-rekening-weergave. (In de oefeningen kan je dit werkblad ook
          gebruiken én je antwoord laten verbeteren.)
        </p>
        <Werkblad rekeningen={rekeningen} />
      </section>
    </div>
    </PaywallGate>
  );
}
