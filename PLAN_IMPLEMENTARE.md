# Plan de implementare — mockup „România Construiește”

## 1. Obiectiv și baza planului

Mockup-ul trebuie să arate cum poate un cetățean să înțeleagă investițiile publice din comunitatea sa în 60–90 de secunde și să verifice ulterior informațiile care îl interesează.

Promisiunea interfeței:

> „Spune-ne unde locuiești și ce te interesează. Îți explicăm ce s-a promis, ce s-a plătit, ce s-a livrat și ce s-a schimbat. Poți vedea de unde vine fiecare informație.”

PNRR este prima sursă ilustrată, iar numele și structura permit adăugarea altor programe de investiții publice ulterior.

Acest plan privește realizarea unui prototip local, navigabil. În etapa curentă livrabilul este planul; implementarea site-ului este etapa următoare. Toate fișierele se păstrează în `platforma/`. Nu sunt necesare modificări sau dependențe din celelalte foldere ale workspace-ului.

## 2. Limitele mockup-ului

Mockup-ul va folosi date fictive, coerente între pagini, pentru a demonstra experiența. Nu reprezintă o situație reală a PNRR. Toate valorile și afirmațiile temporale aparțin exclusiv scenariului demonstrativ.

| Inclus în mockup | Etapă ulterioară de produs |
| --- | --- |
| Briefing local, pagini de proiect și buletin narativ | Importuri din MIPE și alte surse oficiale |
| Două versiuni demonstrative ale datelor și schimbările dintre ele | Arhivare periodică și detectarea schimbărilor reale |
| Alegerea județului și temei, căutare simplă | Căutare semantică și acoperire națională |
| Comparații calculate din date demonstrative | Metodologie validată și indicatori INS/sectoriali |
| Surse, explicații și export al datelor demo | Legături documentare verificate pentru fiecare câmp |
| Preferințe locale și previzualizarea unui buletin | Abonare, confirmarea adresei și trimitere de email |

Nu sunt necesare în această etapă conturi, backend, AI, integrări cu achizițiile publice sau un sistem de raportări civice. Monitorizarea civică poate fi prezentată ca exemplu separat pe un proiect, cu dovezi demonstrative etichetate ca atare.

## 3. Structura experienței

Interfața are trei niveluri, organizate după întrebările cetățeanului:

- **Înțelege:** briefing local, rezultate concrete și schimbări explicate.
- **Explorează:** proiecte, căutare, teme și comparații.
- **Verifică:** proveniență, documente, istoricul datelor și metodologie.

Navigația principală va include aceste trei intrări și acces la buletin. Alegerea județului și a temei rămâne vizibilă după configurare.

### Ecranul 1 — Pornire: „Ce se construiește în comunitatea ta?”

- Introducere scurtă, fără statistici naționale dominante.
- Întrebarea „Ce județ te interesează?” și selector de județ.
- Temele: Toate, Școli, Sănătate, Transport, Energie, Mediu, Comunitate.
- Acțiune principală: „Vezi ce s-a schimbat”.
- Acces rapid la exemplul Bacău, pentru a putea vedea imediat produsul.
- Mențiune vizibilă: „Prototip cu date demonstrative”.

**Decizie de domeniu:** prima versiune lucrează la nivel de județ. „Județul Bacău” nu se confundă cu municipiul Bacău. Localitatea apare pe proiecte; selectarea ei ca filtru general se poate adăuga ulterior.

### Ecranul 2 — Briefingul județului, pagina principală de produs

Ordinea secțiunilor:

1. **Județul și tema selectată**, perioada datelor și ultima actualizare a paginii, afișate distinct.
2. **„Într-un minut”**: trei schimbări importante, în propoziții scurte, cu acces la proiectele și dovezile aferente.
3. **„Ce s-a promis și ce avem”**: obiective concrete, valoare contractată, sumă plătită și rezultate fizice raportate. Unitățile diferite, precum școli și kilometri, nu se adună într-un singur indicator.
4. **„Ce este gata”**: proiecte cu rezultate documentate în scenariul demo. O raportare administrativă de 100% se afișează explicit ca raportare, fără a presupune că serviciul funcționează.
5. **„De urmărit”**: două grupuri distincte — întârziere confirmată și informații insuficiente/neactualizate.
6. **„Cum se compară”**: un grafic simplu, normalizat, cu metodologia la un click distanță.
7. **„Povestea unui proiect”**: o intervenție explicată prin problemă, promisiune și rezultat.
8. **„Primește actualizări relevante”**: acces la configurarea buletinului demo.

