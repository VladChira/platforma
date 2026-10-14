import { useParams, useSearchParams } from "react-router";
import { usePreferences } from "../app/PreferencesProvider";
import { counties } from "../data/counties";
import { projects } from "../data/projects";
import { themes, type CountyId, type ThemeFilter } from "../types/domain";
export function useSelection() {
  const { countyId, projectId } = useParams();
  const [params] = useSearchParams();
  const { preferences } = usePreferences();
  const project = projects.find((p) => p.id === projectId);
  const rawCounty =
    countyId ??
    project?.countyId ??
    params.get("judet") ??
    preferences.countyId;
  const county = counties.find((c) => c.id === rawCounty);
  const rawTheme = params.get("tema") ?? project?.theme ?? "toate";
  const theme: ThemeFilter = Object.hasOwn(themes, rawTheme)
    ? (rawTheme as ThemeFilter)
    : "toate";
  const id: CountyId = county?.id ?? preferences.countyId;
  return {
    county,
    countyId: id,
    theme,
    query: `judet=${id}&tema=${theme}`,
    countyUrl: `/judet/${id}?tema=${theme}`,
  };
}
