import { Link, useSearchParams } from "react-router";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  TriangleAlert,
  CircleHelp,
} from "lucide-react";
import { useSelection } from "../hooks/useSelection";
import { projects } from "../data/projects";
import { currentSnapshot, previousSnapshot } from "../data/snapshots";
import { aggregate, confirmedDelay, selectProjects } from "../lib/calculations";
import { detectChanges, relevantChanges } from "../lib/changes";
import { eventLabels, themes } from "../types/domain";
import { compactMoney, date, number } from "../lib/formatters";
import { ThemeTabs } from "../components/Filters";
import { ProjectCard } from "../components/ProjectCard";
import { ChangeList } from "../components/ChangeList";
import { FactSource } from "../components/FactSourcePanel";
import { ComparisonChart } from "../components/ComparisonChart";
import { NotFoundPage } from "./NotFoundPage";
export function CountyPage() {
  const { county, countyId, theme, query } = useSelection();
  const [params, setParams] = useSearchParams();
  if (!county) return <NotFoundPage />;
  const selected = selectProjects(projects, countyId, theme);
  const states = currentSnapshot.states.filter((s) =>
    selected.some((p) => p.id === s.projectId),
  );
  const totals = aggregate(states);
  const events = relevantChanges(
    detectChanges(previousSnapshot, currentSnapshot),
    projects,
    {
      countyId,
      themes: [theme],
      events: Object.keys(eventLabels) as (keyof typeof eventLabels)[],
    },
  );
  const important = [...events]
    .sort(
      (a, b) =>
        ["delivery", "delay", "value", "payment", "progress"].indexOf(a.type) -
        ["delivery", "delay", "value", "payment", "progress"].indexOf(b.type),
    )
    .slice(0, 3);
  const finished = selected.filter(
    (p) =>
      states.find((s) => s.projectId === p.id)?.status.value === "finalizat",
  );
  const delayed = selected.filter((p) =>
    confirmedDelay(
      states.find((s) => s.projectId === p.id)!,
      currentSnapshot.referenceDate,
    ),
  );
  const unknown = selected.filter(
    (p) =>
      states.find((s) => s.projectId === p.id)?.status.value === "necunoscut",
  );
  return (
    <div className="container page">
      <div className="page-heading">
        <span className="eyebrow">BRIEFING LOCAL · {themes[theme]}</span>
        <h1>
          Județul {county.name}
          <span className="heading-dot">.</span>
        </h1>
        <p className="lead">
          Ce se schimbă aproape de tine, explicat pe înțelesul tuturor.
        </p>
        <div className="date-line">
          <span>
            Date de referință:{" "}
            <strong>{date(currentSnapshot.referenceDate)}</strong>
          </span>
          <span>
            Pagină actualizată: {date(currentSnapshot.importedAt)} (demo)
          </span>
        </div>
      </div>
      <ThemeTabs
        value={theme}
        onChange={(t) => {
          const next = new URLSearchParams(params);
          next.set("tema", t);
          setParams(next);
        }}
      />
      {!selected.length ? (
        <p className="empty-state">
          Nu avem proiecte demonstrative pentru această temă în județul{" "}
          {county.name}. Alege altă temă pentru a continua.
        </p>
      ) : (
        <>
          <section className="briefing-panel">
            <div className="section-heading">
              <span className="eyebrow">ESENȚIALUL, FĂRĂ TABELE</span>
              <h2>Într-un minut</h2>
              <p>
                Ce s-a schimbat între {date(previousSnapshot.referenceDate)} și{" "}
                {date(currentSnapshot.referenceDate)}.
              </p>
            </div>
            <ChangeList events={important} numbered />
            <Link className="text-link" to={`/buletin?${query}`}>
              Toate schimbările din buletin <ArrowRight size={17} />
            </Link>
          </section>
          <section className="section">
            <div className="section-heading">
              <span className="eyebrow">BANII ȘI LUCRURILE CONCRETE</span>
              <h2>Ce s-a promis și ce avem</h2>
              <p>
                {selected.length} proiecte în selecția ta. Sume în lei, cu TVA
                inclus.
              </p>
            </div>
            <div className="two-grid">
              <article className="stat-card">
                <span>Valoare contractată</span>
                <strong>{compactMoney(totals.contracted.value)}</strong>
                <p>Angajamentul din contracte, nu bani deja cheltuiți.</p>
                <FactSource
                  factIds={states.map((s) => s.contracted.id)}
                  explanation={`Total calculat (simulare), fără dublarea proiectelor. Acoperire: ${totals.contracted.known}/${totals.contracted.total}.`}
                />
              </article>
              <article className="stat-card">
                <span>Plătit beneficiarilor</span>
                <strong>{compactMoney(totals.paid.value)}</strong>
                <p>
                  {totals.paid.known} din {totals.paid.total} proiecte au date
                  despre plăți. Suma este{" "}
                  {totals.paid.known < totals.paid.total
                    ? "un total parțial"
                    : "totalul valorilor cunoscute"}
                  .
                </p>
                <FactSource
                  factIds={states.map((s) => s.paid.id)}
                  explanation="Total calculat din plățile cunoscute. Nu dovedește livrarea fizică sau funcționarea serviciilor."
                />
              </article>
            </div>
            <div className="physical-list">
              {totals.physical.map((row) => (
                <article key={row.unit}>
                  <strong>
                    {number(row.delivered.value)}
                    <span> / {number(row.promised.value)}</span>
                  </strong>
                  <span>{row.unit}</span>
                  <small>
                    raportate / promise · date pentru {row.delivered.known}/
                    {row.delivered.total} proiecte
                  </small>
                  <FactSource
                    factIds={states
                      .filter((s) => s.promised.unit === row.unit)
                      .flatMap((s) => [s.promised.id, s.delivered.id])}
                  />
                </article>
              ))}
            </div>
          </section>
          <section className="section">
            <div className="section-heading">
              <span className="eyebrow">
                <CheckCircle2 size={16} /> LIVRĂRI RAPORTATE
              </span>
              <h2>Ce este gata</h2>
              <p>
                Finalizarea raportată descrie livrarea fizică. Nu confirmă
                automat că serviciul funcționează.
              </p>
            </div>
            {finished.length ? (
              <div className="two-grid">
                {finished.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            ) : (
              <p className="empty-state">
                Niciun proiect din selecție nu are finalizare raportată în
                scenariul demo.
              </p>
            )}
          </section>
          <section className="section">
            <div className="section-heading">
              <span className="eyebrow">ÎNTREBĂRILE RĂMASE DESCHISE</span>
              <h2>De urmărit</h2>
            </div>
            <div className="two-grid">
              <div className="attention-box">
                <h3>
                  <TriangleAlert size={20} /> Întârziere confirmată
                </h3>
                <p>Termen depășit și dovezi în nota de monitorizare.</p>
                {delayed.length ? (
                  delayed.map((p) => <ProjectCard key={p.id} project={p} />)
                ) : (
                  <p className="meta">
                    Nicio întârziere confirmată în selecția curentă.
                  </p>
                )}
              </div>
              <div className="unknown-box">
                <h3>
                  <CircleHelp size={20} /> Informații insuficiente
                </h3>
                <p>
                  O raportare veche sau absentă nu demonstrează o întârziere.
                </p>
                {unknown.length ? (
                  unknown.map((p) => <ProjectCard key={p.id} project={p} />)
                ) : (
                  <p className="meta">
                    Niciun proiect cu informații insuficiente în selecție.
                  </p>
                )}
              </div>
            </div>
          </section>
          <section className="section">
            <div className="section-heading">
              <span className="eyebrow">
                ACELEAȘI UNITĂȚI, ÎNTREBĂRI MAI BUNE
              </span>
              <h2>Cum se compară</h2>
            </div>
            <ComparisonChart selected={countyId} theme={theme} />
          </section>
          <section className="story-panel">
            <div>
              <span className="eyebrow">
                POVESTEA UNUI PROIECT · {selected[0].locality}
              </span>
              <h2>{selected[0].title}</h2>
              <p>
                {selected[0].purpose} {selected[0].promise}
              </p>
              <Link
                className="button primary"
                to={`/proiect/${selected[0].id}`}
              >
                Urmărește povestea <ArrowRight size={17} />
              </Link>
            </div>
            <div className="story-quote">
              <span>Promis</span>
              <strong>Contractat</strong>
              <span>Plătit</span>
              <strong>Livrat?</strong>
              <p>Patru întrebări. Dovezi pentru fiecare.</p>
            </div>
          </section>
        </>
      )}
      <section className="newsletter-callout">
        <Mail size={30} strokeWidth={1.4} />
        <div>
          <h2>Schimbările care contează pentru tine.</h2>
          <p>Alege subiectele și previzualizează buletinul tău demonstrativ.</p>
        </div>
        <Link className="button secondary" to={`/buletin?${query}`}>
          Configurează buletinul <ArrowRight size={17} />
        </Link>
      </section>
    </div>
  );
}
