"use client";

import { useUnlock } from "@/components/UnlockProvider";

export default function UnlockButton({
  label = "🔓 Code invoeren & ontgrendelen",
}: {
  label?: string;
}) {
  const { ready, unlocked, openUnlock } = useUnlock();

  if (ready && unlocked) {
    return (
      <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
        ✓ Dit toestel is al ontgrendeld. Veel succes!
      </p>
    );
  }

  return (
    <button
      onClick={openUnlock}
      className="rounded-xl bg-brand-600 px-6 py-3 text-base font-bold text-white shadow-sm transition hover:bg-brand-700"
    >
      {label}
    </button>
  );
}
