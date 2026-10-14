import { useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { useSelection } from "../hooks/useSelection";
import { projects } from "../data/projects";
import { currentSnapshot } from "../data/snapshots";
import { selectProjects } from "../lib/calculations";
import { statuses } from "../types/domain";
import { ProjectCard } from "../components/ProjectCard";
import { ComparisonChart } from "../components/ComparisonChart";
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("ro-RO");
export function ExplorePage() {
  const { countyId, theme } = useSelection();
  const [params, setParams] = useSearchParams();
  const search = params.get("q") ?? "";
  const status = params.get("stare") ?? "toate";
  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    next.set(key, value);
    setParams(next, { replace: key === "q" });
  }
  const selected = selectProjects(projects, countyId, theme).filter(
    (p) =>
      normalize(
        [p.title, p.locality, ...p.institutions.map((i) => i.name)].join(" "),
      ).includes(normalize(search)) &&
      (status === "toate" ||
        currentSnapshot.states.find((s) => s.projectId === p.id)?.status
          .value === status),
  );
  return (
    <div className="container page">
      <div className="page-heading">
        <span className="eyebrow">DINCOLO DE REZUMAT</span>
        <h1>
          Explorează proiectele<span className="heading-dot">.</span>
        </h1>
        <p className="lead">
          Caută o investiție și urmărește promisiunea, plățile și livrarea.
        </p>
      </div>
      <div className="explore-filters">
        <label className="field search-field">
          <span>Caută după titlu, beneficiar sau localitate</span>
          <div>
            <Search size={19} />
            <input
              type="search"
              value={search}
              onChange={(e) => update("q", e.target.value)}
              placeholder="De exemplu: Moinești, școală…"
            />
          </div>
        </label>
        <label className="field">
          <span>Situația proiectului</span>
          <select
            value={status}
            onChange={(e) => update("stare", e.target.value)}
          >
            <option value="toate">Toate situațiile</option>
            {Object.entries(statuses).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="results-count" role="status">
        {selected.length} proiecte în selecția curentă · date demonstrative
      </p>
      {selected.length ? (
        <div className="two-grid">
          {selected.map((project) => (
            <ProjectCard project={project} key={project.id} />
          ))}
        </div>
      ) : (
        <p className="empty-state">
          Nu am găsit proiecte pentru aceste filtre. Încearcă alt județ, altă
          temă sau o căutare mai scurtă.
        </p>
      )}
      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">CONTEXT PENTRU CIFRE</span>
          <h2>O comparație explicată</h2>
          <p>
            Județele din demo ilustrează mecanismul. Nu sunt un grup de
            comparație validat.
          </p>
        </div>
        <ComparisonChart selected={countyId} theme={theme} />
      </section>
    </div>
  );
}
