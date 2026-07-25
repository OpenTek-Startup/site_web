import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getDocuments, resolveImageUrl } from "../../../services/crudServices";
import { DATABASE_ID, EVENTS_COLLECTION_ID } from "../../../config/appwrite";
import { Seo } from "../../../components/seo/Seo";
import "./eventsPublic.css";

function formatEventDate(date, lang) {
  return new Date(date).toLocaleDateString(lang === "en" ? "en-US" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EventsPublicPage() {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const docs = await getDocuments(DATABASE_ID, EVENTS_COLLECTION_ID);
        const sorted = [...docs].sort((a, b) => {
          if (!a.date || !b.date) return 0;
          return new Date(a.date) - new Date(b.date);
        });
        setEvents(sorted);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="events-public container">
      <Seo
        title={t("eventsPage.title")}
        description="Retrouvez OpenTek lors de nos prochains evenements : conferences, ateliers et rencontres."
        path="/events"
      />
      <div className="ot-section-header">
        <span className="ot-eyebrow">{t("eventsPage.eyebrow")}</span>
        <h1 className="ot-section-title">{t("eventsPage.title")}</h1>
        <p className="ot-section-subtitle">{t("eventsPage.subtitle")}</p>
      </div>

      {loading && <p className="events-public__status">{t("eventsPage.loading")}</p>}

      {!loading && events.length === 0 && (
        <p className="events-public__status">{t("eventsPage.empty")}</p>
      )}

      <div className="ot-grid">
        {events.map((event) => {
          const imageUrl = event.image
            ? event.image.startsWith("http")
              ? event.image
              : resolveImageUrl(event.image)
            : null;
          return (
            <div className="ot-card ot-card--hoverable" key={event.$id}>
              <div className="ot-image-frame ot-image-frame--16-10">
                {imageUrl ? (
                  <img src={imageUrl} alt={event.title} loading="lazy" />
                ) : (
                  <div className="ot-image-frame--placeholder">OpenTek</div>
                )}
              </div>
              <div className="ot-card__body">
                {event.date && (
                  <div className="events-public__date">{formatEventDate(event.date, i18n.language)}</div>
                )}
                <h3 className="events-public__title">{event.title}</h3>
                <p className="ot-clamp-3 events-public__description">{event.description}</p>
                {event.description && event.description.length > 140 && (
                  <button className="ot-link-btn" onClick={() => setSelected(event)}>
                    {t("common.seeMore")} <span className="ot-link-btn__arrow">&rarr;</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="ot-modal-overlay" onClick={() => setSelected(null)}>
          <div className="ot-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ot-modal__close" onClick={() => setSelected(null)}>&times;</button>
            {selected.date && (
              <div className="events-public__date">{formatEventDate(selected.date, i18n.language)}</div>
            )}
            <h3 style={{ marginTop: 6, color: 'var(--text-heading)' }}>{selected.title}</h3>
            <p style={{ color: 'var(--text-body)', lineHeight: 1.7 }}>{selected.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
