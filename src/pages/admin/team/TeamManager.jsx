import { CollectionManager } from "../../../components/admin/CollectionManager/CollectionManager";
import { TEAM_COLLECTION_ID } from "../../../config/appwrite";

const fields = [
  { label: "Nom", name: "name", type: "text", placeholder: "Ex: Djomo Brown" },
  { label: "Poste / fonction (Francais)", name: "role_fr", type: "text", placeholder: "Ex: Directeur General" },
  { label: "Poste / fonction (Anglais)", name: "role_en", type: "text", placeholder: "Ex: CEO & Founder" },
  { label: "Photo", name: "photo", type: "file" },
  { label: "Bio (Francais)", name: "bio_fr", type: "textarea", placeholder: "Courte presentation", rows: 3 },
  { label: "Bio (Anglais)", name: "bio_en", type: "textarea", placeholder: "Short bio", rows: 3 },
  { label: "Lien LinkedIn", name: "linkedin", type: "text", placeholder: "https://linkedin.com/in/..." },
  { label: "Ordre d'affichage", name: "order", type: "number", placeholder: "0" },
];

const columns = [
  { header: "Nom", accessor: "name" },
  { header: "Poste (FR)", accessor: "role_fr" },
  { header: "Ordre", accessor: "order" },
];

export function TeamManager() {
  return (
    <CollectionManager
      title="Equipe"
      subtitle="Geres les membres de l'equipe affiches sur la page A propos, en francais et en anglais"
      collectionId={TEAM_COLLECTION_ID}
      fields={fields}
      columns={columns}
      fileFields={["photo"]}
      defaultValues={{ order: 0 }}
    />
  );
}
