// Upload d'images vers Cloudinary (stockage des donnees reste sur Appwrite -
// seules les IMAGES passent par Cloudinary pour beneficier du CDN et de
// l'optimisation automatique de format/qualite).
//
// Utilise un "unsigned upload preset" : permet l'upload direct depuis le
// navigateur sans exposer de cle API secrete. A creer dans Cloudinary :
// Settings > Upload > Upload presets > Add upload preset > Signing Mode: Unsigned.

import { validateFile } from "./crudServices";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const DEFAULT_ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mo

/**
 * Upload une image vers Cloudinary et retourne son URL securisee (https).
 * Cette URL est stockee telle quelle dans le document Appwrite (champ
 * string) - voir resolveImageUrl() dans crudServices.js pour l'affichage.
 */
export const uploadImageToCloudinary = async (file, options = {}) => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary n'est pas configure : renseignez VITE_CLOUDINARY_CLOUD_NAME et VITE_CLOUDINARY_UPLOAD_PRESET dans .env"
    );
  }

  const { valid, error } = validateFile(file, {
    maxSizeBytes: options.maxSizeBytes || MAX_IMAGE_SIZE_BYTES,
    allowedTypes: options.allowedTypes || DEFAULT_ALLOWED_IMAGE_TYPES,
  });
  if (!valid) {
    throw new Error(error);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  if (options.folder) {
    formData.append("folder", options.folder);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    console.error("Erreur Cloudinary:", errorBody);
    throw new Error(
      errorBody?.error?.message || "Erreur lors de l'upload de l'image vers Cloudinary."
    );
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
};

/**
 * Construit une variante optimisee d'une URL Cloudinary existante en y
 * injectant des transformations (redimensionnement, format/qualite auto).
 * Ne fait rien si l'URL n'est pas une URL Cloudinary (ex: ancien fichier
 * Appwrite).
 *
 * Exemple : cloudinaryTransform(url, "w_400,f_auto,q_auto")
 */
export const cloudinaryTransform = (url, transformation) => {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/${transformation}/`);
};
