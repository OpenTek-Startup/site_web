import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Suspense, lazy } from 'react';
//Pages
//aos libray
import 'aos/dist/aos.css';
//Stylesheet
import './App.css';
import './styles/design-system.css';
import RootLayout from './layout/RootLayout';
import { LanguageLayout } from './layout/language/LanguageLayout';
import { RootRedirect } from './layout/language/RootRedirect';
import HomePage from './pages/public/home';
import AboutPage from './pages/public/about/about';
import JobsPublicPage from './pages/public/jobs/JobsPublicPage';
import EventsPublicPage from './pages/public/events/EventsPublicPage';
import BlogListPage from './pages/public/blog/BlogListPage';
import BlogPostPage from './pages/public/blog/BlogPostPage';
import Contact from './layout/contact';
import LegalPage from './pages/public/legal/LegalPage';
import NotFoundPage from './pages/public/not-found/NotFoundPage';

// Backoffice (admin) - charge paresseusement (React.lazy) : un visiteur
// public ne telecharge jamais ce code (formulaires, gestionnaires CRUD,
// icones admin...), qui ne sert qu'aux quelques personnes qui se
// connectent sur /admin. Les pages PUBLIQUES restent en import classique
// (pas de lazy) car elles sont prerendues cote serveur (voir
// scripts/prerender.mjs) - un lazy() cote client casserait la
// correspondance avec le HTML deja genere lors de l'hydratation.
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
const AdminLayout = lazy(() => import('./layout/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const Login = lazy(() => import('./pages/admin/login/Login').then((m) => ({ default: m.Login })));
const Dashboard = lazy(() => import('./pages/admin/dashboard/Dashboard').then((m) => ({ default: m.Dashboard })));
const JobsPage = lazy(() => import('./pages/admin/jobs/jobsPage').then((m) => ({ default: m.JobsPage })));
const Event = lazy(() => import('./pages/admin/events/Event').then((m) => ({ default: m.Event })));
const BlogManager = lazy(() => import('./pages/admin/blog/BlogManager').then((m) => ({ default: m.BlogManager })));
const ServicesManager = lazy(() => import('./pages/admin/services/ServicesManager').then((m) => ({ default: m.ServicesManager })));
const PortfolioManager = lazy(() => import('./pages/admin/portfolio/PortfolioManager').then((m) => ({ default: m.PortfolioManager })));
const TestimonialsManager = lazy(() => import('./pages/admin/testimonials/TestimonialsManager').then((m) => ({ default: m.TestimonialsManager })));
const TeamManager = lazy(() => import('./pages/admin/team/TeamManager').then((m) => ({ default: m.TeamManager })));
const PageContentManager = lazy(() => import('./pages/admin/page-content/PageContentManager').then((m) => ({ default: m.PageContentManager })));
const ContactMessagesManager = lazy(() => import('./pages/admin/contact/ContactMessagesManager').then((m) => ({ default: m.ContactMessagesManager })));
const ApplicationsManager = lazy(() => import('./pages/admin/applications/ApplicationsManager').then((m) => ({ default: m.ApplicationsManager })));
const SiteSettingsManager = lazy(() => import('./pages/admin/settings/SiteSettingsManager').then((m) => ({ default: m.SiteSettingsManager })));

// Petit indicateur de chargement pour le Suspense admin - reste sobre et
// coherent avec la charte (bleu OpenTek) sans dependre d'un CSS lourd.
function AdminLoading() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif', color: '#5a5a5a' }}>
      Chargement...
    </div>
  );
}

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* --- Site public : prefixe par langue /fr ou /en --- */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="/:lang" element={<LanguageLayout />}>
          <Route element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="jobs" element={<JobsPublicPage />} />
            <Route path="events" element={<EventsPublicPage />} />
            <Route path="blog" element={<BlogListPage />} />
            <Route path="blog/:slug" element={<BlogPostPage />} />
            <Route path="contact" element={<Contact />} />
            <Route path="legal" element={<LegalPage />} />
            <Route path="*" element={<NotFoundPage />} />
            {/* Dynamic route */}
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />

        {/* --- Backoffice --- */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="events" element={<Event />} />
          <Route path="blog" element={<BlogManager />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="portfolio" element={<PortfolioManager />} />
          <Route path="testimonials" element={<TestimonialsManager />} />
          <Route path="team" element={<TeamManager />} />
          <Route path="page-content" element={<PageContentManager />} />
          <Route path="contact-messages" element={<ContactMessagesManager />} />
          <Route path="applications" element={<ApplicationsManager />} />
          <Route path="settings" element={<SiteSettingsManager />} />
        </Route>
      </>
    )
  );

  return (
    <AuthProvider>
      <Suspense fallback={<AdminLoading />}>
        <RouterProvider router={router} />
      </Suspense>
    </AuthProvider>
  );
}

export default App;
