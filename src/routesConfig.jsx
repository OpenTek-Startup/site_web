// Arbre de routes PUBLIQUES partage entre le client (App.jsx, via
// createBrowserRouter) et le script de prerendu serveur (entry-server.jsx,
// via StaticRouter). Garder synchronise avec les routes publiques de
// App.jsx a chaque ajout/suppression de page publique.
//
// Les routes admin ne sont PAS incluses ici : elles ne doivent jamais etre
// prerendues (contenu prive, protege par authentification).

import { Routes, Route } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import HomePage from "./pages/public/home";
import AboutPage from "./pages/public/about/about";
import JobsPublicPage from "./pages/public/jobs/JobsPublicPage";
import EventsPublicPage from "./pages/public/events/EventsPublicPage";
import BlogListPage from "./pages/public/blog/BlogListPage";
import BlogPostPage from "./pages/public/blog/BlogPostPage";
import Contact from "./layout/contact";
import LegalPage from "./pages/public/legal/LegalPage";
import NotFoundPage from "./pages/public/not-found/NotFoundPage";

export function PublicRoutes() {
  return (
    <Routes>
      <Route path="/:lang" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="jobs" element={<JobsPublicPage />} />
        <Route path="events" element={<EventsPublicPage />} />
        <Route path="blog" element={<BlogListPage />} />
        <Route path="blog/:slug" element={<BlogPostPage />} />
        <Route path="contact" element={<Contact />} />
        <Route path="legal" element={<LegalPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
