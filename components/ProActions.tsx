"use client";

import { useUnlock } from "@/components/UnlockProvider";
import { STRIPE_LINK, PRIJS } from "@/lib/access";

export default function ProActions() {
  const { ready, unlocked, openUnlock } = useUnlock();

  if (ready && unlocked) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center text-emerald-800">
        <p className="font-semibold">✓ Je hebt de volledige pack al ontgrendeld op dit toestel.</p>
        <p className="mt-1 text-sm">Veel succes met studeren!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <a
        href={STRIPE_LINK}
        target="_blank"
        rel="noreferrer"
        className="w-full rounded-xl bg-brand-600 px-6 py-3 text-center text-base font-bold text-white shadow-sm shadow-brand-600/20 transition hover:bg-brand-700 hover:shadow-md sm:w-auto"
      >
        🚀 Koop de pack — {PRIJS}
      </a>
      <button
        onClick={openUnlock}
        className="w-full rounded-xl border border-slate-300 bg-white px-6 py-3 text-center text-base font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
      >
        Ik heb al een code
      </button>
    </div>
  );
}
