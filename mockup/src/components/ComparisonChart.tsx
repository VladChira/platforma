import { useState } from "react";
import { counties } from "../data/counties";
import { projects } from "../data/projects";
import { currentSnapshot } from "../data/snapshots";
import { compare, metricLabels, type Metric } from "../lib/calculations";
import { number, date } from "../lib/formatters";
import { FactSource } from "./FactSourcePanel";
import { themes, type CountyId, type ThemeFilter } from "../types/domain";
export function ComparisonChart({
  selected,
  theme = "toate",
}: {
  selected: CountyId;
  theme?: ThemeFilter;
}) {
  const [metric, setMetric] = useState<Metric>("resident");
  const rows = counties.map((county) => ({
    county,
    ...compare(county, projects, currentSnapshot.states, metric, theme),
  }));
  const max = Math.max(...rows.map((r) => r.value ?? 0), 1);
  return (
    <div className="comparison">
      <label className="field">
        <span>Indicator comparat</span>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value as Metric)}
        >
          {Object.entries(metricLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <p className="meta">
        {metric === "student" ? "Școli" : themes[theme]} ·{" "}
        {date(currentSnapshot.referenceDate)} · numai proiectele demo
      </p>
      <div className="comparison-bars">
        {rows.map((row) => (
          <div
            className={`comparison-row ${row.county.id === selected ? "highlight" : ""}`}
            key={row.county.id}
          >
            <span>{row.county.name}</span>
            <div className="bar-track" aria-hidden="true">
              <span style={{ width: `${((row.value ?? 0) / max) * 100}%` }} />
            </div>
            <strong>
              {number(
                row.value === null
                  ? null
                  : row.value * (metric === "completion" ? 100 : 1),
                1,
              )}
              {row.value !== null && ` ${row.unit}`}
            </strong>
          </div>
        ))}
      </div>
      <details>
        <summary>Cum calculăm și ce acoperă comparația?</summary>
        <p>
          Numărător / numitor, fără conversii valutare. Sumele sunt în lei, cu
          TVA inclus. Pentru elevi luăm exclusiv proiectele de școli. Numitorii
          demografici sunt fictivi, cu referința 1 ianuarie 2026. Un status
          necunoscut este exclus din numitorul ratei de finalizare; 100% tehnic
          nu este o dovadă a funcționării serviciului.
        </p>
        <div className="table-scroll">
          <table>
            <caption>Valorile din grafic și acoperirea datelor</caption>
            <thead>
              <tr>
                <th>Județ</th>
                <th>Numărător</th>
                <th>Numitor</th>
                <th>Acoperire</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.county.id}>
                  <th>{r.county.name}</th>
                  <td>{number(r.numerator)}</td>
                  <td>{number(r.denominator)}</td>
                  <td>
                    {r.known} / {r.total} proiecte
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <FactSource
          title="Vezi datele calculului"
          factIds={rows.flatMap((r) => [
            metric === "student"
              ? r.county.students.id
              : r.county.population.id,
            ...currentSnapshot.states
              .filter((s) =>
                projects.some(
                  (p) =>
                    p.id === s.projectId &&
                    p.countyId === r.county.id &&
                    (metric === "student"
                      ? p.theme === "scoli"
                      : theme === "toate" || p.theme === theme),
                ),
              )
              .map((s) =>
                metric === "completion" ? s.status.id : s.contracted.id,
              ),
          ])}
          explanation="Calculat de platformă (simulare). Județele ilustrează mecanismul și nu formează un grup validat de comparație."
        />
      </details>
      <p className="method-note">
        Trei județe demonstrative, nu un clasament al performanței. Nevoile și
        acoperirea datelor diferă.
      </p>
    </div>
  );
}
