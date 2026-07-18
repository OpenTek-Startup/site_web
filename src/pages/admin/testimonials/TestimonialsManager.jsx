import { CollectionManager } from "../../../components/admin/CollectionManager/CollectionManager";
import { TESTIMONIALS_COLLECTION_ID } from "../../../config/appwrite";

const fields = [
  { label: "Nom du client", name: "author", type: "text", placeholder: "Ex: Michel Claude" },
  { label: "Entreprise / fonction", name: "company", type: "text", placeholder: "Ex: CEO, Acme Inc." },
  { label: "Temoignage (Francais)", name: "content_fr", type: "textarea", placeholder: "Le message du client", rows: 4 },
  { label: "Temoignage (Anglais)", name: "content_en", type: "textarea", placeholder: "The client's message", rows: 4 },
  { label: "Photo", name: "photo", type: "file" },
  { label: "Note (1 a 5)", name: "rating", type: "number", placeholder: "5" },
];

const columns = [
  { header: "Nom", accessor: "author" },
  { header: "Entreprise", accessor: "company" },
  { header: "Note", accessor: "rating" },
];

export function TestimonialsManager() {
  return (
    <CollectionManager
      title="Temoignages clients"
      subtitle="Geres les temoignages affiches sur la page d'accueil, en francais et en anglais"
      collectionId={TESTIMONIALS_COLLECTION_ID}
      fields={fields}
      columns={columns}
      fileFields={["photo"]}
      defaultValues={{ rating: 5 }}
    />
  );
}
