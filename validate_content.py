#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Controleert de studie-content tegen de MAR (bron van waarheid).
- Elke gebruikte rekeningcode moet bestaan in data/mar.json.
- Elke boeking moet balanceren (som debet == som credit).
Gebruik:  python3 validate_content.py
Exit-code 0 = alles ok, 1 = problemen gevonden.
"""
import json, glob, os, sys

BASE = os.path.dirname(os.path.abspath(__file__))

def main():
    mar = json.load(open(os.path.join(BASE, "data", "mar.json"), encoding="utf-8"))
    valid = {r["code"] for r in mar["rekeningen"]}
    problemen, onbekend = [], {}
    oef = fc = 0
    files = sorted(glob.glob(os.path.join(BASE, "data", "themes", "*.json")))
    for f in files:
        slug = os.path.basename(f)[:-5]
        try:
            d = json.load(open(f, encoding="utf-8"))
        except Exception as e:
            problemen.append(f"{slug}: ONGELDIGE JSON: {e}")
            continue
        oef += len(d.get("oefeningen", []))
        fc += len(d.get("flashcards", []))

        def check(code, ctx):
            if code and code not in valid:
                onbekend.setdefault(code, []).append(f"{slug}:{ctx}")

        for k in d.get("kernrekeningen", []):
            check(k.get("code", ""), "kernrekening")
        for s in d.get("boekingsschemas", []):
            for r in s.get("regels", []):
                check(r.get("code", ""), "schema")
        for o in d.get("oefeningen", []):
            for b in o.get("boekingen", []):
                td = sum((r.get("debet") or 0) for r in b.get("regels", []))
                tc = sum((r.get("credit") or 0) for r in b.get("regels", []))
                if abs(td - tc) > 0.005:
                    problemen.append(
                        f"{slug}/{o.get('id')}: '{b.get('omschrijving','')}' "
                        f"debet {td:.2f} != credit {tc:.2f}"
                    )
                for r in b.get("regels", []):
                    check(r.get("code", ""), f"oef {o.get('id')}")

    print(f"Thema's: {len(files)} | Oefeningen: {oef} | Flashcards: {fc}")
    print(f"Niet-balancerende boekingen: {len(problemen)}")
    for p in problemen:
        print("  ✗", p)
    print(f"Onbekende rekeningcodes: {len(onbekend)}")
    for c, where in sorted(onbekend.items()):
        print(f"  ✗ {c}  ({', '.join(where[:5])})")

    ok = not problemen and not onbekend
    print("\n✅ Alles correct." if ok else "\n❌ Problemen gevonden.")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
