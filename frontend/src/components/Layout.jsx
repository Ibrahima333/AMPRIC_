import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const scrolledRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled === scrolledRef.current) return;
      scrolledRef.current = isScrolled;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navClass = `navbar navbar-expand-lg navbar-light position-fixed fixed-top ${
    scrolled ? "nav-lg" : "nav-sn"
  }`;
  const logoClass = `logo ${scrolled ? "logo-lg" : "logo-sn"}`;

  const closeMobileMenu = () => {
    if (!window.matchMedia("(max-width: 900px)").matches) return;

    const menu = document.getElementById("navbarNav");
    if (!menu?.classList.contains("show")) return;

    const Collapse = window.bootstrap?.Collapse;
    if (Collapse) {
      Collapse.getOrCreateInstance(menu).hide();
      return;
    }

    menu.classList.remove("show");
    document.querySelector(".navbar-toggler")?.setAttribute("aria-expanded", "false");
  };

  return (
    <>
      <nav className={navClass}>
        <div className="container-fluid mw-100 mh-100 b-nav">
          <NavLink className="navbar-brand d-block mw-100 mh-100 m-0" to="/">
            <img
              src="/image/logo.jpeg"
              className={logoClass}
              alt="Logo AMPRIC"
              width="96"
              height="96"
              fetchPriority="high"
            />
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end mw-100" id="navbarNav">
            <ul className="navbar-nav elements w-50 justify-content-evenly" onClick={closeMobileMenu}>
              <li className="nav-item">
                <NavLink className="nav-link" to="/">Accueil</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/objectifs">Nos objectifs</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/activite">Activité</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/don">Faire un don</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/contact">Contact</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Outlet />

      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-col footer-brand" aria-label="À propos AMPRIC">
            <img
              src="/image/logo.jpeg"
              alt="Logo AMPRIC"
              className="footer-logo"
              width="96"
              height="96"
              loading="lazy"
              decoding="async"
            />
            <p className="footer-tag">
              AMPRIC — Association Malienne des Polyarthritiques et des Rhumatismes Inflammatoires Chroniques
            </p>
            <p className="footer-copy">© 2025 — Tous droits réservés</p>
          </div>

          <div className="footer-col footer-links" aria-label="Liens rapides">
            <nav>
              <a href="#section5">Missions</a>
              <a href="#resources">Ressources</a>
            </nav>
          </div>

          <div className="footer-col footer-contact" aria-label="Contact et réseaux">
            <p className="contact-mail">contactampric@gmail.com </p>
            <div className="social-links" role="list">
              <a role="listitem" href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook" className="social">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.3c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12H20l-1.5 3.9h-.5v7A10 10 0 0 0 22 12z" /></svg>
              </a>
              <a role="listitem" href="https://www.linkedin.com/company/association-malienne-des-polyathritiques-et-des-rhumatismes-inflammatoires-chroniques/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="social">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 .02 0zM3 8.98h4v12H3v-12zM9 8.98h3.8v1.6h.1c.5-.9 1.8-1.8 3.6-1.8 3.8 0 4.5 2.5 4.5 5.7v6.5H19v-5.7c0-1.4 0-3.2-2-3.2-2 0-2.4 1.6-2.4 3v5.9H9v-12z" /></svg>
              </a>
              <a role="listitem" href="https://www.tiktok.com/@ampric1?_r=1&_t=ZM-91hMuNLJECJ" target="_blank" rel="noreferrer" aria-label="TikTok" className="social">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.12v13.17a2.8 2.8 0 1 1-2.8-2.8c.31 0 .61.05.9.15V9.36a5.93 5.93 0 0 0-.9-.07A5.92 5.92 0 1 0 15.82 15V8.33a7.9 7.9 0 0 0 4.62 1.49V6.69h-.85z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
