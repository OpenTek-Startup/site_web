import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getDocuments, resolveImageUrl } from "../services/crudServices";
import { DATABASE_ID, PAGE_CONTENT_COLLECTION_ID } from "../config/appwrite";
import { pickLocalized } from "./pickLocalized";

let cache = null; // evite de re-fetch toute la collection a chaque composant qui l'utilise

async function fetchAllBlocks() {
  if (cache) return cache;
  try {
    const docs = await getDocuments(DATABASE_ID, PAGE_CONTENT_COLLECTION_ID);
    cache = {};
    docs.forEach((doc) => {
      cache[doc.key] = doc;
    });
  } catch {
    cache = {};
  }
  return cache;
}

/**
 * Recupere un bloc de contenu editable (voir PageContentManager) pour la
 * page publique. Retourne une fonction `field(name, fallback)` qui rend
 * le texte localise s'il a ete personnalise dans l'admin, sinon le texte
 * `fallback` fourni par le composant appelant (le contenu actuel codé en
 * dur), pour ne jamais rien casser tant que le contenu n'a pas ete saisi.
 */
export function usePageContent(key) {
  const { i18n } = useTranslation();
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchAllBlocks().then((blocks) => {
      if (mounted) setDoc(blocks[key] || null);
    });
    return () => {
      mounted = false;
    };
  }, [key]);

  const field = (name, fallback = "") => {
    if (!doc) return fallback;
    const value = pickLocalized(doc, name, i18n.language);
    return value || fallback;
  };

  return { field, image: resolveImageUrl(doc?.image) };
}
