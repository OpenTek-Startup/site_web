import { useEffect, useState } from "react";
import {
  createDocument,
  deleteDocument,
  getDocuments,
  updateDocument,
  resolveImageUrl,
} from "../../../services/crudServices";
import { uploadImageToCloudinary } from "../../../services/cloudinaryService";
import { FormComponent } from "../../../components/FormComponent/formComponent";
import { DataList } from "../../../components/admin/DatatList/DataList";
import { DATABASE_ID, BLOG_COLLECTION_ID } from "../../../config/appwrite";
import "./blog.css";

const slugify = (text = "") =>
  text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const blog_fields = [
  { label: "Titre (Francais)", name: "title_fr", type: "text", placeholder: "Titre de l'article en francais" },
  { label: "Titre (Anglais)", name: "title_en", type: "text", placeholder: "Article title in english" },
  { label: "Extrait (Francais)", name: "excerpt_fr", type: "textarea", placeholder: "Court resume affiche dans la liste des articles", rows: 3 },
  { label: "Extrait (Anglais)", name: "excerpt_en", type: "textarea", placeholder: "Short summary shown in the article list", rows: 3 },
  { label: "Contenu (Francais)", name: "content_fr", type: "textarea", placeholder: "Contenu complet de l'article", rows: 10 },
  { label: "Contenu (Anglais)", name: "content_en", type: "textarea", placeholder: "Full article content", rows: 10 },
  { label: "Auteur", name: "author", type: "text", placeholder: "Nom de l'auteur" },
  { label: "Categorie", name: "category", type: "text", placeholder: "Ex: Actualites, Tech, Evenements" },
  { label: "Image de couverture", name: "coverImage", type: "file" },
  { label: "Publier l'article", name: "published", type: "bool" },
];

const columns = [
  { header: "Titre (FR)", accessor: "title_fr" },
  { header: "Categorie", accessor: "category" },
  { header: "Auteur", accessor: "author" },
  {
    header: "Statut",
    accessor: "published",
    render: (value) => (value ? "Publie" : "Brouillon"),
  },
];

export function BlogManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const docs = await getDocuments(DATABASE_ID, BLOG_COLLECTION_ID);
      setPosts(docs);
      setLoadError(false);
    } catch (error) {
      console.error("Impossible de charger les articles de blog:", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreateOrUpdate = async (data) => {
    setSaving(true);
    try {
      let coverImageId = editingPost?.coverImage || null;

      // Si un nouveau fichier a ete selectionne, on l'uploade vers Cloudinary
      if (data.coverImage instanceof File) {
        const uploaded = await uploadImageToCloudinary(data.coverImage, {
          folder: "opentek/blog_posts",
        });
        coverImageId = uploaded.url;
      } else if (typeof data.coverImage === "string") {
        coverImageId = data.coverImage;
      }

      const payload = {
        title_fr: data.title_fr || "",
        title_en: data.title_en || "",
        slug: slugify(data.title_fr || data.title_en || ""),
        excerpt_fr: data.excerpt_fr || "",
        excerpt_en: data.excerpt_en || "",
        content_fr: data.content_fr || "",
        content_en: data.content_en || "",
        author: data.author || "",
        category: data.category || "",
        coverImage: coverImageId,
        published: !!data.published,
      };

      if (editingPost) {
        await updateDocument(DATABASE_ID, BLOG_COLLECTION_ID, editingPost.$id, payload, []);
      } else {
        await createDocument(DATABASE_ID, BLOG_COLLECTION_ID, payload);
      }

      setShowForm(false);
      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'article:", error);
      alert("Une erreur est survenue lors de l'enregistrement de l'article.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Supprimer definitivement cet article ?")) return;
    try {
      await deleteDocument(DATABASE_ID, BLOG_COLLECTION_ID, postId);
      fetchPosts();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article:", error);
      alert("Une erreur est survenue lors de la suppression de l'article.");
    }
  };

  const handleOpenCreateForm = () => {
    setEditingPost(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPost(null);
  };

  return (
    <div className="blog-manager">
      <div className="blog-manager__header">
        <div>
          <h1>Gestion du blog</h1>
          <p className="blog-manager__subtitle">
            Creez, modifiez et publiez les articles affiches sur le site
          </p>
        </div>
        <button className="create-button" onClick={handleOpenCreateForm}>
          + Nouvel article
        </button>
      </div>

      {loadError && (
        <div className="blog-manager__notice">
          La collection <code>blog_posts</code> n&apos;existe pas encore dans
          Appwrite (ou son ID differe de celui configure). Voir{" "}
          <code>APPWRITE_SCHEMA.md</code> a la racine du projet pour la
          creer, puis renseignez son ID reel dans <code>.env</code>.
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseForm}>
              X
            </button>
            <h3>{editingPost ? "Modifier l'article" : "Nouvel article"}</h3>
            {editingPost?.coverImage && (
              <img
                className="blog-manager__current-cover"
                src={resolveImageUrl(editingPost.coverImage)}
                alt="Couverture actuelle"
              />
            )}
            <FormComponent
              onSubmit={handleCreateOrUpdate}
              fields={blog_fields}
              submitLabel={saving ? "Enregistrement..." : editingPost ? "Mettre a jour" : "Publier / Enregistrer"}
              initialData={editingPost || { published: false }}
            />
          </div>
        </div>
      )}

      {loading ? (
        <p>Chargement des articles...</p>
      ) : (
        <DataList
          data={posts}
          columns={columns}
          onEdite={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
