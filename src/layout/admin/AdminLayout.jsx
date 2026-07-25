import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  faGauge,
  faBriefcase,
  faCalendarDays,
  faNewspaper,
  faRightFromBracket,
  faBars,
  faScrewdriverWrench,
  faImages,
  faQuoteLeft,
  faUserGroup,
  faFileLines,
  faEnvelope,
  faFileSignature,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../context/AuthContext";
import "./adminLayout.css";

const NAV_ITEMS = [
  { to: "/admin", label: "Tableau de bord", icon: faGauge, end: true },
  { to: "/admin/blog", label: "Blog", icon: faNewspaper },
  { to: "/admin/services", label: "Services", icon: faScrewdriverWrench },
  { to: "/admin/portfolio", label: "Portfolio", icon: faImages },
  { to: "/admin/testimonials", label: "Temoignages", icon: faQuoteLeft },
  { to: "/admin/team", label: "Equipe", icon: faUserGroup },
  { to: "/admin/page-content", label: "Contenu des pages", icon: faFileLines },
  { to: "/admin/jobs", label: "Offres d'emploi", icon: faBriefcase },
  { to: "/admin/applications", label: "Candidatures", icon: faFileSignature },
  { to: "/admin/events", label: "Evenements", icon: faCalendarDays },
  { to: "/admin/contact-messages", label: "Messages de contact", icon: faEnvelope },
  { to: "/admin/settings", label: "Parametres du site", icon: faGear },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${menuOpen ? "admin-sidebar--open" : ""}`}>
        <div className="admin-sidebar__brand">
          <img src="/opentek-logo_no_bg.png" alt="OpenTek" />
          <span>OpenTek Admin</span>
        </div>
        <nav className="admin-sidebar__nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-sidebar__link ${isActive ? "admin-sidebar__link--active" : ""}`
              }
              onClick={() => setMenuOpen(false)}
            >
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="admin-sidebar__logout" onClick={handleLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} />
          <span>Deconnexion</span>
        </button>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-topbar__burger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Ouvrir le menu"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className="admin-topbar__user">
            {user?.name || user?.email || "Administrateur"}
          </div>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
