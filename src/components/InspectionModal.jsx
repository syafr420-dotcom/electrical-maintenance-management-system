/**
 * ============================================================
 * InspectionModal.jsx - Form Rencana Inspeksi Kelistrikan
 * ============================================================
 * 
 * PENJELASAN UNTUK SISWA SMK TITL:
 * Form ini digunakan untuk menjadwalkan patroli pemeriksaan rutin
 * sebelum teknisi turun ke lapangan dengan lembar checklist.
 * 
 * Data peralatan listrik terhubung langsung dengan Modul 2 (Aset).
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { X, ClipboardCheck, Save, AlertCircle } from 'lucide-react';

const SHIFTS = [
  'Pagi (07:00 - 15:00)',
  'Siang (15:00 - 23:00)',
  'Malam (23:00 - 07:00)',
];

export default function InspectionModal({ isOpen, onClose, onSave, inspectionToEdit, availableAssets }) {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    assetId: '',
    assetName: '',
    inspector: '',
    date: '',
    shift: 'Pagi (07:00 - 15:00)',
    status: 'scheduled',
    overallCondition: 'Normal',
    findingsSummary: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (inspectionToEdit) {
      setFormData(inspectionToEdit);
    } else {
      const randomNum = Math.floor(200 + Math.random() * 800);
      const defaultAsset = availableAssets[0] || { id: '', name: '' };

      setFormData({
        id: `INS-${randomNum}`,
        title: '',
        assetId: defaultAsset.id,
        assetName: defaultAsset.name,
        inspector: 'Ahmad Riyadi (Teknisi TITL)',
        date: new Date().toISOString().split('T')[0],
        shift: 'Pagi (07:00 - 15:00)',
        status: 'scheduled',
        overallCondition: 'Normal',
        findingsSummary: 'Pemeriksaan rutin kelayakan operasional instalasi.',
        checkpoints: [
          {
            category: 'Kondisi Fisik & Visual',
            item: 'Pintu panel/gardu tertutup rapat, engsel tidak longgar, dan kunci pengaman terpasang.',
            result: 'pass',
            notes: '',
          },
          {
            category: 'Kondisi Fisik & Visual',
            item: 'Tidak ada kotoran, debu tebal, sarang serangga, atau kebocoran air di sekitar panel.',
            result: 'pass',
            notes: '',
          },
          {
            category: 'Indikator & Metering',
            item: 'Semua lampu pilot lamp penunjuk Fasa R-S-T menyala normal dan seimbang.',
            result: 'pass',
            notes: '',
          },
          {
            category: 'Pendeteksian Bau & Suara',
            item: 'Tidak tercium bau gosong/sangit kabel terbakar dan tidak terdengar suara dengung/desis abnormal.',
            result: 'pass',
            notes: '',
          },
          {
            category: 'Ventilasi & Suhu',
            item: 'Kipas pendingin (exhaust fan) dan lubang sirkulasi udara panel bersih dan berfungsi.',
            result: 'pass',
            notes: '',
          },
          {
            category: 'K3 & Alat Pemadam',
            item: 'Tabung APAR di ruangan panel siap pakai dan karpet isolasi 1000V terpasang rapi.',
            result: 'pass',
            notes: '',
          },
        ],
      });
    }
    setErrorMessage('');
  }, [inspectionToEdit, isOpen, availableAssets]);

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
      setErrorMessage('Judul lembar inspeksi wajib diisi!');
      return;
    }
    if (!formData.assetId) {
      setErrorMessage('Peralatan yang diinspeksi wajib dipilih!');
      return;
    }
    if (!formData.inspector.trim()) {
      setErrorMessage('Nama teknisi pemeriksa wajib diisi!');
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
            <div className="modal-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <ClipboardCheck size={20} />
            </div>
            <div>
              <h2 className="modal-title">
                {inspectionToEdit ? 'Edit Data Inspeksi' : 'Jadwalkan Lembar Inspeksi Baru'}
              </h2>
              <p className="modal-subtitle">
                {inspectionToEdit
                  ? `Mengubah jadwal inspeksi ${inspectionToEdit.id}`
                  : 'Rencanakan patroli pemeriksaan fisik dan visual panel kelistrikan'}
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
            
            {/* ID Inspeksi */}
            <div className="form-group">
              <label className="form-label" htmlFor="id">Kode Inspeksi</label>
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

            {/* Shift Kerja */}
            <div className="form-group">
              <label className="form-label" htmlFor="shift">Shift Patroli</label>
              <select
                id="shift"
                name="shift"
                className="form-select"
                value={formData.shift}
                onChange={handleChange}
              >
                {SHIFTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Judul Inspeksi (Span 2) */}
            <div className="form-group span-2">
              <label className="form-label" htmlFor="title">Judul Kegiatan Inspeksi</label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                placeholder="misal: Patroli Pemeriksaan Shift Pagi Panel MDP Gedung A"
                required
              />
            </div>

            {/* Pilihan Aset Sasaran (Span 2) */}
            <div className="form-group span-2">
              <label className="form-label" htmlFor="assetId">Peralatan / Panel Sasaran Inspeksi</label>
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

            {/* Tanggal Patroli */}
            <div className="form-group">
              <label className="form-label" htmlFor="date">Tanggal Pelaksanaan</label>
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

            {/* Teknisi Pemeriksa */}
            <div className="form-group">
              <label className="form-label" htmlFor="inspector">Teknisi Pemeriksa</label>
              <input
                id="inspector"
                name="inspector"
                type="text"
                className="form-input"
                value={formData.inspector}
                onChange={handleChange}
                placeholder="misal: Ahmad Riyadi (Teknisi TITL)"
                required
              />
            </div>

            {/* Catatan Pendahuluan (Span 2) */}
            <div className="form-group span-2">
              <label className="form-label" htmlFor="findingsSummary">Rencana / Catatan Khusus</label>
              <textarea
                id="findingsSummary"
                name="findingsSummary"
                className="form-textarea"
                rows="2"
                value={formData.findingsSummary}
                onChange={handleChange}
                placeholder="misal: Fokuskan pemeriksaan pada temperatur kipas ventilasi dan baut terminal Fasa S."
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              {inspectionToEdit ? 'Simpan Perubahan Jadwal' : 'Buat Lembar Inspeksi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
