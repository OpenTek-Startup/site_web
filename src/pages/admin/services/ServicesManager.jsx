import { CollectionManager } from "../../../components/admin/CollectionManager/CollectionManager";
import { SERVICES_COLLECTION_ID } from "../../../config/appwrite";

const fields = [
  { label: "Titre (Francais)", name: "title_fr", type: "text", placeholder: "Ex: Developpement web" },
  { label: "Titre (Anglais)", name: "title_en", type: "text", placeholder: "Ex: Web Development" },
  { label: "Description (Francais)", name: "description_fr", type: "textarea", placeholder: "Description courte du service", rows: 4 },
  { label: "Description (Anglais)", name: "description_en", type: "textarea", placeholder: "Short service description", rows: 4 },
  { label: "Image", name: "icon", type: "file" },
  { label: "Ordre d'affichage", name: "order", type: "number", placeholder: "0" },
];

const columns = [
  { header: "Titre (FR)", accessor: "title_fr" },
  { header: "Titre (EN)", accessor: "title_en" },
  { header: "Ordre", accessor: "order" },
];

export function ServicesManager() {
  return (
    <CollectionManager
      title="Nos services"
      subtitle="Geres les services affiches sur la page d'accueil, en francais et en anglais"
      collectionId={SERVICES_COLLECTION_ID}
      fields={fields}
      columns={columns}
      fileFields={["icon"]}
      defaultValues={{ order: 0 }}
    />
  );
}
