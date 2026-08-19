import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch, ensureCsrf } from "../api/client";
import "../styles/dashboard_login.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextUrl = searchParams.get("next") || "/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    ensureCsrf();
    apiFetch("/api/admin/session").then((data) => {
      if (data.authenticated) navigate(nextUrl, { replace: true });
    });
  }, [navigate, nextUrl]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const data = await apiFetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      if (data.ok) {
        navigate(nextUrl, { replace: true });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-aurora" aria-hidden="true">
        <span className="blob blob-a" />
        <span className="blob blob-b" />
        <span className="blob blob-c" />
      </div>

      {error && (
        <section className="login-alerts">
          <div className="login-alert-error">
            <p>{error}</p>
          </div>
        </section>
      )}

      <section className="login-glass">
        <div className="login-badge">
          <img src="/image/logo.jpeg" alt="AMPRIC" />
        </div>

        <p className="kicker">Espace sécurisé</p>
        <h1>Connexion</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            <span className="field-label">Nom d'utilisateur</span>
            <span className="field-control">
              <svg className="field-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" stroke="currentColor" strokeWidth="1.6" />
                <path d="M4 20c1.6-3.6 4.8-5.5 8-5.5s6.4 1.9 8 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                autoComplete="username"
              />
            </span>
          </label>

          <label>
            <span className="field-label">Mot de passe</span>
            <span className="field-control">
              <svg className="field-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="5" y="10.5" width="14" height="9.5" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M8 10.5V8a4 4 0 1 1 8 0v2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </span>
          </label>

          <button type="submit" className="login-submit-btn" disabled={submitting}>
            {submitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <a href="/" className="back-home-link">Retourner a l'accueil</a>
        <p className="login-footnote">Accès réservé à l'administration AMPRIC.</p>
      </section>
    </main>
  );
}
