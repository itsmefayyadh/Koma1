// src/pages/BarangMasukPage.jsx
import { useState } from "react";

export default function BarangMasukPage() {
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    tanggal: today,
    barang: "",
    jumlah: 1,
    supplier: "",
    catatan: "",
  });

  // sementara simpan di state lokal (belum konek backend)
  const [transaksiList, setTransaksiList] = useState([]);

  // opsi dummy, nanti bisa diganti dari API / master barang & supplier
  const barangOptions = [
    "Kertas A4 70gsm",
    "Pulpen Hitam",
    "Mouse Wireless",
    "Kursi Kantor",
  ];

  const supplierOptions = ["Supplier A", "Supplier B", "Supplier C"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "jumlah" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.barang || !form.supplier) {
      alert("Barang dan supplier wajib dipilih.");
      return;
    }

    const newTrx = {
      id: Date.now(),
      tanggal: form.tanggal,
      barang: form.barang,
      jumlah: form.jumlah || 0,
      supplier: form.supplier,
      catatan: form.catatan,
    };

    setTransaksiList((prev) => [newTrx, ...prev]);

    // reset jumlah & catatan, tanggal dan pilihan tetap
    setForm((prev) => ({
      ...prev,
      jumlah: 1,
      catatan: "",
    }));
  };

  const totalTransaksi = transaksiList.length;

  return (
    <div className="page">
      {/* Header section */}
      <div className="page-section-header">
        <h1 className="page-section-title">Barang Masuk</h1>
        <p className="page-section-subtitle">
          Catat setiap barang yang diterima dari supplier.
        </p>
      </div>

      <div className="page-grid-2">
        {/* KIRI: INPUT BARANG MASUK */}
        <div className="form-card">
          <div className="form-card-header">
            <h2 className="form-card-title">Input Barang Masuk</h2>
            <p className="form-card-subtitle">
              Isi detail barang masuk kemudian klik <b>Simpan Transaksi</b>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label>Tanggal Masuk</label>
              <input
                type="date"
                name="tanggal"
                value={form.tanggal}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Barang</label>
              <select
                name="barang"
                value={form.barang}
                onChange={handleChange}
                required
              >
                <option value="">-- Pilih Barang --</option>
                {barangOptions.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group-inline">
              <div className="form-group">
                <label>Jumlah</label>
                <input
                  type="number"
                  name="jumlah"
                  min="1"
                  value={form.jumlah}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Supplier</label>
                <select
                  name="supplier"
                  value={form.supplier}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Pilih Supplier --</option>
                  {supplierOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Catatan (opsional)</label>
              <input
                type="text"
                name="catatan"
                value={form.catatan}
                onChange={handleChange}
                placeholder="Contoh: Untuk persediaan bulan Desember"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Simpan Transaksi
              </button>
            </div>
          </form>
        </div>

        {/* KANAN: RIWAYAT BARANG MASUK */}
        <div className="table-card">
          <div className="table-card-header">
            <div className="table-card-title">
              Riwayat Barang Masuk{" "}
              <span className="table-card-title-count">
                (Total: {totalTransaksi} transaksi)
              </span>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Tanggal</th>
                  <th>Barang</th>
                  <th>Jumlah</th>
                  <th>Supplier</th>
                  <th>Catatan</th>
                </tr>
              </thead>
              <tbody>
                {transaksiList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        textAlign: "center",
                        fontSize: "12px",
                        color: "#6b7280",
                      }}
                    >
                      Belum ada transaksi barang masuk. Tambahkan transaksi
                      melalui form di sebelah kiri.
                    </td>
                  </tr>
                ) : (
                  transaksiList.map((trx, index) => (
                    <tr key={trx.id}>
                      <td>{index + 1}</td>
                      <td>{trx.tanggal}</td>
                      <td>{trx.barang}</td>
                      <td>
                        <span className="badge-stock">{trx.jumlah}</span>
                      </td>
                      <td>{trx.supplier}</td>
                      <td>{trx.catatan || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            {transaksiList.length === 0
              ? "Belum ada data ditampilkan."
              : `Menampilkan 1 sampai ${transaksiList.length} dari ${transaksiList.length} transaksi`}
          </div>
        </div>
      </div>
    </div>
  );
}
