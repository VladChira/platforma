import type {
  ChangeEvent,
  EventType,
  Fact,
  Preferences,
  Project,
  Snapshot,
} from "../types/domain";
import { confirmedDelay } from "./calculations";
export function detectChanges(
  previous: Snapshot,
  current: Snapshot,
): ChangeEvent[] {
  return current.states.flatMap((next) => {
    const old = previous.states.find((s) => s.projectId === next.projectId);
    if (!old) return [];
    const changes: ChangeEvent[] = [];
    function add(type: EventType, a: Fact, b: Fact, extraIds: string[] = []) {
      changes.push({
        id: `${next.projectId}-${type}`,
        projectId: next.projectId,
        type,
        previous: a.value,
        current: b.value,
        unit: b.unit,
        fromSnapshotId: previous.id,
        toSnapshotId: current.id,
        factIds: [a.id, b.id, ...extraIds],
      });
    }
    if (
      next.delivered.value !== null &&
      old.delivered.value !== null &&
      next.delivered.value > old.delivered.value
    )
      add("delivery", old.delivered, next.delivered);
    if (
      next.paid.value !== null &&
      old.paid.value !== null &&
      next.paid.value > old.paid.value
    )
      add("payment", old.paid, next.paid);
    if (next.contracted.value !== old.contracted.value)
      add("value", old.contracted, next.contracted);
    if (next.progress.value !== old.progress.value)
      add("progress", old.progress, next.progress);
    if (
      confirmedDelay(next, current.referenceDate) &&
      !confirmedDelay(old, previous.referenceDate)
    )
      add("delay", old.status, next.status, [
        next.deadline.id,
        next.delayEvidence.id,
      ]);
    return changes;
  });
}
export function relevantChanges(
  events: ChangeEvent[],
  projects: Project[],
  preferences: Preferences,
) {
  return events.filter((e) => {
    const p = projects.find((p) => p.id === e.projectId);
    return (
      p &&
      p.countyId === preferences.countyId &&
      (preferences.themes.includes("toate") ||
        preferences.themes.includes(p.theme)) &&
      preferences.events.includes(e.type)
    );
  });
}
