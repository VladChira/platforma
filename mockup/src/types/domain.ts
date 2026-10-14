export const themes = {
  toate: "Toate",
  scoli: "Școli",
  sanatate: "Sănătate",
  transport: "Transport",
  energie: "Energie",
  mediu: "Mediu",
  comunitate: "Comunitate",
} as const;
export type Theme = Exclude<keyof typeof themes, "toate">;
export type ThemeFilter = Theme | "toate";
export type CountyId = "bacau" | "neamt" | "vrancea";
export type Status = "in-lucru" | "finalizat" | "intarziat" | "necunoscut";
export const statuses: Record<Status, string> = {
  "in-lucru": "În lucru",
  finalizat: "Finalizare raportată",
  intarziat: "Întârziere confirmată",
  necunoscut: "Informații insuficiente",
};
export type Provenance =
  | "raportat oficial"
  | "calculat de platformă"
  | "extras din document"
  | "observație civică"
  | "interpretare editorială";
export interface Fact<T = number | string> {
  id: string;
  value: T | null;
  unit: string;
  referenceDate: string;
  provenance: Provenance;
  sourceIds: string[];
  isDemo: true;
}
export interface County {
  id: CountyId;
  name: string;
  population: Fact<number>;
  students: Fact<number>;
}
export interface Project {
  id: string;
  title: string;
  countyId: CountyId;
  locality: string;
  theme: Theme;
  purpose: string;
  promise: string;
  program: string;
  institutions: { name: string; role: string }[];
}
export interface ProjectState {
  projectId: string;
  snapshotId: string;
  contracted: Fact<number>;
  paid: Fact<number>;
  progress: Fact<number>;
  deadline: Fact<string>;
  status: Fact<Status>;
  promised: Fact<number>;
  delivered: Fact<number>;
  outcome: Fact<string>;
  delayEvidence: Fact<string>;
  currency: "RON";
  vat: "inclus";
}
export interface Snapshot {
  id: string;
  referenceDate: string;
  importedAt: string;
  states: ProjectState[];
  isDemo: true;
}
export interface Source {
  id: string;
  title: string;
  type: string;
  date: string;
  description: string;
  isDemo: true;
}
export const eventLabels = {
  delivery: "Livrare raportată",
  payment: "Plată nouă",
  value: "Valoare modificată",
  delay: "Întârziere documentată",
  progress: "Progres modificat",
} as const;
export type EventType = keyof typeof eventLabels;
export interface ChangeEvent {
  id: string;
  projectId: string;
  type: EventType;
  previous: number | string | null;
  current: number | string | null;
  unit: string;
  fromSnapshotId: string;
  toSnapshotId: string;
  factIds: string[];
}
export interface Preferences {
  countyId: CountyId;
  themes: ThemeFilter[];
  events: EventType[];
}
