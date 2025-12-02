// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import BarangPage from "./pages/BarangPage.jsx";
import BarangMasukPage from "./pages/BarangMasukPage.jsx";
import BarangKeluarPage from "./pages/BarangKeluarPage.jsx";
import LaporanPage from "./pages/LaporanPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

function App() {
  return (
    <Routes>
      {/* Halaman login (tanpa layout) */}
      <Route path="/login" element={<LoginPage />} />

      {/* Semua halaman yang butuh login dibungkus ProtectedRoute + Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard jadi index (/) */}
        <Route index element={<DashboardPage />} />

        {/* Master data */}
        <Route path="barang" element={<BarangPage />} />

        {/* Transaksi */}
        <Route path="barang-masuk" element={<BarangMasukPage />} />
        <Route path="barang-keluar" element={<BarangKeluarPage />} />

        {/* Laporan */}
        <Route path="laporan" element={<LaporanPage />} />

        {/* Profil user (admin/staff) */}
        <Route path="profil" element={<ProfilePage />} />
      </Route>

      {/* Fallback kalau user ke path yang nggak dikenali */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
