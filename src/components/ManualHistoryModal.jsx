/**
 * ============================================================
 * ManualHistoryModal.jsx - Form Pencatatan Riwayat Pemeliharaan Manual
 * ============================================================
 * 
 * PENJELASAN UNTUK SISWA SMK TITL:
 * Terkadang teknisi melakukan perbaikan dadakan atau pengujian
 * insidental di bengkel/gardu tanpa melalui tiket WO terlebih dahulu.
 * 
 * Form ini memungkinkan teknisi mencatat perbaikan tersebut langsung
 * ke dalam Buku Logbook Riwayat agar rekam jejak peralatan tetap lengkap.
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { X, History, Save, AlertCircle } from 'lucide-react';

const SOURCE_TYPES = [
  'Work Order',
  'Preventive Maintenance',
  'Inspeksi Rutin',
  'Perbaikan Insidental',
  'Uji Kelayakan / Komisioning',
  'Modifikasi & Upgrade',
];

export default function ManualHistoryModal({ isOpen, onClose, onSave, availableAssets }) {
  const [formData, setFormData] = useState({
    id: '',
    date: new Date().toISOString().split('T')[0],
    sourceType: 'Perbaikan Insidental',
    referenceId: '',
    title: '',
    assetId: '',
    assetName: '',
    technician: 'Ahmad Riyadi (Teknisi TITL)',
    actionSummary: '',
    partsReplaced: '',
    downtime: 'Tanpa Pemadaman',
  });

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const randomNum = Math.floor(300 + Math.random() * 700);
      const defaultAsset = availableAssets[0] || { id: '', name: '' };

      setFormData({
        id: `HIST-${randomNum}`,
        date: new Date().toISOString().split('T')[0],
        sourceType: 'Perbaikan Insidental',
        referenceId: '',
        title: '',
        assetId: defaultAsset.id,
        assetName: defaultAsset.name,
        technician: 'Ahmad Riyadi (Teknisi TITL)',
        actionSummary: '',
        partsReplaced: '',
        downtime: 'Tanpa Pemadaman',
      });
      setErrorMessage('');
    }
  }, [isOpen, availableAssets]);

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
      setErrorMessage('Judul pekerjaan pemeliharaan wajib diisi!');
      return;
    }
    if (!formData.assetId) {
      setErrorMessage('Peralatan yang dirawat wajib dipilih!');
      return;
    }
    if (!formData.actionSummary.trim()) {
      setErrorMessage('Tindakan teknis dan parameter ukur wajib dijelaskan!');
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
            <div className="modal-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <History size={20} />
            </div>
            <div>
              <h2 className="modal-title">Catat Riwayat Pemeliharaan Baru</h2>
              <p className="modal-subtitle">
                Dokumentasikan pekerjaan perbaikan atau komisioning langsung ke dalam buku logbook
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
            
            {/* Nomor Berita Acara */}
            <div className="form-group">
              <label className="form-label" htmlFor="id">Kode Arsip Logbook</label>
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

            {/* Tanggal Selesai */}
            <div className="form-group">
              <label className="form-label" htmlFor="date">Tanggal Selesai</label>
              <input
                id="date"
                name="date"
                type="date"
                className="form-input"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            {/* Judul Pekerjaan (Span 2) */}
            <div className="form-group span-2">
              <label className="form-label" htmlFor="title">Uraian Nama Pekerjaan</label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                placeholder="misal: Penggantian Sekring Lebur HRC dan Kalibrasi CT Meter"
                required
              />
            </div>

            {/* Pilihan Aset Sasaran (Span 2) */}
            <div className="form-group span-2">
              <label className="form-label" htmlFor="assetId">Peralatan / Panel Sasaran</label>
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

            {/* Jenis Sumber Pekerjaan */}
            <div className="form-group">
              <label className="form-label" htmlFor="sourceType">Jenis Pekerjaan</label>
              <select
                id="sourceType"
                name="sourceType"
                className="form-select"
                value={formData.sourceType}
                onChange={handleChange}
              >
                {SOURCE_TYPES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Nomor Referensi (Opsional) */}
            <div className="form-group">
              <label className="form-label" htmlFor="referenceId">Nomor Referensi (Opsional)</label>
              <input
                id="referenceId"
                name="referenceId"
                type="text"
                className="form-input"
                value={formData.referenceId}
                onChange={handleChange}
                placeholder="misal: WO-102 atau PM-001"
              />
            </div>

            {/* Teknisi Pelaksana */}
            <div className="form-group">
              <label className="form-label" htmlFor="technician">Teknisi Pelaksana (TITL)</label>
              <input
                id="technician"
                name="technician"
                type="text"
                className="form-input"
                value={formData.technician}
                onChange={handleChange}
                required
              />
            </div>

            {/* Durasi Pemadaman */}
            <div className="form-group">
              <label className="form-label" htmlFor="downtime">Lama Pemadaman Listrik</label>
              <input
                id="downtime"
                name="downtime"
                type="text"
                className="form-input"
                value={formData.downtime}
                onChange={handleChange}
                placeholder="misal: Tanpa Pemadaman atau 45 Menit"
              />
            </div>

            {/* Suku Cadang yang Diganti */}
            <div className="form-group span-2">
              <label className="form-label" htmlFor="partsReplaced">Material / Suku Cadang yang Diganti</label>
              <input
                id="partsReplaced"
                name="partsReplaced"
                type="text"
                className="form-input"
                value={formData.partsReplaced}
                onChange={handleChange}
                placeholder="misal: 3x Fuse HRC 100A, Kabel NYAF 16mm² 2 meter"
              />
            </div>

            {/* Uraian Tindakan & Parameter Hasil Uji */}
            <div className="form-group span-2">
              <label className="form-label" htmlFor="actionSummary">Tindakan Teknis & Nilai Pengukuran</label>
              <textarea
                id="actionSummary"
                name="actionSummary"
                className="form-textarea"
                rows="3"
                value={formData.actionSummary}
                onChange={handleChange}
                placeholder="Jelaskan tindakan yang telah diambil dan hasil pengujian parameter listrik (tegangan, arus, tahanan isolasi, suhu)..."
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
              Simpan ke Buku Logbook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
