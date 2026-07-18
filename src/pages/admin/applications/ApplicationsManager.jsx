import { useEffect, useState } from "react";
import { getDocuments, updateDocument, deleteDocument, getFileUrl } from "../../../services/crudServices";
import { DATABASE_ID, APPLICATIONS_COLLECTION_ID } from "../../../config/appwrite";
import "../contact/contactMessages.css";
import "./applications.css";

const STATUS_OPTIONS = ["Nouvelle", "Vue", "Retenue", "Rejetee"];

export function ApplicationsManager() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const docs = await getDocuments(DATABASE_ID, APPLICATIONS_COLLECTION_ID);
      docs.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
      setApplications(docs);
      setLoadError(false);
    } catch (error) {
      console.error("Impossible de charger les candidatures:", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const openApplication = async (application) => {
    setSelected(application);
    if (application.status === "Nouvelle") {
      try {
        await updateDocument(DATABASE_ID, APPLICATIONS_COLLECTION_ID, application.$id, { status: "Vue" }, []);
        setApplications((prev) =>
          prev.map((a) => (a.$id === application.$id ? { ...a, status: "Vue" } : a))
        );
      } catch (error) {
        console.error("Erreur lors de la mise a jour du statut:", error);
      }
    }
  };

  const handleStatusChange = async (application, status) => {
    try {
      await updateDocument(DATABASE_ID, APPLICATIONS_COLLECTION_ID, application.$id, { status }, []);
      setApplications((prev) =>
        prev.map((a) => (a.$id === application.$id ? { ...a, status } : a))
      );
      setSelected((prev) => (prev ? { ...prev, status } : prev));
    } catch (error) {
      console.error("Erreur lors de la mise a jour du statut:", error);
      alert("Une erreur est survenue lors de la mise a jour du statut.");
    }
  };

  const handleDelete = async (applicationId) => {
    if (!window.confirm("Supprimer definitivement cette candidature ?")) return;
    try {
      await deleteDocument(DATABASE_ID, APPLICATIONS_COLLECTION_ID, applicationId);
      setSelected(null);
      fetchApplications();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Une erreur est survenue lors de la suppression.");
    }
  };

  const newCount = applications.filter((a) => a.status === "Nouvelle").length;

  return (
    <div className="contact-messages">
      <div className="contact-messages__header">
        <div>
          <h1>Candidatures</h1>
          <p className="contact-messages__subtitle">
            {newCount > 0 ? `${newCount} nouvelle(s) candidature(s)` : "Aucune nouvelle candidature"}
          </p>
        </div>
      </div>

      {loadError && (
        <div className="contact-messages__notice">
          La collection <code>job_applications</code> n&apos;existe pas
          encore dans Appwrite. Voir <code>APPWRITE_SCHEMA.md</code> pour la
          creer.
        </div>
      )}

      {loading ? (
        <p>Chargement...</p>
      ) : applications.length === 0 ? (
        <p>Aucune candidature recue pour le moment.</p>
      ) : (
        <div className="contact-messages__list">
          {applications.map((application) => (
            <button
              key={application.$id}
              className={`contact-messages__item ${application.status === "Nouvelle" ? "contact-messages__item--unread" : ""}`}
              onClick={() => openApplication(application)}
            >
              <div className="contact-messages__item-main">
                <span className="contact-messages__item-name">
                  {application.applicantName} - {application.jobTitle}
                </span>
                <span className="contact-messages__item-preview">{application.email}</span>
              </div>
              <span className={`applications__status applications__status--${application.status}`}>
                {application.status}
              </span>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setSelected(null)}>
              X
            </button>
            <h3>{selected.applicantName}</h3>
            <p><strong>Poste :</strong> {selected.jobTitle}</p>
            <p><strong>Email :</strong> <a href={`mailto:${selected.email}`}>{selected.email}</a></p>
            {selected.phone && <p><strong>Telephone :</strong> {selected.phone}</p>}
            {selected.coverLetter && (
              <p style={{ whiteSpace: "pre-wrap" }}><strong>Motivation :</strong> {selected.coverLetter}</p>
            )}
            {selected.cvFile && (
              <p>
                <a href={getFileUrl(selected.cvFile)} target="_blank" rel="noopener noreferrer">
                  Telecharger le CV
                </a>
              </p>
            )}

            <div className="applications__status-select">
              <label>Statut :</label>
              <select
                value={selected.status}
                onChange={(e) => handleStatusChange(selected, e.target.value)}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <button className="btn delete-btn" onClick={() => handleDelete(selected.$id)}>
              Supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
