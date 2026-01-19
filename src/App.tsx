import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import EditProvider from "./components/EditProvider";
import AuthGuard from "./components/AuthGuard";

const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const InscriptionPage = lazy(() => import("./pages/InscriptionPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage"));
const PreschoolPage = lazy(() => import("./pages/PreschoolPage"));
const PrimaryPage = lazy(() => import("./pages/PrimaryPage"));
const MiddleschoolPage = lazy(() => import("./pages/MiddleschoolPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const EquipePage = lazy(() => import("./pages/EquipePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
// Admin pages
const BlogAdminPage = lazy(() => import("./pages/admin/BlogAdminPage"));
const BlogEditorPage = lazy(() => import("./pages/admin/BlogEditorPage"));
const TestimonialsAdminPage = lazy(
  () => import("./pages/admin/TestimonialsAdminPage")
);
const MediaAdminPage = lazy(() => import("./pages/admin/MediaAdminPage"));
const TeamAdminPage = lazy(() => import("./pages/admin/TeamAdminPage"));
const TimelineAdminPage = lazy(() => import("./pages/admin/TimelineAdminPage"));

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <EditProvider>
        <div className="min-h-screen antialiased">
          <Navigation />
          <main>
            <Suspense
              fallback={
                <div className="min-h-[60vh] w-full flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-gray-200 border-t-[var(--primary)] rounded-full animate-spin" />
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/histoire" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/inscription" element={<InscriptionPage />} />

                {/* Blog Routes */}
                <Route path="/journal" element={<BlogPage />} />
                <Route path="/journal/:slug" element={<BlogDetailPage />} />

                {/* Program Routes */}
                <Route path="/programs/preschool" element={<PreschoolPage />} />
                <Route path="/programs/primary" element={<PrimaryPage />} />
                <Route
                  path="/programs/middleschool"
                  element={<MiddleschoolPage />}
                />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/equipe" element={<EquipePage />} />

                {/* Authentication Route */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <AuthGuard requireAdmin={true}>
                      <BlogAdminPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/admin/blog"
                  element={
                    <AuthGuard requireAdmin={true}>
                      <BlogAdminPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/admin/blog/create"
                  element={
                    <AuthGuard requireAdmin={true}>
                      <BlogEditorPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/admin/blog/edit/:slug"
                  element={
                    <AuthGuard requireAdmin={true}>
                      <BlogEditorPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/admin/testimonials"
                  element={
                    <AuthGuard requireAdmin={true}>
                      <TestimonialsAdminPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/admin/timeline"
                  element={
                    <AuthGuard requireAdmin={true}>
                      <TimelineAdminPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/admin/media"
                  element={
                    <AuthGuard requireAdmin={true}>
                      <MediaAdminPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/admin/team"
                  element={
                    <AuthGuard requireAdmin={true}>
                      <TeamAdminPage />
                    </AuthGuard>
                  }
                />

                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </EditProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </Router>
  );
}
