/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  createDocument,
  deleteDocument,
  getDocuments,
  updateDocument,
} from "../../../services/crudServices";
import { uploadImageToCloudinary } from "../../../services/cloudinaryService";
import { FormComponent } from "../../FormComponent/formComponent";
import { DataList } from "../DatatList/DataList";
import { DATABASE_ID } from "../../../config/appwrite";
import "./collectionManager.css";

/**
 * Composant generique de gestion CRUD pour une collection Appwrite.
 * Sert de base a Services, Portfolio, Temoignages, Equipe... afin
 * d'eviter de dupliquer la meme logique liste/formulaire/upload a
 * chaque fois (voir BlogManager pour le meme principe applique au blog).
 *
 * Props :
 * - title, subtitle : entetes de la page
 * - collectionId : ID de la collection Appwrite cible
 * - fields : description des champs pour FormComponent (voir formComponent.jsx)
 * - columns : colonnes affichees dans la liste (voir DataList.jsx)
 * - fileFields : noms des champs de type "file" (images) a uploader vers
 *   Cloudinary avant l'enregistrement du document (le champ stocke alors
 *   l'URL Cloudinary complete, pas un ID de fichier)
 * - buildPayload : fonction optionnelle (data) => payload pour transformer
 *   les donnees du formulaire avant enregistrement (ex: forcer un type)
 * - defaultValues : valeurs par defaut a la creation (ex: { order: 0 })
 * - notFoundHint : message affiche si la collection n'existe pas encore
 */
export function CollectionManager({
  title,
  subtitle,
  collectionId,
  fields,
  columns,
  fileFields = [],
  buildPayload,
  defaultValues = {},
  notFoundHint,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const docs = await getDocuments(DATABASE_ID, collectionId);
      setItems(docs);
      setLoadError(false);
    } catch (error) {
      console.error(`Impossible de charger la collection ${collectionId}:`, error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionId]);

  const handleCreateOrUpdate = async (data) => {
    setSaving(true);
    try {
      const payload = { ...data };

      // Upload des images (Cloudinary) marquees comme fileFields, si modifiees
      for (const fieldName of fileFields) {
        if (payload[fieldName] instanceof File) {
          const uploaded = await uploadImageToCloudinary(payload[fieldName], {
            folder: `opentek/${collectionId}`,
          });
          payload[fieldName] = uploaded.url;
        } else if (!payload[fieldName] && editingItem?.[fieldName]) {
          payload[fieldName] = editingItem[fieldName];
        }
      }

      const finalPayload = buildPayload ? buildPayload(payload) : payload;

      if (editingItem) {
        await updateDocument(DATABASE_ID, collectionId, editingItem.$id, finalPayload, []);
      } else {
        await createDocument(DATABASE_ID, collectionId, finalPayload);
      }

      setShowForm(false);
      setEditingItem(null);
      fetchItems();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      alert("Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Supprimer definitivement cet element ?")) return;
    try {
      await deleteDocument(DATABASE_ID, collectionId, itemId);
      fetchItems();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Une erreur est survenue lors de la suppression.");
    }
  };

  const handleOpenCreateForm = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="collection-manager">
      <div className="collection-manager__header">
        <div>
          <h1>{title}</h1>
          {subtitle && <p className="collection-manager__subtitle">{subtitle}</p>}
        </div>
        <button className="create-button" onClick={handleOpenCreateForm}>
          + Ajouter
        </button>
      </div>

      {loadError && (
        <div className="collection-manager__notice">
          {notFoundHint || (
            <>
              La collection <code>{collectionId}</code> n&apos;existe pas
              encore dans Appwrite. Voir <code>APPWRITE_SCHEMA.md</code> pour
              la creer.
            </>
          )}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseForm}>
              X
            </button>
            <h3>{editingItem ? "Modifier" : "Ajouter"}</h3>
            <FormComponent
              onSubmit={handleCreateOrUpdate}
              fields={fields}
              submitLabel={saving ? "Enregistrement..." : editingItem ? "Mettre a jour" : "Enregistrer"}
              initialData={editingItem || defaultValues}
            />
          </div>
        </div>
      )}

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <DataList
          data={items}
          columns={columns}
          onEdite={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
