import type { Source } from "../types/domain";
export const sources: Source[] = [
  {
    id: "denominators",
    title: "Populație și elevi — scenariu demonstrativ",
    type: "Tabel de referință fictiv",
    date: "2026-01-01",
    description:
      "Numitori inventați. Nu provin de la INS sau din evidențe școlare reale.",
    isDemo: true,
  },
];
export function registerSource(source: Source) {
  sources.push(source);
}
