#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Voegt de cursus-verrijking (_extracted/cursus/<slug>.enrich.json) toe aan de
thema-bestanden (data/themes/<slug>.json) ZONDER bestaande velden te wijzigen.
Voegt enkel 'cursus' en 'meerkeuze' toe. Valideert de structuur.
"""
import json, glob, os

BASE = os.path.dirname(os.path.abspath(__file__))
ENR = os.path.join(BASE, "_extracted", "cursus")
THEMES = os.path.join(BASE, "data", "themes")

def valideer_meerkeuze(mk, slug, problemen):
    schoon = []
    for i, v in enumerate(mk or []):
        opties = v.get("opties") or []
        juist = v.get("juist")
        if not v.get("vraag") or len(opties) < 2:
            problemen.append(f"{slug} mk#{i}: ontbrekende vraag/opties"); continue
        if not isinstance(juist, int) or juist < 0 or juist >= len(opties):
            problemen.append(f"{slug} mk#{i}: 'juist'={juist} buiten bereik (0..{len(opties)-1})")
            juist = 0
        schoon.append({"vraag": v["vraag"], "opties": opties, "juist": juist, "uitleg": v.get("uitleg", "")})
    return schoon

def main():
    problemen = []
    n_merged = tot_begrippen = tot_mk = 0
    for ef in sorted(glob.glob(os.path.join(ENR, "*.enrich.json"))):
        slug = os.path.basename(ef)[:-len(".enrich.json")]
        tf = os.path.join(THEMES, slug + ".json")
        if not os.path.exists(tf):
            problemen.append(f"{slug}: geen themabestand"); continue
        try:
            enr = json.load(open(ef, encoding="utf-8"))
        except Exception as e:
            problemen.append(f"{slug}: enrich JSON-fout {e}"); continue
        theme = json.load(open(tf, encoding="utf-8"))

        cursus = enr.get("cursus") or {}
        cursus = {
            "vindplaats": cursus.get("vindplaats", ""),
            "kernpunten": cursus.get("kernpunten", ""),
            "begrippen": [b for b in (cursus.get("begrippen") or []) if b.get("term") and b.get("uitleg")],
        }
        mk = valideer_meerkeuze(enr.get("meerkeuze"), slug, problemen)

        theme["cursus"] = cursus
        theme["meerkeuze"] = mk
        json.dump(theme, open(tf, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
        n_merged += 1
        tot_begrippen += len(cursus["begrippen"])
        tot_mk += len(mk)
        print(f"  {slug:30s} begrippen={len(cursus['begrippen']):2d}  meerkeuze={len(mk):2d}")

    print(f"\nSamengevoegd: {n_merged} thema's | {tot_begrippen} begrippen | {tot_mk} meerkeuzevragen")
    if problemen:
        print(f"\n⚠️ {len(problemen)} aandachtspunten:")
        for p in problemen:
            print("  -", p)
    else:
        print("✅ Geen structuurproblemen.")

if __name__ == "__main__":
    main()
