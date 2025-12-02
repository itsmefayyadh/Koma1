// src/pages/BarangPage.jsx
import { useState } from "react";

export default function BarangPage() {
  const [form, setForm] = useState({
    nama: "",
    kode: "",
    kategori: "",
    stokAwal: 0,
    satuan: "pcs",
    hargaBeli: "",
    hargaJual: "",
  });

  // sementara simpan di state lokal (belum konek backend)
  const [barangList, setBarangList] = useState([]);

  const kategoriOptions = [
    "ATK",
    "Elektronik",
    "Furniture",
    "Kebersihan",
    "Lainnya",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // validasi sederhana
    if (!form.nama || !form.kode || !form.kategori) {
      alert("Nama, kode dan kategori wajib diisi.");
      return;
    }

    const newItem = {
      id: Date.now(),
      nama: form.nama,
      kode: form.kode,
      kategori: form.kategori,
      stokAwal: Number(form.stokAwal) || 0,
      satuan: form.satuan || "pcs",
      hargaBeli: Number(form.hargaBeli) || 0,
      hargaJual: Number(form.hargaJual) || 0,
    };

    setBarangList((prev) => [...prev, newItem]);

    // reset form
    setForm({
      nama: "",
      kode: "",
      kategori: "",
      stokAwal: 0,
      satuan: "pcs",
      hargaBeli: "",
      hargaJual: "",
    });
  };

  const totalBarang = barangList.length;

  return (
    <div className="page">
      {/* Header section */}
      <div className="page-section-header">
        <h1 className="page-section-title">Data Barang</h1>
        <p className="page-section-subtitle">
          Kelola master barang untuk kebutuhan transaksi.
        </p>
      </div>

      {/* Dua kolom: kiri form, kanan tabel */}
      <div className="page-grid-2">
        {/* KIRI: FORM TAMBAH BARANG */}
        <div className="form-card">
          <div className="form-card-header">
            <h2 className="form-card-title">Tambah Barang</h2>
            <p className="form-card-subtitle">
              Isi data barang dengan lengkap, kemudian klik <b>Tambah</b>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label>Nama Barang</label>
              <input
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Contoh: Kertas A4 70gsm"
                required
              />
            </div>

            <div className="form-group">
              <label>Kode Barang</label>
              <input
                type="text"
                name="kode"
                value={form.kode}
                onChange={handleChange}
                placeholder="Contoh: BRG-001"
                required
              />
            </div>

            <div className="form-group">
              <label>Kategori</label>
              <select
                name="kategori"
                value={form.kategori}
                onChange={handleChange}
                required
              >
                <option value="">-- Pilih Kategori --</option>
                {kategoriOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group-inline">
              <div className="form-group">
                <label>Stok Awal</label>
                <input
                  type="number"
                  name="stokAwal"
                  value={form.stokAwal}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Satuan</label>
                <input
                  type="text"
                  name="satuan"
                  value={form.satuan}
                  onChange={handleChange}
                  placeholder="pcs / box / unit"
                />
              </div>
            </div>

            <div className="form-group-inline">
              <div className="form-group">
                <label>Harga Beli</label>
                <input
                  type="number"
                  name="hargaBeli"
                  value={form.hargaBeli}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Harga Jual</label>
                <input
                  type="number"
                  name="hargaJual"
                  value={form.hargaJual}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Tambah Barang
              </button>
            </div>
          </form>
        </div>

        {/* KANAN: DAFTAR BARANG */}
        <div className="table-card">
          <div className="table-card-header">
            <div className="table-card-title">
              Daftar Barang{" "}
              <span className="table-card-title-count">
                (Total: {totalBarang} data)
              </span>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Kode</th>
                  <th>Nama Barang</th>
                  <th>Kategori</th>
                  <th>Stok</th>
                  <th>Satuan</th>
                  <th>Harga Beli</th>
                  <th>Harga Jual</th>
                </tr>
              </thead>
              <tbody>
                {barangList.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", fontSize: "12px", color: "#6b7280" }}>
                      Belum ada barang yang terdaftar. Tambahkan barang melalui
                      form di sebelah kiri.
                    </td>
                  </tr>
                ) : (
                  barangList.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.kode}</td>
                      <td>{item.nama}</td>
                      <td>{item.kategori}</td>
                      <td>
                        <span className="badge-stock">{item.stokAwal}</span>
                      </td>
                      <td>{item.satuan}</td>
                      <td>Rp {item.hargaBeli.toLocaleString("id-ID")}</td>
                      <td>Rp {item.hargaJual.toLocaleString("id-ID")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            {barangList.length === 0
              ? "Belum ada data ditampilkan."
              : `Menampilkan 1 sampai ${barangList.length} dari ${barangList.length} data`}
          </div>
        </div>
      </div>
    </div>
  );
}
