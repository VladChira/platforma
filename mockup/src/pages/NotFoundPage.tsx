import { Link } from "react-router";
export function NotFoundPage() {
  return (
    <div className="container page">
      <span className="eyebrow">PAGINĂ NEGĂSITĂ</span>
      <h1>Nu avem această pagină.</h1>
      <p>Verifică adresa sau revino la județele din scenariul demonstrativ.</p>
      <Link className="button primary" to="/">
        Alege comunitatea ta
      </Link>
    </div>
  );
}
