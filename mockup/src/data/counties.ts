import type { County, CountyId, Fact } from "../types/domain";
const denominator = (
  id: string,
  value: number,
  unit: string,
): Fact<number> => ({
  id,
  value,
  unit,
  referenceDate: "2026-01-01",
  provenance: "interpretare editorială",
  sourceIds: ["denominators"],
  isDemo: true,
});
export const counties: County[] = [
  {
    id: "bacau",
    name: "Bacău",
    population: denominator("bacau-pop", 600000, "locuitori"),
    students: denominator("bacau-students", 80000, "elevi"),
  },
  {
    id: "neamt",
    name: "Neamț",
    population: denominator("neamt-pop", 450000, "locuitori"),
    students: denominator("neamt-students", 60000, "elevi"),
  },
  {
    id: "vrancea",
    name: "Vrancea",
    population: denominator("vrancea-pop", 300000, "locuitori"),
    students: denominator("vrancea-students", 40000, "elevi"),
  },
];
export const countyById = (id: CountyId) => counties.find((c) => c.id === id)!;
