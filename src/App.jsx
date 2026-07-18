import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
//Pages
//aos libray
import 'aos/dist/aos.css';
//Stylesheet
import './App.css';
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
import { JobsPage } from './pages/admin/jobs/jobsPage';
import { Event } from './pages/admin/events/Event';

// Backoffice (admin)
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLayout } from './layout/admin/AdminLayout';
import { Login } from './pages/admin/login/Login';
import { Dashboard } from './pages/admin/dashboard/Dashboard';
import { BlogManager } from './pages/admin/blog/BlogManager';
import { ServicesManager } from './pages/admin/services/ServicesManager';
import { PortfolioManager } from './pages/admin/portfolio/PortfolioManager';
import { TestimonialsManager } from './pages/admin/testimonials/TestimonialsManager';
import { TeamManager } from './pages/admin/team/TeamManager';
import { PageContentManager } from './pages/admin/page-content/PageContentManager';
import { ContactMessagesManager } from './pages/admin/contact/ContactMessagesManager';
import { ApplicationsManager } from './pages/admin/applications/ApplicationsManager';

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
        </Route>
      </>
    )
  );

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
