import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CircleHelp, X } from "lucide-react";
import { allFacts } from "../data/snapshots";
import { counties } from "../data/counties";
import { sources } from "../data/sources";
import { date, number } from "../lib/formatters";
import { statuses, type Fact, type Status } from "../types/domain";
type Explanation = { title: string; factIds: string[]; explanation?: string };
const Context = createContext<(value: Explanation) => void>(() => {});
export function EvidenceProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<Explanation | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const facts: Fact[] = [
    ...allFacts,
    ...counties.flatMap((c) => [c.population, c.students]),
  ];
  useEffect(() => {
    if (active) dialog.current?.showModal();
  }, [active]);
  function open(value: Explanation) {
    trigger.current = document.activeElement as HTMLElement;
    setActive(value);
  }
  function close() {
    dialog.current?.close();
    setActive(null);
    trigger.current?.focus();
  }
  return (
    <Context.Provider value={open}>
      {children}
      <dialog
        ref={dialog}
        className="source-dialog"
        aria-labelledby="source-title"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {active && (
          <div className="dialog-content">
            <div className="flex items-start justify-between gap-4">
              <span className="eyebrow">Verificare · simulare</span>
              <button
                className="icon-button"
                onClick={close}
                aria-label="Închide explicația"
                autoFocus
              >
                <X size={22} />
              </button>
            </div>
            <h2 id="source-title">{active.title}</h2>
            <p className="notice">
              Date demonstrative. Documentele și cifrele de mai jos sunt
              fictive.
            </p>
            {active.explanation && <p>{active.explanation}</p>}
            {active.factIds.map((id) => {
              const fact = facts.find((f) => f.id === id);
              return fact ? (
                <section className="evidence-fact" key={id}>
                  <h3>
                    {fact.value === null
                      ? "Nu avem date"
                      : typeof fact.value === "number"
                        ? `${number(fact.value, 2)} ${fact.unit}`
                        : (statuses[fact.value as Status] ?? fact.value)}
                  </h3>
                  <p className="meta">
                    Referință: {date(fact.referenceDate)} · {fact.provenance}{" "}
                    (simulat)
                  </p>
                  <code>{fact.id}</code>
                  {fact.sourceIds.map((id) => {
                    const source = sources.find((s) => s.id === id);
                    return (
                      source && (
                        <div className="source-entry" key={id}>
                          <strong>{source.title}</strong>
                          <p>{source.description}</p>
                          <p className="meta">
                            {date(source.date)} · {source.type}
                          </p>
                          <code>{source.id}</code>
                        </div>
                      )
                    );
                  })}
                </section>
              ) : (
                <p key={id}>Fapt indisponibil: {id}</p>
              );
            })}
          </div>
        )}
      </dialog>
    </Context.Provider>
  );
}
export function FactSource({
  factIds,
  title = "Cum știm?",
  explanation,
}: {
  factIds: string[];
  title?: string;
  explanation?: string;
}) {
  const open = useContext(Context);
  return (
    <button
      className="source-button"
      onClick={() => open({ title, factIds, explanation })}
    >
      <CircleHelp size={14} />
      <span>{title}</span>
    </button>
  );
}
