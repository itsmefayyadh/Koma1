// src/pages/DashboardPage.jsx
import { useAuth } from "../context/AuthContext.jsx";

export default function DashboardPage() {
  const { user } = useAuth();

  // Sementara: statistik default 0 (belum ada data)
  const totalBarang = 0;
  const totalMasuk = 0;
  const totalKeluar = 0;
  const jenisBarang = 0;
  const dataUser = 0;

  // Tabel stok minimum juga masih kosong
  const stokMin = []; // nanti diisi dari API kalau backend sudah siap

  return (
    <div className="page">
      {/* Header di dalam konten */}
      <div className="page-header-bar">
        <div className="page-header-icon">🏠</div>
        <div>
          <h1 className="page-header-title">Dashboard</h1>
          <p className="page-header-subtitle">
            Selamat datang, <strong>{user?.name || "Admin"}</strong>. Berikut
            ringkasan inventori kantor Anda.
          </p>
        </div>
      </div>

      {/* Kartu statistik atas */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon purple">📦</div>
          <div className="stat-info">
            <div className="stat-label">Data Barang</div>
            <div className="stat-value">{totalBarang}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">⬇️</div>
          <div className="stat-info">
            <div className="stat-label">Data Barang Masuk</div>
            <div className="stat-value">{totalMasuk}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">⬆️</div>
          <div className="stat-info">
            <div className="stat-label">Data Barang Keluar</div>
            <div className="stat-value">{totalKeluar}</div>
          </div>
        </div>
      </div>

      {/* Kartu statistik kedua baris */}
      <div className="stats-row">
        <div className="stat-card small">
          <div className="stat-icon yellow">🗂</div>
          <div className="stat-info">
            <div className="stat-label">Data Jenis Barang</div>
            <div className="stat-value">{jenisBarang}</div>
          </div>
        </div>

        <div className="stat-card small">
          <div className="stat-icon blue">👤</div>
          <div className="stat-info">
            <div className="stat-label">Data User</div>
            <div className="stat-value">{dataUser}</div>
          </div>
        </div>
      </div>

      {/* Tabel stok minimum */}
      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">
            Stok barang telah mencapai batas minimum
          </div>
          <div className="table-card-tools">
            <span className="table-small-label">Tampilkan</span>
            <select className="table-select" disabled>
              <option>10</option>
            </select>
            <span className="table-small-label">data</span>
            <div className="table-search-wrapper">
              <span className="table-small-label">Cari:</span>
              <input className="table-search" disabled />
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>No.</th>
                <th>ID Barang</th>
                <th>Nama Barang</th>
                <th>Jenis Barang</th>
                <th>Stok</th>
                <th>Satuan</th>
              </tr>
            </thead>

            {/* Kalau belum ada data, tampilkan 1 baris pesan kosong */}
            <tbody>
              {stokMin.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "#6b7280", fontSize: "12px" }}>
                    Belum ada data stok minimum. Data akan muncul setelah Anda
                    menambahkan barang dan mengatur stoknya.
                  </td>
                </tr>
              ) : (
                stokMin.map((row, index) => (
                  <tr key={row.id}>
                    <td>{index + 1}</td>
                    <td>{row.id}</td>
                    <td>{row.nama}</td>
                    <td>{row.jenis}</td>
                    <td>
                      <span className="badge-stock">{row.stok}</span>
                    </td>
                    <td>{row.satuan}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          {stokMin.length === 0
            ? "Belum ada data ditampilkan."
            : `Menampilkan 1 sampai ${stokMin.length} dari ${stokMin.length} data`}
        </div>
      </div>
    </div>
  );
}
