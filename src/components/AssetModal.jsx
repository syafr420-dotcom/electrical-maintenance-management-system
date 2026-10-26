/**
 * ============================================================
 * AssetModal.jsx - Form Modal Tambah & Edit Aset Kelistrikan
 * ============================================================
 * 
 * PENJELASAN UNTUK SISWA SMK TITL:
 * Komponen ini adalah formulir interaktif (dialog modal) untuk:
 * 1. Memasukkan aset kelistrikan baru (mode Tambah).
 * 2. Mengubah spesifikasi aset yang sudah terdaftar (mode Edit).
 * 
 * Data form dikendalikan oleh "React State" (useState),
 * yang bertindak seperti sakelar memori sementara sebelum
 * data ditekan tombol "Simpan" ke LocalStorage.
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { X, Zap, Save, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  'Transformator',
  'Panel Distribusi',
  'Motor Listrik',
  'Pembangkit / Backup',
  'Koreksi Faktor Daya',
  'Instalasi Penerangan',
  'Proteksi & Grounding',
  'Lainnya',
];

const STATUS_OPTIONS = [
  { value: 'operational', label: 'Operasional (Normal)' },
  { value: 'warning', label: 'Perhatian (Perlu Dipantau)' },
  { value: 'in-progress', label: 'Dikerjakan (Dalam Pemeliharaan)' },
  { value: 'critical', label: 'Kritis (Perlu Tindakan Segera)' },
];

export default function AssetModal({ isOpen, onClose, onSave, assetToEdit }) {
  // State untuk menyimpan nilai input formulir
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'Panel Distribusi',
    location: '',
    voltageLevel: 'TR (3 Fasa 380/220 V)',
    capacity: '',
    status: 'operational',
    installDate: '',
    lastCheck: '',
    notes: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  // Sinkronisasi data saat modal dibuka untuk mode Edit atau Tambah
  useEffect(() => {
    if (assetToEdit) {
      setFormData(assetToEdit);
    } else {
      // Mode Tambah Baru: buat ID otomatis sederhana berdasarkan timestamp
      const randomNum = Math.floor(100 + Math.random() * 900);
      setFormData({
        id: `AST-${randomNum}`,
        name: '',
        category: 'Panel Distribusi',
        location: '',
        voltageLevel: 'TR (3 Fasa 380/220 V)',
        capacity: '',
        status: 'operational',
        installDate: new Date().toISOString().split('T')[0],
        lastCheck: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
    setErrorMessage('');
  }, [assetToEdit, isOpen]);

  if (!isOpen) return null;

  // Handler perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler submit simpan data
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi sederhana: nama dan lokasi tidak boleh kosong
    if (!formData.name.trim()) {
      setErrorMessage('Nama peralatan listrik wajib diisi!');
      return;
    }
    if (!formData.location.trim()) {
      setErrorMessage('Lokasi penempatan peralatan wajib diisi!');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      {/* Konten Kotak Dialog Modal */}
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat mengklik dalam kotak
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon">
              <Zap size={20} />
            </div>
            <div>
              <h2 className="modal-title">
                {assetToEdit ? 'Edit Spesifikasi Aset' : 'Tambah Aset Listrik Baru'}
              </h2>
              <p className="modal-subtitle">
                {assetToEdit
                  ? `Mengubah data teknis untuk kode ${assetToEdit.id}`
                  : 'Daftarkan peralatan kelistrikan baru ke dalam inventaris EMMS'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Tutup form"
          >
            <X size={20} />
          </button>
        </div>

        {errorMessage && (
          <div className="form-error-banner">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            
            {/* Tag ID Aset */}
            <div className="form-group">
              <label className="form-label" htmlFor="id">Kode Tag Aset</label>
              <input
                id="id"
                name="id"
                type="text"
                className="form-input"
                value={formData.id}
                onChange={handleChange}
                placeholder="misal: AST-010"
                required
              />
            </div>

            {/* Status Operasional */}
            <div className="form-group">
              <label className="form-label" htmlFor="status">Status Operasional</label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Nama Peralatan (Spanning 2 kolom) */}
            <div className="form-group span-2">
              <label className="form-label" htmlFor="name">Nama Peralatan Listrik</label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="misal: Motor Induksi 3 Fasa Pompa Sirkulasi"
                required
              />
            </div>

            {/* Kategori Peralatan */}
            <div className="form-group">
              <label className="form-label" htmlFor="category">Kategori Peralatan</label>
              <select
                id="category"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Lokasi Fisik */}
            <div className="form-group">
              <label className="form-label" htmlFor="location">Lokasi Penempatan</label>
              <input
                id="location"
                name="location"
                type="text"
                className="form-input"
                value={formData.location}
                onChange={handleChange}
                placeholder="misal: Gardu Trafo 2 / Ruang Panel"
                required
              />
            </div>

            {/* Level Tegangan */}
            <div className="form-group">
              <label className="form-label" htmlFor="voltageLevel">Level Tegangan Kerja</label>
              <input
                id="voltageLevel"
                name="voltageLevel"
                type="text"
                className="form-input"
                value={formData.voltageLevel}
                onChange={handleChange}
                placeholder="misal: TR 380V atau TM 20kV"
              />
            </div>

            {/* Kapasitas / Daya */}
            <div className="form-group">
              <label className="form-label" htmlFor="capacity">Kapasitas / Rating Arus</label>
              <input
                id="capacity"
                name="capacity"
                type="text"
                className="form-input"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="misal: 15 kW / 400 kVA / 250A"
              />
            </div>

            {/* Tanggal Pemasangan */}
            <div className="form-group">
              <label className="form-label" htmlFor="installDate">Tanggal Pemasangan</label>
              <input
                id="installDate"
                name="installDate"
                type="date"
                className="form-input"
                value={formData.installDate}
                onChange={handleChange}
              />
            </div>

            {/* Tanggal Terakhir Pengecekan */}
            <div className="form-group">
              <label className="form-label" htmlFor="lastCheck">Pengecekan Terakhir</label>
              <input
                id="lastCheck"
                name="lastCheck"
                type="date"
                className="form-input"
                value={formData.lastCheck}
                onChange={handleChange}
              />
            </div>

            {/* Catatan Teknis / Spesifikasi Tambahan */}
            <div className="form-group span-2">
              <label className="form-label" htmlFor="notes">Catatan Teknis & Proteksi</label>
              <textarea
                id="notes"
                name="notes"
                className="form-textarea"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                placeholder="misal: Rating breaker MCB 3x25A, kabel NYY 4x6mm², setting thermal overload 18A."
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <Save size={16} />
              {assetToEdit ? 'Simpan Perubahan' : 'Tambahkan Aset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
