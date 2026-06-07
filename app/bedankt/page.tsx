import Link from "next/link";
import UnlockButton from "@/components/UnlockButton";

export const metadata = { title: "Bedankt voor je aankoop — Boekhouden 2" };

export default function BedanktPagina() {
  return (
    <div className="mx-auto max-w-lg py-10 text-center">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-4xl">
          🎉
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Bedankt voor je aankoop!</h1>
        <p className="mx-auto mt-2 max-w-md text-slate-600">
          Je betaling is gelukt. Je <strong>toegangscode</strong> komt binnen enkele
          minuten per e-mail (kijk ook even in je spam/ongewenst).
        </p>
        <div className="mt-6">
          <UnlockButton />
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Eén code werkt op max. 2 toestellen. Geen e-mail na 10 minuten? Mail{" "}
          <a href="mailto:emieldewaele@gmail.com" className="text-brand-600 hover:underline">
            emieldewaele@gmail.com
          </a>
          .
        </p>
        <div className="mt-6">
          <Link href="/" className="text-sm font-medium text-brand-600 hover:underline">
            ← Naar de studieomgeving
          </Link>
        </div>
      </div>
    </div>
  );
}
