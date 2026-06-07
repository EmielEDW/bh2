# 📊 Boekhouden 2 (BH2) — Studie- & Oefenwebsite

Een complete, interactieve studieomgeving om te slagen voor het examen **Boekhouden 2**.
Alle inhoud is gebaseerd op **jouw lesdocumenten** en het officiële **ITAA
Rekeningenstelsel 2021 (de MAR)**. De MAR is overal de _bron van waarheid_: elke
oefening, elk voorbeeld en elke boeking gebruikt enkel rekeningcodes die echt in de
documenten/MAR voorkomen.

> Gebouwd met **Next.js 14 + TypeScript + Tailwind CSS**. Volledig statisch → snel en
> gratis te hosten op Vercel.

---

## ✨ Wat zit erin?

| Pagina | Inhoud |
|---|---|
| **/** (Dashboard) | Overzicht, studeeradvies, snelle links naar alles. |
| **/samenvatting** | 12 thema's, elk met uitgelegde samenvatting, een **"📖 Volgens de cursus"-verdieping** (theorie + wettelijke basis + paginaverwijzing naar het handboek), kernrekeningen, boekingsschema's, begrippen, een **meerkeuzetoets**, veelgemaakte fouten en controlevragen. |
| **/oefeningen** | **92 uitgewerkte oefeningen** die de échte oefeningenfiches volgen, met **oefenmodus** + **correctiemodus**, een ingebouwd **werkblad** (journaalpost & T-rekeningen met "Verbeter"), en een **meerkeuzetoets** per thema. |
| **/mar** | Zoeker over alle **298 rekeningen** (incl. eigen rekeningen van de leerkracht: ABTW, VBTW, ICN/UCN…) + een **debet/credit-trainer**. |
| **/boekingshulp** | Beslis-wizard ("welke boeking?") + een **werkblad** (journaalpost én T-rekeningen) met live debet=credit-controle. |
| **/btw** | BTW-rekenmachine die meteen de juiste boeking toont, overzicht van de aangiftevakken, theorie en valkuilen. |
| **/begrippen** | **Doorzoekbare begrippenlijst** (±160 begrippen) met definities uit de cursus. |
| **/examen** | Last-minute kernboekingen, een afvinkbare **examenchecklist** (bewaard in je browser) en de belangrijkste valkuilen. |

**Interactieve onderdelen:** MAR-zoeker · werkblad met journaalpost- én T-rekening-weergave + "Verbeter" ·
BTW-helper · debet/credit-trainer · **meerkeuzetoetsen** · oefen-/correctiemodus ·
boekings-wizard · controlevragen · begrippenlijst · examenchecklist met voortgang.

Alle theorie, definities en meerkeuzevragen zijn gebaseerd op het **officiële handboek
(cursus.pdf)**; de oefeningen volgen de oefeningenfiches van de leerkracht.

---

## 🚀 Lokaal draaien

> Je hebt **Node.js 18+** nodig (getest met Node 22). Check met `node --version`.

```bash
# 1. Dependencies installeren
npm install

# 2. Ontwikkelserver starten
npm run dev
# → open http://localhost:3000

# 3. Productie-build maken en testen
npm run build
npm start
```

### Handige extra commando's

```bash
# De MAR-database opnieuw genereren uit mar.pdf + de compacte lijst
npm run mar:build           # = python3 _build_mar.py   (vereist Python 3 + pypdf)

# De content controleren tegen de MAR (codes + debet=credit)
python3 validate_content.py
```

---

## ☁️ Deployen op Vercel

Vercel detecteert Next.js automatisch — je hoeft niets te configureren.

