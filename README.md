# România Construiește — prototip local

Implementarea planului se află în [`mockup/`](mockup/). Aplicația are șase ecrane: pornire, briefing județean, proiect, buletin, explorare și verificare. Folosește React, TypeScript, Vite, Tailwind CSS și React Router.

## Pornire

Node.js 22.12+ (verificat cu 22.14.0) sau o versiune compatibilă cu dependențele din lockfile.

```bash
cd platforma/mockup
npm ci
npm run dev
```

Deschide `http://localhost:5173/platforma/` (sau portul afișat de Vite). Pentru acces de pe alt dispozitiv din rețeaua locală, pornește explicit cu `npm run dev -- --host 0.0.0.0`.

Parcursul de referință: **Bacău → Școli → o schimbare → proiect → „Cum știm?” → buletin**. Acces direct în varianta Docker: `/platforma/judet/bacau?tema=scoli` și `/platforma/proiect/scoala-demo-01`.

## GitHub Pages și comutarea între moduri

Aceleași surse produc două variante, fără modificări manuale în cod:

| Destinație | Build din `mockup/` | Rezultat | Exemplu de rută |
| --- | --- | --- | --- |
| Docker / server local | `npm run build` | `dist/` | `/platforma/proiect/scoala-demo-01` |
| GitHub Pages | `npm run build:pages` | `dist-pages/` | `/platforma/#/proiect/scoala-demo-01` |

Pentru dezvoltare în modul Pages: `npm run dev:pages`; pentru previzualizarea build-ului: `npm run preview:pages`. Modul standard rămâne implicit în Docker. Build-urile sunt separate, iar filtrele, sursele, buletinul și exporturile sunt comune.

Publicarea Pages este pregătită pentru un repository separat **`VladChira/platforma`**, cu conținutul acestui folder la rădăcină. Workflow-ul este în [`.github/workflows/pages.yml`](.github/workflows/pages.yml). Nu trebuie activat în repository-ul `home-server`, unde acest proiect este încă un subfolder.

Site-ul Chirpy din `VladChira/VladChira.github.io` rămâne separat. Instrucțiunile de pregătire a noului repository și de activare Pages sunt în [github-pages/README.md](github-pages/README.md). Adresa țintă este `https://vladchira.github.io/platforma/`; existența acestei configurații locale nu înseamnă că site-ul a fost publicat.

## Deploy cu Docker Compose

Din folderul `platforma/`, pe server:

```bash
docker compose up -d --build
docker compose ps
```

Aplicația este disponibilă la `http://IP-SERVER:8080/platforma/`. Pentru alt port:

```bash
PLATFORMA_PORT=8090 docker compose up -d --build
```

Pentru păstrarea portului între comenzi, poți crea în `platforma/` un fișier `.env` cu `PLATFORMA_PORT=8090`.

Imaginea se construiește în două etape: Node 22 instalează dependențele din lockfile și compilează aplicația, iar etapa finală servește fișierele rezultate cu `serve`, pe portul intern 3000, fără Nginx inclus. Resursele Vite și rutele React Router folosesc baza `/platforma/`. Configurația `serve.json` oferă fallback numai sub această cale și servește direct atât `/platforma`, cât și `/platforma/`; healthcheck-ul verifică `/platforma/`. Nu sunt necesare volume sau baze de date; preferințele rămân în browserul vizitatorului.

Nginx-ul existent poate trimite traficul către `http://127.0.0.1:8080` dacă rulează direct pe aceeași gazdă:

```nginx
location = /platforma {
    return 301 /platforma/;
}

location /platforma/ {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Păstrează `proxy_pass` fără slash la final: upstream-ul trebuie să primească inclusiv prefixul `/platforma/`. Dacă Nginx rulează în alt container, folosește adresa gazdei și portul publicat sau conectează ambele servicii la o rețea Docker comună și folosește `http://platforma:3000`, tot fără slash la final. Site-ul va fi accesibil la `https://DOMENIU/platforma/`.

Actualizare după copierea noilor surse: `docker compose up -d --build`. Loguri: `docker compose logs -f platforma`. Oprire: `docker compose down`.

## Date și comportament

