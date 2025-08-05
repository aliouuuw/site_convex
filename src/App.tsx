import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import EditProvider from "./components/EditProvider";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";
import InscriptionPage from "./pages/InscriptionPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import PreschoolPage from "./pages/PreschoolPage";
import PrimaryPage from "./pages/PrimaryPage";
import MiddleschoolPage from "./pages/MiddleschoolPage";
import GalleryPage from "./pages/GalleryPage";
import EquipePage from "./pages/EquipePage";
// Admin pages
import BlogAdminPage from "./pages/admin/BlogAdminPage";
import BlogEditorPage from "./pages/admin/BlogEditorPage";
import MediaAdminPage from "./pages/admin/MediaAdminPage";
import TeamAdminPage from "./pages/admin/TeamAdminPage";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <EditProvider>
        <div className="min-h-screen antialiased">
          <Navigation />
          <main>
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

              {/* Admin Routes */}
              <Route path="/admin" element={<BlogAdminPage />} />
              <Route path="/admin/blog" element={<BlogAdminPage />} />
              <Route path="/admin/blog/create" element={<BlogEditorPage />} />
              <Route path="/admin/blog/edit/:slug" element={<BlogEditorPage />} />
              <Route path="/admin/media" element={<MediaAdminPage />} />
              <Route path="/admin/team" element={<TeamAdminPage />} />

              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
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
