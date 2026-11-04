import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

import { useAuth } from "../context/AuthContext.jsx";

import HomePage from "../pages/Home/HomePage.jsx";
import SearchPage from "../pages/Search/SearchPage.jsx";
import LyricsPage from "../pages/Lyrics/LyricsPage.jsx";
import AboutPage from "../pages/About/AboutPage.jsx";
import NotFoundPage from "../pages/NotFound/NotFoundPage.jsx";

import AdminLoginPage from "../pages/Admin/AdminLoginPage.jsx";
import AdminDashboardPage from "../pages/Admin/AdminDashboardPage.jsx";
import SongUploadPage from "../pages/Admin/SongUploadPage.jsx";
import AllLyricsPage from "../pages/Admin/AllLyricsPage.jsx";
import EditSongPage from "../pages/Admin/EditSongPage.jsx";

function AdminLoginRoute() {
  const { isAuthenticated, loading, authError } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted">Checking authentication...</p>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <p className="text-sm text-muted">{authError}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return <AdminLoginPage />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/lyrics/:slug" element={<LyricsPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>

      {/* Admin login */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected admin routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/songs/new" element={<SongUploadPage />} />
          <Route path="/admin/songs" element={<AllLyricsPage />} />
          <Route path="/admin/songs/:slug/edit" element={<EditSongPage />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
