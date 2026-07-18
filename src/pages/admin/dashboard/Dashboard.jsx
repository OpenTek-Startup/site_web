import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  faBriefcase,
  faCalendarDays,
  faNewspaper,
  faScrewdriverWrench,
  faImages,
  faQuoteLeft,
  faUserGroup,
  faEnvelope,
  faFileSignature,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getDocuments } from "../../../services/crudServices";
import {
  DATABASE_ID,
  JOBS_COLLECTION_ID,
  EVENTS_COLLECTION_ID,
  BLOG_COLLECTION_ID,
  SERVICES_COLLECTION_ID,
  PROJECTS_COLLECTION_ID,
  TESTIMONIALS_COLLECTION_ID,
  TEAM_COLLECTION_ID,
  CONTACT_MESSAGES_COLLECTION_ID,
  APPLICATIONS_COLLECTION_ID,
} from "../../../config/appwrite";
import "./dashboard.css";

const CARDS = [
  {
    key: "contact",
    label: "Messages de contact",
    icon: faEnvelope,
    link: "/admin/contact-messages",
    collectionId: CONTACT_MESSAGES_COLLECTION_ID,
  },
  {
    key: "applications",
    label: "Candidatures",
    icon: faFileSignature,
    link: "/admin/applications",
    collectionId: APPLICATIONS_COLLECTION_ID,
  },
  {
    key: "blog",
    label: "Articles de blog",
    icon: faNewspaper,
    link: "/admin/blog",
    collectionId: BLOG_COLLECTION_ID,
  },
  {
    key: "services",
    label: "Services",
    icon: faScrewdriverWrench,
    link: "/admin/services",
    collectionId: SERVICES_COLLECTION_ID,
  },
  {
    key: "portfolio",
    label: "Projets (portfolio)",
    icon: faImages,
    link: "/admin/portfolio",
    collectionId: PROJECTS_COLLECTION_ID,
  },
  {
    key: "testimonials",
    label: "Temoignages",
    icon: faQuoteLeft,
    link: "/admin/testimonials",
    collectionId: TESTIMONIALS_COLLECTION_ID,
  },
  {
    key: "team",
    label: "Membres de l'equipe",
    icon: faUserGroup,
    link: "/admin/team",
    collectionId: TEAM_COLLECTION_ID,
  },
  {
    key: "jobs",
    label: "Offres d'emploi",
    icon: faBriefcase,
    link: "/admin/jobs",
    collectionId: JOBS_COLLECTION_ID,
  },
  {
    key: "events",
    label: "Evenements",
    icon: faCalendarDays,
    link: "/admin/events",
    collectionId: EVENTS_COLLECTION_ID,
  },
];

export function Dashboard() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadCounts = async () => {
      const nextCounts = {};
      const nextErrors = {};

      await Promise.all(
        CARDS.map(async (card) => {
          try {
            const docs = await getDocuments(DATABASE_ID, card.collectionId);
            nextCounts[card.key] = docs.length;
          } catch {
            // La collection blog_posts n'existe peut-etre pas encore dans Appwrite
            nextErrors[card.key] = true;
            nextCounts[card.key] = null;
          }
        })
      );

      setCounts(nextCounts);
      setErrors(nextErrors);
      setLoading(false);
    };

    loadCounts();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Tableau de bord</h1>
      <p className="admin-dashboard__subtitle">
        Vue d&apos;ensemble du contenu du site OpenTek
      </p>

      <div className="admin-dashboard__grid">
        {CARDS.map((card) => (
          <Link to={card.link} key={card.key} className="admin-dashboard__card">
            <div className="admin-dashboard__icon">
              <FontAwesomeIcon icon={card.icon} />
            </div>
            <div>
              <div className="admin-dashboard__value">
                {loading
                  ? "..."
                  : errors[card.key]
                  ? "N/A"
                  : counts[card.key]}
              </div>
              <div className="admin-dashboard__label">{card.label}</div>
              {errors[card.key] && (
                <div className="admin-dashboard__hint">
                  Collection a creer dans Appwrite
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
