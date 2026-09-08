import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch, ensureCsrf } from "../api/client";
import FlashBanner from "../components/FlashBanner";
import "../styles/dashboard.css";

const emptyForm = { nom: "", prenom: "", telephone: "", email: "", comment: "" };

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";
  const editId = searchParams.get("edit");

  const [listing, setListing] = useState(null);
  const [flash, setFlash] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [searchInput, setSearchInput] = useState(search);

  const loadUsers = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);
    if (editId) params.set("edit", editId);

    try {
      const data = await apiFetch(`/api/admin/users?${params.toString()}`);
      setListing(data);
      if (data.editing_user) {
        setForm(data.editing_user);
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
        setForm(emptyForm);
      }
    } catch {
      navigate(`/admin/login?next=/dashboard`, { replace: true });
    }
  }, [page, search, editId, navigate]);

  useEffect(() => {
    ensureCsrf();
    loadUsers();
  }, [loadUsers]);

  const closeSidebar = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("edit");
    setSearchParams(next);
  };

  const openSidebarForCreate = () => {
    setForm(emptyForm);
    setSidebarOpen(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = editId
        ? await apiFetch(`/api/admin/users/${editId}`, { method: "PUT", body: JSON.stringify(form) })
        : await apiFetch("/api/admin/users", { method: "POST", body: JSON.stringify(form) });

      setFlash({ category: data.category, message: data.message });
      if (data.ok) {
        if (editId) closeSidebar();
        else {
          setForm(emptyForm);
          setSidebarOpen(false);
        }
        loadUsers();
      }
    } catch (error) {
      setFlash({ category: "error", message: error.message });
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Supprimer cette donnee ?")) return;
    try {
      const data = await apiFetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      setFlash({ category: data.category, message: data.message });
      loadUsers();
    } catch (error) {
      setFlash({ category: "error", message: error.message });
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchParams({ search: searchInput, page: "1" });
  };

  const resetSearch = () => setSearchParams({});

  const goToPage = (targetPage) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(targetPage));
    setSearchParams(next);
  };

  const handleLogout = async () => {
    await apiFetch("/api/admin/logout", { method: "POST" });
    navigate("/admin/login");
  };

  if (!listing) return null;

  const { users, total_users: totalUsers, current_page: currentPage, total_pages: totalPages } = listing;

  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div className="tb-inner">
          <div>
            <p className="eyebrow">Administration</p>
            <h1>Tableau de bord AMPRIC</h1>
          </div>
          <div className="topbar-actions">
            <div className="user">Gestion des utilisateurs</div>
            <button className="btn btn-secondary topbar-btn" type="button" onClick={() => navigate("/")}>Accueil</button>
            <button className="btn btn-secondary topbar-btn" onClick={handleLogout}>Deconnexion</button>
          </div>
        </div>
      </header>

      <main className="page">
        <FlashBanner category={flash?.category} message={flash?.message} onDone={() => setFlash(null)} />

        <div className={`dashboard-layout ${sidebarOpen ? "with-sidebar" : ""}`}>
          <aside className={`sidebar panel ${sidebarOpen ? "is-open" : ""}`}>
            <div className="panel-head sidebar-head">
              <div>
                <p className="section-kicker">Sidebar</p>
                <h2>{editId ? "Mettre a jour une donnee" : "Ajouter une donnee"}</h2>
              </div>
              <div className="sidebar-actions">
                <button className="btn btn-secondary sidebar-close" type="button" onClick={() => { setSidebarOpen(false); closeSidebar(); }}>
                  Fermer
                </button>
                {editId && (
                  <button className="btn btn-secondary" type="button" onClick={closeSidebar}>
                    Annuler
                  </button>
                )}
              </div>
            </div>

            <form className="dashboard-form sidebar-form" onSubmit={handleFormSubmit}>
              <label>
                Nom
                <input type="text" name="nom" value={form.nom} onChange={handleFormChange} required />
              </label>

              <label>
                Prenom
                <input type="text" name="prenom" value={form.prenom} onChange={handleFormChange} required />
              </label>

              <label>
                Telephone
                <input type="text" name="telephone" value={form.telephone} onChange={handleFormChange} required />
              </label>

              <label>
                Email
                <input type="email" name="email" value={form.email} onChange={handleFormChange} required />
              </label>

              <label className="full">
                Commentaire
                <textarea name="comment" rows="4" placeholder="Ajoutez une remarque..." value={form.comment || ""} onChange={handleFormChange} />
              </label>

              <div className="form-actions full">
                <button className="btn btn-primary btn-block" type="submit">
                  {editId ? "Mettre a jour" : "Ajouter"}
                </button>
              </div>
            </form>
          </aside>

          <section className="panel main-panel">
            <div className="hero-stat">
              <span>Utilisateurs inscrits</span>
              <strong>{totalUsers}</strong>
            </div>

            <div className="panel-head">
              <div>
                <p className="section-kicker">Tableau</p>
                <h2>Liste des membres</h2>
              </div>
              <div className="main-actions">
                <div className="table-meta">{totalUsers} enregistrement{totalUsers !== 1 ? "s" : ""}</div>
                <button className="btn btn-primary" type="button" onClick={openSidebarForCreate}>Ajouter</button>
              </div>
            </div>

            <form className="search-bar" onSubmit={handleSearchSubmit}>
              <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Rechercher une donnee..." />
              <button className="btn btn-secondary" type="submit">Rechercher</button>
              {search && (
                <button className="btn btn-secondary" type="button" onClick={resetSearch}>Reinitialiser</button>
              )}
            </form>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Prenom</th>
                    <th>Telephone</th>
                    <th>Email</th>
                    <th>Commentaire</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length ? (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.nom}</td>
                        <td>{user.prenom}</td>
                        <td>{user.telephone}</td>
                        <td>{user.email}</td>
                        <td>{user.comment || "-"}</td>
                        <td>{user.date_inscription ? user.date_inscription.slice(0, 10) : "-"}</td>
                        <td>
                          <div className="row-actions">
                            <button
                              className="btn btn-secondary btn-small"
                              type="button"
                              onClick={() => {
                                const next = new URLSearchParams(searchParams);
                                next.set("edit", String(user.id));
                                setSearchParams(next);
                              }}
                            >
                              Modifier
                            </button>
                            <button className="btn btn-danger btn-small" type="button" onClick={() => handleDelete(user.id)}>
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="empty-state">Aucune donnee disponible.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <nav className="pagination" aria-label="Pagination">
              <button className="btn btn-secondary" disabled={currentPage <= 1} onClick={() => goToPage(currentPage - 1)}>
                Precedent
              </button>
              <span>Page {currentPage} sur {totalPages}</span>
              <button className="btn btn-secondary" disabled={currentPage >= totalPages} onClick={() => goToPage(currentPage + 1)}>
                Suivant
              </button>
            </nav>
          </section>
        </div>
      </main>

      <footer className="dash-footer">AMPRIC - Dashboard</footer>
    </div>
  );
}
