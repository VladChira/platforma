import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { projects } from "../data/projects";
import { allFacts } from "../data/snapshots";
import { eventLabels, themes, type ChangeEvent } from "../types/domain";
import { money, number } from "../lib/formatters";
import { FactSource } from "./FactSourcePanel";
export function changeText(event: ChangeEvent) {
  if (event.type === "delay")
    return "Termen depășit, confirmat prin nota de monitorizare demo.";
  if (event.type === "payment")
    return `${money(Number(event.current) - Number(event.previous))} plătiți în plus; total ${money(event.current as number)}.`;
  if (event.type === "value")
    return `Valoarea contractată: ${money(event.previous as number)} → ${money(event.current as number)}.`;
  if (event.type === "delivery")
    return `${number(event.previous as number)} → ${number(event.current as number)} ${event.unit} raportate ca livrate.`;
  return `Progres tehnic raportat: ${number(event.previous as number)}% → ${number(event.current as number)}%.`;
}
export function ChangeList({
  events,
  numbered = false,
}: {
  events: ChangeEvent[];
  numbered?: boolean;
}) {
  return events.length ? (
    <div className="change-list">
      {events.map((event, index) => {
        const project = projects.find((p) => p.id === event.projectId)!;
        return (
          <article key={event.id} className="change-item">
            {numbered && <span className="change-number">0{index + 1}</span>}
            <div>
              <span className="eyebrow">
                {themes[project.theme]} · {eventLabels[event.type]}
              </span>
              <h3>
                <Link to={`/proiect/${project.id}#${event.id}`}>
                  {project.title} <ArrowRight size={16} />
                </Link>
              </h3>
              <p>{changeText(event)}</p>
              <FactSource
                factIds={event.factIds.filter((id) =>
                  allFacts.some((f) => f.id === id),
                )}
                explanation="Schimbare calculată de platformă (simulare), prin compararea acelorași câmpuri din cele două versiuni demo. Lipsa unei valori nu este tratată ca zero."
              />
            </div>
          </article>
        );
      })}
    </div>
  ) : (
    <p className="empty-state" role="status">
      Nu există schimbări pentru selecția curentă în cele două versiuni demo.
    </p>
  );
}
