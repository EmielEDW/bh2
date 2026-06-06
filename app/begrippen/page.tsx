import { getAlleBegrippen } from "@/lib/data";
import Begrippenlijst from "@/components/Begrippenlijst";

export const metadata = { title: "Begrippenlijst — Boekhouden 2" };

export default function BegrippenPagina() {
  const begrippen = getAlleBegrippen();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Begrippenlijst</h1>
        <p className="mt-1 text-slate-500">
          {begrippen.length} begrippen uit de cursus, alfabetisch en doorzoekbaar.
          Klik op een thema om naar de volledige uitleg te gaan.
        </p>
      </div>
      {begrippen.length > 0 ? (
        <Begrippenlijst begrippen={begrippen} />
      ) : (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          Nog geen begrippen beschikbaar.
        </p>
      )}
    </div>
  );
}