Fiecare afirmație importantă are un control „Cum știm?” care deschide explicația, data de referință și proveniența demonstrativă.

### Ecranul 3 — Povestea unui proiect

- Titlu în limbaj obișnuit, localitate și tip de investiție.
- Ce problemă urmărește să rezolve și ce s-a promis.
- Traseu „Promis → Contractat → Plătit → Livrat”, cu informații independente pentru fiecare etapă. Acesta organizează povestea, fără să transforme plățile și livrarea într-un singur procent de progres.
- Valoare contractată și sumă plătită, cu definiții accesibile.
- Rezultat fizic promis și rezultat fizic raportat, cu unitate și dată.
- Progres tehnic raportat, termen și data ultimei raportări.
- Cronologia schimbărilor dintre cele două versiuni demo ale datelor.
- Instituțiile implicate și rolul fiecăreia; contractorul apare numai când este identificat în date.
- Surse și documente demonstrative asociate afirmațiilor.
- Rezultate pentru comunitate: informație distinctă de livrările fizice; când nu există măsurare, mesajul este „Nu avem date despre acest rezultat”.

Jaloanele naționale și plățile UE către România se explică separat. Nu sunt reprezentate ca o continuare automată a plății unui proiect local.

### Ecranul 4 — Buletinul „Ce s-a schimbat?”

- Ediție pentru județul și tema alese, cu două date explicite între care se face comparația.
- Trei schimbări principale și secțiuni pe teme.
- Evenimente ilustrate: livrare raportată, plată nouă, valoare modificată, întârziere documentată.
- Legături spre proiect și spre detaliile fiecărui eveniment.
- Formular de preferințe: județ, teme și tipuri de evenimente relevante.
- Buton „Previzualizează buletinul meu” și salvarea preferințelor în browser.
- Confirmare explicită: „Preferințele au fost salvate în acest browser. Trimiterea de email nu este activă în prototip.”

Nu se colectează adrese de email. Dacă pentru selecția curentă nu există schimbări, se afișează această situație; nu se generează un buletin artificial.

### Ecranul 5 — Explorează

- Listă de proiecte, cu căutare după titlu, beneficiar și localitate.
- Filtre limitate la județ, temă și situația proiectului.
- Carduri cu scop, rezultat, stare, dată și proveniență.
- Comparație între cele trei județe demonstrative, pe un indicator ales.
- Indicatori disponibili: valoare contractată per locuitor; pentru educație, valoare contractată per elev; raportul proiectelor finalizate raportat la totalul proiectelor cu status cunoscut.
- Numărătorul, numitorul, perioada, acoperirea datelor și motivul alegerii reperelor pot fi consultate.

Județele din demo nu sunt prezentate drept un grup de comparație validat. Interfața arată mecanismul; alegerea unor județe cu nevoi comparabile cere cercetare pentru produsul real. O hartă națională nu este necesară pentru a valida acest parcurs.

### Ecranul 6 — Verifică și metodologie

- Explicația surselor și a limitelor prototipului.
- Glosar: planificat, contractat, plătit beneficiarului, rezultat fizic, rezultat pentru comunitate, jalon, încasat de la UE.
- Exemplu explicat al diferenței dintre circuitul financiar local și plățile UE către stat.
- Metodologia comparațiilor și regulile pentru semnalele de atenție.
- Tabel cu cele două versiuni demo și datele lor de referință.
- Export JSON/CSV al datelor demonstrative, cu proveniență și indicator `isDemo`.
- Intrări de sursă demonstrative, identificabile prin ID. Linkurile generale către instituții, dacă sunt incluse, sunt etichetate ca orientare și nu ca dovezi ale cifrelor fictive.

## 4. Direcție vizuală

Aspect de publicație civică: fundal deschis, titluri clare, spațiu între secțiuni și accent pe lectura explicațiilor. Paletă propusă: alb cald, bleumarin și verde petrol; portocaliu pentru situațiile care cer atenție. Stările folosesc și text/simbol, astfel încât sensul să nu depindă de culoare.

