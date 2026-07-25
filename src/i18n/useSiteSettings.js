import { useEffect, useState } from "react";
import { getDocuments } from "../services/crudServices";
import { DATABASE_ID, SETTINGS_COLLECTION_ID } from "../config/appwrite";

let cache = null;

async function fetchSettings() {
  if (cache) return cache;
  try {
    const docs = await getDocuments(DATABASE_ID, SETTINGS_COLLECTION_ID);
    cache = docs[0] || {};
  } catch {
    cache = {};
  }
  return cache;
}

const DEFAULTS = {
  contactEmail: "opentek.startup@gmail.com",
  contactPhone: "+237 657 26 85 49",
  facebookUrl: "",
  linkedinUrl: "",
  twitterUrl: "",
  githubUrl: "",
};

/**
 * Coordonnees et reseaux sociaux du site (voir SiteSettingsManager en
 * admin). Retourne les valeurs par defaut codees en dur tant que rien n'a
 * ete personnalise dans l'admin - ne casse jamais l'affichage.
 */
export function useSiteSettings() {
  const [settings, setSettings] = useState(DEFAULTS);

  useEffect(() => {
    let mounted = true;
    fetchSettings().then((data) => {
      if (mounted) {
        setSettings({
          contactEmail: data.contactEmail || DEFAULTS.contactEmail,
          contactPhone: data.contactPhone || DEFAULTS.contactPhone,
          address: data.address || "",
          facebookUrl: data.facebookUrl || "",
          linkedinUrl: data.linkedinUrl || "",
          twitterUrl: data.twitterUrl || "",
          githubUrl: data.githubUrl || "",
        });
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return settings;
}