1. Push de code naar GitHub (zie hieronder).
2. Ga naar **[vercel.com](https://vercel.com)** → **Add New… → Project**.
3. Kies de repo **`EmielEDW/bh2`** en klik **Import**.
4. Laat alle defaults staan (Framework: *Next.js*, Build: `next build`, Output: standaard).
5. Klik **Deploy**. Na ~1 minuut staat je site online op een `*.vercel.app`-adres.

Elke `git push` naar `main` zorgt daarna automatisch voor een nieuwe deploy.

---

## 💳 Betaalmuur, codes & e-mail (pack ontgrendelen)

Thema 1-3 (samenvatting + oefeningen), de rekenmachine en de examen-tab zijn
**gratis**. De rest ontgrendel je met een **code** (max. 2 toestellen per code). De
flow: betalen via een **Stripe Payment Link** → een webhook pakt een ongebruikte
code → die wordt automatisch **per e-mail (Resend)** verstuurd. Codes + toestellen
worden bewaard in **Upstash Redis**.

### 1. Env-variabelen (kopieer `.env.example` → `.env.local` en zet ze ook in Vercel)

| Variabele | Waar |
|---|---|
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` | Je Stripe Payment Link-URL |
| `NEXT_PUBLIC_PRIJS` | Prijs voor weergave, bv. `€9,99` |
| `NEXT_PUBLIC_SITE_URL` | De live URL (voor de e-mail) |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Stripe API-sleutel + webhook-secret |
| `RESEND_API_KEY` / `RESEND_FROM` / `ADMIN_EMAIL` | Resend (geverifieerd domein) |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis (REST) |

### 2. Stripe webhook
Maak in Stripe een webhook-endpoint aan op `https://<jouw-site>/api/stripe/webhook`
voor het event **`checkout.session.completed`**. Kopieer de signing secret naar
`STRIPE_WEBHOOK_SECRET`. Zet op de Payment Link "verzamel e-mailadres" aan.

### 3. Codes genereren
```bash
node scripts/seed-codes.mjs 200      # 200 codes in Upstash + backup in _codes-backup.txt
```
Codes zien eruit als `BH2-XXXX-XXXX`. Raken ze op, run het script opnieuw.

> ⚠️ De inhoud-afscherming is **client-side** (zoals bij vergelijkbare cursus-sites):
> de codecontrole en het toestellimiet gebeuren server-side via Upstash, maar de
> paginabundel bevat de content. Voldoende voor dit soort lesmateriaal; geen
> bankkluis. De **sales-pagina** staat op `/pro` — die link je naar de klasgroep.

---

## 🐙 Naar GitHub pushen

De repo bestaat al: `https://github.com/EmielEDW/bh2.git`.
Vanuit deze projectmap:

```bash
git init                      # indien nog geen git-repo
git add .
git commit -m "BH2 studiesite: MAR, samenvatting, oefeningen, tools"
git branch -M main
git remote add origin https://github.com/EmielEDW/bh2.git
git push -u origin main
```

> Bestaat er al inhoud op de remote? Doe dan eerst `git pull origin main --allow-unrelated-histories`
> om samen te voegen, of (als de remote leeg/mag overschreven worden) `git push -u origin main --force`.

---

## 🗂️ Projectstructuur

```
app/                  Next.js pagina's (App Router)
  page.tsx            Dashboard
  samenvatting/       Overzicht + /[slug] per thema
  oefeningen/         Overzicht + /[slug] per thema
  mar/  btw/  examen/  flashcards/  boekingshulp/
components/           Herbruikbare (interactieve) componenten
lib/                  data.ts (laadt JSON), types.ts, format.ts
data/
  mar.json            ⭐ De MAR-database (300 rekeningen) — bron van waarheid
  mar-codes.tsv       Platte codelijst (voor validatie)
  themes/*.json       12 thema-bestanden (samenvatting, oefeningen, flashcards…)
_extracted/           Ruwe tekst-extracties uit de PDF's/Excel (ter referentie)
_build_mar.py         Bouwt data/mar.json uit mar.pdf + compacte lijst
validate_content.py   Controleert alle content tegen de MAR
```

### Inhoud aanpassen of uitbreiden

- **Een oefening/samenvatting wijzigen** → bewerk het juiste bestand in
  `data/themes/<thema>.json` en run `python3 validate_content.py`.
- **Een rekening toevoegen/corrigeren** → pas `_build_mar.py` aan en run `npm run mar:build`.
- De UI leest alles automatisch in; geen code-wijziging nodig voor nieuwe content.

---

## 📚 Gebruikte documenten

Zie **[BRONNEN.md](BRONNEN.md)** voor de volledige lijst van je lesdocumenten,
wat erin staat en hoe ze gebruikt zijn.

Kort samengevat:
- **`mar.pdf`** — ITAA Rekeningenstelsel 2021 (officiële MAR, 40 blz.). Basis van `data/mar.json`.
- **`001_Rekeningenstelsel_compact_…`** — de compacte werklijst van de leerkracht (BVDS) met de eigen rekeningen (ABTW, VBTW, ICN/UCN, loon arbeider/bediende…).
- Oefeningenfiches, MVA-PowerPoint & -trainer, BTW-grootboeken, LT-leningen, belastingen-theorie, winstbestemming, enz.

---

## ⚠️ Onzekerheden — manueel na te kijken

Deze zaken zijn met de grootste zorg gemaakt, maar **controleer ze tegen je eigen cursus**:

1. **Gescande fiches — opgelost.** Vier oefeningenfiches (FVA/geldbeleggingen 396/456/462,
   Kapitaalsubsidies 540-542, Voorzieningen 579-581, Overlopende rekeningen 689-691) waren
   ingescande beelden zonder tekstlaag. Die zijn nu **als afbeelding gerenderd en visueel
   uitgelezen** (via PyMuPDF), zodat ook die oefeningen de échte fiche volgen. Controleer ze
   gerust nog eens tegen je papieren fiche — bij scans kan een cijfer onduidelijk zijn.
2. **BTW-aangiftevakken** (pagina /btw) volgen het standaard Belgische schema
   (roosters 00-03, 54-59, 81-87…). De exacte nummers staan niet allemaal letterlijk
   in de documenten → controleer tegen je cursus.
3. **Eigen rekeningen van de leerkracht.** Codes als `411590 ABTW`, `451540 VBTW`,
   `411630 RABTW`, `451640 RVBTW`, `604001 ICN`, `700001 UCN`, `620100 Loon arbeider`,
   `743209 Voordelen alle aard` zijn afgeleid uit de compacte werklijst en de
   grootboek-oefeningen. Ze zijn in de MAR-zoeker gemarkeerd als *"eigen rekening
   (leerkracht)"*. Verifieer de exacte codes in jouw Octopus-dossier.
4. Sommige rekeningen kregen de naam uit de compacte lijst (bv. *"Machines AW"* i.p.v.
   het officiële *"Andere installaties"*) omdat dat de naam is die de leerkracht gebruikt.

Alle **92 oefeningen** zijn automatisch gecontroleerd: elke boeking balanceert
(debet = credit) en elke gebruikte code bestaat in `data/mar.json`
(`python3 validate_content.py` → 0 fouten).

---

## 🧰 Tech-stack

Next.js 14 (App Router, static export) · React 18 · TypeScript · Tailwind CSS ·
react-markdown. Content in lokale JSON; geen backend nodig.
