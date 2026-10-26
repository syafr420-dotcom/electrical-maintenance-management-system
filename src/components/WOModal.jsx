/**
 * ============================================================
 * WOModal.jsx - Form Pembuatan & Edit Surat Perintah Kerja (WO)
 * ============================================================
 * 
 * PENJELASAN UNTUK SISWA SMK TITL:
 * Saat ada laporan kerusakan dari bengkel produksi atau gedung,
 * pengawas instalasi listrik membuat Work Order (WO) untuk:
 * 1. Mendeskripsikan secara jelas apa gejala kerusakannya.
 * 2. Menentukan tingkat bahaya/urgensinya (misal: "Darurat" jika ada resiko kebakaran).
 * 3. Menugaskan teknisi instalatur TITL tertentu untuk menanganinya.
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { X, ClipboardList, Save, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  'Perbaikan Korektif',
  'Darurat (Emergency)',
  'Pemeliharaan Rutin',
  'Modifikasi & Upgrade',
  'Instalasi Baru',
];

const PRIORITIES = [
  { value: 'Darurat', label: 'Darurat (Bahaya Sengatan / Padam Total)' },
  { value: 'Tinggi', label: 'Tinggi (Beban Utama Trip / Terganggu)' },
  { value: 'Normal', label: 'Normal (Penerangan / Stop Kontak)' },
  { value: 'Rendah', label: 'Rendah (Penyempurnaan Fisik / Label)' },
];

const STATUSES = [
  { value: 'open', label: 'Open (Menunggu Ditangani)' },
  { value: 'in-progress', label: 'In-Progress (Sedang Dikerjakan)' },
  { value: 'completed', label: 'Completed (Selesai & Normal)' },
  { value: 'cancelled', label: 'Cancelled (Dibatalkan)' },
];

export default function WOModal({ isOpen, onClose, onSave, woToEdit, availableAssets }) {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    assetId: '',
    assetName: '',
    category: 'Perbaikan Korektif',
    priority: 'Tinggi',
    status: 'open',
    reportedBy: '',
    assignedTo: '',
    dueDate: '',
    problemDescription: '',
    sparePartsUsed: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (woToEdit) {
      setFormData(woToEdit);
    } else {
      const randomNum = Math.floor(100 + Math.random() * 900);
      const defaultAsset = availableAssets[0] || { id: '', name: '' };

      setFormData({
        id: `WO-${randomNum}`,
        title: '',
        assetId: defaultAsset.id,
        assetName: defaultAsset.name,
        category: 'Perbaikan Korektif',
        priority: 'Tinggi',
        status: 'open',
        reportedBy: 'Operator Lapangan',
        assignedTo: 'Ahmad Riyadi (Teknisi TITL)',
        createdDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Besok
        problemDescription: '',
        actionTaken: '',
        sparePartsUsed: '',
      });
    }
    setErrorMessage('');
  }, [woToEdit, isOpen, availableAssets]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

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
      setErrorMessage('Judul perintah kerja wajib diisi!');
      return;
    }
    if (!formData.assetId) {
      setErrorMessage('Peralatan yang bermasalah wajib dipilih!');
      return;
    }
    if (!formData.problemDescription.trim()) {
      setErrorMessage('Uraian gejala kerusakan wajib dijelaskan agar teknisi memahami masalah!');
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
            <div className="modal-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <ClipboardList size={20} />
            </div>
            <div>
              <h2 className="modal-title">
                {woToEdit ? 'Edit Tiket Work Order' : 'Terbitkan Work Order Baru'}
              </h2>
              <p className="modal-subtitle">
                {woToEdit
                  ? `Mengubah rincian perintah kerja ${woToEdit.id}`
                  : 'Catat laporan gangguan teknis dan tugaskan teknisi penanggung jawab'}
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
            
            {/* ID Work Order */}
            <div className="form-group">
              <label className="form-label" htmlFor="id">Kode Tiket WO</label>
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

            {/* Status Penanganan */}
            <div className="form-group">
              <label className="form-label" htmlFor="status">Status Tiket</label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                {STATUSES.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Judul Kerusakan / Masalah (Span 2) */}
            <div className="form-group span-2">
              <label className="form-label" htmlFor="title">Judul Masalah / Kerusakan</label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                placeholder="misal: MCB 3 Fasa Trip Berulang saat Beban Penuh"
                required
              />
            </div>

            {/* Pilihan Aset yang Mengalami Gangguan (Span 2) */}
            <div className="form-group span-2">
              <label className="form-label" htmlFor="assetId">Peralatan / Panel yang Bermasalah</label>
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

            {/* Kategori Kerusakan */}
            <div className="form-group">
              <label className="form-label" htmlFor="category">Kategori Perintah Kerja</label>
              <select
                id="category"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Tingkat Urgensi / Prioritas */}
            <div className="form-group">
              <label className="form-label" htmlFor="priority">Tingkat Urgensi</label>
              <select
                id="priority"
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Nama Pelapor */}
            <div className="form-group">
              <label className="form-label" htmlFor="reportedBy">Dilaporkan Oleh</label>
              <input
                id="reportedBy"
                name="reportedBy"
                type="text"
                className="form-input"
                value={formData.reportedBy}
                onChange={handleChange}
                placeholder="misal: Operator Bengkel Las"
                required
              />
            </div>

            {/* Teknisi Bertugas */}
            <div className="form-group">
              <label className="form-label" htmlFor="assignedTo">Teknisi Bertugas (Assigned)</label>
              <input
                id="assignedTo"
                name="assignedTo"
                type="text"
                className="form-input"
                value={formData.assignedTo}
                onChange={handleChange}
                placeholder="misal: Ahmad Riyadi (Teknisi TITL)"
                required
              />
            </div>

            {/* Target Tanggal Penyelesaian */}
            <div className="form-group">
              <label className="form-label" htmlFor="dueDate">Batas Target Selesai (Due Date)</label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                className="form-input"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Estimasi Suku Cadang */}
            <div className="form-group">
              <label className="form-label" htmlFor="sparePartsUsed">Suku Cadang / Material</label>
              <input
                id="sparePartsUsed"
                name="sparePartsUsed"
                type="text"
                className="form-input"
                value={formData.sparePartsUsed || ''}
                onChange={handleChange}
                placeholder="misal: MCB 3P 40A, Kabel NYM 3x4mm²"
              />
            </div>

            {/* Uraian Gejala Kerusakan (Span 2) */}
            <div className="form-group span-2">
              <label className="form-label" htmlFor="problemDescription">Uraian Masalah & Gejala Kerusakan</label>
              <textarea
                id="problemDescription"
                name="problemDescription"
                className="form-textarea"
                rows="3"
                value={formData.problemDescription}
                onChange={handleChange}
                placeholder="Jelaskan secara detail: Apakah timbul percikan bunga api, bau terbakar, bunyi mendengung, atau trip saat start motor?"
                required
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              {woToEdit ? 'Simpan Perubahan Tiket' : 'Terbitkan Work Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
