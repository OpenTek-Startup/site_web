import { CollectionManager } from "../../../components/admin/CollectionManager/CollectionManager";
import { PROJECTS_COLLECTION_ID } from "../../../config/appwrite";

const fields = [
  { label: "Titre", name: "title", type: "text", placeholder: "Nom du projet" },
  { label: "Description", name: "description", type: "textarea", placeholder: "Description courte du projet", rows: 4 },
  { label: "Image de couverture", name: "coverImage", type: "file" },
  { label: "Lien (etude de cas, demo...)", name: "link", type: "text", placeholder: "https://..." },
  { label: "Ordre d'affichage", name: "order", type: "number", placeholder: "0" },
];

const columns = [
  { header: "Titre", accessor: "title" },
  { header: "Description", accessor: "description" },
  { header: "Ordre", accessor: "order" },
];

export function ProjectsManager() {
  return (
    <CollectionManager
      title="Portfolio / projets"
      subtitle="Projets affiches dans la section 'Our Portfolio' de la page d'accueil"
      collectionId={PROJECTS_COLLECTION_ID}
      fields={fields}
      columns={columns}
      imageField="coverImage"
      newButtonLabel="+ Nouveau projet"
      buildPayload={(data, imageId) => ({
        title: data.title || "",
        description: data.description || "",
        coverImage: imageId,
        link: data.link || "",
        order: data.order ? Number(data.order) : 0,
      })}
    />
  );
}
