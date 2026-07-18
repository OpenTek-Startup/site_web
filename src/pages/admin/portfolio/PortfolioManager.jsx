import { CollectionManager } from "../../../components/admin/CollectionManager/CollectionManager";
import { PROJECTS_COLLECTION_ID } from "../../../config/appwrite";

const fields = [
  { label: "Titre du projet (Francais)", name: "title_fr", type: "text", placeholder: "Ex: Application mobile meteo" },
  { label: "Titre du projet (Anglais)", name: "title_en", type: "text", placeholder: "Ex: Weather Mobile App" },
  { label: "Description (Francais)", name: "description_fr", type: "textarea", placeholder: "Description courte du projet", rows: 4 },
  { label: "Description (Anglais)", name: "description_en", type: "textarea", placeholder: "Short project description", rows: 4 },
  { label: "Image de couverture", name: "coverImage", type: "file" },
  { label: "Lien (etude de cas, demo...)", name: "link", type: "text", placeholder: "https://..." },
  { label: "Ordre d'affichage", name: "order", type: "number", placeholder: "0" },
];

const columns = [
  { header: "Titre (FR)", accessor: "title_fr" },
  { header: "Titre (EN)", accessor: "title_en" },
  { header: "Ordre", accessor: "order" },
];

export function PortfolioManager() {
  return (
    <CollectionManager
      title="Portfolio"
      subtitle="Geres les projets affiches dans la section 'Our Portfolio' de la page d'accueil, en francais et en anglais"
      collectionId={PROJECTS_COLLECTION_ID}
      fields={fields}
      columns={columns}
      fileFields={["coverImage"]}
      defaultValues={{ order: 0 }}
    />
  );
}
