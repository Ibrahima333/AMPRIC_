import { Link } from "react-router-dom";
import "../styles/notfound.css";

export default function NotFound() {
  return (
    <section className="notfound-hero container-fluid">
      <div className="notfound-inner">
        <p className="notfound-kicker">Erreur 404</p>
        <h1>Page introuvable</h1>
        <p>
          La page que vous cherchez n'existe pas ou a été déplacée. Vérifiez l'adresse ou repartez
          depuis l'accueil.
        </p>
        <div className="notfound-actions">
          <Link className="button button-popup" to="/">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </section>
  );
}
