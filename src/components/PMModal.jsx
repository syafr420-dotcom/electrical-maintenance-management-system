/**
 * ============================================================
 * PMModal.jsx - Form Modal Tambah & Edit Jadwal PM
 * ============================================================
 * 
 * PENJELASAN UNTUK SISWA SMK TITL:
 * Komponen ini adalah lembar formulir pembuatan jadwal pemeliharaan rutin.
 * 
 * Hubungan Antar Modul:
 * Formulir ini mengambil daftar peralatan dari Modul 2 (Asset Management).
 * Ketika Anda memilih suatu aset (misal: "AST-001 Trafo"), sistem otomatis
 * menghubungkan jadwal ini ke aset tersebut.
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { X, Wrench, Save, AlertCircle } from 'lucide-react';

const FREQUENCIES = [
  'Mingguan',
  'Bulanan',
  'Triwulan (3 Bulan)',
  'Semester (6 Bulan)',
  'Tahunan',
];

const PRIORITIES = ['Rendah', 'Normal', 'Tinggi'];

const PM_STATUSES = [
  { value: 'scheduled', label: 'Terjadwal (Belum Mulai)' },
  { value: 'in-progress', label: 'Dikerjakan (Sedang Berjalan)' },
  { value: 'completed', label: 'Selesai (Completed)' },
  { value: 'overdue', label: 'Terlambat (Overdue)' },
];

export default function PMModal({ isOpen, onClose, onSave, pmToEdit, availableAssets }) {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    assetId: '',
    assetName: '',
    frequency: 'Bulanan',
    scheduledDate: '',
    assignee: '',
    priority: 'Normal',
    status: 'scheduled',
    notes: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  // Sinkronisasi data saat modal dibuka
  useEffect(() => {
    if (pmToEdit) {
      setFormData(pmToEdit);
    } else {
      // Inisialisasi jadwal baru
      const randomNum = Math.floor(100 + Math.random() * 900);
      const defaultAsset = availableAssets[0] || { id: '', name: '' };

      setFormData({
        id: `PM-${randomNum}`,
        title: '',
        assetId: defaultAsset.id,
        assetName: defaultAsset.name,
        frequency: 'Bulanan',
        scheduledDate: new Date().toISOString().split('T')[0],
        assignee: 'Ahmad Riyadi (Teknisi TITL)',
        priority: 'Normal',
        status: 'scheduled',
        notes: '',
        sopSteps: [
          { text: 'Pemeriksaan kelengkapan APD kelistrikan dan rambu K3.', done: false },
          { text: 'Pemasangan LOTO (Lock-Out Tag-Out) pada panel daya.', done: false },
          { text: 'Uji tegangan nol (Zero voltage test) sebelum eksekusi.', done: false },
          { text: 'Pembersihan dan pengukuran parameter listrik teknis.', done: false },
          { text: 'Pencatatan data hasil uji ke logbook pemeliharaan.', done: false },
        ],
      });
    }
    setErrorMessage('');
  }, [pmToEdit, isOpen, availableAssets]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Jika pengguna mengubah pilihan Aset, otomatis sinkronkan nama asetnya
    if (name === 'assetId') {
      const selected = availableAssets.find((a) => a.id === value);
      setFormData((prev) => ({
        ...prev,
        assetId: value,
        assetName: selected ? selected.name : '',
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setErrorMessage('Judul pemeliharaan wajib diisi!');
      return;
    }
    if (!formData.assetId) {
      setErrorMessage('Peralatan listrik yang dirawat wajib dipilih!');
      return;
    }
    if (!formData.scheduledDate) {
      setErrorMessage('Tanggal jadwal pelaksanaan wajib ditentukan!');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon">
              <Wrench size={20} />
            </div>
            <div>
              <h2 className="modal-title">
                {pmToEdit ? 'Edit Jadwal Pemeliharaan' : 'Buat Jadwal PM Baru'}
              </h2>
              <p className="modal-subtitle">
                {pmToEdit
                  ? `Mengubah jadwal pemeliharaan ${pmToEdit.id}`
                  : 'Rencanakan inspeksi rutin peralatan listrik sebelum terjadi kegagalan'}
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
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
            
            {/* ID Jadwal */}
            <div className="form-group">
              <label className="form-label" htmlFor="id">Kode Jadwal PM</label>
              <input
                id="id"
                name="id"
                type="text"
                className="form-input"
                value={formData.id}
                onChange={handleChange}
                required
              />
            </div>

            {/* Status Pelaksanaan */}
            <div className="form-group">
              <label className="form-label" htmlFor="status">Status Jadwal</label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                {PM_STATUSES.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Judul Tugas PM (Spanning 2 Kolom) */}
            <div className="form-group span-2">
              <label className="form-label" htmlFor="title">Nama Kegiatan Pemeliharaan</label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                placeholder="misal: Uji Tahanan Isolasi Megger Kabel Utama"
                required
              />
            </div>

            {/* Pilihan Aset Terdaftar */}
            <div className="form-group span-2">
              <label className="form-label" htmlFor="assetId">Pilih Peralatan / Panel Listrik</label>
              <select
                id="assetId"
                name="assetId"
                className="form-select"
                value={formData.assetId}
                onChange={handleChange}
                required
              >
                <option value="">-- Pilih Peralatan Terdaftar --</option>
                {availableAssets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    [{asset.id}] {asset.name} ({asset.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Frekuensi Rutin */}
            <div className="form-group">
              <label className="form-label" htmlFor="frequency">Siklus Frekuensi</label>
              <select
                id="frequency"
                name="frequency"
                className="form-select"
                value={formData.frequency}
                onChange={handleChange}
              >
                {FREQUENCIES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Prioritas */}
            <div className="form-group">
              <label className="form-label" htmlFor="priority">Tingkat Prioritas</label>
              <select
                id="priority"
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Tanggal Rencana Pelaksanaan */}
            <div className="form-group">
              <label className="form-label" htmlFor="scheduledDate">Tanggal Target Pelaksanaan</label>
              <input
                id="scheduledDate"
                name="scheduledDate"
                type="date"
                className="form-input"
                value={formData.scheduledDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Teknisi PIC */}
            <div className="form-group">
              <label className="form-label" htmlFor="assignee">Teknisi Penanggung Jawab (PIC)</label>
              <input
                id="assignee"
                name="assignee"
                type="text"
                className="form-input"
                value={formData.assignee}
                onChange={handleChange}
                placeholder="misal: Ahmad Riyadi (Teknisi TITL)"
                required
              />
            </div>

            {/* Catatan Instruksi Kerja */}
            <div className="form-group span-2">
              <label className="form-label" htmlFor="notes">Instruksi Kerja & Catatan Lapangan</label>
              <textarea
                id="notes"
                name="notes"
                className="form-textarea"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                placeholder="misal: Pastikan koordinasi dengan operator sebelum pemadaman."
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              {pmToEdit ? 'Simpan Perubahan Jadwal' : 'Tambahkan Jadwal PM'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
