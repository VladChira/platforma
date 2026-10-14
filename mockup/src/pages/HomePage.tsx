import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, BookOpen, Fingerprint, MapPin } from "lucide-react";
import { CountySelect, ThemeTabs } from "../components/Filters";
import { usePreferences } from "../app/PreferencesProvider";
import type { ThemeFilter } from "../types/domain";
export function HomePage() {
  const { preferences } = usePreferences();
  const [county, setCounty] = useState(preferences.countyId);
  const [theme, setTheme] = useState<ThemeFilter>("toate");
  const navigate = useNavigate();
  return (
    <>
      <section className="home-hero container">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="tiny-line" /> INVESTIȚII PUBLICE. VIAȚA DE ZI CU
            ZI.
          </span>
          <h1>
            Ce se construiește
            <br />
            în <em>comunitatea ta?</em>
          </h1>
          <p className="lead">
            De la promisiuni la lucruri pe care le poți vedea. Află ce s-a
            plătit, ce s-a livrat și ce mai avem de aflat despre investițiile
            din județul tău.
          </p>
          <div className="hero-footnote">
            <Fingerprint size={18} /> Fiecare informație are o explicație.
            Fiecare cifră, o sursă.
          </div>
        </div>
        <div className="start-card">
          <span className="step-label">ÎNCEPE CU LOCUL TĂU</span>
          <h2>
            O perspectivă locală.
            <br />
            Într-un minut.
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/judet/${county}?tema=${theme}`);
            }}
          >
            <CountySelect value={county} onChange={setCounty} />
            <fieldset>
              <legend>Ce te interesează?</legend>
              <ThemeTabs value={theme} onChange={setTheme} />
            </fieldset>
            <button className="button primary w-full" type="submit">
              Vezi ce s-a schimbat <ArrowRight size={19} />
            </button>
          </form>
          <Link className="example-link" to="/judet/bacau?tema=scoli">
            Sau descoperă exemplul Bacău · Școli <ArrowRight size={15} />
          </Link>
          <span className="meta">
            3 județe · 12 proiecte fictive · fără cont
          </span>
        </div>
      </section>
      <section className="how-section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">MAI APROAPE DE CE CONTEAZĂ</span>
            <h2>
              Banii publici au o poveste.
              <br />O facem ușor de urmărit.
            </h2>
          </div>
          <div className="three-grid">
            {[
              {
                icon: MapPin,
                no: "01",
                title: "Înțelege",
                text: "Ce s-a promis și ce avem, în locul în care trăiești.",
              },
              {
                icon: BookOpen,
                no: "02",
                title: "Explorează",
                text: "Proiectele din spatele schimbărilor, explicate fără jargon.",
              },
              {
                icon: Fingerprint,
                no: "03",
                title: "Verifică",
                text: "Surse, date și limite. Vezi cum ajungem la fiecare concluzie.",
              },
            ].map((item) => (
              <article className="how-card" key={item.no}>
                <div className="flex justify-between">
                  <item.icon size={27} strokeWidth={1.5} />
                  <span className="meta">{item.no}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <p className="method-note">
            Acesta este un prototip cu date demonstrative. PNRR este primul
            program ilustrat; cifrele și documentele sunt fictive.
          </p>
        </div>
      </section>
    </>
  );
}
