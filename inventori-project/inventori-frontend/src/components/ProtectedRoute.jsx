// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // saat masih cek token / user -> boleh tampilkan "loading" sederhana
  if (loading) {
    return (
      <div style={{ padding: 32, textAlign: "center" }}>
        Memuat data pengguna...
      </div>
    );
  }

  // belum login -> lempar ke /login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // kalau butuh role tertentu (misal hanya admin)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // misal staff mencoba buka halaman khusus admin
    return <Navigate to="/" replace />;
  }

  return children;
}
