import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getDocuments, resolveImageUrl } from "../../../services/crudServices";
import { DATABASE_ID, EVENTS_COLLECTION_ID } from "../../../config/appwrite";
import { Seo } from "../../../components/seo/Seo";
import "./eventsPublic.css";

export default function EventsPublicPage() {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const docs = await getDocuments(DATABASE_ID, EVENTS_COLLECTION_ID);
        // Tri du plus recent au plus ancien si une date est renseignee
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
      <div className="events-public__header">
        <h1>{t("eventsPage.title")}</h1>
        <p>{t("eventsPage.subtitle")}</p>
      </div>

      {loading && <p>{t("eventsPage.loading")}</p>}

      {!loading && events.length === 0 && (
        <p className="events-public__empty">{t("eventsPage.empty")}</p>
      )}

      <div className="events-public__grid">
        {events.map((event) => {
          const imageUrl = event.image
            ? event.image.startsWith("http")
              ? event.image
              : resolveImageUrl(event.image)
            : null;
          return (
            <div className="events-public__card" key={event.$id}>
              {imageUrl && (
                <div className="events-public__image-wrapper">
                  <img src={imageUrl} alt={event.title} />
                </div>
              )}
              <div className="events-public__content">
                {event.date && (
                  <div className="events-public__date">
                    {new Date(event.date).toLocaleDateString(i18n.language === "en" ? "en-US" : "fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                )}
                <h3>{event.title}</h3>
                <p>{event.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
