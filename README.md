# OpenTek - Site web

Site vitrine OpenTek (React + Vite) avec backoffice d'administration
(Appwrite) pour gerer les offres d'emploi, les evenements et le blog.

## Demarrage rapide (sans Docker)

```bash
npm install
cp .env.example .env   # puis completer avec vos IDs Appwrite
npm run dev
```

## Demarrage avec Docker (dev, hot reload)

```bash
cp .env.example .env
docker compose up --build
```

Le site est alors disponible sur http://localhost:5173

## Build de production

```bash
npm run build      # genere le dossier dist/
npm run preview    # pour tester le build localement
```

## Deploiement

- **Vercel** (recommande) : connecter le repo, Vercel detecte
  automatiquement `vercel.json` (build Vite, rewrites SPA). Renseigner les
  variables d'environnement `VITE_APPWRITE_*` dans les parametres du
  projet Vercel (voir `.env.example`).
- **Docker / VPS** (alternative) : `docker build --target production -t opentek-web .`
  puis `docker run -p 80:80 opentek-web` (sert le build via nginx).

## Backoffice admin

Accessible sur `/admin/login`. Voir `APPWRITE_SCHEMA.md` pour la liste des
collections Appwrite a creer (blog, equipe, temoignages, services,
parametres du site) et comment creer le premier compte administrateur.

Fonctionnalites actuelles du backoffice :
- Tableau de bord avec vue d'ensemble du contenu
- Gestion des offres d'emploi (creation, edition, suppression)
- Gestion des evenements
- Gestion du blog (creation, edition, suppression, publication, image de
  couverture)

## Architecture

- Frontend : React 18 + Vite + React Router
- Backend : Appwrite (base de donnees, authentification, stockage de
  fichiers) - self-hostable via Docker ou Appwrite Cloud
- Le contenu public du site reste pour le moment gere directement dans le
  code (integration progressive prevue - voir `APPWRITE_SCHEMA.md`)
