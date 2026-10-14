import { counties } from "../data/counties";
import { projects } from "../data/projects";
import { snapshots, allFacts } from "../data/snapshots";
import { sources } from "../data/sources";
import { detectChanges } from "./changes";
export const demoBundle = () => ({
  isDemo: true,
  notice: "Date fictive. Nu reprezintă situația reală a PNRR.",
  currency: "RON",
  vat: "inclus",
  counties,
  projects,
  snapshots,
  sources,
  changes: detectChanges(snapshots[0], snapshots[1]),
});
export function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}
export function exportCsv() {
  const headers = [
    "isDemo",
    "snapshotId",
    "projectId",
    "countyId",
    "theme",
    "factId",
    "value",
    "isMissing",
    "unit",
    "referenceDate",
    "provenance",
    "sourceIds",
    "sourceTitles",
    "currency",
    "vat",
  ];
  return (
    "\uFEFF" +
    [
      headers,
      ...snapshots.flatMap((snapshot) =>
        snapshot.states.flatMap((state) => {
          const project = projects.find((p) => p.id === state.projectId)!;
          return allFacts
            .filter((f) =>
              f.id.startsWith(`${snapshot.id}-${state.projectId}-`),
            )
            .map((f) => [
              true,
              snapshot.id,
              project.id,
              project.countyId,
              project.theme,
              f.id,
              f.value,
              f.value === null,
              f.unit,
              f.referenceDate,
              f.provenance,
              f.sourceIds.join("|"),
              f.sourceIds
                .map((id) => sources.find((s) => s.id === id)?.title)
                .join("|"),
              state.currency,
              state.vat,
            ]);
        }),
      ),
    ]
      .map((row) => row.map(csvCell).join(","))
      .join("\r\n")
  );
}
export function download(format: "json" | "csv") {
  const blob = new Blob(
    [format === "json" ? JSON.stringify(demoBundle(), null, 2) : exportCsv()],
    { type: format === "json" ? "application/json" : "text/csv;charset=utf-8" },
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `romania-construieste-demo.${format}`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