- 12 proiecte fictive în Bacău (6), Neamț (3) și Vrancea (3).
- Două versiuni: 31 august și 30 septembrie 2026; importurile demo sunt separate de datele raportate.
- Scenarii de livrare, plată parțială, valoare modificată, întârziere documentată și informații lipsă.
- Faptele au ID, unitate, dată, categorie de proveniență, surse individuale și `isDemo: true`.
- Plățile necunoscute rămân `null`; agregatele indică acoperirea. Unitățile fizice nu se amestecă.
- Comparațiile oferă numărătorii, numitorii, perioada și acoperirea. Populația și elevii sunt fictivi, cu referința 1 ianuarie 2026.
- Buletinul permite selecții multiple de teme și tipuri de evenimente. Preferințele se salvează în browser, iar selecția previzualizată este reflectată în URL. Dacă stocarea este blocată, aplicația continuă să funcționeze în memorie.
- Pagina Verifică oferă glosar, metodologie, registrul documentelor și exporturi JSON/CSV. JSON include întregul set de date; CSV include fiecare fapt al proiectelor, cu `isMissing`, proveniență și surse.

Toate cifrele, instituțiile din scenariu și documentele sunt demonstrative. Nu descriu situația reală a PNRR. Nu există backend, conturi, importuri, AI sau trimitere de email; nu se colectează adrese. Nu s-a publicat aplicația pe internet.

## Verificare

```bash
npm run typecheck
npm run test
npm run test:server
npm run build
npm run preview
```

Testele Vitest acoperă valori absente versus zero, numitori invalizi, agregate și unități, filtrare, schimbări între versiuni, dovezile întârzierilor, integritatea surselor, exporturi și preferințe corupte.

Testul HTTP `test:server` folosește aceeași versiune `serve-handler` ca imaginea Docker și configurația reală `serve.json`. Verifică lipsa redirecturilor circulare, rutele SPA, resursele JavaScript și izolarea sub prefixul `/platforma/`.

Au trecut verificarea TypeScript, cele 13 teste Vitest, testul HTTP al serverului static, build-urile standard și Pages și cele 20 de teste Playwright în Chromium (10 parcursuri pentru fiecare mod de rutare). Varianta Pages este testată cu build-ul de producție pe un server static fără fallback SPA. Capturile de pornire pentru desktop și telefon au fost inspectate vizual. Imaginea Docker se construiește cu succes; rularea acesteia nu a fost verificată.

Pentru testele funcționale în Chromium:

```bash
npx playwright install chromium
npm run test:e2e
```

În mediul de implementare browserul este instalat temporar în `/tmp/platforma-browsers`; comanda echivalentă este `PLAYWRIGHT_BROWSERS_PATH=/tmp/platforma-browsers npm run test:e2e`. Playwright pornește și oprește serverul Vite pe portul 5173 și serverul de test Pages pe 5174; ambele porturi trebuie să fie libere. Poți rula separat cu `npm run test:e2e -- --project=pages` sau `--project=docker`.

Testele din browser verifică parcursul principal, închiderea cu Escape și restabilirea focusului, filtrele, linkurile directe, navigarea înapoi, selecțiile fără rezultate, persistența preferințelor, stocarea indisponibilă, descărcările și lipsa derulării orizontale la 360, 768 și 1440 px. Capturile sunt generate în `mockup/test-results/` (ignorat de Git).

Verificarea automată în Chromium nu înlocuiește validarea cu cetățeni sau un audit complet cu cititor de ecran și mai multe browsere.

## Structura codului

`src/data/` definește scenariul; `src/types/domain.ts` definește modelul. Funcțiile pure din `src/lib/` alimentează toate paginile, comparațiile și exporturile. `src/components/` conține controalele comune și dialogul de proveniență. `src/pages/` implementează cele șase ecrane; `src/app/` gestionează rutele și preferințele locale.

Build-ul este în `mockup/dist/`, iar imaginea Docker îl servește sub `/platforma/`, cu fallback către `/platforma/index.html`. La folosirea altui server static trebuie montat build-ul sub același prefix și configurat același fallback. Planul de implementare rămâne disponibil în proiect.

Următorul pas de produs este validarea mockup-ului cu utilizatori și verificarea disponibilității datelor reale pentru un județ pilot, conform planului.
