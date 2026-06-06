import { getAlleFlashcards, getRekeningen } from "@/lib/data";
import Flashcards from "@/components/Flashcards";
import DebetCreditTrainer from "@/components/DebetCreditTrainer";

export const metadata = { title: "Flashcards — Boekhouden 2" };

export default function FlashcardsPagina() {
  const cards = getAlleFlashcards();
  const rekeningen = getRekeningen();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Flashcards</h1>
        <p className="mt-1 text-slate-500">
          {cards.length} kaarten met begrippen, MAR-codes en boekingslogica. Klik
          om te draaien, filter per thema, of shuffle.
        </p>
      </div>

      <Flashcards cards={cards} />

      <section>
        <h2 className="mb-1 text-xl font-bold text-slate-900">
          ⚡ Debet/Credit-trainer
        </h2>
        <p className="mb-3 text-sm text-slate-500">
          De snelste manier om de debet/credit-reflex te automatiseren: kies of de
          getoonde rekening normaal in debet of credit stijgt.
        </p>
        <div className="mx-auto max-w-xl">
          <DebetCreditTrainer rekeningen={rekeningen} />
        </div>
      </section>
    </div>
  );
}
