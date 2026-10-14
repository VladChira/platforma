import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { projects } from "../data/projects";
import { currentSnapshot, previousSnapshot } from "../data/snapshots";
import { countyById } from "../data/counties";
import { themes } from "../types/domain";
import { date, money, number } from "../lib/formatters";
import { detectChanges } from "../lib/changes";
import { ChangeList } from "../components/ChangeList";
import { FactSource } from "../components/FactSourcePanel";
import { StatusBadge } from "../components/ProjectCard";
import { NotFoundPage } from "./NotFoundPage";
export function ProjectPage() {
  const { projectId } = useParams();
  const project = projects.find((p) => p.id === projectId);
  if (!project) return <NotFoundPage />;
  const state = currentSnapshot.states.find((s) => s.projectId === project.id)!;
  const events = detectChanges(previousSnapshot, currentSnapshot).filter(
    (e) => e.projectId === project.id,
  );
  return (
    <div className="container page project-page">
      <Link
        className="text-link"
        to={`/judet/${project.countyId}?tema=${project.theme}`}
      >
        <ArrowLeft size={16} /> Înapoi la județul{" "}
        {countyById(project.countyId).name} · {themes[project.theme]}
      </Link>
      <div className="page-heading">
        <span className="eyebrow">
          {project.locality} · {themes[project.theme]} · {project.program}
        </span>
        <h1>{project.title}</h1>
        <StatusBadge status={state.status.value} />
        <div className="date-line">
          <span>Referință: {date(currentSnapshot.referenceDate)}</span>
          <span>
            Pagină actualizată: {date(currentSnapshot.importedAt)} (demo)
          </span>
        </div>
      </div>
      <section className="two-grid section">
        <article>
          <span className="eyebrow">PROBLEMA</span>
          <h2>De ce acest proiect?</h2>
          <p className="lead">{project.purpose}</p>
          <p className="meta">
            Context editorial fictiv, redactat pentru acest scenariu.
          </p>
        </article>
        <article className="promise-box">
          <span className="eyebrow">PROMISIUNEA</span>
          <h2>{project.promise}</h2>
          <FactSource factIds={[state.promised.id]} />
        </article>
      </section>
      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">PATRU ETAPE, INFORMAȚII INDEPENDENTE</span>
          <h2>De la promisiune la livrare</h2>
          <p>
            Plățile și livrarea răspund la întrebări diferite. Niciun procent
            unic nu le înlocuiește.
          </p>
        </div>
        <div className="journey-grid">
          <article>
            <span className="eyebrow">01 · PROMIS</span>
            <strong>
              {number(state.promised.value)} {state.promised.unit}
            </strong>
            <p>Obiectivul fizic al proiectului.</p>
            <FactSource factIds={[state.promised.id]} />
          </article>
          <article>
            <span className="eyebrow">02 · CONTRACTAT</span>
            <strong>{money(state.contracted.value)}</strong>
            <p>Valoarea angajată prin contract. Lei, cu TVA inclus.</p>
            <FactSource factIds={[state.contracted.id]} />
          </article>
          <article>
            <span className="eyebrow">03 · PLĂTIT</span>
            <strong>{money(state.paid.value)}</strong>
            <p>Plăți către beneficiar. Nu dovedesc recepția.</p>
            <FactSource factIds={[state.paid.id]} />
          </article>
          <article>
            <span className="eyebrow">04 · LIVRAT</span>
            <strong>
              {number(state.delivered.value)}{" "}
              {state.delivered.value !== null && state.delivered.unit}
            </strong>
            <p>
              Rezultat fizic raportat la {date(state.delivered.referenceDate)}.
            </p>
            <FactSource factIds={[state.delivered.id]} />
          </article>
        </div>
      </section>
      <section className="two-grid section">
        <div className="report-box">
          <h2>Situația raportată</h2>
          <dl className="facts-list">
            <div>
              <dt>Progres tehnic</dt>
              <dd>
                {number(state.progress.value)}
                {state.progress.value !== null && "%"}{" "}
                <FactSource factIds={[state.progress.id]} />
              </dd>
            </div>
            <div>
              <dt>Termen contractual demo</dt>
              <dd>
                {state.deadline.value
                  ? date(state.deadline.value)
                  : "Nu avem date"}{" "}
                <FactSource factIds={[state.deadline.id]} />
              </dd>
            </div>
            <div>
              <dt>Ultima raportare</dt>
              <dd>
                {date(state.status.referenceDate)}{" "}
                <FactSource factIds={[state.status.id]} />
              </dd>
            </div>
          </dl>
          {state.status.value === "finalizat" && (
            <p className="notice">
              100% reprezintă progresul administrativ raportat. Nu confirmă
              automat funcționarea serviciului.
            </p>
          )}
          {state.status.value === "necunoscut" && (
            <p className="notice">
              Raportarea este veche și câmpuri esențiale lipsesc. Nu putem
              deduce o întârziere.
            </p>
          )}
          {state.delayEvidence.value && (
            <div className="notice attention">
              <p>{state.delayEvidence.value}</p>
              <FactSource
                factIds={[
                  state.delayEvidence.id,
                  state.deadline.id,
                  state.status.id,
                ]}
              />
            </div>
          )}
        </div>
        <div className="outcome-box">
          <span className="eyebrow">REZULTATE PENTRU COMUNITATE</span>
          <h2>Ce s-a schimbat în viața oamenilor?</h2>
          <p className="lead">Nu avem date despre acest rezultat.</p>
          <p>
            Livrarea fizică nu dovedește reducerea timpilor de așteptare,
            economii de energie sau rezultate școlare mai bune. Aceste efecte
            cer măsurări separate.
          </p>
          <FactSource factIds={[state.outcome.id]} />
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">ISTORIC DEMONSTRATIV</span>
          <h2>Ce s-a schimbat?</h2>
          <p>
            {date(previousSnapshot.referenceDate)} →{" "}
            {date(currentSnapshot.referenceDate)}
          </p>
        </div>
        {events.length ? (
          events.map((event) => (
            <div key={event.id} id={event.id} className="timeline-event">
              <ChangeList events={[event]} />
            </div>
          ))
        ) : (
          <p className="empty-state">
            Nu avem schimbări între cele două versiuni pentru acest proiect.
          </p>
        )}
      </section>
      <section className="section">
        <h2>Cine are ce rol?</h2>
        <div className="two-grid">
          {project.institutions.map((institution) => (
            <article className="institution" key={institution.name}>
              <h3>{institution.name}</h3>
              <p>{institution.role}</p>
            </article>
          ))}
        </div>
        <p className="meta">
          Contractorul nu este identificat în datele demonstrative.
        </p>
      </section>
      <section className="section">
        <h2>Surse și documente</h2>
        <p>
          Fiecare câmp are o intrare demonstrativă identificabilă. Nu sunt
          documente publice reale.
        </p>
        <div className="source-actions">
          <FactSource
            title="Contractul și termenul"
            factIds={[state.contracted.id, state.deadline.id]}
          />
          <FactSource title="Raportul financiar" factIds={[state.paid.id]} />
          <FactSource
            title="Livrarea și starea proiectului"
            factIds={[
              state.promised.id,
              state.delivered.id,
              state.progress.id,
              state.status.id,
            ]}
          />
        </div>
        <details>
          <summary>
            De ce plata UE nu apare ca o etapă a acestui proiect?
          </summary>
          <p>
            În modelul explicativ al prototipului, plățile către beneficiar și
            plățile către stat sunt circuite distincte. Un jalon național nu se
            deduce automat din recepția acestui proiect. Nu simulăm tranșe
            europene și nu atribuim acestui proiect încasări ale statului.
          </p>
          <Link to="/verifica#glosar">
            Vezi glosarul și limitele explicației
          </Link>
        </details>
      </section>
      <Link
        className="button primary"
        to={`/buletin?judet=${project.countyId}&tema=${project.theme}`}
      >
        Vezi buletinul acestei teme <ArrowRight size={17} />
      </Link>
    </div>
  );
}
