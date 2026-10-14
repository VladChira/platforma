import { describe, expect, it } from "vitest";
import {
  aggregate,
  compare,
  confirmedDelay,
  ratio,
  selectProjects,
  sumKnown,
} from "./calculations";
import { detectChanges, relevantChanges } from "./changes";
import { csvCell, demoBundle, exportCsv } from "./exports";
import { counties } from "../data/counties";
import { projects } from "../data/projects";
import { allFacts, currentSnapshot, previousSnapshot } from "../data/snapshots";
import { sources } from "../data/sources";
const bacau = counties[0];
describe("Lipsuri, numitori și agregate", () => {
  it("distinge zero de lipsa datelor și declară acoperirea", () => {
    expect(sumKnown([null, null])).toEqual({ value: null, known: 0, total: 2 });
    expect(sumKnown([0, null, 100])).toEqual({
      value: 100,
      known: 2,
      total: 3,
    });
    expect(sumKnown([0]).value).toBe(0);
    expect(sumKnown([]).value).toBeNull();
  });
  it("nu calculează rapoarte cu numitori invalizi", () => {
    expect(ratio(20, 0)).toBeNull();
    expect(ratio(20, -2)).toBeNull();
    expect(ratio(20, null)).toBeNull();
    expect(ratio(null, 20)).toBeNull();
    expect(ratio(0, 20)).toBe(0);
  });
  it("filtrează exact județul și tema", () => {
    expect(selectProjects(projects, "bacau", "scoli").map((p) => p.id)).toEqual(
      ["scoala-demo-01"],
    );
    expect(selectProjects(projects, "neamt", "mediu")).toEqual([]);
    expect(selectProjects(projects, "bacau")).toHaveLength(6);
  });
  it("reconciliază totalurile Bacău și păstrează unitățile fizice", () => {
    const states = currentSnapshot.states.filter(
      (s) => projects.find((p) => p.id === s.projectId)?.countyId === "bacau",
    );
    const totals = aggregate([...states, states[0]]);
    expect(totals.contracted.value).toBe(38800000);
    expect(totals.paid).toEqual({ value: 18800000, known: 5, total: 6 });
    expect(
      totals.physical.find((p) => p.unit === "școli")?.delivered.value,
    ).toBe(3);
    expect(
      totals.physical.find((p) => p.unit === "centre comunitare")?.delivered
        .value,
    ).toBeNull();
    expect(totals.physical).toHaveLength(6);
  });
  it("normalizează doar educația per elev", () => {
    expect(
      compare(bacau, projects, currentSnapshot.states, "student").value,
    ).toBe(45);
    expect(
      compare(bacau, projects, currentSnapshot.states, "resident").value,
    ).toBeCloseTo(64.66667);
    expect(
      compare(bacau, projects, currentSnapshot.states, "completion"),
    ).toMatchObject({
      value: 0.4,
      numerator: 2,
      denominator: 5,
      known: 5,
      total: 6,
    });
    expect(
      compare(
        counties[1],
        projects,
        currentSnapshot.states,
        "resident",
        "mediu",
      ).value,
    ).toBeNull();
  });
  it("nu confirmă întârzieri fără termen și dovadă", () => {
    const bus = structuredClone(
      currentSnapshot.states.find((s) => s.projectId === "transport-bc")!,
    );
    expect(confirmedDelay(bus, currentSnapshot.referenceDate)).toBe(true);
    expect(confirmedDelay(bus, "2026-09-01")).toBe(false);
    bus.delayEvidence.value = null;
    expect(confirmedDelay(bus, currentSnapshot.referenceDate)).toBe(false);
    expect(
      confirmedDelay(
        currentSnapshot.states.find((s) => s.projectId === "comunitate-bc")!,
        currentSnapshot.referenceDate,
      ),
    ).toBe(false);
  });
});
describe("Schimbări și proveniență", () => {
  const events = detectChanges(previousSnapshot, currentSnapshot);
  it("identifică livrare, plată parțială, valoare și întârziere", () => {
    expect(
      events.find((e) => e.id === "scoala-demo-01-delivery"),
    ).toMatchObject({ previous: 0, current: 3 });
    expect(events.find((e) => e.id === "scoala-demo-01-payment")).toMatchObject(
      { previous: 1800000, current: 2700000 },
    );
    expect(events.find((e) => e.id === "energie-bc-value")).toMatchObject({
      previous: 4000000,
      current: 4200000,
    });
    expect(
      events.filter((e) => e.type === "delay").map((e) => e.projectId),
    ).toEqual(["transport-bc"]);
    expect(
      events.every((e) =>
        e.factIds.every((id) => allFacts.some((f) => f.id === id)),
      ),
    ).toBe(true);
  });
  it("nu inventează livrări sau plăți de la zero când valoarea veche lipsește", () => {
    const older = structuredClone(previousSnapshot);
    older.states[0].paid.value = null;
    older.states[0].delivered.value = null;
    const result = detectChanges(older, currentSnapshot).filter(
      (e) => e.projectId === "scoala-demo-01",
    );
    expect(
      result.some((e) => e.type === "payment" || e.type === "delivery"),
    ).toBe(false);
  });
  it("nu declară eliminat un proiect absent din noua versiune", () => {
    expect(
      detectChanges(previousSnapshot, { ...currentSnapshot, states: [] }),
    ).toEqual([]);
  });
  it("filtrează buletinul pe județ, teme și tipuri", () => {
    expect(
      relevantChanges(events, projects, {
        countyId: "bacau",
        themes: ["scoli"],
        events: ["delivery"],
      }).map((e) => e.id),
    ).toEqual(["scoala-demo-01-delivery"]);
    expect(
      relevantChanges(events, projects, {
        countyId: "neamt",
        themes: ["mediu"],
        events: ["delivery"],
      }),
    ).toEqual([]);
    expect(
      relevantChanges(events, projects, {
        countyId: "bacau",
        themes: [],
        events: ["delivery"],
      }),
    ).toEqual([]);
    expect(
      relevantChanges(events, projects, {
        countyId: "bacau",
        themes: ["toate"],
        events: [],
      }),
    ).toEqual([]);
  });
  it("asigură coerența fixture-urilor și a legăturilor către surse", () => {
    expect(projects).toHaveLength(12);
    expect(new Set(projects.map((p) => p.id)).size).toBe(12);
    expect(new Set(allFacts.map((f) => f.id)).size).toBe(allFacts.length);
    expect(new Set(sources.map((s) => s.id)).size).toBe(sources.length);
    for (const snapshot of [previousSnapshot, currentSnapshot]) {
      expect(snapshot.states).toHaveLength(12);
      for (const s of snapshot.states) {
        expect(
          s.paid.value === null || s.paid.value <= s.contracted.value!,
        ).toBe(true);
        expect(
          s.delivered.value === null || s.delivered.value <= s.promised.value!,
        ).toBe(true);
      }
    }
    expect(
      allFacts.every(
        (f) =>
          f.isDemo &&
          f.sourceIds.length &&
          f.sourceIds.every((id) =>
            sources.some((s) => s.id === id && s.isDemo),
          ),
      ),
    ).toBe(true);
  });
  it("exportă JSON reconciliabil și CSV cu null explicit, proveniență și escaping", () => {
    const bundle = demoBundle();
    expect(bundle.isDemo).toBe(true);
    expect(bundle.snapshots).toHaveLength(2);
    expect(bundle.counties[0].population.value).toBe(600000);
    const csv = exportCsv();
    expect(csv).toContain('"isDemo"');
    expect(csv).toContain('"isMissing"');
    expect(csv).toContain('"provenance"');
    expect(csv.split("\r\n")).toHaveLength(allFacts.length + 1);
    expect(csv).toContain('"","true"');
    expect(csv).toContain('"0","false"');
    expect(csvCell('Text, "citat"')).toBe('"Text, ""citat"""');
  });
});
