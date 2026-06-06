import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Boekhouden 2 — Studie & Oefenen",
  description:
    "Volledige studie- en oefenomgeving voor het examen Boekhouden 2 (BH2): samenvatting, oefeningen, MAR-zoeker, boekingshulp, BTW en flashcards.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body>
        <Nav />
        <main className="mx-auto max-w-6xl px-4 py-6 md:py-8">{children}</main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-slate-500">
            Studiehulp Boekhouden 2 · gebaseerd op de lesdocumenten en het ITAA
            Rekeningenstelsel 2021 (MAR). Controleer altijd tegen je eigen cursus.
          </div>
        </footer>
      </body>
    </html>
  );
}
