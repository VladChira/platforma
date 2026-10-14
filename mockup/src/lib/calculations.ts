import type {
  County,
  CountyId,
  Project,
  ProjectState,
  ThemeFilter,
} from "../types/domain";
export function selectProjects(
  projects: Project[],
  countyId?: CountyId,
  theme: ThemeFilter = "toate",
) {
  return projects.filter(
    (p) =>
      (!countyId || p.countyId === countyId) &&
      (theme === "toate" || p.theme === theme),
  );
}
export function sumKnown(values: (number | null)[]) {
  const known = values.filter((v): v is number => v !== null);
  return {
    value: known.length ? known.reduce((a, b) => a + b, 0) : null,
    known: known.length,
    total: values.length,
  };
}
export function ratio(numerator: number | null, denominator: number | null) {
  return numerator !== null && denominator !== null && denominator > 0
    ? numerator / denominator
    : null;
}
export function confirmedDelay(state: ProjectState, referenceDate: string) {
  return (
    state.status.value === "intarziat" &&
    !!state.deadline.value &&
    state.deadline.value < referenceDate &&
    !!state.delayEvidence.value
  );
}
export function aggregate(states: ProjectState[]) {
  const unique = [...new Map(states.map((s) => [s.projectId, s])).values()];
  return {
    contracted: sumKnown(unique.map((s) => s.contracted.value)),
    paid: sumKnown(unique.map((s) => s.paid.value)),
    physical: [...new Set(unique.map((s) => s.promised.unit))].map((unit) => ({
      unit,
      promised: sumKnown(
        unique
          .filter((s) => s.promised.unit === unit)
          .map((s) => s.promised.value),
      ),
      delivered: sumKnown(
        unique
          .filter((s) => s.delivered.unit === unit)
          .map((s) => s.delivered.value),
      ),
    })),
  };
}
export type Metric = "resident" | "student" | "completion";
export const metricLabels: Record<Metric, string> = {
  resident: "Valoare contractată / locuitor",
  student: "Valoare pentru școli / elev",
  completion: "Proiecte cu finalizare raportată",
};
export function compare(
  county: County,
  projects: Project[],
  states: ProjectState[],
  metric: Metric,
  theme: ThemeFilter = "toate",
) {
  const relevant = selectProjects(
    projects,
    county.id,
    metric === "student" ? "scoli" : theme,
  );
  const selected = [
    ...new Map(
      states
        .filter((s) => relevant.some((p) => p.id === s.projectId))
        .map((s) => [s.projectId, s]),
    ).values(),
  ];
  const known = selected.filter(
    (s) => s.status.value !== null && s.status.value !== "necunoscut",
  );
  const amounts = sumKnown(selected.map((s) => s.contracted.value));
  const numerator =
    metric === "completion"
      ? known.length
        ? known.filter((s) => s.status.value === "finalizat").length
        : null
      : amounts.value;
  const denominator =
    metric === "completion"
      ? known.length
      : metric === "student"
        ? county.students.value
        : county.population.value;
  return {
    value: ratio(numerator, denominator),
    numerator,
    denominator,
    known: metric === "completion" ? known.length : amounts.known,
    total: selected.length,
    unit:
      metric === "completion"
        ? "%"
        : metric === "student"
          ? "lei / elev"
          : "lei / locuitor",
  };
}
