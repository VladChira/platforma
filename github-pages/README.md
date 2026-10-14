# GitHub Pages și Docker în același repository

Alegerea este un repository separat, `VladChira/platforma`, publicat la `https://vladchira.github.io/platforma/`. Repository-ul existent `VladChira/VladChira.github.io`, tema Chirpy, postările și workflow-ul blogului nu trebuie modificate.

GitHub permite un site de utilizator la `<utilizator>.github.io` și un site de proiect per repository la `<utilizator>.github.io/<repository>`. Aplicația folosește a doua variantă.

Repository-ul și Pages sunt configurate. Pentru modificări ulterioare folosește direct noul repository:

```bash
git clone https://github.com/VladChira/platforma.git
cd platforma
```

Fiecare push pe `main` actualizează automat varianta Pages. Pe serverul local rulează `git pull --ff-only` și `docker compose up -d --build` din această clonă pentru a actualiza varianta Docker. Secțiunile de pregătire de mai jos descriu instalarea inițială și nu trebuie repetate.

## Structura repository-ului nou

Copiază **conținutul** folderului `platforma/` la rădăcina repository-ului `VladChira/platforma`, astfel încât acesta să conțină:

```text
.github/workflows/pages.yml
Dockerfile
docker-compose.yml
serve.json
mockup/
github-pages/
README.md
```

Workflow-ul este în folderul ascuns `.github/`, care trebuie inclus la copiere. Nu se copiază celelalte servicii din repository-ul `home-server`.

Poți pregăti un folder separat, fără dependențe sau build-uri generate:

```bash
node platforma/github-pages/prepare-project.mjs /tmp/platforma-pages-project
git -C /tmp/platforma-pages-project init -b main
git -C /tmp/platforma-pages-project add .
git -C /tmp/platforma-pages-project commit -m "Add Romania Construieste with Docker and Pages builds"
```

Scriptul nu face commit, push sau deploy și refuză o destinație care conține deja fișiere. După prima copiere, modificările se fac direct în noul repository; nu se păstrează două copii active ale surselor.

## Publicare

După crearea repository-ului public `VladChira/platforma` și autentificarea Git:

```bash
git -C /tmp/platforma-pages-project remote add origin https://github.com/VladChira/platforma.git
git -C /tmp/platforma-pages-project push -u origin main
```

În repository-ul **platforma**, Settings → Pages → Build and deployment → Source: **GitHub Actions**. Rulează workflow-ul „Deploy platforma to GitHub Pages” din Actions dacă setarea este activată după primul push. Workflow-ul verifică tipurile și calculele, construiește aplicația și publică exclusiv `mockup/dist-pages/`.

Nu modifica setările Pages din repository-ul blogului. Fiecare repository are propriul workflow și propria publicare.

## Comutare între cele două moduri

Din `mockup/` în noul repository (sau `platforma/mockup/` în workspace-ul original):

| Utilizare | Comandă | Rezultat |
| --- | --- | --- |
| Docker / server propriu | `npm run build` | `dist/`, rute `/platforma/proiect/...` |
| GitHub Pages | `npm run build:pages` | `dist-pages/`, rute `/platforma/#/proiect/...` |
| Dezvoltare Pages | `npm run dev:pages` | Vite cu rutare hash |
| Previzualizare Pages | `npm run preview:pages` | Build-ul Pages local |

Docker continuă să folosească build-ul standard, fără Nginx inclus. Comanda `docker compose up -d --build`, rulată din rădăcina noului repository, păstrează publicarea locală pe portul 8877.

Ambele variante au aceeași sursă și aceleași date. Build-urile sunt în foldere diferite. Prefixul resurselor rămâne `/platforma/`; rutarea hash a versiunii Pages permite refresh și linkuri directe fără fallback pe server.

Preferințele locale nu se transferă automat între serverul local și domeniul GitHub Pages, fiind stocate separat pentru fiecare origine de browser.
