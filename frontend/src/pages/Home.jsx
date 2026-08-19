import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch, ensureCsrf } from "../api/client";
import FlashBanner from "../components/FlashBanner";
import Reveal from "../components/Reveal";
import StatsCounter from "../components/StatsCounter";
import Testimonials from "../components/Testimonials";

const SLIDER_IMAGES = ["/image/img1.jpeg", "/image/img4.jpg", "/image/img6.jpg"];
const PHONE_REGEX = /^[789]\d{7}$/;

const RECENT_ACTIONS = [
  {
    image: "/image/c2.jpeg",
    badge: "Rencontre",
    title: "À la rencontre des malades et des membres",
    text: "Le 14 juin 2026, l'AMPRIC a réuni malades et membres de l'association pour un temps d'échange, d'écoute et d'orientation.",
  },
  {
    image: "/image/a4.JPG",
    badge: "Sensibilisation",
    title: "Des campagnes qui font bouger les lignes",
    text: "Actions de terrain pour informer le grand public sur la polyarthrite rhumatoïde et ses impacts au quotidien.",
  },
  {
    image: "/image/a1.jpg",
    badge: "Rencontre",
    title: "Échange avec la marraine de l'association",
    text: "Un moment fort de dialogue et de partage autour des missions de l'AMPRIC.",
  },
];

function useHeroSlider(paused) {
  const layerRefs = [useRef(null), useRef(null)];
  const [activeLayer, setActiveLayer] = useState(0);
  const [dotIndex, setDotIndex] = useState(0);
  const indexRef = useRef(0);
  const activeLayerRef = useRef(0);

  useEffect(() => {
    if (layerRefs[0].current) {
      layerRefs[0].current.style.backgroundImage = `url(${SLIDER_IMAGES[0]})`;
    }
  }, []);

  useEffect(() => {
    if (paused || document.hidden) return undefined;

    const id = window.setInterval(() => {
      const nextIndex = (indexRef.current + 1) % SLIDER_IMAGES.length;
      const nextLayer = activeLayerRef.current === 0 ? 1 : 0;

      const el = layerRefs[nextLayer].current;
      if (el) el.style.backgroundImage = `url(${SLIDER_IMAGES[nextIndex]})`;

      indexRef.current = nextIndex;
      activeLayerRef.current = nextLayer;
      setActiveLayer(nextLayer);
      setDotIndex(nextIndex);
    }, 5500);

    return () => window.clearInterval(id);
  }, [paused]);

  return { layerRefs, activeLayer, dotIndex };
}

