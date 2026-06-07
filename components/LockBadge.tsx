"use client";

import { useUnlock } from "@/components/UnlockProvider";

/** Toont een klein slotje zolang de pack niet ontgrendeld is. */
export default function LockBadge({ className = "" }: { className?: string }) {
  const { ready, unlocked } = useUnlock();
  if (!ready || unlocked) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700 ${className}`}
      title="Zit in de volledige pack"
    >
      🔒 Pro
    </span>
  );
}
