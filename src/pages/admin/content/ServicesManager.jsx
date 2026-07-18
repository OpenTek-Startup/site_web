import { CollectionManager } from "../../../components/admin/CollectionManager/CollectionManager";
import { SERVICES_COLLECTION_ID } from "../../../config/appwrite";

const fields = [
  { label: "Titre", name: "title", type: "text", placeholder: "Ex: Web Development" },
  { label: "Description", name: "description", type: "textarea", placeholder: "Description courte du service", rows: 4 },
  { label: "Image", name: "image", type: "file" },
  { label: "Ordre d'affichage", name: "order", type: "number", placeholder: "0" },
];

const columns = [
  { header: "Titre", accessor: "title" },
  { header: "Description", accessor: "description" },
  { header: "Ordre", accessor: "order" },
];

export function ServicesManager() {
  return (
    <CollectionManager
      title="Nos services"
      subtitle="Services affiches dans la section 'Our Services' de la page d'accueil"
      collectionId={SERVICES_COLLECTION_ID}
      fields={fields}
      columns={columns}
      imageField="image"
      newButtonLabel="+ Nouveau service"
      buildPayload={(data, imageId) => ({
        title: data.title || "",
        description: data.description || "",
        image: imageId,
        order: data.order ? Number(data.order) : 0,
      })}
    />
  );
}