Pagina de județ are un titlu puternic, briefing narativ și câteva carduri de rezultate. Graficele sunt secundare explicației, iar detaliile administrative se deschid la cerere.

Nu este necesară generarea de imagini pentru prima versiune. Fotografiile pot fi adăugate ulterior dacă există materiale cu drepturi clare și legătură verificabilă cu proiectul. Un grafic SVG simplu este suficient pentru comparații.

Pe telefon, secțiunile devin o singură coloană, selectorii sunt ușor de folosit, iar acțiunea principală rămâne accesibilă. Textele sunt în română, cu diacritice și formatare numerică `ro-RO`.

## 5. Datele și regulile de încredere

### Setul demonstrativ

- Trei județe: Bacău, Neamț și Vrancea.
- Douăsprezece proiecte: șase în Bacău, câte unul pentru fiecare temă, și câte trei în celelalte județe.
- Două versiuni ale datelor, de exemplu 31 august și 30 septembrie 2026, marcate explicit ca scenariu fictiv.
- Exemple cu rezultat livrat, progres modificat, plată nouă, întârziere confirmată și date insuficiente.
- Cel puțin un proiect cu plată parțială, un rezultat necunoscut și o valoare modificată.

Toate sumele demonstrative folosesc aceeași monedă și aceeași convenție privind TVA, declarate în metodologie. Nu se efectuează conversii valutare implicite.

### Model de date minimal

| Entitate | Câmpuri principale |
| --- | --- |
| `County` | ID, nume, populație demo, elevi demo, perioada și proveniența numitorilor |
| `Project` | ID stabil, titlu, județ, localitate, temă, scop, program, instituții și roluri |
| `Snapshot` | ID, perioadă de referință, data importului demo, lista proiectelor |
| `ProjectState` | ID proiect, ID snapshot, valoare contractată, sumă plătită, monedă, TVA, progres raportat, termen, status, rezultate |
| `Fact` | ID, valoare sau text, unitate, data de referință, categorie de proveniență, ID-uri de surse, `isDemo` |
| `Source` | ID, titlu, tip, data documentului, statut demo, URL numai dacă există o destinație reală |
| `ChangeEvent` | ID proiect, tip, valoare anterioară/nouă, snapshot-uri comparate și ID-uri de fapte |

Faptele asociate sumelor, statusurilor și rezultatelor păstrează proveniența individual. Un singur link generic pe proiect nu este suficient.

### Reguli obligatorii în interfață

1. Eticheta „Date demonstrative” rămâne vizibilă pe toate ecranele și în exporturi.
2. Lipsa datelor este reprezentată prin `null` și „Nu avem date”, nu prin zero.
3. Data perioadei raportate este distinctă de data actualizării paginii.
4. Banii, livrările fizice și rezultatele pentru comunitate sunt categorii separate.
5. Întârzierea confirmată cere termen și dovezi; datele vechi sau absente nu demonstrează o întârziere.
6. Proveniența poate fi „raportat oficial”, „calculat de platformă”, „extras din document”, „observație civică” sau „interpretare editorială”. În demo, toate aceste etichete poartă și marcajul de simulare.
7. Procentele se calculează numai cu numitor valid. Comparațiile prezintă acoperirea și perioada; agregatele nu dublează proiecte și nu amestecă unități.
8. Narațiunile folosesc faptele demo și calculele locale. Nu se inventează impact, cauzalitate sau vinovăție politică.
9. Un proiect absent dintr-o versiune nouă a datelor nu este declarat automat eliminat din program.

## 6. Implementare tehnică propusă

**Stack ales: React + TypeScript + Vite, cu Tailwind CSS și React Router.** Cerința este o aplicație cu framework și componente reutilizabile; varianta cu pagini HTML, CSS și JavaScript scrise direct este exclusă.

Vite asigură mediul de dezvoltare și build-ul; React asigură componentele și starea interfeței. TypeScript definește explicit proiectele, faptele, sursele și snapshot-urile. Tailwind gestionează stilizarea și regulile responsive printr-un set comun de tokenuri vizuale.

### De ce Vite pentru această etapă

