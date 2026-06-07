"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { STRIPE_LINK } from "@/lib/access";

type Ctx = {
  ready: boolean;
  unlocked: boolean;
  code: string | null;
  openUnlock: () => void;
  lock: () => void;
};

const UnlockContext = createContext<Ctx | null>(null);

export function useUnlock() {
  const c = useContext(UnlockContext);
  if (!c) throw new Error("useUnlock buiten provider");
  return c;
}

function getDeviceId(): string {
  try {
    const bestaand = localStorage.getItem("bh2_device");
    if (bestaand) return bestaand;
    const id: string =
      (crypto as any)?.randomUUID?.() ??
      "d_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("bh2_device", id);
    return id;
  } catch {
    return "anon";
  }
}

export default function UnlockProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    try {
      const c = localStorage.getItem("bh2_code");
      if (c && localStorage.getItem("bh2_unlocked") === "1") {
        setUnlocked(true);
        setCode(c);
      }
    } catch {}
    setReady(true);
  }, []);

  const openUnlock = useCallback(() => setModalOpen(true), []);
  const lock = useCallback(() => {
    setUnlocked(false);
    setCode(null);
    try {
      localStorage.removeItem("bh2_unlocked");
      localStorage.removeItem("bh2_code");
    } catch {}
  }, []);

  const onSuccess = useCallback((c: string) => {
    setUnlocked(true);
    setCode(c);
    setModalOpen(false);
    try {
      localStorage.setItem("bh2_unlocked", "1");
      localStorage.setItem("bh2_code", c);
    } catch {}
  }, []);

  const value = useMemo<Ctx>(
    () => ({ ready, unlocked, code, openUnlock, lock }),
    [ready, unlocked, code, openUnlock, lock]
  );

  return (
    <UnlockContext.Provider value={value}>
      {children}
      {modalOpen && (
        <UnlockModal onClose={() => setModalOpen(false)} onSuccess={onSuccess} />
      )}
    </UnlockContext.Provider>
  );
}

function UnlockModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (code: string) => void;
}) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "bezig" | "fout">("idle");
  const [fout, setFout] = useState("");

  async function probeer() {
    const c = input.trim().toUpperCase();
    if (!c) return;
    setStatus("bezig");
    setFout("");
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: c, deviceId: getDeviceId() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        onSuccess(c);
      } else {
        setStatus("fout");
        setFout(data.error || "Code niet geldig of het toestellimiet is bereikt.");
      }
    } catch {
      setStatus("fout");
      setFout("Kon de code niet controleren. Probeer opnieuw.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-slate-900">🔓 Ontgrendel de volledige pack</h2>
        <p className="mt-1 text-sm text-slate-500">
          Vul je code in (uit de e-mail na je aankoop). Eén code werkt op max. 2 toestellen.
        </p>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && probeer()}
          placeholder="BH2-XXXX-XXXX"
          autoFocus
          className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-center font-mono uppercase tracking-wider outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        />
        {status === "fout" && (
          <p className="mt-2 text-sm text-rose-600">{fout}</p>
        )}
        <button
          onClick={probeer}
          disabled={status === "bezig" || !input.trim()}
          className="mt-4 w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          {status === "bezig" ? "Controleren…" : "Ontgrendelen"}
        </button>
        <p className="mt-3 text-center text-xs text-slate-400">
          Nog geen code?{" "}
          <Link href="/pro" className="text-brand-600 hover:underline" onClick={onClose}>
            Bekijk de pack
          </Link>{" "}
          of{" "}
          <a href={STRIPE_LINK} className="text-brand-600 hover:underline" target="_blank" rel="noreferrer">
            koop direct
          </a>
          .
        </p>
      </div>
    </div>
  );
}
