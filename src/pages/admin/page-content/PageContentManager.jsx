import { useEffect, useState } from "react";
import {
  createDocument,
  getDocuments,
  updateDocument,
} from "../../../services/crudServices";
import { uploadImageToCloudinary } from "../../../services/cloudinaryService";
import { FormComponent } from "../../../components/FormComponent/formComponent";
import { DATABASE_ID, PAGE_CONTENT_COLLECTION_ID } from "../../../config/appwrite";
import "./pageContent.css";

// Registre des blocs de texte modifiables. Chaque bloc correspond a un
// texte actuellement code en dur dans une page publique - voir le
// commentaire "source" pour savoir ou il est utilise aujourd'hui.
// Chaque bloc est bilingue : title_fr/title_en, body_fr/body_en.
const BLOCKS = [
  {
    key: "home_hero",
    label: "Accueil - Titre principal (Hero)",
    source: "src/pages/public/home/components/hero_section/hero.jsx",
    fields: [
      { label: "Titre (Francais)", name: "title_fr", type: "text" },
      { label: "Titre (Anglais)", name: "title_en", type: "text" },
      { label: "Sous-titre (Francais)", name: "body_fr", type: "textarea", rows: 4 },
      { label: "Sous-titre (Anglais)", name: "body_en", type: "textarea", rows: 4 },
    ],
  },
  {
    key: "home_about",
    label: "Accueil - Texte de presentation",
    source: "src/pages/public/home/components/about_section/about.jsx",
    fields: [
      { label: "Texte (Francais)", name: "body_fr", type: "textarea", rows: 4 },
      { label: "Texte (Anglais)", name: "body_en", type: "textarea", rows: 4 },
    ],
  },
  {
    key: "core_values_intro",
    label: "Accueil - Intro 'Why Choose Us'",
    source: "src/pages/public/home/components/CoreValues/coreValues.jsx",
    fields: [
      { label: "Titre (Francais)", name: "title_fr", type: "text" },
      { label: "Titre (Anglais)", name: "title_en", type: "text" },
      { label: "Texte (Francais)", name: "body_fr", type: "textarea", rows: 3 },
      { label: "Texte (Anglais)", name: "body_en", type: "textarea", rows: 3 },
    ],
  },
  {
    key: "core_value_1",
    label: "Accueil - Valeur cle #1",
    source: "src/pages/public/home/components/CoreValues/coreValues.jsx",
    fields: [
      { label: "Titre (Francais)", name: "title_fr", type: "text" },
      { label: "Titre (Anglais)", name: "title_en", type: "text" },
      { label: "Description (Francais)", name: "body_fr", type: "textarea", rows: 3 },
      { label: "Description (Anglais)", name: "body_en", type: "textarea", rows: 3 },
    ],
  },
  {
    key: "core_value_2",
    label: "Accueil - Valeur cle #2",
    source: "src/pages/public/home/components/CoreValues/coreValues.jsx",
    fields: [
      { label: "Titre (Francais)", name: "title_fr", type: "text" },
      { label: "Titre (Anglais)", name: "title_en", type: "text" },
      { label: "Description (Francais)", name: "body_fr", type: "textarea", rows: 3 },
      { label: "Description (Anglais)", name: "body_en", type: "textarea", rows: 3 },
    ],
  },
  {
    key: "about_vision",
    label: "A propos - Vision",
    source: "src/pages/public/about/components/hero_section/hero.jsx",
    fields: [
      { label: "Titre (Francais)", name: "title_fr", type: "text" },
      { label: "Titre (Anglais)", name: "title_en", type: "text" },
      { label: "Texte (Francais)", name: "body_fr", type: "textarea", rows: 4 },
      { label: "Texte (Anglais)", name: "body_en", type: "textarea", rows: 4 },
      { label: "Icone", name: "image", type: "file" },
    ],
  },
  {
    key: "about_mission",
    label: "A propos - Mission",
    source: "src/pages/public/about/components/hero_section/hero.jsx",
    fields: [
      { label: "Titre (Francais)", name: "title_fr", type: "text" },
      { label: "Titre (Anglais)", name: "title_en", type: "text" },
      { label: "Texte (Francais)", name: "body_fr", type: "textarea", rows: 4 },
      { label: "Texte (Anglais)", name: "body_en", type: "textarea", rows: 4 },
      { label: "Icone", name: "image", type: "file" },
    ],
  },
  {
    key: "about_approach",
    label: "A propos - Approche",
    source: "src/pages/public/about/components/hero_section/hero.jsx",
    fields: [
      { label: "Titre (Francais)", name: "title_fr", type: "text" },
      { label: "Titre (Anglais)", name: "title_en", type: "text" },
      { label: "Texte (Francais)", name: "body_fr", type: "textarea", rows: 4 },
      { label: "Texte (Anglais)", name: "body_en", type: "textarea", rows: 4 },
      { label: "Icone", name: "image", type: "file" },
    ],
  },
];

