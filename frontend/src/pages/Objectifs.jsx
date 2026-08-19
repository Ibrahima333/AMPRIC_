import "../styles/objectif.css";
import Reveal from "../components/Reveal";

export default function Objectifs() {
  return (
    <>
      <div className="container-fluid goal_description">
        <h1>Les objectifs de l'AMPRIC</h1>
        <p>
          L'AMPRIC a pour mission principale d'améliorer la qualité de vie des personnes atteintes de polyarthrite rhumatoïde
          et de rhumatismes inflammatoires chroniques, ainsi que celle de leur entourage.
          Pour cela, l'association s'articule autour de deux objectifs fondamentaux :
        </p>
      </div>
      <div className="container-fluid">
        <Reveal as="div" className="goal1">
          <div className="img-goal1">
            <img src="/image/informer.jpg" alt="Illustration informer et sensibiliser" width="420" height="280" loading="eager" fetchPriority="high" decoding="async" />
          </div>
          <div className="text">
            <h2>Objectif 1 : Informer et sensibiliser</h2>
            <p>
              Mettre à disposition des personnes concernées et de leurs proches une information fiable, claire et
              accessible sur la polyarthrite rhumatoïde, ses symptômes, ses conséquences, les traitements
              existants et les bonnes pratiques pour mieux vivre avec la maladie.
            </p>
          </div>
        </Reveal>
        <Reveal as="div" className="goal1">
          <div className="text">
            <h2>Objectif 2 : Écouter, soutenir et orienter</h2>
            <p>
              Offrir un espace d'écoute et de soutien moral aux personnes atteintes, les accompagner dans leurs démarches et les orienter vers les structures, professionnels de santé et ressources adaptées à leurs besoins.
              L'AMPRIC vise à créer une communauté solidaire où les malades peuvent partager leurs expériences, trouver du réconfort et bénéficier d'un soutien psychologique face aux défis de la maladie.
            </p>
          </div>
          <div className="img-goal1">
            <img src="/image/sensibiliser.jpg" alt="Illustration écouter soutenir et orienter" width="420" height="280" loading="lazy" decoding="async" />
          </div>
        </Reveal>
      </div>
    </>
  );
}
