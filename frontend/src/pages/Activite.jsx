import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/activite.css";
import Reveal from "../components/Reveal";

const LAUNCH_PHOTOS = [
  ["0949", "Participants réunis pour le lancement officiel de l’AMPRIC"],
  ["0945", "Temps fort de la journée de sensibilisation de l’AMPRIC"],
  ["0951", "Échanges lors du lancement de l’AMPRIC à Bamako"],
  ["0952", "Mobilisation des participants pour les maladies rhumatismales"],
  ["0958", "Rencontre autour de l’information et de l’accompagnement des patients"],
  ["0978", "Temps d’échange pendant le lancement officiel de l’AMPRIC"],
  ["0987", "Activité de sensibilisation organisée par l’AMPRIC"],
  ["0991", "Participants à la journée mondiale de l’arthrite"],
  ["ortm", "L’équipe de l’ORTM présente lors du lancement de l’AMPRIC"],
];

export default function Activite() {
  const { hash } = useLocation();
  const [photoIndex, setPhotoIndex] = useState(0);

  const showPhoto = (index) => {
    setPhotoIndex((index + LAUNCH_PHOTOS.length) % LAUNCH_PHOTOS.length);
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const timer = window.setInterval(() => {
      setPhotoIndex((index) => (index + 1) % LAUNCH_PHOTOS.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!hash) return undefined;

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [hash]);

  return (
    <>
      <section className="activity-hero container-fluid">
        <div className="activity-hero-inner">
          <h1>Nos activités</h1>
          <p>
            L'AMPRIC mène des actions concrètes pour informer, soutenir et rapprocher les personnes atteintes
            de polyarthrite rhumatoïde et de rhumatismes inflammatoires chroniques.
          </p>
        </div>
      </section>

      <section className="launch-photo-banner" aria-label="Photos du lancement officiel de l’AMPRIC">
        <div className="launch-photo-frame">
          {LAUNCH_PHOTOS.map(([image, description], index) => (
            <img
              key={image}
              className={`launch-photo-slide${index === photoIndex ? " is-active" : ""}`}
              src={image === "ortm" ? "/image/ortm.jpg" : `/image/lancement-ampric-${image}.jpg`}
              alt={description}
              aria-hidden={index !== photoIndex}
              fetchPriority={index === 0 ? "high" : "auto"}
            />
          ))}
          <div className="launch-photo-shade" />
          <div className="launch-photo-caption" aria-live="polite">
            <span>Retour en images</span>
            <p>{LAUNCH_PHOTOS[photoIndex][1]}</p>
          </div>
          <button className="launch-photo-control previous" type="button" onClick={() => showPhoto(photoIndex - 1)} aria-label="Photo précédente">
            ‹
          </button>
          <button className="launch-photo-control next" type="button" onClick={() => showPhoto(photoIndex + 1)} aria-label="Photo suivante">
            ›
          </button>
          <div className="launch-photo-count" aria-label={`Photo ${photoIndex + 1} sur ${LAUNCH_PHOTOS.length}`}>
            {String(photoIndex + 1).padStart(2, "0")} <span>/ {String(LAUNCH_PHOTOS.length).padStart(2, "0")}</span>
          </div>
        </div>
      </section>

      <article className="launch-article container" id="lancement-ampric">
        <div className="launch-article-layout">
          <figure className="launch-article-portrait">
            <div className="launch-article-photo-frame">
              <img
                src="/image/aissata-keita.jpg"
                alt="Aïssata Keita, maîtresse de cérémonie du lancement de l’AMPRIC"
                width="1800"
                height="1789"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption>
              <strong>Aïssata Keita</strong>
              <span>Maîtresse de cérémonie et secrétaire générale de l’AMPRIC</span>
            </figcaption>
          </figure>

          <div className="launch-article-heading">
            <p className="activity-kicker">12 octobre 2026 · Journée mondiale de l’arthrite</p>
            <h2>Lancement officiel de l’AMPRIC</h2>
            <p className="launch-theme">« Maladie rhumatismale : comprendre pour mieux vivre et réaliser ses rêves »</p>
            <p>
              À l’Université Scientifique Libre de Bamako, l’AMPRIC a officiellement lancé ses activités autour
              d’une journée d’information et de sensibilisation. Communications scientifiques, échanges avec les
              professionnels de santé, témoignages et sketch ont permis de mieux faire connaître les maladies
              rhumatismales inflammatoires chroniques et leurs effets sur la vie quotidienne.
            </p>
            <p>
              Patients, familles, soignants, partenaires et médias se sont réunis pour encourager le diagnostic
              précoce, l’écoute et la solidarité, et pour donner la parole aux personnes concernées. La journée,
              relayée notamment au journal télévisé de 20 heures de l’ORTM, a posé une première pierre pour faire
              connaître l’association et soutenir durablement les patients au Mali.
            </p>
            <p>
              L’AMPRIC entend poursuivre cette mobilisation par des actions régulières d’information,
              d’accompagnement et d’orientation. Son message : la maladie ne doit pas effacer les projets ni
              l’espoir de réaliser ses rêves.
            </p>
          </div>
        </div>
      </article>

      <section className="activity-highlight container">
        <Reveal as="div" className="highlight-media">
          <img src="/image/a4.JPG" alt="Activités de sensibilisation de l'AMPRIC" width="720" height="520" loading="lazy" decoding="async" />
        </Reveal>
        <Reveal as="div" id="actions-terrain" className="highlight-text" delay={120}>
          <p className="activity-kicker">Actions sur le terrain</p>
          <h2>Des initiatives proches des besoins réels</h2>
          <p>
            À travers ses activités, l'AMPRIC cherche à renforcer l'information, à rompre l'isolement et à
            favoriser une meilleure orientation des patients. Chaque action vise à améliorer la qualité de vie,
            encourager le dialogue et développer une communauté plus solidaire.
          </p>
        </Reveal>

        <Reveal as="div" className="highlight-media">
          <img src="/image/a1.jpg" alt="Activités de sensibilisation de l'AMPRIC" width="720" height="520" loading="lazy" decoding="async" />
        </Reveal>
        <Reveal as="div" id="rencontre-marraine" className="highlight-text" delay={120}>
          <p className="activity-kicker">Rencontre institutionnelle</p>
          <h2>Échange avec la marraine de l'association</h2>
          <p>
            Cette rencontre avec la marraine de l'association a été un moment fort de dialogue, d'écoute et
            de partage autour des missions de l'AMPRIC. Elle illustre la volonté de l'association de renforcer
            ses liens avec ses soutiens, de porter la voix des malades et de donner plus de visibilité à ses actions.
          </p>
        </Reveal>

        <Reveal as="div" className="highlight-media">
          <img src="/image/c1.jpg" alt="Rencontre entre les malades et les membres de l'AMPRIC" width="720" height="520" loading="lazy" decoding="async" />
        </Reveal>
        <Reveal as="div" id="rencontre-malades" className="highlight-text" delay={120}>
          <p className="activity-kicker">Rencontre du 14 juin 2026</p>
          <h2>À la rencontre des malades et des membres</h2>
          <p>
            Le 14 juin 2026, l'AMPRIC a réuni malades et membres de l'association autour d'un temps d'échange
            et de partage. Ces rencontres permettent de rompre l'isolement, de recueillir les besoins réels des
            personnes concernées et de renforcer les liens au sein de la communauté.
          </p>
        </Reveal>

        <Reveal as="div" className="highlight-media">
          <img src="/image/c2.jpeg" alt="Membres de l'AMPRIC lors de la rencontre avec les malades" width="720" height="520" loading="lazy" decoding="async" />
        </Reveal>
        <Reveal as="div" className="highlight-text" delay={120}>
          <p className="activity-kicker">Accueil et orientation</p>
          <h2>Un accueil au plus près des besoins</h2>
          <p>
            Lors de cette même journée, les membres de l'association ont assuré l'accueil, l'enregistrement et
            l'orientation des participants. Un travail de terrain essentiel pour informer, écouter et diriger
            chacun vers les ressources adaptées à sa situation.
          </p>
        </Reveal>
      </section>
    </>
  );
}
