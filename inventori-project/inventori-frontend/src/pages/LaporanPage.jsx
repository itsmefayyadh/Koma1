// src/pages/LaporanPage.jsx
import { useState } from "react";

export default function LaporanPage() {
  const today = new Date().toISOString().slice(0, 10);

  const [filter, setFilter] = useState({
    dari: today,
    sampai: today,
  });

  // nanti kalau sudah ada backend, rows ini diisi dari API
  const [rows] = useState([]); // sementara kosong dulu

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    // nanti di sini panggil API dengan filter.dari & filter.sampai
    console.log("Terapkan filter laporan:", filter);
  };

  const handleExportPdf = () => {
    // versi sederhana: pakai print browser
    window.print();
    // kalau mau lebih advanced bisa pakai jsPDF / backend PDF generator
  };

  const totalBaris = rows.length;

  return (
    <div className="page">
      {/* Header section */}
      <div className="page-section-header">
        <h1 className="page-section-title">Laporan Inventori</h1>
        <p className="page-section-subtitle">
          Lihat ringkasan stok akhir dan riwayat barang masuk/keluar untuk
          periode tertentu.
        </p>
      </div>

      {/* Card laporan */}
      <div className="table-card report-card">
        <div className="report-card-header">
          <div>
            <h2 className="report-card-title">Ringkasan Inventori</h2>
            <p className="report-card-subtitle">
              Pilih tanggal lalu klik <b>Terapkan</b>. Gunakan tombol{" "}
              <b>Export PDF</b> untuk menyimpan laporan.
            </p>
          </div>

          {/* Filter + tombol */}
          <form className="report-filter-bar" onSubmit={handleFilterSubmit}>
            <div className="report-filter-group">
              <label>Dari Tanggal</label>
              <input
                type="date"
                name="dari"
                value={filter.dari}
                onChange={handleFilterChange}
              />
            </div>

            <div className="report-filter-group">
              <label>Sampai Tanggal</label>
              <input
                type="date"
                name="sampai"
                value={filter.sampai}
                onChange={handleFilterChange}
              />
            </div>

            <div className="report-filter-actions">
              <button type="submit" className="btn-primary btn-sm">
                Terapkan
              </button>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={handleExportPdf}
              >
                Export PDF
              </button>
            </div>
          </form>
        </div>

        {/* Tabel ringkasan stok */}
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Nama Barang</th>
                <th>Kode</th>
                <th>Kuantitas</th>
                <th>Harga Rata-rata</th>
                <th>Nilai Stok</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      fontSize: "12px",
                      color: "#6b7280",
                    }}
                  >
                    Belum ada data laporan untuk periode ini. Data akan muncul
                    setelah Anda menambahkan barang dan transaksi.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.kode}>
                    <td>{row.nama}</td>
                    <td>{row.kode}</td>
                    <td>{row.qty}</td>
                    <td>Rp {row.hargaRata.toLocaleString("id-ID")}</td>
                    <td>Rp {row.nilaiStok.toLocaleString("id-ID")}</td>
                  </tr>
                ))
              )}
            </tbody>
            {rows.length > 0 && (
              <tfoot>
                <tr>
                  <th colSpan={2}>Total</th>
                  <th>
                    {rows.reduce((sum, r) => sum + r.qty, 0).toLocaleString(
                      "id-ID"
                    )}
                  </th>
                  <th></th>
                  <th>
                    Rp{" "}
                    {rows
                      .reduce((sum, r) => sum + r.nilaiStok, 0)
                      .toLocaleString("id-ID")}
                  </th>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        <div className="table-footer">
          {totalBaris === 0
            ? "Belum ada data ditampilkan."
            : `Menampilkan ${totalBaris} baris data.`}
        </div>
      </div>
    </div>
  );
}
