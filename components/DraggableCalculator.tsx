"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Pos = { x: number; y: number };

export default function DraggableCalculator() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // beginpositie (rechtsonder) + onthouden in localStorage
  useEffect(() => {
    if (pos) return;
    try {
      const saved = localStorage.getItem("bh2-calc-pos");
      if (saved) {
        setPos(JSON.parse(saved));
        return;
      }
    } catch {}
    const w = 264;
    setPos({ x: Math.max(8, window.innerWidth - w - 20), y: Math.max(72, window.innerHeight - 460) });
  }, [pos]);

  useEffect(() => {
    if (pos) {
      try {
        localStorage.setItem("bh2-calc-pos", JSON.stringify(pos));
      } catch {}
    }
  }, [pos]);

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!dragRef.current) return;
    const w = panelRef.current?.offsetWidth ?? 264;
    const h = panelRef.current?.offsetHeight ?? 360;
    const x = Math.min(Math.max(4, e.clientX - dragRef.current.dx), window.innerWidth - w - 4);
    const y = Math.min(Math.max(4, e.clientY - dragRef.current.dy), window.innerHeight - 40);
    setPos({ x, y });
  }, []);

  const stopDrag = useCallback(() => {
    dragRef.current = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", stopDrag);
  }, [onPointerMove]);

  function startDrag(e: React.PointerEvent) {
    if (!pos) return;
    dragRef.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stopDrag);
  }

  return (
    <>
      {/* Zwevende knop */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-xl text-white shadow-lg shadow-brand-700/30 transition hover:scale-105 hover:bg-brand-700"
        aria-label="Rekenmachine"
        title="Rekenmachine"
      >
        🧮
      </button>

      {open && pos && (
        <div
          ref={panelRef}
          className="fixed z-[61] w-64 select-none overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-slate-900/10"
          style={{ left: pos.x, top: pos.y }}
        >
          <div
            onPointerDown={startDrag}
            className="flex cursor-grab items-center justify-between bg-slate-800 px-3 py-2 text-white active:cursor-grabbing"
          >
            <span className="flex items-center gap-1.5 text-sm font-semibold">
              <span className="text-slate-400">⠿</span> Rekenmachine
            </span>
            <button
              onClick={() => setOpen(false)}
              className="rounded p-0.5 text-slate-300 hover:bg-white/10 hover:text-white"
              aria-label="Sluiten"
            >
              ✕
            </button>
          </div>
          <Calculator />
        </div>
      )}
    </>
  );
}

function Calculator() {
  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [verwacht, setVerwacht] = useState(true); // verwacht een nieuw getal

  function compute(a: number, b: number, o: string): number {
    switch (o) {
      case "+": return a + b;
      case "−": return a - b;
      case "×": return a * b;
      case "÷": return b === 0 ? NaN : a / b;
      default: return b;
    }
  }

  function invoerCijfer(d: string) {
    setDisplay((cur) => {
      if (verwacht) {
        setVerwacht(false);
        return d === "." ? "0." : d;
      }
      if (d === "." && cur.includes(".")) return cur;
      if (cur === "0" && d !== ".") return d;
      return (cur + d).slice(0, 14);
    });
  }

  function kiesOp(o: string) {
    const huidig = parseFloat(display);
    if (op !== null && !verwacht && stored !== null) {
      const res = compute(stored, huidig, op);
      setStored(res);
      setDisplay(format(res));
    } else {
      setStored(huidig);
    }
    setOp(o);
    setVerwacht(true);
  }

  function isGelijk() {
    if (op === null || stored === null) return;
    const res = compute(stored, parseFloat(display), op);
    setDisplay(format(res));
    setStored(null);
    setOp(null);
    setVerwacht(true);
  }

  function wis() {
    setDisplay("0");
    setStored(null);
    setOp(null);
    setVerwacht(true);
  }

  function backspace() {
    setDisplay((c) => (c.length <= 1 || (c.length === 2 && c.startsWith("-")) ? "0" : c.slice(0, -1)));
  }

  function procent() {
    setDisplay((c) => format(parseFloat(c) / 100));
    setVerwacht(true);
  }

  function plusmin() {
    setDisplay((c) => (c === "0" ? c : c.startsWith("-") ? c.slice(1) : "-" + c));
  }

  function format(n: number): string {
    if (!isFinite(n)) return "Fout";
    const r = Math.round(n * 1e9) / 1e9;
    return String(r).slice(0, 14);
  }

  const Knop = ({
    label,
    onClick,
    variant = "num",
    wide,
  }: {
    label: string;
    onClick: () => void;
    variant?: "num" | "op" | "fn" | "eq";
    wide?: boolean;
  }) => {
    const cls = {
      num: "bg-slate-50 text-slate-800 hover:bg-slate-100",
      op: "bg-brand-50 text-brand-700 hover:bg-brand-100 font-semibold",
      fn: "bg-slate-100 text-slate-600 hover:bg-slate-200",
      eq: "bg-brand-600 text-white hover:bg-brand-700",
    }[variant];
    return (
      <button
        onClick={onClick}
        className={`h-11 rounded-lg text-sm transition ${cls} ${wide ? "col-span-2" : ""}`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="p-3">
      <div className="mb-2 overflow-hidden rounded-lg bg-slate-900 px-3 py-2 text-right">
        <div className="h-4 text-xs text-slate-400">
          {stored !== null && op ? `${format(stored)} ${op}` : " "}
        </div>
        <div className="truncate font-mono text-2xl text-white">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        <Knop label="C" onClick={wis} variant="fn" />
        <Knop label="±" onClick={plusmin} variant="fn" />
        <Knop label="%" onClick={procent} variant="fn" />
        <Knop label="÷" onClick={() => kiesOp("÷")} variant="op" />

        <Knop label="7" onClick={() => invoerCijfer("7")} />
        <Knop label="8" onClick={() => invoerCijfer("8")} />
        <Knop label="9" onClick={() => invoerCijfer("9")} />
        <Knop label="×" onClick={() => kiesOp("×")} variant="op" />

        <Knop label="4" onClick={() => invoerCijfer("4")} />
        <Knop label="5" onClick={() => invoerCijfer("5")} />
        <Knop label="6" onClick={() => invoerCijfer("6")} />
        <Knop label="−" onClick={() => kiesOp("−")} variant="op" />

        <Knop label="1" onClick={() => invoerCijfer("1")} />
        <Knop label="2" onClick={() => invoerCijfer("2")} />
        <Knop label="3" onClick={() => invoerCijfer("3")} />
        <Knop label="+" onClick={() => kiesOp("+")} variant="op" />

        <Knop label="0" onClick={() => invoerCijfer("0")} wide />
        <Knop label="." onClick={() => invoerCijfer(".")} />
        <Knop label="=" onClick={isGelijk} variant="eq" />
      </div>
      <button
        onClick={backspace}
        className="mt-1.5 w-full rounded-lg bg-slate-100 py-1.5 text-xs text-slate-500 hover:bg-slate-200"
      >
        ⌫ Backspace
      </button>
    </div>
  );
}
