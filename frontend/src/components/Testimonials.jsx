import { useEffect, useState } from "react";

const TESTIMONIALS = [
  {
    quote: "Grâce à l'AMPRIC, je me suis sentie écoutée pour la première fois depuis mon diagnostic.",
    author: "Membre de l'association",
    role: "Vit avec la polyarthrite depuis 6 ans",
  },
  {
    quote:
      "La mère, tu m'as sauvé, ça fait 6 mois je pensais que c'était le nerf, dès que j'ai vu l'une de tes vidéos j'ai fui pour aller voir le rhumatologue, j'ai fait les diagnostics et commencé les traitements 🥰🥰🥰",
    author: "Abonnée",
    role: "Commentaire laissé sous une vidéo TikTok"
  },
  {
    quote: "L'équipe m'a orientée vers les bons professionnels de santé, ça a changé mon quotidien.",
    author: "Proche aidant",
    role: "Accompagne un membre de sa famille",
  },
];

function TikTokIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className}>
      <path
        fill="currentColor"
        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.12v13.17a2.8 2.8 0 1 1-2.8-2.8c.31 0 .61.05.9.15V9.36a5.93 5.93 0 0 0-.9-.07A5.92 5.92 0 1 0 15.82 15V8.33a7.9 7.9 0 0 0 4.62 1.49V6.69h-.85z"
      />
    </svg>
  );
}

function ProfileIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className}>
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path fill="currentColor" d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [paused]);

  const current = TESTIMONIALS[index];

  return (
    <div
      className="testimonials-section container-fluid"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="testimonials-inner">
        <p className="testimonials-kicker">Témoignages</p>

        <blockquote key={index} className="testimonial-quote">
          "{current.quote}"
        </blockquote>

        <div className="testimonial-profile">
          <span className="testimonial-avatar">
            <ProfileIcon className="testimonial-avatar-icon" />
            {current.source === "tiktok" && (
              <span className="testimonial-avatar-badge" aria-label="Avis TikTok">
                <TikTokIcon />
              </span>
            )}
          </span>
          <p className="testimonial-author">
            {current.author} <span>— {current.role}</span>
          </p>
        </div>

        <div className="testimonial-dots">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`testimonial-dot ${i === index ? "is-active" : ""}`}
              aria-label={`Voir le témoignage ${i + 1}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>

        <p className="testimonials-note">
        </p>
      </div>
    </div>
  );
}
