import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout.jsx";

import HomePage from "../pages/Home/HomePage.jsx";
import SearchPage from "../pages/Search/SearchPage.jsx";
import LyricsPage from "../pages/Lyrics/LyricsPage.jsx";
import AboutPage from "../pages/About/AboutPage.jsx";
import NotFoundPage from "../pages/NotFound/NotFoundPage.jsx";
import SongUploadPage from "../pages/Admin/SongUploadPage.jsx";
import AdminLoginPage from "../pages/Admin/AdminLoginPage.jsx";
import AdminDashboardPage from "../pages/Admin/AdminDashboardPage.jsx";
import AllLyricsPage from "../pages/Admin/AllLyricsPage.jsx";

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

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/songs/new" element={<SongUploadPage />} />
      <Route path="/admin/songs" element={<AllLyricsPage />} />
    </Routes>
  );
}

export default AppRoutes;
