import { useEffect, useRef } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { ArrowUpRight, Building2, MapPin } from "lucide-react";
import { useSelection } from "../../hooks/useSelection";
import { CountySelect, ThemeSelect } from "../Filters";
import type { CountyId, ThemeFilter } from "../../types/domain";
export function Layout() {
  const selection = useSelection();
  const location = useLocation();
  const navigate = useNavigate();
  const main = useRef<HTMLElement>(null);
  const first = useRef(true);
  const isHome = location.pathname === "/";
  const isProject = location.pathname.startsWith("/proiect/");
  useEffect(() => {
    if (!first.current) main.current?.focus({ preventScroll: true });
    first.current = false;
    const frame = requestAnimationFrame(() => {
      const target = location.hash
        ? document.getElementById(location.hash.slice(1))
        : null;
      if (target) target.scrollIntoView({ block: "center" });
      else window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);
  function update(county: CountyId, theme: ThemeFilter) {
    const params = new URLSearchParams(location.search);
    params.set("judet", county);
    params.set("tema", theme);
    params.delete("teme");
    params.delete("evenimente");
    navigate(
      `${location.pathname.startsWith("/judet/") || isProject ? `/judet/${county}` : location.pathname}?${params}`,
    );
  }
  return (
    <>
      <Link
        className="skip-link"
        to={{
          pathname: location.pathname,
          search: location.search,
          hash: "#main",
        }}
        onClick={() => main.current?.focus({ preventScroll: true })}
      >
        Sari la conținut
      </Link>
      <div className="demo-strip">
        <span className="demo-dot" /> Prototip cu date demonstrative{" "}
        <span className="hidden sm:inline">
          · Nicio cifră nu descrie situația reală a PNRR
        </span>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Link
            to="/"
            className="brand"
            aria-label="România Construiește — acasă"
          >
            <span className="brand-mark">
              <Building2 size={24} />
            </span>
            <span>
              România
              <strong>
                Construiește<span className="brand-dot">.</span>
              </strong>
            </span>
          </Link>
          <nav aria-label="Navigație principală">
            <NavLink
              to={selection.countyUrl}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Înțelege
            </NavLink>
            <NavLink to={`/exploreaza?${selection.query}`}>Explorează</NavLink>
            <NavLink to={`/verifica?${selection.query}`}>Verifică</NavLink>
            <NavLink
              to={`/buletin?${selection.query}`}
              className="bulletin-nav"
            >
              Buletinul tău <ArrowUpRight size={15} />
            </NavLink>
          </nav>
        </div>
      </header>
      {!isHome && (
        <div className="selection-bar">
          <div className="container selection-inner">
            <span className="selection-label">
              <MapPin size={16} /> Comunitatea ta
            </span>
            <CountySelect
              value={selection.countyId}
              onChange={(id) => update(id, selection.theme)}
            />
            <ThemeSelect
              value={selection.theme}
              onChange={(theme) => update(selection.countyId, theme)}
            />
          </div>
        </div>
      )}
      <main id="main" ref={main} tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <strong>România Construiește.</strong>
            <p>Investiții publice, pe înțelesul tău.</p>
          </div>
          <div>
            <span className="demo-label">Date demonstrative</span>
            <p>Un prototip despre cum ar putea arăta transparența.</p>
            <Link to={`/verifica?${selection.query}`}>
              Surse, metodologie și limite <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
