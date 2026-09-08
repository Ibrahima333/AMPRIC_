import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/activite.css";
import Reveal from "../components/Reveal";

export default function Activite() {
  const { hash } = useLocation();

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
