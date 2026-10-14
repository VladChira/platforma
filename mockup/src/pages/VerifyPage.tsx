import { Download, Fingerprint } from "lucide-react";
import { snapshots, currentSnapshot } from "../data/snapshots";
import { sources } from "../data/sources";
import { download } from "../lib/exports";
import { date } from "../lib/formatters";
import { FactSource } from "../components/FactSourcePanel";
const glossary = [
  [
    "Planificat",
    "O intenție sau o alocare înaintea unui contract. Nu echivalează cu o plată.",
  ],
  [
    "Contractat",
    "Valoarea angajată printr-un contract, cu eventuale modificări documentate.",
  ],
  [
    "Plătit beneficiarului",
    "Suma transferată către beneficiarul proiectului. Separată de livrarea fizică și de încasările statului.",
  ],
  [
    "Rezultat fizic",
    "Ce a fost livrat: școli dotate, echipamente sau kilometri. Unități diferite nu se adună.",
  ],
  [
    "Rezultat pentru comunitate",
    "Schimbarea măsurată în viața oamenilor. Necesită dovezi distincte de recepția unui echipament.",
  ],
  [
    "Jalon",
    "Un reper național de implementare, cu propriile criterii de evaluare. Nu se deduce automat din starea unui proiect local.",
  ],
  [
    "Încasat de la UE",
    "Plată către stat în circuitul european. Nu este sinonimă cu suma plătită unui beneficiar local.",
  ],
];
export function VerifyPage() {
  return (
    <div className="container page verify-page">
      <div className="page-heading">
        <span className="eyebrow">
          <Fingerprint size={17} /> TRANSPARENȚA ÎNCEPE CU LIMITELE
        </span>
        <h1>
          De unde știm<span className="heading-dot">?</span>
        </h1>
        <p className="lead">
          Datele bune pot fi verificate. Datele care lipsesc trebuie
          recunoscute.
        </p>
      </div>
      <div className="notice">
        <strong>Tot acest prototip folosește date demonstrative.</strong>
        <p>
          Cele 12 proiecte, cifrele, numitorii și documentele sunt fictive.
          Nicio afirmație nu descrie situația reală a PNRR. Nu există importuri
          din surse oficiale.
        </p>
      </div>
      <section className="section">
        <h2>Ce înseamnă o sursă aici?</h2>
        <p>
          Fiecare sumă, stare și rezultat fizic are propriul fapt, o dată de
          referință și identificatori de surse. „Cum știm?” deschide exact
          aceste intrări. Documentele demo sunt texte din scenariu, fără linkuri
          către dovezi reale.
        </p>
        <div className="two-grid">
          <article className="report-box">
            <h3>Proveniența informației</h3>
            <ul>
              <li>Raportat oficial — simulat</li>
              <li>Calculat de platformă — simulat</li>
              <li>Extras din document — simulat</li>
              <li>
                Observație civică — categorie disponibilă, fără observații în
                acest demo
              </li>
              <li>Interpretare editorială — simulată</li>
            </ul>
          </article>
          <article className="report-box">
            <h3>Ce nu presupunem</h3>
            <p>
              O plată nu demonstrează o livrare. O livrare nu demonstrează
              impact. O raportare veche nu demonstrează întârziere. Un proiect
              absent dintr-o versiune nu este automat eliminat din program.
            </p>
          </article>
        </div>
      </section>
      <section className="section" id="glosar">
        <h2>Un glosar fără jargon</h2>
        <div className="glossary">
          {glossary.map(([term, definition]) => (
            <details key={term}>
              <summary>{term}</summary>
              <p>{definition}</p>
            </details>
          ))}
        </div>
        <div className="finance-example">
          <span className="eyebrow">
            DOUĂ CIRCUITE DISTINCTE · EXEMPLU CONCEPTUAL
          </span>
          <div className="two-grid">
            <div>
              <h3>Proiect local</h3>
              <p>
                Contract → plăți către beneficiar → livrare verificată separat
              </p>
            </div>
            <div>
              <h3>Plată europeană către stat</h3>
              <p>Jaloane și ținte → evaluare → tranșă către stat</p>
            </div>
          </div>
          <p className="meta">
            Acesta este un model explicativ simplificat, nu o descriere juridică
            sau o verificare actuală a regulilor PNRR. În demo nu calculăm
            încasări europene.
          </p>
        </div>
      </section>
      <section className="section" id="metodologie">
        <h2>Metodologia comparațiilor</h2>
        <ol>
          <li>
            Valoare contractată per locuitor: suma contractelor din selecție /
            populația demo a județului.
          </li>
          <li>
            Valoare per elev: suma contractelor pentru școli / numărul demo al
            elevilor din județ.
          </li>
          <li>
            Finalizare raportată: proiecte cu status „Finalizare raportată” /
            proiecte cu status cunoscut. Statusul necunoscut este exclus și
            acoperirea rămâne vizibilă.
          </li>
        </ol>
        <p>
          Numărătorii folosesc versiunea din{" "}
          {date(currentSnapshot.referenceDate)}; numitorii demografici folosesc
          1 ianuarie 2026. Valorile lipsă sunt <code>null</code>, nu zero. Dacă
          numitorul lipsește sau nu este pozitiv, rezultatul este „Nu avem
          date”. Sumele parțiale arată acoperirea. Proiectele se numără o
          singură dată, iar unitățile fizice se păstrează separat.
        </p>
        <p>
          Toate sumele sunt RON, cu TVA inclus. Nu facem conversii. Cele trei
          județe au fost alese pentru a demonstra interfața, nu pentru nevoi
          comparabile sau reprezentativitate națională.
        </p>
        <h3>Reguli pentru semnalele de atenție</h3>
        <p>
          Întârzierea confirmată cere un termen depășit la data de referință și
          o notă demonstrativă care confirmă întârzierea. Datele vechi sau
          absente apar separat, la informații insuficiente. Comparația dintre
          versiuni nu tratează prima raportare a unei valori drept o creștere de
          la zero.
        </p>
      </section>
      <section className="section">
        <h2>Două versiuni, două date explicite</h2>
        <div className="table-scroll">
          <table>
            <caption>Istoricul setului demonstrativ</caption>
            <thead>
              <tr>
                <th>Versiune</th>
                <th>Data de referință</th>
                <th>Import demo / actualizarea paginii</th>
                <th>Proiecte</th>
              </tr>
            </thead>
            <tbody>
              {snapshots.map((s) => (
                <tr key={s.id}>
                  <th>{s.id}</th>
                  <td>{date(s.referenceDate)}</td>
                  <td>{date(s.importedAt)}</td>
                  <td>{s.states.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="export-panel">
        <div>
          <span className="eyebrow">DATE DESCHISE, CHIAR ȘI ÎN DEMO</span>
          <h2>Verifică singur cifrele.</h2>
          <p>
            JSON: setul complet, inclusiv numitorii și sursele. CSV: faptele
            proiectelor din ambele versiuni, cu lipsurile și proveniența
            marcate. Toate exporturile includ <code>isDemo</code>.
          </p>
        </div>
        <div className="export-buttons">
          <button className="button primary" onClick={() => download("json")}>
            <Download size={17} /> Descarcă JSON
          </button>
          <button className="button secondary" onClick={() => download("csv")}>
            <Download size={17} /> Descarcă CSV
          </button>
        </div>
      </section>
      <section className="section">
        <h2>Registrul surselor demonstrative</h2>
        <p>
          {sources.length} intrări fictive, identificabile prin ID. Deschide un
          grup pentru a inspecta documentele.
        </p>
        <details>
          <summary>Numitorii demografici</summary>
          <FactSource
            title="Populație și elevi — proveniență"
            factIds={[
              "bacau-pop",
              "bacau-students",
              "neamt-pop",
              "neamt-students",
              "vrancea-pop",
              "vrancea-students",
            ]}
          />
        </details>
        {snapshots.map((snapshot) => (
          <details key={snapshot.id}>
            <summary>
              Documentele versiunii {snapshot.id} ·{" "}
              {date(snapshot.referenceDate)}
            </summary>
            <div className="source-register">
              {sources
                .filter((s) => s.id.startsWith(snapshot.id))
                .map((s) => (
                  <details key={s.id} id={s.id}>
                    <summary>{s.title}</summary>
                    <p>{s.description}</p>
                    <p className="meta">
                      {date(s.date)} · {s.type} · simulare
                    </p>
                    <code>{s.id}</code>
                  </details>
                ))}
            </div>
          </details>
        ))}
      </section>
    </div>
  );
}
