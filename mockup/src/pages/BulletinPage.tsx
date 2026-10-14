import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { MailCheck } from "lucide-react";
import { useSelection } from "../hooks/useSelection";
import { usePreferences } from "../app/PreferencesProvider";
import { CountySelect } from "../components/Filters";
import { ChangeList } from "../components/ChangeList";
import { projects } from "../data/projects";
import { currentSnapshot, previousSnapshot } from "../data/snapshots";
import { countyById } from "../data/counties";
import { detectChanges, relevantChanges } from "../lib/changes";
import {
  eventLabels,
  themes,
  type EventType,
  type Preferences,
  type ThemeFilter,
} from "../types/domain";
import { date } from "../lib/formatters";
export function BulletinPage() {
  const selection = useSelection();
  const { preferences, save } = usePreferences();
  const [params, setParams] = useSearchParams();
  const selectionKey = `${selection.countyId}:${selection.theme}:${params.get("teme")}:${params.get("evenimente")}`;
  const syncedSelection = useRef(selectionKey);
  function selectedPreferences(): Preferences {
    const selectedThemes = params.get("teme");
    const selectedEvents = params.get("evenimente");
    return {
      ...preferences,
      countyId: selection.countyId,
      themes:
        selectedThemes !== null
          ? (selectedThemes
              .split(",")
              .filter((t) => Object.hasOwn(themes, t)) as ThemeFilter[])
          : selection.theme === "toate"
            ? preferences.themes
            : [selection.theme],
      events:
        selectedEvents !== null
          ? (selectedEvents
              .split(",")
              .filter((e) => Object.hasOwn(eventLabels, e)) as EventType[])
          : preferences.events,
    };
  }
  const [draft, setDraft] = useState<Preferences>(selectedPreferences);
  const [preview, setPreview] = useState(draft);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (syncedSelection.current === selectionKey) return;
    syncedSelection.current = selectionKey;
    const next = selectedPreferences();
    setDraft(next);
    setPreview(next);
    setMessage("");
  }, [selectionKey]);
  const events = relevantChanges(
    detectChanges(previousSnapshot, currentSnapshot),
    projects,
    preview,
  );
  const priority = [...events].sort(
    (a, b) =>
      ["delivery", "delay", "value", "payment", "progress"].indexOf(a.type) -
      ["delivery", "delay", "value", "payment", "progress"].indexOf(b.type),
  );
  function toggleTheme(theme: ThemeFilter) {
    setDraft((p) => ({
      ...p,
      themes:
        theme === "toate"
          ? ["toate"]
          : p.themes.includes(theme)
            ? p.themes.filter((t) => t !== theme)
            : [...p.themes.filter((t) => t !== "toate"), theme],
    }));
  }
  function toggleEvent(event: EventType) {
    setDraft((p) => ({
      ...p,
      events: p.events.includes(event)
        ? p.events.filter((e) => e !== event)
        : [...p.events, event],
    }));
  }
  return (
    <div className="container page">
      <div className="page-heading">
        <span className="eyebrow">BULETIN LOCAL · EDIȚIE DEMONSTRATIVĂ</span>
        <h1>
          Ce s-a schimbat<span className="heading-dot">?</span>
        </h1>
        <p className="lead">
          Un buletin despre comunitatea ta. Doar subiectele pe care vrei să le
          urmărești.
        </p>
      </div>
      <div className="bulletin-layout">
        <aside className="preferences-panel">
          <MailCheck size={30} strokeWidth={1.5} />
          <h2>Buletinul tău</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPreview(draft);
              const persisted = save(draft);
              const next = new URLSearchParams(params);
              const theme =
                draft.themes.length === 1 ? draft.themes[0] : "toate";
              next.set("judet", draft.countyId);
              next.set("tema", theme);
              next.set("teme", draft.themes.join(","));
              next.set("evenimente", draft.events.join(","));
              syncedSelection.current = `${draft.countyId}:${theme}:${next.get("teme")}:${next.get("evenimente")}`;
              setParams(next, { replace: true });
              setMessage(
                persisted
                  ? "Preferințele au fost salvate în acest browser. Trimiterea de email nu este activă în prototip."
                  : "Previzualizarea este gata. Salvarea în browser nu este disponibilă; preferințele sunt păstrate doar în această sesiune. Trimiterea de email nu este activă în prototip.",
              );
            }}
          >
            <CountySelect
              value={draft.countyId}
              onChange={(countyId) => setDraft((p) => ({ ...p, countyId }))}
            />
            <fieldset>
              <legend>Temele tale</legend>
              {Object.entries(themes).map(([id, label]) => (
                <label className="checkbox" key={id}>
                  <input
                    type="checkbox"
                    checked={draft.themes.includes(id as ThemeFilter)}
                    onChange={() => toggleTheme(id as ThemeFilter)}
                  />
                  {label}
                </label>
              ))}
            </fieldset>
            <fieldset>
              <legend>Ce evenimente contează?</legend>
              {Object.entries(eventLabels).map(([id, label]) => (
                <label className="checkbox" key={id}>
                  <input
                    type="checkbox"
                    checked={draft.events.includes(id as EventType)}
                    onChange={() => toggleEvent(id as EventType)}
                  />
                  {label}
                </label>
              ))}
            </fieldset>
            <button className="button primary w-full" type="submit">
              Previzualizează buletinul meu
            </button>
            <p className="meta">
              Nu colectăm adrese de email. Preferințele se salvează numai în
              acest browser.
            </p>
            <p className="save-message" role="status">
              {message}
            </p>
          </form>
        </aside>
        <div className="bulletin-preview" aria-label="Previzualizare buletin">
          <div className="edition-header">
            <span className="eyebrow">
              ROMÂNIA CONSTRUIEȘTE · DATE DEMONSTRATIVE
            </span>
            <h2>Județul {countyById(preview.countyId).name}</h2>
            <p>
              {preview.themes.length
                ? preview.themes.map((t) => themes[t]).join(" · ")
                : "Nicio temă selectată"}
            </p>
            <p className="meta">
              Comparație: {date(previousSnapshot.referenceDate)} —{" "}
              {date(currentSnapshot.referenceDate)}
            </p>
          </div>
          <section>
            <h2>Schimbările principale</h2>
            <ChangeList events={priority.slice(0, 3)} numbered />
          </section>
          {Object.entries(themes)
            .filter(([id]) => id !== "toate")
            .map(([id, label]) => {
              const themed = events.filter(
                (e) => projects.find((p) => p.id === e.projectId)?.theme === id,
              );
              return themed.length ? (
                <section className="bulletin-theme" key={id}>
                  <h2>{label}</h2>
                  <ChangeList events={themed} />
                </section>
              ) : null;
            })}
          <p className="method-note">
            Schimbări calculate local între două versiuni fictive. Date de
            referință: {date(currentSnapshot.referenceDate)}. Buletin pregătit:{" "}
            {date(currentSnapshot.importedAt)} (demo).
          </p>
        </div>
      </div>
    </div>
  );
}
