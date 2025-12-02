// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // { id, name, email, role }
  const [loading, setLoading] = useState(true);

  // Ambil user dari localStorage saat pertama kali load
  useEffect(() => {
    const saved = localStorage.getItem("inventori_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      } catch {
        localStorage.removeItem("inventori_user");
      }
    }
    setLoading(false);
  }, []);

  // === LOGIN DUMMY (TANPA BACKEND) ===
  const login = async (email, password) => {
    // kamu bisa bebas ubah kombinasi ini
    let loggedUser = null;

    if (email === "admin@example.com" && password === "admin123") {
      loggedUser = {
        id: 1,
        name: "Admin",
        email,
        role: "admin",
      };
    } else if (email === "staff@example.com" && password === "staff123") {
      loggedUser = {
        id: 2,
        name: "Staff",
        email,
        role: "staff",
      };
    } else {
      // kalau salah, lempar error biar bisa ditangkap di LoginPage
      throw new Error("INVALID_CREDENTIAL");
    }

    setUser(loggedUser);
    localStorage.setItem("inventori_user", JSON.stringify(loggedUser));
  };

  const logout = async () => {
    localStorage.removeItem("inventori_user");
    setUser(null);
  };

  // === UPDATE PROFIL (dummy, hanya di frontend) ===
  const updateProfile = async (partial) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial };
      localStorage.setItem("inventori_user", JSON.stringify(updated));
      return updated;
    });
  };

  // === UPDATE PASSWORD (dummy, belum ke backend) ===
  const updatePassword = async ({ oldPassword, newPassword }) => {
    // Di sini belum ada cek password lama karena belum ada backend.
    // Nanti kalau sudah ada API, tinggal panggil endpoint:
    // await api.post("/change-password", { oldPassword, newPassword });
    console.log("Dummy change password:", { oldPassword, newPassword });
    return true;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, updateProfile, updatePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}