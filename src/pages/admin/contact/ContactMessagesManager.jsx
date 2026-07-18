import { useEffect, useState } from "react";
import { getDocuments, updateDocument, deleteDocument } from "../../../services/crudServices";
import { DATABASE_ID, CONTACT_MESSAGES_COLLECTION_ID } from "../../../config/appwrite";
import "./contactMessages.css";

export function ContactMessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const docs = await getDocuments(DATABASE_ID, CONTACT_MESSAGES_COLLECTION_ID);
      // Plus recent en premier
      docs.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
      setMessages(docs);
      setLoadError(false);
    } catch (error) {
      console.error("Impossible de charger les messages:", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const openMessage = async (message) => {
    setSelected(message);
    if (!message.read) {
      try {
        await updateDocument(DATABASE_ID, CONTACT_MESSAGES_COLLECTION_ID, message.$id, { read: true }, []);
        setMessages((prev) =>
          prev.map((m) => (m.$id === message.$id ? { ...m, read: true } : m))
        );
      } catch (error) {
        console.error("Erreur lors du marquage comme lu:", error);
      }
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm("Supprimer definitivement ce message ?")) return;
    try {
      await deleteDocument(DATABASE_ID, CONTACT_MESSAGES_COLLECTION_ID, messageId);
      setSelected(null);
      fetchMessages();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Une erreur est survenue lors de la suppression.");
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="contact-messages">
      <div className="contact-messages__header">
        <div>
          <h1>Messages de contact</h1>
          <p className="contact-messages__subtitle">
            {unreadCount > 0
              ? `${unreadCount} message(s) non lu(s)`
              : "Tous les messages ont ete lus"}
          </p>
        </div>
      </div>

      {loadError && (
        <div className="contact-messages__notice">
          La collection <code>contact_messages</code> n&apos;existe pas
          encore dans Appwrite. Voir <code>APPWRITE_SCHEMA.md</code> pour la
          creer.
        </div>
      )}

      {loading ? (
        <p>Chargement...</p>
      ) : messages.length === 0 ? (
        <p>Aucun message recu pour le moment.</p>
      ) : (
        <div className="contact-messages__list">
          {messages.map((message) => (
            <button
              key={message.$id}
              className={`contact-messages__item ${message.read ? "" : "contact-messages__item--unread"}`}
              onClick={() => openMessage(message)}
            >
              <div className="contact-messages__item-main">
                <span className="contact-messages__item-name">{message.name}</span>
                <span className="contact-messages__item-preview">{message.message}</span>
              </div>
              <span className="contact-messages__item-date">
                {new Date(message.$createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
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
            <h3>{selected.name}</h3>
            <p><strong>Email :</strong> <a href={`mailto:${selected.email}`}>{selected.email}</a></p>
            {selected.subject && <p><strong>Sujet :</strong> {selected.subject}</p>}
            <p style={{ whiteSpace: "pre-wrap" }}>{selected.message}</p>
            <button className="btn delete-btn" onClick={() => handleDelete(selected.$id)}>
              Supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
