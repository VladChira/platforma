import { createContext, useContext, useState, type ReactNode } from "react";
import { eventLabels, themes, type Preferences } from "../types/domain";
import { counties } from "../data/counties";
export const defaultPreferences: Preferences = {
  countyId: "bacau",
  themes: ["toate"],
  events: Object.keys(eventLabels) as Preferences["events"],
};
export const preferencesKey = "romania-construieste-preferences-v1";
export function parsePreferences(raw: string | null): Preferences {
  try {
    const p = JSON.parse(raw ?? "null") as Preferences | null;
    if (
      p &&
      counties.some((c) => c.id === p.countyId) &&
      Array.isArray(p.themes) &&
      p.themes.every((t) => Object.hasOwn(themes, t)) &&
      Array.isArray(p.events) &&
      p.events.every((e) => Object.hasOwn(eventLabels, e))
    )
      return p;
  } catch {
    /* Preferințele corupte nu împiedică navigarea. */
  }
  return defaultPreferences;
}
const Context = createContext<{
  preferences: Preferences;
  save: (p: Preferences) => boolean;
} | null>(null);
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState(() => {
    try {
      return parsePreferences(localStorage.getItem(preferencesKey));
    } catch {
      return defaultPreferences;
    }
  });
  function save(p: Preferences) {
    setPreferences(p);
    try {
      localStorage.setItem(preferencesKey, JSON.stringify(p));
      return true;
    } catch {
      return false;
    }
  }
  return (
    <Context.Provider value={{ preferences, save }}>
      {children}
    </Context.Provider>
  );
}
export function usePreferences() {
  return useContext(Context)!;
}
