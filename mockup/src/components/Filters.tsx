import { counties } from "../data/counties";
import { themes, type CountyId, type ThemeFilter } from "../types/domain";
export function CountySelect({
  value,
  onChange,
  label = "Județul care te interesează",
}: {
  value: CountyId;
  onChange: (value: CountyId) => void;
  label?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CountyId)}
      >
        {counties.map((c) => (
          <option key={c.id} value={c.id}>
            Județul {c.name}
          </option>
        ))}
      </select>
    </label>
  );
}
export function ThemeSelect({
  value,
  onChange,
}: {
  value: ThemeFilter;
  onChange: (value: ThemeFilter) => void;
}) {
  return (
    <label className="field">
      <span>Ce te interesează?</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ThemeFilter)}
      >
        {Object.entries(themes).map(([id, name]) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}
export function ThemeTabs({
  value,
  onChange,
}: {
  value: ThemeFilter;
  onChange: (value: ThemeFilter) => void;
}) {
  return (
    <div className="theme-tabs" aria-label="Teme">
      {Object.entries(themes).map(([id, name]) => (
        <button
          type="button"
          key={id}
          aria-pressed={value === id}
          className={value === id ? "selected" : ""}
          onClick={() => onChange(id as ThemeFilter)}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