export function PageContentManager() {
  const [docsByKey, setDocsByKey] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchBlocks = async () => {
    setLoading(true);
    try {
      const docs = await getDocuments(DATABASE_ID, PAGE_CONTENT_COLLECTION_ID);
      const byKey = {};
      docs.forEach((doc) => {
        byKey[doc.key] = doc;
      });
      setDocsByKey(byKey);
      setLoadError(false);
    } catch (error) {
      console.error("Impossible de charger le contenu des pages:", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      const existing = docsByKey[editingBlock.key];
      const payload = {
        key: editingBlock.key,
        title_fr: data.title_fr || "",
        title_en: data.title_en || "",
        body_fr: data.body_fr || "",
        body_en: data.body_en || "",
      };

      if (editingBlock.fields.some((f) => f.name === "image")) {
        if (data.image instanceof File) {
          const uploaded = await uploadImageToCloudinary(data.image, {
            folder: "opentek/page_content",
          });
          payload.image = uploaded.url;
        } else {
          payload.image = existing?.image || "";
        }
      }

      if (existing) {
        await updateDocument(DATABASE_ID, PAGE_CONTENT_COLLECTION_ID, existing.$id, payload, []);
      } else {
        await createDocument(DATABASE_ID, PAGE_CONTENT_COLLECTION_ID, payload);
      }

      setEditingBlock(null);
      fetchBlocks();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du bloc:", error);
      alert("Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-content-manager">
      <h1>Contenu des pages</h1>
      <p className="page-content-manager__subtitle">
        Modifiez les textes affiches sur le site (accueil, a propos...)
      </p>

      {loadError && (
        <div className="page-content-manager__notice">
          La collection <code>page_content</code> n&apos;existe pas encore
          dans Appwrite. Voir <code>APPWRITE_SCHEMA.md</code> pour la creer.
          En attendant, le site public continue d&apos;afficher les textes
          actuels codes en dur.
        </div>
      )}

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="page-content-manager__list">
          {BLOCKS.map((block) => {
            const doc = docsByKey[block.key];
            return (
              <div className="page-content-manager__card" key={block.key}>
                <div>
                  <div className="page-content-manager__card-label">{block.label}</div>
                  <div className="page-content-manager__card-preview">
                    {doc?.title_fr || doc?.body_fr || doc?.title_en || doc?.body_en
                      ? doc.title_fr || doc.body_fr || doc.title_en || doc.body_en
                      : "Pas encore personnalise - texte par defaut affiche"}
                  </div>
                </div>
                <button className="edit-btn btn" onClick={() => setEditingBlock(block)}>
                  Modifier
                </button>
              </div>
            );
          })}
        </div>
      )}

      {editingBlock && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setEditingBlock(null)}>
              X
            </button>
            <h3>{editingBlock.label}</h3>
            <FormComponent
              fields={editingBlock.fields}
              onSubmit={handleSave}
              submitLabel={saving ? "Enregistrement..." : "Enregistrer"}
              initialData={docsByKey[editingBlock.key] || {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}
