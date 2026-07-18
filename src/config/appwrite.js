// src/config/appwrite.js
import { Client, Databases, Account, Storage, ID, Query } from "appwrite";

// Toutes les valeurs viennent des variables d'environnement Vite (VITE_*),
// avec les valeurs historiques du projet en repli pour ne rien casser
// si le .env n'est pas encore configure (dev local sans Docker par ex.)
const ENDPOINT =
  import.meta.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const PROJECT_ID =
  import.meta.env.VITE_APPWRITE_PROJECT_ID || "67ea7b5100381c86e477";

const client = new Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID);

const databases = new Databases(client);
const account = new Account(client);
const storage = new Storage(client);

// --- Base de donnees + collections -----------------------------------------
const DATABASE_ID =
  import.meta.env.VITE_APPWRITE_DATABASE_ID || "67eaac4d00270f35f322";

const JOBS_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_JOBS_COLLECTION_ID || "67eaacc50033130662c4";
const EVENTS_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_EVENTS_COLLECTION_ID || "67eaac61000fd1e98d80";

// Nouvelles collections pour piloter le contenu du site depuis le backoffice.
// Les IDs par defaut ci-dessous sont des noms lisibles : a creer dans la
// console Appwrite (voir APPWRITE_SCHEMA.md) puis, une fois les vrais IDs
// generes, a renseigner dans le .env pour figer les references.
const BLOG_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_BLOG_COLLECTION_ID || "blog_posts";
const TEAM_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_TEAM_COLLECTION_ID || "team_members";
const TESTIMONIALS_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_TESTIMONIALS_COLLECTION_ID || "testimonials";
const SERVICES_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_SERVICES_COLLECTION_ID || "services";
const PROJECTS_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_PROJECTS_COLLECTION_ID || "projects";
const PAGE_CONTENT_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_PAGE_CONTENT_COLLECTION_ID || "page_content";
const CONTACT_MESSAGES_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_CONTACT_MESSAGES_COLLECTION_ID || "contact_messages";
const APPLICATIONS_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_APPLICATIONS_COLLECTION_ID || "job_applications";
const SETTINGS_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_SETTINGS_COLLECTION_ID || "site_settings";

// --- Stockage (images blog, logos, CV...) -----------------------------------
const MEDIA_BUCKET_ID =
  import.meta.env.VITE_APPWRITE_MEDIA_BUCKET_ID || "media";

export {
  client,
  databases,
  account,
  storage,
  ID,
  Query,
  DATABASE_ID,
  JOBS_COLLECTION_ID,
  EVENTS_COLLECTION_ID,
  BLOG_COLLECTION_ID,
  TEAM_COLLECTION_ID,
  TESTIMONIALS_COLLECTION_ID,
  SERVICES_COLLECTION_ID,
  PROJECTS_COLLECTION_ID,
  PAGE_CONTENT_COLLECTION_ID,
  CONTACT_MESSAGES_COLLECTION_ID,
  APPLICATIONS_COLLECTION_ID,
  SETTINGS_COLLECTION_ID,
  MEDIA_BUCKET_ID,
};
