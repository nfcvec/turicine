import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import MoviesPage from "../pages/MoviesPage.jsx";
import MovieDetailPage from "../pages/MovieDetailPage.jsx";
import VenuesPage from "../pages/VenuesPage.jsx";
import CategoriesPage from "../pages/CategoriesPage.jsx";
import LeadsPage from "../pages/LeadsPage.jsx";
import SponsorsPage from "../pages/SponsorsPage.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movies" element={<MoviesPage />} />
      <Route path="/movies/:id" element={<MovieDetailPage />} />
      <Route path="/venues" element={<VenuesPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/leads" element={<LeadsPage />} />
      <Route path="/sponsors" element={<SponsorsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
