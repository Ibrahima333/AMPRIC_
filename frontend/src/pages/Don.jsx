import { Link } from "react-router-dom";
import "../styles/don.css";
import Reveal from "../components/Reveal";

export default function Don() {
  return (
    <>
      <section className="don-hero container-fluid">
        <div className="don-hero-inner">
          <h1>Faire un don</h1>
          <p>
            Votre contribution aide l'AMPRIC à poursuivre ses actions d'information, d'écoute,
            d'accompagnement et de sensibilisation auprès des personnes vivant avec des rhumatismes
            inflammatoires chroniques.
          </p>
        </div>
      </section>

      <section className="don-content container">
        <div className="don-grid">
          <Reveal as="article" className="don-card">
            <h2>Pourquoi faire un don ?</h2>
            <p>
              Chaque soutien permet de renforcer les activités de terrain, les campagnes de sensibilisation,
              les rencontres communautaires et l'accompagnement des malades et de leurs proches.
            </p>
          </Reveal>

          <Reveal as="article" className="don-card" delay={100}>
            <h2>Votre impact</h2>
            <p>
              En faisant un don, vous participez à une meilleure visibilité de la maladie, au développement
              d'une communauté solidaire et à l'amélioration de la qualité de vie des personnes concernées.
            </p>
          </Reveal>
        </div>

        <Reveal as="div" className="don-panel">
          <div className="don-panel-text">
            <p className="don-kicker">Contribution</p>
            <h2>Soutenez les actions de l'AMPRIC</h2>
            <p>
              Pour effectuer un don, vous pouvez prendre contact avec l'association afin de connaître les
              modalités disponibles. Nous vous accompagnerons pour finaliser votre contribution en toute simplicité.
            </p>
            <div className="don-actions">
              <Link className="don-btn primary" to="/contact">Contacter l'association</Link>
              <Link className="don-btn secondary" to="/">Retour à l'accueil</Link>
            </div>
          </div>

          <div className="don-panel-info">
            <h3>Informations utiles</h3>
            <ul>
              <li>Soutien aux activités de sensibilisation</li>
              <li>Aide à l'accompagnement des patients</li>
              <li>Renforcement des actions communautaires</li>
              <li>Contribution libre selon vos possibilités</li>
            </ul>
          </div>
        </Reveal>

        <Reveal as="div" className="bank-card">
          <div className="bank-card-head">
            <p className="don-kicker">Paiement bancaire</p>
            <h2>Coordonnées bancaires</h2>
            <p>Vous pouvez aussi effectuer votre don par virement bancaire en utilisant les informations ci-dessous.</p>
          </div>

          <div className="bank-grid">
            <div className="bank-item">
              <span>Nom du compte</span>
              <strong>AMPRIC</strong>
            </div>
            <div className="bank-item">
              <span>Banque</span>
              <strong>BDM sa (Banque de Développement du Mali) </strong>
            </div>
            <div className="bank-item">
              <span>Numero de compte</span>
              <strong>026001494143</strong>
            </div>
            <div className="bank-item">
              <span>IBAN</span>
              <strong>ML13 ML016 01227 026001494143 72</strong>
            </div>
            <div className="bank-item">
              <span>Code SWIFT / BIC</span>
              <strong>BDMAMLBA</strong>
            </div>
            <div className="bank-item">
              <span>Reference</span>
              <strong>Don AMPRIC</strong>
            </div>
          </div>
        </Reveal>

        <Reveal as="div" className="mobile-money-card">
          <div className="bank-card-head">
            <p className="don-kicker">Paiement mobile</p>
            <h2>Orange Money et Wave</h2>
            <p>Vous pouvez également soutenir l'AMPRIC via les solutions de paiement mobile ci-dessous.</p>
          </div>

          <div className="mobile-money-grid">
            <div className="mobile-money-item orange-money">
              <img src="/image/orange-money-logo.svg" alt="Orange Money" className="mobile-money-logo" loading="lazy" decoding="async" />
              <span>Orange Money</span>
              <p>+223 73 24 40 61</p>
            </div>

            <div className="mobile-money-item wave-money">
              <img src="/image/wave-logo.jpg" alt="Wave" className="mobile-money-logo mobile-money-logo-round" loading="lazy" decoding="async" />
              <span>Wave</span>
              <p>+223 66 91 99 05</p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