export default function Home() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [flash, setFlash] = useState(null);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fields, setFields] = useState({ nom: "", prenom: "", email: "", tel: "", message: "" });
  const { layerRefs, activeLayer, dotIndex } = useHeroSlider(popupOpen);

  useEffect(() => {
    ensureCsrf();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("popup-open", popupOpen);
    return () => document.body.classList.remove("popup-open");
  }, [popupOpen]);

  const phoneValid = PHONE_REGEX.test(fields.tel.trim());

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!phoneValid) return;

    setSubmitting(true);
    setFormError("");
    try {
      const data = await apiFetch("/api/interest", {
        method: "POST",
        body: JSON.stringify({
          nom: fields.nom,
          prenom: fields.prenom,
          email: fields.email,
          tel: fields.tel,
          comment: fields.message,
        }),
      });

      if (data.ok) {
        setPopupOpen(false);
        setFields({ nom: "", prenom: "", email: "", tel: "", message: "" });
        setFlash({ category: data.category, message: data.message });
      } else {
        setFormError(data.message);
      }
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <FlashBanner category={flash?.category} message={flash?.message} onDone={() => setFlash(null)} />

      <div className="container-fluid p-0 section1">
        <div className="section1-slider" aria-hidden="true">
          <div ref={layerRefs[0]} className={`section1-slide ${activeLayer === 0 ? "is-active" : ""}`} />
          <div ref={layerRefs[1]} className={`section1-slide ${activeLayer === 1 ? "is-active" : ""}`} />
        </div>
        <div className="section1-overlay"></div>
        <div className="section1-content">
          <div className="message">
            "Certains gestes semblent anodins.<strong>Pour moi c'est un défi quotidien.</strong>"
          </div>
          <div className="section1-bottom-actions">
            <div className="hero-buttons">
              <button className="button button-popup" onClick={() => setPopupOpen(true)}>
                Je suis concerné(e) par la maladie
              </button>
              <Link className="button button-don" to="/don">
                Faire un don
              </Link>
            </div>
            <div className="slider-indicators" aria-label="Indicateurs du slider">
              {SLIDER_IMAGES.map((_, i) => (
                <span key={i} className={`slider-dot ${i === dotIndex ? "is-active" : ""}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`overlay-popup ${popupOpen ? "active-popup" : ""}`} id="popup">
        <div className="overlay-content">
          <div className="content-popup">
            <button className="close-btn" onClick={() => setPopupOpen(false)}>x</button>

            <h3>Renseignez vos coordonnées</h3>

            <form id="form-association" onSubmit={handleSubmit}>
              {formError && <p className="erreur">{formError}</p>}
              <label>Nom </label>
              <input type="text" name="nom" value={fields.nom} onChange={handleChange} required autoComplete="off" spellCheck="false" />

              <label>Prenom </label>
              <input type="text" name="prenom" value={fields.prenom} onChange={handleChange} required autoComplete="off" spellCheck="false" />

              <label>Email</label>
              <input type="email" name="email" value={fields.email} onChange={handleChange} required autoComplete="off" spellCheck="false" />

              <label>
                Téléphone{" "}
                <span className="erreur_tel" style={{ opacity: fields.tel && !phoneValid ? 1 : 0 }}>
                  (Le numero doit contenir 7 chiffres, commençant par 7, 8 ou 9.)
                </span>
              </label>
              <input id="phone" type="number" name="tel" value={fields.tel} onChange={handleChange} autoComplete="off" spellCheck="false" />

              <label>Message</label>
              <textarea name="message" rows="2" maxLength="200" value={fields.message} onChange={handleChange} autoComplete="off" spellCheck="false" />

              <button type="submit" className="submit-btn" disabled={!phoneValid || submitting}>
                Envoyer
              </button>
            </form>
          </div>
        </div>
      </div>

      <Reveal as="div" className="container-fluid section2 p-0">
        <p className="text-center">
          Cuisiner, puiser de l'eau, attacher son pagne ou même écrire un simple message…
          pour les milliers de Maliens atteints de polyarthrite rhumatoïde et de rhumatismes inflammatoires chroniques,
          chaque geste du quotidien devient un véritable combat contre la douleur.
        </p>
        <div className="section2-band">
          <h2 className="text-center">
            Ensemble contre la douleur pour mieux vivre avec la Polyarthrite Rhumatoïde
          </h2>
          <StatsCounter />
        </div>
      </Reveal>

      <Testimonials />

      <div className="container-fluid section3" aria-labelledby="section3-title">
        <div className="container section3-inner">
          <div className="section3-grid">
            <Reveal as="article" className="paragraphe" aria-describedby="presidente-desc">
              <h3 id="section3-title">Mot de Diaminatou Camara</h3>
              <p className="role">Présidente de l'AMPRIC</p>

              <blockquote id="presidente-desc" className="president-quote">
                Sage-femme avec plus de 20 ans d'expérience, titulaire d'un master en management de santé.
                Depuis 22 ans de vie avec la polyarthrite rhumatoïde, j'ai appris à transformer la douleur en force
                et l'épreuve en engagement. Aujourd'hui, il est temps pour moi de partager cette expérience et de
                tendre la main à toutes celles et ceux qui souffrent en silence.
              </blockquote>

              <div className="paragraphe-foot">
                <figure className="logo-figure">
                  <img src="/image/logo.jpeg" alt="Logo AMPRIC" width="96" height="96" loading="lazy" decoding="async" />
                </figure>
              </div>
            </Reveal>

            <Reveal as="figure" className="section3-media" delay={120} aria-hidden="false">
              <div className="tiktok-embed-wrap">
                <iframe
                  src="https://www.tiktok.com/embed/v2/7611676038380211476"
                  title="Vidéo TikTok de Diaminatou Camara, présidente de l'AMPRIC"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <figcaption className="media-caption">Diaminatou Camara — Présidente</figcaption>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="container-fluid section4">
        <Reveal as="div" className="image_section4">
          <img src="/image/img7.jpeg" alt="Illustration sur la polyarthrite rhumatoïde" width="720" height="720" loading="lazy" decoding="async" />
        </Reveal>
        <Reveal as="div" className="section4_info" delay={120}>
          <h2>Polyarthrite rhumatoïde c'est quoi ? </h2>
          <p>
            La polyarthrite rhumatoïde est une maladie inflammatoire chronique qui touche principalement les articulations.
            C'est une maladie auto-immune : le système immunitaire, qui normalement protège le corps, se trompe et attaque
            la membrane qui entoure les articulations.
            Sans traitement, elle peut progressivement abîmer les articulations et limiter les mouvements.
            La maladie peut toucher toutes les articulations, mais elle commence souvent au niveau des mains, des poignets,
            des pieds et de façon symétrique (des deux côtés du corps).
          </p>
        </Reveal>
      </div>

      <div className="container-fluid section5">
        <Reveal as="div" className="info_section5">
          <h1>l'AMPRIC, créée par les malades, pour les malades !</h1>
          <p>
            AMPRIC est une structure dédiée à l'information, l'écoute, le
            soutien et l'orientation des personnes atteintes de
            polyarthrite et de rhumatismes inflammatoires chroniques.
            Elle est reconnue par la Loi n°04-038 du 5 août 2004
            relative aux associations et enregistrée au Secrétariat du
            Gouvernorat du District de Bamako.
          </p>
          <h1>Nos missions</h1>
        </Reveal>

        <div className="missions">
          <Reveal as="div" className="tache1">
            <p>Améliorer la qualité de vie des personnes atteintes et de leurs proches.</p>
          </Reveal>
          <Reveal as="div" className="tache2" delay={100}>
            <p>Créer un véritable dialogue entre malades et professionnels de santé.</p>
          </Reveal>
          <Reveal as="div" className="tache3" delay={200}>
            <p>Sensibiliser le grand public sur ces maladies encore trop peu connues.</p>
          </Reveal>
        </div>
      </div>

      <div className="actions-recent-section container-fluid">
        <div className="actions-recent-inner">
          <p className="actions-recent-kicker">Actualités</p>
          <h2 className="actions-recent-title">
            En direct <span>du terrain</span>
          </h2>

          <div className="actions-recent-grid">
            {RECENT_ACTIONS.map((action, i) => (
              <Reveal
                as={Link}
                to="/activite"
                className="action-recent-card"
                delay={i * 100}
                key={action.title}
              >
                <div className="action-recent-media">
                  <img src={action.image} alt="" loading="lazy" decoding="async" />
                </div>
                <div className="action-recent-body">
                  <span className="action-recent-badge">{action.badge}</span>
                  <h3>{action.title}</h3>
                  <p>{action.text}</p>
                  <span className="action-recent-link">En savoir plus</span>
                </div>
              </Reveal>
            ))}
          </div>

          <Link className="actions-recent-more" to="/activite">
            Toutes nos activités
          </Link>
        </div>
      </div>

      <div className="section6 container-fluid">
        <Reveal as="div" className="section6-inner">
          <p className="section6-kicker">Ressource utile</p>
          <h1>Découvrir le flyer de l'AMPRIC</h1>
          <p className="section6-text">
            Ce document présente l'association, ses missions, ses objectifs et les principaux messages de
            sensibilisation autour de la polyarthrite rhumatoïde et des rhumatismes inflammatoires chroniques.
          </p>
          <div className="section6-points">
            <span>Présentation de l'association</span>
            <span>Informations essentielles</span>
            <span>Support facile à partager</span>
          </div>
          <a className="btn-download" href="/image/Flyer.pdf">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
            </svg>
            Télécharger le flyer
          </a>
        </Reveal>
      </div>
    </>
  );
}
