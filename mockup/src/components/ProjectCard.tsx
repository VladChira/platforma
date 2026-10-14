import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  CircleHelp,
  TriangleAlert,
} from "lucide-react";
import { Link } from "react-router";
import { currentSnapshot } from "../data/snapshots";
import { themes, statuses, type Project, type Status } from "../types/domain";
import { number, date } from "../lib/formatters";
import { FactSource } from "./FactSourcePanel";
export function StatusBadge({ status }: { status: Status | null }) {
  const Icon =
    status === "finalizat"
      ? CheckCircle2
      : status === "intarziat"
        ? TriangleAlert
        : status === "necunoscut" || status === null
          ? CircleHelp
          : Clock3;
  return (
    <span className={`status status-${status ?? "necunoscut"}`}>
      <Icon size={14} />
      {status ? statuses[status] : "Nu avem date"}
    </span>
  );
}
export function ProjectCard({ project }: { project: Project }) {
  const state = currentSnapshot.states.find((s) => s.projectId === project.id)!;
  return (
    <article className="project-card">
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow">
          {themes[project.theme]} · {project.locality}
        </span>
        <ArrowUpRight size={20} />
      </div>
      <h3>
        <Link to={`/proiect/${project.id}`}>{project.title}</Link>
      </h3>
      <p>{project.purpose}</p>
      <div className="project-result">
        <strong>
          {number(state.delivered.value)}
          {state.delivered.value !== null &&
            ` / ${number(state.promised.value)} ${state.delivered.unit}`}
        </strong>
        <span>rezultat fizic raportat</span>
      </div>
      <StatusBadge status={state.status.value} />
      <div className="card-bottom">
        <span className="meta">
          Raportare: {date(state.delivered.referenceDate)}
        </span>
        <FactSource factIds={[state.delivered.id, state.status.id]} />
      </div>
    </article>
  );
}
