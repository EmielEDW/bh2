# 📚 Gebruikte bronnen

Alle inhoud van deze site komt uit de documenten die je van je leerkracht kreeg.
Hieronder per document: wat erin staat en waarvoor het gebruikt is. De ruwe
tekst-extracties staan in `_extracted/` (ter controle).

## ⭐ Rekeningenstelsel (de MAR — bron van waarheid)

| Bestand | Inhoud | Gebruikt voor |
|---|---|---|
| `mar.pdf` | **ITAA Rekeningenstelsel 2021** (officiële MAR, 40 blz., klassen 0-7). | Basis van `data/mar.json`: alle codes, namen, klassen, rubrieken en A/P/R-natuur. |
| `001_Rekeningenstelsel_compact_20260509.pdf` | De **compacte werklijst van de leerkracht** (BVDS) met de eigen rekeningen (ABTW 411590, VBTW 451540, ICN 604100, UCN 700100, loon arbeider/bediende, voordelen alle aard…). | De effectieve werkset rekeningen + de eigen rekeningnamen/-codes. |
| `cursus.pdf` | Het **officiële handboek dubbel boekhouden** (756 blz., 6 delen). | De "📖 Volgens de cursus"-verdieping, de begrippenlijst en de meerkeuzetoetsen per thema. Niet in git (auteursrechtelijk + 79 MB). |

## 🏭 Materiële vaste activa (MVA)

| Bestand | Gebruikt voor |
|---|---|
| `2200_01_04_04_(c)_MVA_EIGEN_POWERPOINT_afdruk_.pdf` | MVA-theorie: verwerving, afschrijvingen (lineair/degressief), verkoop, meer-/minderwaarde. |
| `2200_00_0_02_00__MVA_REKENINGEN_BOEKINGSSCHEMA_.pdf` | Het boekingsschema MVA (707 Verkoop VA, 763/663, 6302, x.9…). |
| `007_MVA_2026_-_de_verwerving.xlsx` + `…_oplossing.pdf` | Oefening + oplossing rond de verwerving van een MVA. |
| `2200_01_10_02__08_HH_004_Trainer_MVA_LES17022026_003.xlsm` | MVA-trainer (Excel). |
| `2200_03_MATERIELE_VASTE_ACTIVA_TEST_OPLOSSING.pdf` | Uitgewerkte test MVA. |
| `2200_3_01_Toelichting_MVA_opgave_&_toelichting.pdf` | Toelichting bij een MVA-opgave. |
| `00000_03__oefeningenfiche_MVA…359-362.pdf` | Oefeningenfiche MVA. |

## 🧾 BTW & belastingen

| Bestand | Gebruikt voor |
|---|---|
| `0013_04_HH_003_(c)…CBTW…GROOTBOEK.pdf` | Verkoop-btw (CBTW) in grootboekvorm. |
| `0016_08_HH_003…DBTW…Factory…GROOTBOEK.pdf` | Aankoop-btw (DBTW) — bevestigt de eigen rekeningen (ABTW, VBTW, RABTW, RVBTW, ICN, UCN…). |
| `0016_08_HH_004_Trainer31.pdf` | BTW-trainer. |
| `45000_0040__04_BELASTINGEN_PRESENTATIE_003_THEORIE…pdf` | Belastingen op het resultaat (3 fasen: voorafbetaling → raming → afrekening), met boekingsschema's. |

## 💰 Overige thema's

| Bestand | Thema |
|---|---|
| `00000_06__oefeningenfiche_Voorraden…425-426.pdf` | Voorraden & voorraadwijzigingen. |
| `00000_06__oefeningenfiche_Vorderingen…442-443.pdf` | Vorderingen ≤ 1 jaar. |
| `4001_01_CN_vergelijken_met_dubieuze_2024_afdruk.pdf` | Dubieuze debiteuren & waardeverminderingen. |
| `17000_H8_01g_SCHULD_LT…Waardering…LENING_1-2-3-4-5-6.pdf` + `…TEST.pdf` | Schulden op meer dan één jaar (leningen, aflossingstabel). |
| `00000_18__oefeningenfiche__schulden_op_minder_dan_1_jaar…648-649.pdf` | Schulden ≤ 1 jaar. |
| `00000_13__oefeningenfiche_Winstbestemming…513-522…pdf` | Resultaatverwerking / winstbestemming. |
| `42001…H1_Comm_act…340_404_444.pdf` | Aankopen/verkopen, te innen/te ontvangen facturen. |
| `0003_…OEF_LES01…dubbel_boekhouden_op_4_manieren.xlsx` | Grondbeginselen — dubbel boekhouden. |
| `CANONRPS20_MP159_0771_001.pdf` (LES01) | Kopie lesmateriaal grondbeginselen. |
| `004_…Eigen_cursus52_H2…NIEUW_lezing.pdf` | Leesopdracht hoofdstuk 2. |
| `BOEKHOUDEN_2_werkplekleren.docx` | De praktijkopdrachten in Octopus (Protoy Fictivo, Goodwood). |

## 🖼️ Gescande fiches (gerenderd als beeld)

Deze fiches waren ingescande beelden zonder tekstlaag, dus tekst-extractie gaf niets.
Ze zijn daarom **als afbeelding gerenderd** (via PyMuPDF, `_extracted/img/`) en visueel
uitgelezen, zodat de oefeningen toch de échte fiche volgen:

- `00000_04__…FVA+_Geldbelegging+liquide…396+456+462.pdf` → thema *fva-geldbeleggingen* (nv DELELIE, nv Genpal…)
- `00000_16__…Kapitaalsubsidies…540-542.pdf` → thema *voorzieningen-subsidies* (NV Klaproos)
- `00000_16__…Voorzieningen…579-581.pdf` → thema *voorzieningen-subsidies* (groot onderhoud)
- `00000_49__…Overlopende_rek…689-691.pdf` → thema *overlopende-rekeningen* (huur, abonnement, interest)

> Bij scans kan een enkel cijfer onduidelijk zijn; controleer twijfelgevallen tegen je papieren fiche.

## 📦 Niet verwerkt

- `02_DOSSIER_OCTOPUS/*.bck` — Octopus-back-upbestanden (binair, enkel bruikbaar
  ín de Octopus-software, niet als studiemateriaal voor deze site).