Mockup-ul este o aplicație interactivă cu date demonstrative și preferințe locale. React + Vite permite construirea celor șase ecrane pe aceleași componente, fără să necesite un server de aplicație. Build-ul rezultat poate fi servit static.

Next.js este o alternativă potrivită dacă prioritatea devine dezvoltarea directă a platformei publice, cu pagini locale randate pe server, indexare în motoare de căutare și funcții server pentru accesul la date. Pentru mockup alegem Vite. O eventuală trecere la Next.js ar cere adaptarea rutelor și a accesului la date; componentele și calculele independente pot fi reutilizate, fără a presupune o migrare automată.

Referințe tehnice: [Vite](https://vite.dev/guide/), [Next.js — Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components), [Tailwind cu Vite](https://tailwindcss.com/docs/installation/using-vite).

### Navigare și stare

React Router gestionează rute precum `/judet/bacau?tema=scoli`, `/proiect/scoala-demo-01`, `/buletin`, `/exploreaza` și `/verifica`. Județul și filtrele relevante sunt reflectate în URL pentru linkuri directe și navigarea înainte/înapoi.

Serverul Vite oferă previzualizarea locală. La o eventuală publicare statică se configurează fallback-ul rutelor către intrarea aplicației, astfel încât reîncărcarea unui link direct să funcționeze.

Starea temporară rămâne în componente și hook-uri React; preferințele comune folosesc un context restrâns. Nu este necesar un manager global de stare pentru dimensiunea acestui mockup.

Structura propusă pentru etapa de implementare:

```text
platforma/
├── PLAN_IMPLEMENTARE.md
├── README.md
└── mockup/
    ├── package.json
    ├── package-lock.json
    ├── index.html
    ├── vite.config.ts
    ├── tsconfig.json
    ├── public/
    └── src/
        ├── main.tsx
        ├── app/
        │   ├── App.tsx
        │   ├── router.tsx
        │   └── PreferencesProvider.tsx
        ├── components/
        │   ├── layout/
        │   ├── ui/
        │   ├── ProjectCard.tsx
        │   ├── FactSourcePanel.tsx
        │   └── ComparisonChart.tsx
        ├── pages/
        │   ├── HomePage.tsx
        │   ├── CountyPage.tsx
        │   ├── ProjectPage.tsx
        │   ├── BulletinPage.tsx
        │   ├── ExplorePage.tsx
        │   └── VerifyPage.tsx
        ├── data/
        │   ├── counties.ts
        │   ├── projects.ts
        │   ├── snapshots.ts
        │   └── sources.ts
        ├── types/
        │   └── domain.ts
        ├── lib/
        │   ├── calculations.ts
        │   ├── changes.ts
        │   ├── exports.ts
        │   └── formatters.ts
        ├── hooks/
        │   └── usePreferences.ts
        └── styles/
            └── globals.css
```

- `types/domain.ts`: tipuri comune pentru modelul de date, inclusiv valori absente și proveniență.
- `data/`: fixture-uri TypeScript tipizate, importate local; exporturile JSON/CSV se generează din acestea.
- `lib/`: funcții independente de React pentru totaluri, rapoarte, indicatori normalizați și diferențe între snapshot-uri; aceeași logică alimentează toate paginile.
- `components/`: componente React reutilizabile pentru carduri, surse, filtre, glosar și grafice. `globals.css` conține intrarea Tailwind și tokenurile comune, iar ecranele sunt implementate în TSX.
- `usePreferences.ts` și `PreferencesProvider.tsx`: preferințe de județ, teme și tipuri de evenimente, salvate în `localStorage`. Funcționarea de bază continuă și dacă salvarea locală este indisponibilă.
- Exporturile sunt generate în browser, iar narațiunile sunt redactate pentru scenariile demo și completate cu valori calculate.

### Inițializare, pornire și verificare

În etapa de implementare se creează proiectul din template-ul Vite `react-ts`, în `platforma/mockup/`. Dependențele și lockfile-ul sunt locale acestui proiect. Se verifică versiunea Node disponibilă și compatibilitatea ei cu versiunile pachetelor înainte de instalare.

Comenzile de utilizare, din `platforma/mockup/`, după pregătirea proiectului:

```bash
npm ci
npm run dev
npm run typecheck
npm run test
npm run build
npm run preview
```

Scripturile `typecheck` și `test` se configurează pentru verificarea TypeScript și pentru teste Vitest ale calculelor. Build-ul de producție se generează în `platforma/mockup/dist/`. Adresa locală și portul efectiv sunt cele afișate de Vite; în mod implicit serverul de dezvoltare folosește `http://localhost:5173`.

Publicarea pe internet este o etapă separată, dacă va fi cerută.

## 7. Ordinea implementării și livrabilele

| Etapă | Activitate | Rezultat verificabil |
| --- | --- | --- |
| 1. Scenariu și conținut | Definirea proiectelor, snapshot-urilor, textelor și regulilor de proveniență | Un scenariu Bacău complet și valori coerente pentru toate cele trei județe |
| 2. Fundație React | Inițializare Vite + TypeScript, Tailwind, React Router, selectori și componente responsive | Pornire și briefing Bacău navigabile pe desktop și telefon |
| 3. Parcurs principal | Pagina de proiect, cronologie, glosar și panoul „Cum știm?” | Traseu complet de la o schimbare la proiect și la dovada demo |
| 4. Schimbări și buletin | Diferențe între snapshot-uri, preferințe și previzualizare | Buletinul afișează evenimentele relevante selecției |
| 5. Explorare și verificare | Căutare, filtre, comparații, metodologie și export | Datele pot fi explorate și reconciliate cu explicațiile |
| 6. Validare și predare | Verificare TypeScript, teste pentru calcule, build, verificări funcționale și accesibilitate | Mockup local complet, README și limite explicite |

Prioritatea este un parcurs vertical complet: **Bacău → Școli → o schimbare → proiect → sursă → buletin**. Celelalte ecrane se construiesc pe aceeași structură și același model de date.

## 8. Criterii de acceptare

- Un vizitator nou ajunge din ecranul de pornire la briefing alegând județul și, opțional, tema.
- În briefing poate identifica ce s-a promis, ce s-a livrat și ce s-a schimbat fără a deschide tabele administrative.
- Selectarea județului sau temei actualizează conținutul relevant; combinațiile fără rezultate au mesaje clare.
- O schimbare conduce la proiectul corect; „Cum știm?” explică faptele, sursele demo și data de referință.
- Pagina de proiect separă suma contractată, suma plătită, progresul raportat și rezultatul fizic.
- Datele insuficiente și întârzierea confirmată au texte și stări distincte.
- Totalurile, comparațiile și buletinul folosesc aceleași date și calcule; exporturile permit verificarea lor.
- Navigarea cu link direct și butoanele browserului funcționează.
- Preferințele persistă local, iar confirmarea nu sugerează că se trimit emailuri.
- Interfața este utilizabilă la aproximativ 360 px, 768 px și 1440 px, fără derulare orizontală neintenționată.
- Controalele au etichete, focus vizibil și acces prin tastatură. Panourile pot fi închise cu Escape și restabilesc focusul.
- Graficele au un echivalent textual, iar stările nu se bazează exclusiv pe culoare.
- Verificarea TypeScript, testele calculelor și build-ul Vite trec; nu există erori de execuție în parcursurile verificate în browser.
- Celelalte foldere ale workspace-ului rămân nemodificate.

Verificarea tehnică va include calculele unde există risc real de eroare: valori lipsă versus zero, numitori invalizi, diferențe între snapshot-uri și filtrarea pe județ/temă. Verificarea vizuală și funcțională se face în browser dacă mediul oferă această posibilitate; orice limită de verificare se menționează la predare.

## 9. Ce urmează după validarea mockup-ului

Înainte de dezvoltarea unei platforme reale, sunt necesare două validări:

1. **Cu cetățeni:** pot explica diferența dintre bani plătiți și rezultat livrat, pot găsi sursa și înțeleg când informația lipsește?
2. **Cu date reale:** ce câmpuri, istorice și documente sunt accesibile pentru un județ pilot și cât de bine se pot lega între ele?

Aceste verificări stabilesc arhitectura backend-ului și conținutul realist al primului produs. Integrarea datelor, AI-ul pentru formulare, newsletterul real și monitorizarea civică se planifică după această etapă, pornind de la disponibilitatea demonstrată a datelor.
