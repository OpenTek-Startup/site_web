# Schema Appwrite - Contenu pilotable depuis le backoffice

Ce document liste les collections a creer dans la console Appwrite
(https://cloud.appwrite.io) pour que le backoffice fonctionne. Le code du
front est deja pret a les consommer (voir `src/config/appwrite.js`) : il
suffit de creer les collections, puis de reporter leurs vrais IDs dans le
fichier `.env` (voir `.env.example`).

Base de donnees a utiliser : celle deja existante
(`VITE_APPWRITE_DATABASE_ID`, ID actuel `67eaac4d00270f35f322`).

---

## 1. `blog_posts` (deja utilisee par le backoffice - PRIORITAIRE)

**Bilingue** : les champs de texte existent en deux versions, suffixees
`_fr` et `_en`. Le front public affiche la version de la langue courante,
avec repli automatique sur l'autre langue si une traduction manque.

| Attribut     | Type    | Obligatoire | Notes                                   |
|--------------|---------|-------------|------------------------------------------|
| title_fr     | string (255) | oui    | Titre de l'article (francais)            |
| title_en     | string (255) | non    | Titre de l'article (anglais)             |
| slug         | string (255) | oui    | Genere automatiquement depuis title_fr   |
| excerpt_fr   | string (500) | non    | Resume court (francais)                  |
| excerpt_en   | string (500) | non    | Resume court (anglais)                   |
| content_fr   | string (20000) | oui  | Corps de l'article (francais)            |
| content_en   | string (20000) | non  | Corps de l'article (anglais)             |
| author       | string (100)  | non  |                                           |
| category     | string (100)  | non  |                                           |
| coverImage   | **URL**  | non  | URL Cloudinary complete (voir section Cloudinary) |
| published    | boolean       | oui  | defaut : false                           |

Permissions recommandees :
- Lecture (`read`) : `any` (pour que le futur front public puisse lire les
  articles publies sans etre connecte)
- Creation / mise a jour / suppression (`create`, `update`, `delete`) :
  role `users` ou un role `admin` dedie (voir section Auth ci-dessous)

Index utile : index sur `slug` (unique) et sur `published`.

## 2. `team_members`

**Bilingue** : `bio` et `role` existent en `_fr`/`_en`.

| Attribut | Type | Obligatoire | Notes |
|----------|------|-------------|-------|
| name | string (150) | oui | (pas de traduction necessaire) |
| role_fr | string (150) | oui | Poste / fonction (francais) |
| role_en | string (150) | non | Poste / fonction (anglais) |
| photo | **URL** | non | URL Cloudinary complete |
| bio_fr | string (1000) | non | |
| bio_en | string (1000) | non | |
| linkedin | string (255) | non | |
| order | integer | non | Ordre d'affichage |

## 3. `testimonials`

**Bilingue** : `content` existe en `_fr`/`_en`.

| Attribut | Type | Obligatoire | Notes |
|----------|------|-------------|-------|
| author | string (150) | oui | |
| company | string (150) | non | |
| content_fr | string (1000) | oui | Temoignage (francais) |
| content_en | string (1000) | non | Temoignage (anglais) |
| photo | **URL** | non | URL Cloudinary complete |
| rating | integer | non | 1 a 5 |

## 4. `services`

**Bilingue** : `title`/`description` existent en `_fr`/`_en`.

| Attribut | Type | Obligatoire | Notes |
|----------|------|-------------|-------|
| title_fr | string (150) | oui | |
| title_en | string (150) | non | |
| description_fr | string (1000) | oui | |
| description_en | string (1000) | non | |
| icon | **URL** | non | URL Cloudinary complete |
| order | integer | non | |

## 5. `projects` (portfolio - section "Our Portfolio" de la home)

**Bilingue** : `title`/`description` existent en `_fr`/`_en`.

| Attribut | Type | Obligatoire | Notes |
|----------|------|-------------|-------|
| title_fr | string (150) | oui | |
| title_en | string (150) | non | |
| description_fr | string (600) | oui | |
| description_en | string (600) | non | |
| coverImage | **URL** | oui | URL Cloudinary complete (remplace les URLs Supabase codees en dur) |
| order | integer | non | |
| link | string (255) | non | Lien externe / etude de cas, optionnel |

## 6. `page_content` (textes uniques par page - hero, intro, mission/vision)

Une collection a document unique par bloc identifie par une cle `key`.
**Bilingue** : `title`/`body` existent en `_fr`/`_en`.

| Attribut | Type | Obligatoire | Notes |
|----------|------|-------------|-------|
| key | string (100) | oui | Identifiant unique, ex: `home_hero`, `home_about`, `about_mission`, `about_vision`, `about_approach`, `core_value_1`, `core_value_2` |
| title_fr | string (200) | non | |
| title_en | string (200) | non | |
| body_fr | string (2000) | non | |
| body_en | string (2000) | non | |
| image | **URL** | non | URL Cloudinary complete, si le bloc a une icone/image |

Index utile : index unique sur `key`.

## 7. `contact_messages` (formulaire de contact)

| Attribut | Type | Obligatoire | Notes |
|----------|------|-------------|-------|
| name | string (150) | oui | |
| email | string (150) | oui | |
| subject | string (200) | non | |
| message | string (2000) | oui | |
| read | boolean | oui | defaut : false |

Permissions recommandees :
- Creation (`create`) : `any` (n'importe quel visiteur doit pouvoir envoyer un message)
- Lecture / mise a jour / suppression : reservees au compte admin

## 8. `job_applications` (candidatures)

| Attribut | Type | Obligatoire | Notes |
|----------|------|-------------|-------|
| jobId | string (100) | oui | ID du document dans `jobs` |
| jobTitle | string (200) | non | Copie du titre du poste au moment de la candidature |
| applicantName | string (150) | oui | |
| email | string (150) | oui | |
| phone | string (50) | non | |
| coverLetter | string (2000) | non | Message de motivation |
| cvFile | string (255) | non | ID fichier dans le bucket `media` |
| status | string (50) | non | "Nouvelle" / "Vue" / "Retenue" / "Rejetee" - defaut "Nouvelle" |

Permissions recommandees :
- Creation (`create`) : `any`
- Lecture / mise a jour / suppression : reservees au compte admin

## Relations entre collections

Appwrite propose un type d'attribut **Relationship** (equivalent d'une cle
etrangere) entre deux collections. Il n'est utilise nulle part dans ce
schema, et ce choix merite d'etre explique plutot que suppose.

Le seul endroit ou une relation aurait un sens est `job_applications.jobId`,
qui reference conceptuellement un document de la collection `jobs`. Ce
schema utilise volontairement un simple champ `string` (l'ID du job) plus
un champ `jobTitle` duplique (copie du titre au moment de la candidature),
plutot qu'un attribut Relationship, pour deux raisons :

1. **Historique fiable** : si une offre d'emploi est modifiee ou
   supprimee plus tard, la candidature continue d'afficher le titre du
   poste tel qu'il etait au moment de la candidature - ce qui est le
   comportement souhaitable pour un enregistrement de type "archive".
   Avec une relation stricte, supprimer le job casserait l'affichage de
   toutes les candidatures liees (ou les supprimerait en cascade selon la
   configuration).
2. **Simplicite** : les attributs Relationship ajoutent de la complexite
   de configuration (direction de la relation, comportement a la
   suppression, cle a deux sens) pour un gain limite ici, alors que
   l'objectif du backoffice est de rester simple a comprendre et a
   deboguer directement dans la console Appwrite.

**Si vous preferez neanmoins une vraie relation** (par exemple pour
pouvoir naviguer directement du job vers ses candidatures dans la
console Appwrite) : dans la collection `job_applications`, remplacer
l'attribut `jobId` par un attribut de type **Relationship**, cible
`jobs`, type de relation **Many to One** (plusieurs candidatures pour un
job), et choisir un comportement a la suppression ("Restrict" pour
empecher la suppression d'un job qui a des candidatures, ou "Set NULL"
pour conserver les candidatures orphelines).

Aucune autre collection de ce schema n'a de lien naturel avec une autre
(Services, Portfolio, Temoignages, Equipe, Blog et Contenu des pages sont
chacune independantes) - il n'y a donc pas d'autre relation "manquante".

## 9. `site_settings`

Collection a document unique (un seul document, cle `key`/`value` ou un
document avec tous les champs directement) pour les informations globales :
coordonnees de contact, reseaux sociaux, texte du footer, etc.

| Attribut | Type | Notes |
|----------|------|-------|
| contactEmail | string | |
| contactPhone | string | |
| address | string | |
| facebookUrl | string | |
| linkedinUrl | string | |
| twitterUrl | string | |
| githubUrl | string | |

---

## Stockage (Storage)

**Repartition** : Appwrite Storage pour les documents (CV), Cloudinary pour
les images (voir section suivante). Cette repartition n'est pas une
obligation technique mais un choix fait pour ce projet - Cloudinary
apporte un CDN et une optimisation automatique du poids des images.

Creer un bucket nomme `media` (ou renseigner son ID reel dans
`VITE_APPWRITE_MEDIA_BUCKET_ID`) pour heberger uniquement :
- les CV envoyes via le formulaire de candidature (`job_applications.cvFile`)

**Ou le creer dans la console Appwrite** :
1. Se connecter sur https://cloud.appwrite.io et ouvrir le projet OpenTek
2. Dans le menu de gauche : **Storage**
3. Bouton **Create bucket**
4. Nom : `media` (ou autre nom de votre choix, a reporter dans `.env`)
5. Dans l'onglet **Settings** du bucket cree, section **Permissions** :
   ajouter un role `Any` avec la permission **Create** (pour l'upload
   public de CV), et un role correspondant a votre compte admin avec
   **Read**, **Update**, **Delete**
6. Toujours dans Settings : limiter la **taille maximale de fichier** (ex:
   5 Mo) et les **extensions autorisees** (pdf, doc, docx) pour rester
   coherent avec la validation deja faite cote code

Permissions : creation publique (`any`, pour permettre l'envoi de CV sans
compte), lecture/suppression reservees aux comptes admin.

## Cloudinary (stockage des images)

Toutes les images (couvertures de blog, portfolio, services, temoignages,
photos d'equipe, icones de contenu) sont uploadees directement depuis le
navigateur vers Cloudinary, puis leur URL complete est stockee dans le
champ Appwrite correspondant (ex: `coverImage`, `photo`, `icon`).

Configuration necessaire (voir `.env.example`) :
1. Recuperer le **cloud name** en haut du dashboard Cloudinary
2. Creer un **upload preset** : Settings > Upload > Upload presets > Add
   upload preset > Signing Mode : **Unsigned** (indispensable pour
   permettre l'upload depuis le navigateur sans exposer de cle secrete)
3. Renseigner `VITE_CLOUDINARY_CLOUD_NAME` et `VITE_CLOUDINARY_UPLOAD_PRESET`
4. Optionnel mais recommande : dans les parametres du preset, activer
   l'optimisation automatique du format et de la qualite (souvent nommee
   "f_auto, q_auto" ou "Automatic" selon la version de l'interface) -
   Cloudinary sert alors automatiquement le format le plus leger possible
   (WebP/AVIF) sans changement de code cote site.

Limite appliquee cote site : 5 Mo par image, formats JPEG/PNG/WebP/GIF
(voir `src/services/cloudinaryService.js`).

**Type d'attribut Appwrite pour ces champs** : utiliser le type **URL**
(et non **String**) lors de la creation des attributs `coverImage`,
`photo`, `icon`, `image` dans chaque collection. Le type URL est un type
dedie dans Appwrite qui valide que la valeur est bien une URL bien
formee - plus adapte que String pour ce cas d'usage, et disponible sans
configuration particuliere lors de l'ajout d'un attribut (Attributes >
Create attribute > URL).

---

## Authentification admin

Le backoffice (`/admin/*`) utilise `Account` d'Appwrite (email + mot de
passe). Pour creer le premier compte administrateur :

1. Dans la console Appwrite > Auth > Users > "Create user"
2. Renseigner l'email et le mot de passe qui serviront a se connecter sur
   `/admin/login`

Pour la suite, envisager un role/label `admin` sur le compte + des regles
de permission par collection qui exigent ce role, plutot que d'ouvrir
l'ecriture a tout utilisateur authentifie.
