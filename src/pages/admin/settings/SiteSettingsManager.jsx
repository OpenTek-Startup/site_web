import { useEffect, useState } from "react";
import { getDocuments, createDocument, updateDocument } from "../../../services/crudServices";
import { FormComponent } from "../../../components/FormComponent/formComponent";
import { DATABASE_ID, SETTINGS_COLLECTION_ID } from "../../../config/appwrite";
import "./siteSettings.css";

const fields = [
  { label: "Email de contact", name: "contactEmail", type: "text", placeholder: "opentek.startup@gmail.com" },
  { label: "Telephone de contact", name: "contactPhone", type: "text", placeholder: "+237 6 57 26 85 49" },
  { label: "Adresse", name: "address", type: "text", placeholder: "Ville, Cameroun" },
  { label: "Lien Facebook", name: "facebookUrl", type: "text", placeholder: "https://facebook.com/..." },
  { label: "Lien LinkedIn", name: "linkedinUrl", type: "text", placeholder: "https://linkedin.com/company/..." },
  { label: "Lien Twitter / X", name: "twitterUrl", type: "text", placeholder: "https://x.com/..." },
  { label: "Lien Github", name: "githubUrl", type: "text", placeholder: "https://github.com/..." },
];

export function SiteSettingsManager() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const docs = await getDocuments(DATABASE_ID, SETTINGS_COLLECTION_ID);
      setSettings(docs[0] || null);
      setLoadError(false);
    } catch (error) {
      console.error("Impossible de charger les parametres du site:", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (data) => {
    setSaving(true);
    setSaved(false);
    try {
      if (settings) {
        await updateDocument(DATABASE_ID, SETTINGS_COLLECTION_ID, settings.$id, data, []);
      } else {
        await createDocument(DATABASE_ID, SETTINGS_COLLECTION_ID, data);
      }
      setSaved(true);
      fetchSettings();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des parametres:", error);
      alert("Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="site-settings">
      <h1>Parametres du site</h1>
      <p className="site-settings__subtitle">
        Coordonnees et reseaux sociaux affiches dans le pied de page du site
      </p>

      {loadError && (
        <div className="site-settings__notice">
          La collection <code>site_settings</code> n&apos;existe pas encore
          dans Appwrite. Voir <code>APPWRITE_SCHEMA.md</code> pour la creer.
          En attendant, le site public continue d&apos;afficher les
          coordonnees par defaut.
        </div>
      )}

      {saved && (
        <div className="site-settings__saved">Parametres enregistres avec succes.</div>
      )}

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <FormComponent
          fields={fields}
          onSubmit={handleSave}
          submitLabel={saving ? "Enregistrement..." : "Enregistrer"}
          initialData={settings || {}}
        />
      )}
    </div>
  );
}
