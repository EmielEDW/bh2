"use client";

import Link from "next/link";
import { useUnlock } from "@/components/UnlockProvider";
import { PRIJS } from "@/lib/access";

export default function PaywallGate({
  children,
  titel = "Dit onderdeel zit in de volledige pack",
  free = false,
}: {
  children: React.ReactNode;
  titel?: string;
  free?: boolean;
}) {
  const { ready, unlocked, openUnlock } = useUnlock();

  if (free) return <>{children}</>;

  if (!ready) {
    return (
      <div className="py-24 text-center text-sm text-slate-300">Laden…</div>
    );
  }
  if (unlocked) return <>{children}</>;

  return (
    <div className="mx-auto max-w-xl py-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-3xl">
          🔒
        </div>
        <h2 className="text-xl font-bold text-slate-900">{titel}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
          Thema 1, 2 en 3 (samenvatting + oefeningen), de rekenmachine en de
          examen-tab zijn <strong>gratis</strong>. Ontgrendel met één code de rest:
          alle thema&apos;s, de MAR-zoeker, de boekingshulp, de BTW-tools, de
          begrippenlijst en alle meerkeuzetoetsen.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <Link
            href="/pro"
            className="w-full rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 sm:w-auto"
          >
            🚀 Bekijk de pack — {PRIJS}
          </Link>
          <button
            onClick={openUnlock}
            className="w-full rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto"
          >
            Ik heb al een code
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Eén code = toegang op max. 2 toestellen.
        </p>
      </div>
    </div>
  );
}
