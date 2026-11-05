   # Cvičný projekt pro hackathon olomouc 2026

   Cvičení před hackathonem: Next.js a Claude API (nástroje) nad daty Open-Meteo.

   ## Spuštění

   1. `npm install`
   2. Zkopíruj `.env.example` na `.env.local` a doplň `ANTHROPIC_API_KEY` (potřebuje jen ten, kdo spouští `/api/ask`)
   3. `npm run dev`
   4. Testy: `npm test`

   ## Kdo co dělá

   - `app/api/ask/` – Jáchym (smyčka s Claude)
   - `lib/data/` – David (data z Open-Meteo)
   - `lib/` – společný formát výsledku (domluvíme spolu)