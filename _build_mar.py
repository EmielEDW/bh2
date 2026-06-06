#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bouwt een gestructureerde MAR-database (mar.json) uit:
  1. De officiele ITAA MAR (mar.pdf -> _extracted/mar.pdf.txt)  -> namen, hierarchie, A/P/R
  2. De compacte werklijst van de leerkracht (001_Rekeningenstelsel_compact) -> 6-cijfer werkset
De officiele MAR is de bron van waarheid voor codes/namen.
"""
import re, json, os

BASE = os.path.dirname(os.path.abspath(__file__))
EX = os.path.join(BASE, "_extracted")

# ---------------------------------------------------------------------------
# 1. KLASSE-namen (vast, uit de MAR)
# ---------------------------------------------------------------------------
KLASSEN = {
    "0": "Niet in de balans opgenomen rechten en verplichtingen",
    "1": "Eigen vermogen, voorzieningen en schulden op meer dan één jaar",
    "2": "Oprichtingskosten, vaste activa en vorderingen op meer dan één jaar",
    "3": "Voorraden en bestellingen in uitvoering",
    "4": "Vorderingen en schulden op ten hoogste één jaar",
    "5": "Geldbeleggingen en liquide middelen",
    "6": "Kosten",
    "7": "Opbrengsten",
}
# Welke balans/resultaat-categorie hoort bij elke klasse
KLASSE_SOORT = {
    "0": "order", "1": "passief", "2": "actief", "3": "actief",
    "4": "gemengd", "5": "actief", "6": "kosten", "7": "opbrengsten",
}

# ---------------------------------------------------------------------------
# 2. Parse officiele MAR voor 2- en 3-cijfer rubriek/rekening-namen + [A]/[P]/[R]
# ---------------------------------------------------------------------------
def clean_name(n):
    n = re.sub(r'\[\d+\]', '', n)            # voetnootmarkers [6]
    n = re.sub(r'\{\d+\}', '', n)
    n = re.sub(r'\[[APR]\]', '', n)          # [A][P][R]
    n = re.sub(r'\s+', ' ', n)
    n = n.replace('V oor', 'Voor').replace('V or', 'Vor').replace('V er', 'Ver').replace('V ASTE','VASTE').replace('V oorzieningen','Voorzieningen')
    # losse spaties in woorden herstellen (PDF artefacten)
    n = n.replace(' – ', ' – ').strip(' .-')
    return n.strip()

official = {}     # code -> {name, nature_marker}
rubriek_naam = {} # 2-digit -> naam
acct3_naam = {}   # 3-digit -> naam

mar_txt = open(os.path.join(EX, "mar.pdf.txt"), encoding="utf-8").read()
for raw in mar_txt.splitlines():
    line = raw.strip()
    if not line:
        continue
    m = re.match(r'^(\d{2,5})\b\s+(.+)$', line)
    if not m:
        continue
    code, rest = m.group(1), m.group(2)
    marker = None
    mk = re.search(r'\[([APR])\]', rest)
    if mk:
        marker = mk.group(1)
    name = clean_name(rest)
    if not name or len(name) < 2:
        continue
    # skip lijnen die enkel verwijscijfers zijn
    if re.match(r'^[\d/ ]+$', name):
        continue
    if code not in official:
        official[code] = {"name": name, "marker": marker}
    else:
        if marker and not official[code]["marker"]:
            official[code]["marker"] = marker
    if len(code) == 2 and code not in rubriek_naam:
        rubriek_naam[code] = name
    if len(code) == 3 and code not in acct3_naam:
        acct3_naam[code] = name

# Handmatige aanvullingen/correcties voor rubrieknamen (uit MAR gelezen)
rubriek_naam.update({
    "10":"Kapitaal / Inbreng","11":"Inbreng buiten kapitaal","12":"Herwaarderingsmeerwaarden",
    "13":"Reserves","14":"Overgedragen winst of verlies","15":"Kapitaalsubsidies",
    "16":"Voorzieningen en uitgestelde belastingen","17":"Schulden op meer dan één jaar",
    "20":"Oprichtingskosten","21":"Immateriële vaste activa","22":"Terreinen en gebouwen",
    "23":"Installaties, machines en uitrusting","24":"Meubilair en rollend materieel",
    "25":"Vaste activa in leasing","26":"Overige materiële vaste activa",
    "27":"Vaste activa in aanbouw en vooruitbetalingen","28":"Financiële vaste activa",
    "29":"Vorderingen op meer dan één jaar","30":"Grondstoffen","31":"Hulpstoffen",
    "32":"Goederen in bewerking","33":"Gereed product","34":"Handelsgoederen",
    "35":"Onroerende goederen bestemd voor verkoop","36":"Vooruitbetalingen op voorraadinkopen",
    "37":"Bestellingen in uitvoering","40":"Handelsvorderingen","41":"Overige vorderingen",
    "42":"Schulden op meer dan één jaar die binnen het jaar vervallen","43":"Financiële schulden",
    "44":"Handelsschulden","45":"Schulden m.b.t. belastingen, bezoldigingen en sociale lasten",
    "46":"Ontvangen vooruitbetalingen op bestellingen","47":"Schulden uit de bestemming van het resultaat",
    "48":"Diverse schulden","49":"Overlopende rekeningen","50":"Eigen aandelen",
    "51":"Aandelen en geldbeleggingen","52":"Vastrentende effecten","53":"Termijndeposito's",
    "54":"Te incasseren vervallen waarden","55":"Kredietinstellingen","56":"Postcheque en girodienst",
    "57":"Kassen","58":"Interne overboekingen","60":"Handelsgoederen, grond- en hulpstoffen",
    "61":"Diensten en diverse goederen","62":"Bezoldigingen, sociale lasten en pensioenen",
    "63":"Afschrijvingen, waardeverminderingen en voorzieningen","64":"Andere bedrijfskosten",
    "65":"Financiële kosten","66":"Niet-recurrente bedrijfs- of financiële kosten",
    "67":"Belastingen op het resultaat","68":"Overboeking naar uitgestelde belastingen en belastingvrije reserves",
    "69":"Resultaatverwerking","70":"Omzet","71":"Wijzigingen in voorraden en bestellingen in uitvoering",
    "72":"Geproduceerde vaste activa","74":"Andere bedrijfsopbrengsten","75":"Financiële opbrengsten",
    "76":"Niet-recurrente bedrijfs- of financiële opbrengsten","77":"Regularisering van belastingen",
    "78":"Onttrekking aan belastingvrije reserves en uitgestelde belastingen","79":"Resultaatverwerking",
})

# ---------------------------------------------------------------------------
# 3. Parse compacte werklijst -> 6-cijfer werkset
# ---------------------------------------------------------------------------
compact = {}
comp_txt = open(os.path.join(EX, "001_Rekeningenstelsel_compact_20260509.pdf.txt"), encoding="utf-8").read()
# Stap A: verzamel ALLE codes (ook uit de multi-kolom overzichtspagina) zodat we niets missen
all_compact_codes = set(re.findall(r'(?<!\d)(\d{6})(?!\d)', comp_txt))
# Stap B: schone namen enkel uit één-kolom-lijnen (precies één code per lijn)
for line in comp_txt.splitlines():
    line = line.strip()
    codes = re.findall(r'(?<!\d)(\d{6})(?!\d)', line)
    if len(codes) != 1:
        continue
    code = codes[0]
    name = line.split(code, 1)[1].strip()
    name = re.sub(r'\s+', ' ', name).strip(' .-')
    name = re.sub(r'\s+\d{1,2}$', '', name)          # losse cijfers achteraan
    name = re.sub(r'\s*\[\d+\]\s*$', '', name)
    if not name:
        continue
    # voorkeur: langere/schonere naam
    if code not in compact or len(name) > len(compact[code]):
        compact[code] = name
# Stap C: codes die enkel in de multi-kolom pagina staan: vul aan met officiele naam
for code in all_compact_codes:
    if code not in compact:
        a3 = code[:3]
        compact[code] = acct3_naam.get(a3, "")

# Handmatige correcties / volledige namen voor eigen rekeningen van de leerkracht
COMPACT_FIX = {
    "163000":"Voorzieningen voor overige risico's en kosten",
    "411590":"Aftrekbare btw (ABTW)",
    "411620":"Btw herziening in het voordeel",
    "411630":"Regularisatie aftrekbare btw (RABTW)",
    "412020":"Terug te vorderen belastingen",
    "451300":"Te betalen btw – verlegd (medecontractant)",
    "451540":"Verschuldigde btw (VBTW)",
    "451550":"Te betalen btw – verlegd",
    "451560":"Te betalen btw – intracommunautair",
    "451570":"Te betalen btw – invoer",
    "451610":"Btw herziening in het nadeel",
    "451640":"Regularisatie verschuldigde btw (RVBTW)",
    "409200":"Teruggevraagde btw (op dubieuze)",
    "604100":"Inkomende creditnota (ICN)",
    "700100":"Uitgaande creditnota (UCN)",
    "620100":"Loon arbeider",
    "620200":"Bezoldiging bediende",
    "743209":"Voordelen van alle aard",
    "743291":"Maaltijdcheques (werkgeversdeel als opbrengst)",
    "444100":"Op te maken creditnota's",
    "404200":"Op te stellen facturen",
    "550001":"Uitgeschreven cheques (-)",
    "510900":"Aandelen – geboekte waardevermindering (-)",
    "238900":"Geboekte waardevermindering (-)",
    "285200":"Vastrentende effecten",
    "658000":"Betalingsverschillen",
    "659000":"Aankoopkosten effecten",
    "605000":"Aankopen onroerende goederen bestemd voor verkoop",
    "608000":"Handelskorting / commerciële korting ontvangen (-)",
    "439000":"Overige leningen (financiële schuld KT)",
    "570000":"Kas – contanten (570-576)",
    "643000":"Diverse bedrijfskosten (643-648)",
    "664000":"Andere niet-recurrente kosten (664-668)",
    "743000":"Diverse bedrijfsopbrengsten (743-749)",
    "764000":"Andere niet-recurrente opbrengsten (764-769)",
    "340000":"Handelsgoederen (HG)",
    "604000":"Aankopen van handelsgoederen (HG)",
    "609400":"Voorraadwijziging van handelsgoederen (HG)",
    "300000":"Grondstoffen",
    "330000":"Gereed product",
}

# ---------------------------------------------------------------------------
# Thema-tagging: koppel rekeningen aan studie-thema's (slugs)
# ---------------------------------------------------------------------------
def themas_voor(code):
    t = set()
    rub = code[:2]; a3 = code[:3]; k = code[0]
    # Grondbeginselen
    if code in ("100000","101000","110000","130000","131000","133000","140000","141000"):
        t.add("grondbeginselen")
    # BTW
    if a3 in ("411","451") or code in ("409200","640700","411620","451610"):
        t.add("btw")
    # Aankoop/verkoop & handel
    if rub in ("40","44") or a3 in ("600","601","602","604","606","608","700","706","708","610") \
       or code in ("604001","604100","700001","700100","444100","404200"):
        t.add("aankoop-verkoop")
    # MVA
    if rub in ("22","23","24","25","26","27") or a3 in ("630","663","741","641","760","707") \
       or code in ("630200","741000","641000","763000","663000","760100"):
        t.add("mva")
    # Voorraden
    if rub in ("30","31","32","33","34","36","37") or a3 in ("609","631","712","713","717") or rub=="71":
        t.add("voorraden")
    # Dubieuze debiteuren
    if code in ("400000","407000","409000","409100","409200","634000","634100","642000","416000") or a3=="407":
        t.add("dubieuze-debiteuren")
    # LT schulden / leningen
    if rub in ("17","42","43") or a3 in ("173","170","171","172","174","423","430","433","650") \
       or code in ("650200","650000"):
        t.add("lt-schulden")
    # Overlopende rekeningen
    if a3 in ("490","491","492","493"):
        t.add("overlopende-rekeningen")
    # Voorzieningen & kapitaalsubsidies
    if rub=="16" or a3 in ("635","636","637","656","662","150","151","753","160","162","163")\
       or code in ("150000","753000"):
        t.add("voorzieningen-subsidies")
    # Belastingen & winstbestemming
    if rub in ("67","68","69","77","78","79") or a3 in ("450","452","453","670","671","6702","6700",
       "471","472","473","474","470","692","693","694","695","696") or code in ("450000","452000"):
        t.add("belastingen-winstbestemming")
    # Personeel / bezoldigingen
    if rub in ("45","62") and code not in ("450000","451000","452000","453000") or a3 in ("454","455","456") \
       or code in ("620100","620200","743209","743291"):
        t.add("personeel")
    # FVA / geldbeleggingen / liquide
    if rub in ("28","50","51","52","53","54","55","56","57","58") or a3 in ("750","751","752","657","657"):
        t.add("fva-geldbeleggingen")
    return sorted(t)

# Eigen (niet-standaard) rekeningen van de leerkracht t.o.v. de officiele MAR.
# Dit zijn 6-cijfer subrekeningen die NIET als zodanig in het officiele MAR staan,
# maar door de leerkracht/Octopus zijn aangemaakt onder een standaard hoofdrekening.
CUSTOM_CODES = {
    "411590","411620","411630","412020","451300","451540","451550","451560",
    "451570","451610","451640","409200","409100","604100","700100",
    "620100","620200","743209","743291","444100","404200","550001","510900","238900",
}

# Codes die in de compacte bron staan maar foutief/dubbel zijn: niet opnemen.
# De leerkracht gebruikt de .1-notatie: UCN = 700100 (niet 700001),
# ICN = 604100 (niet 604001). De ...001-vormen zijn inconsistente dubbels.
UITSLUITEN = {"700001", "604001"}

# ---------------------------------------------------------------------------
# 4. Bepaal debet/credit-natuur per 6-cijfer code
# ---------------------------------------------------------------------------
def bepaal_natuur(code, name):
    k = code[0]
    n = name.lower()
    contra = ("(-)" in name) or ("geboekte afschrijv" in n) or ("geboekte waardeverm" in n) \
             or ("niet-opgevraagd" in n) or ("niet opgevraagde" in n) or ("terugneming" in n) \
             or ("uitgeschreven cheques" in n)
    # Klasse 1: passief (credit). Contra -> debet
    if k == "1":
        return "debet" if contra else "credit"
    # Klasse 2 & 3: actief (debet). Contra (afschrijving/waardeverm) -> credit. Meerwaarde -> debet
    if k in ("2", "3"):
        if contra and ("meerwaard" not in n or "waardevermind" in n):
            return "credit"
        return "debet"
    # Klasse 4: 40-41 vorderingen (debet, contra credit); 42-49 schulden (credit)
    if k == "4":
        rub = code[:2]
        if rub in ("40", "41"):
            return "credit" if contra else "debet"
        if rub == "49":
            # 490/491 actief (debet); 492/493 passief (credit); 499 wacht
            if code[:3] in ("490", "491"):
                return "debet"
            return "credit"
        return "credit"   # 42-48 schulden
    # Klasse 5: geldbeleggingen/liquide = actief (debet), contra credit
    if k == "5":
        return "credit" if contra else "debet"
    # Klasse 6: kosten (debet). Correcties/terugnemingen/(-)/ontvangen kortingen -> credit
    if k == "6":
        if contra or "ontvangen korting" in n or "voorraadwijzig" in n:
            return "credit" if (contra or "ontvangen korting" in n) else "beide"
        return "debet"
    # Klasse 7: opbrengsten (credit). UCN / toegekende kortingen / voorraadwijziging
    if k == "7":
        if "creditnota" in n or "ucn" in n or "toegekende korting" in n:
            return "debet"
        if "wijziging" in n or "voorraad" in n:
            return "beide"
        return "credit"
    return "n.t.b."

# ---------------------------------------------------------------------------
# 5. Bouw de records
# ---------------------------------------------------------------------------
def soort_label(code):
    k = code[0]
    rub = code[:2]
    if k == "1": return "Passief (eigen vermogen / schuld LT)"
    if k in ("2","3"): return "Actief (vaste activa / voorraden)"
    if k == "4":
        if rub in ("40","41"): return "Actief (vordering KT)"
        if rub == "49": return "Overlopende rekening"
        return "Passief (schuld KT)"
    if k == "5": return "Actief (geldbelegging / liquide middel)"
    if k == "6": return "Resultaat – kost"
    if k == "7": return "Resultaat – opbrengst"
    if k == "0": return "Orderrekening"
    return "?"

records = []
all_codes = dict(compact)
for c, nm in COMPACT_FIX.items():
    all_codes[c] = nm  # gebruik de nettere naam

for code in sorted(all_codes):
    if code in UITSLUITEN:
        continue
    name = COMPACT_FIX.get(code, all_codes[code])
    k = code[0]
    rub = code[:2]
    a3 = code[:3]
    # verrijk naam met officiele naam indien compact-naam erg kort/artefact
    off3 = acct3_naam.get(a3)
    rec = {
        "code": code,
        "naam": name,
        "klasse": k,
        "klasseNaam": KLASSEN.get(k, "?"),
        "rubriek": rub,
        "rubriekNaam": rubriek_naam.get(rub, ""),
        "soort": soort_label(code),
        "natuur": bepaal_natuur(code, name),
        "custom": code in CUSTOM_CODES,
        "officieleRekening": off3 or "",
        "themas": themas_voor(code),
    }
    records.append(rec)

data = {
    "bron": "ITAA Rekeningenstelsel 2021 (mar.pdf) + compacte werklijst leerkracht (001_Rekeningenstelsel_compact_20260509)",
    "klassen": KLASSEN,
    "rubrieken": rubriek_naam,
    "rekeningen": records,
}
os.makedirs(os.path.join(BASE, "data"), exist_ok=True)
out = os.path.join(BASE, "data", "mar.json")
json.dump(data, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

# Platte codelijst (voor de content-validatie en de agents)
tsv = ["CODE\tNAAM\tNATUUR\tSOORT"]
for r in records:
    flag = " [EIGEN/leerkracht]" if r["custom"] else ""
    tsv.append(f"{r['code']}\t{r['naam']}\t{r['natuur']}\t{r['soort']}{flag}")
open(os.path.join(BASE, "data", "mar-codes.tsv"), "w", encoding="utf-8").write("\n".join(tsv) + "\n")

print("Geschreven:", out)
print("Aantal rekeningen:", len(records))
print("Custom rekeningen:", sum(1 for r in records if r["custom"]))
from collections import Counter
tc = Counter()
for r in records:
    for th in r["themas"]:
        tc[th]+=1
print("Thema-tags:", dict(tc))
zonder = [r["code"] for r in records if not r["themas"]]
print("Zonder thema:", len(zonder), zonder[:20])
print("\n-- natuur verdeling --")
from collections import Counter
print(Counter(r["natuur"] for r in records))
print("\n-- steekproef --")
for r in records:
    if r["code"] in ("100000","220000","220900","400000","409200","411590","440000","451540","604000","604001","609000","700000","700001","630200","133000","473000","490000","492000","550000","57000"):
        print(f"{r['code']} {r['natuur']:7s} {r['soort'][:28]:28s} | {r['naam'][:40]} {'[CUSTOM]' if r['custom'] else ''}")