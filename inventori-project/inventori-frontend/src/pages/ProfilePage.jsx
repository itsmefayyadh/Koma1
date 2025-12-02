// src/pages/ProfilePage.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProfilePage() {
  const { user, updateProfile, updatePassword } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "staff",
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({
        name: profileForm.name,
        // kalau nanti email bisa diganti, tinggal tambahkan: email: profileForm.email
      });
      alert("Profil berhasil diperbarui.");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan profil.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Konfirmasi password baru tidak sama.");
      return;
    }

    setSavingPassword(true);
    try {
      await updatePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      alert("Password berhasil diubah (dummy).");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      alert("Gagal mengubah password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const initial = (user?.name || "U").charAt(0).toUpperCase();
  const roleLabel =
    user?.role === "admin"
      ? "Administrator"
      : user?.role === "staff"
      ? "Staff"
      : "Pengguna";

  return (
    <div className="page">
      <div className="page-section-header">
        <h1 className="page-section-title">Profil Akun</h1>
        <p className="page-section-subtitle">
          Kelola informasi akun dan keamanan login Anda.
        </p>
      </div>

      <div className="page-grid-2 profile-grid">
        {/* CARD PROFIL */}
        <div className="form-card">
          <div className="form-card-header profile-header">
            <div className="profile-avatar">{initial}</div>
            <div>
              <h2 className="form-card-title">
                {profileForm.name || "Pengguna"}
              </h2>
              <p className="form-card-subtitle">
                <span className="profile-role-badge">{roleLabel}</span>
              </p>
            </div>
          </div>

          <form className="form-grid" onSubmit={handleSaveProfile}>
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input
                type="text"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                placeholder="Nama lengkap anda"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profileForm.email}
                readOnly     // kalau mau bisa diubah, hapus readOnly & disabled
                disabled
              />
              <small className="profile-hint">
                Email tidak dapat diubah dari aplikasi ini.
              </small>
            </div>

            <div className="form-group">
              <label>Role</label>
              <input type="text" value={roleLabel} readOnly disabled />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={savingProfile}
              >
                {savingProfile ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>

        {/* CARD PASSWORD */}
        <div className="form-card">
          <div className="form-card-header">
            <h2 className="form-card-title">Keamanan & Password</h2>
            <p className="form-card-subtitle">
              Ganti password Anda secara berkala untuk menjaga keamanan akun.
            </p>
          </div>

          <form className="form-grid" onSubmit={handleSavePassword}>
            <div className="form-group">
              <label>Password Lama</label>
              <input
                type="password"
                name="oldPassword"
                value={passwordForm.oldPassword}
                onChange={handlePasswordChange}
                placeholder="Masukkan password lama"
                required
              />
            </div>

            <div className="form-group">
              <label>Password Baru</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="Minimal 6 karakter"
                required
              />
            </div>

            <div className="form-group">
              <label>Konfirmasi Password Baru</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Ulangi password baru"
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={savingPassword}
              >
                {savingPassword ? "Memproses..." : "Ubah Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
