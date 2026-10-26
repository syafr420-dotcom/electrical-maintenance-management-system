/**
 * ============================================================
 * InspectionChecklist.jsx - Halaman Daftar Periksa & Inspeksi Harian
 * ============================================================
 * 
 * PENJELASAN UNTUK SISWA SMK TITL:
 * Modul ini berfungsi untuk mengelola seluruh lembar periksa patroli
 * fisik dan visual pada panel tenaga, trafo, genset, dan kabel.
 * 
 * Fitur Utama:
 * 1. Manajemen Lembar Periksa Inspeksi (Tambah, Edit, Hapus).
 * 2. Terkoneksi dengan daftar Aset Kelistrikan dari Modul 2.
 * 3. Lembar Checklist Digital Interaktif (OK, Perhatian, Bahaya).
 * 4. Penilaian Otomatis Status Kelayakan (Normal / Warning / Kritis).
 * 5. Filter berdasarkan Shift Kerja dan Status Kelayakan.
 * 6. Penyimpanan persisten di LocalStorage browser.
 * ============================================================
 */

import { useState, useEffect, useMemo } from 'react';
import {
  ClipboardCheck,
  Search,
  Plus,
  RotateCcw,
  Edit2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Calendar,
  Filter,
} from 'lucide-react';

import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import InspectionModal from '../components/InspectionModal';
import InspectionSheetModal from '../components/InspectionSheetModal';
import {
  getStoredInspections,
  saveStoredInspections,
  resetStoredInspections,
  getStoredAssets,
} from '../utils/storage';

export default function InspectionChecklist() {
  const [inspections, setInspections] = useState([]);
  const [availableAssets, setAvailableAssets] = useState([]);

  // State pencarian & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('ALL');
  const [selectedShift, setSelectedShift] = useState('ALL');

  // State Modal Form Jadwal (Tambah / Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [inspectionToEdit, setInspectionToEdit] = useState(null);

  // State Modal Lembar Pengisian Checklist
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedInspectionForSheet, setSelectedInspectionForSheet] = useState(null);

  // State Notifikasi Toast
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setInspections(getStoredInspections());
    setAvailableAssets(getStoredAssets());
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // --- Operasi CRUD Inspeksi ---

  // 1. Simpan Jadwal Lembar Inspeksi
  const handleSaveInspection = (formData) => {
    let updatedList;
    if (inspectionToEdit) {
      updatedList = inspections.map((item) =>
        item.id === formData.id ? formData : item
      );
      showToast(`Jadwal inspeksi ${formData.id} berhasil diperbarui.`);
    } else {
      const isDuplicate = inspections.some((i) => i.id.toLowerCase() === formData.id.toLowerCase());
      if (isDuplicate) {
        showToast(`Kode inspeksi ${formData.id} sudah digunakan! Silakan ganti kode.`, 'error');
        return;
      }
      updatedList = [formData, ...inspections];
      showToast(`Lembar inspeksi baru ${formData.id} berhasil dijadwalkan.`);
    }

    setInspections(updatedList);
    saveStoredInspections(updatedList);
    setInspectionToEdit(null);
  };

  // 2. Hapus Lembar Inspeksi
  const handleDeleteInspection = (id, title) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus lembar inspeksi "${title}" (${id})?`
    );
    if (!confirmDelete) return;

    const filtered = inspections.filter((item) => item.id !== id);
    setInspections(filtered);
    saveStoredInspections(filtered);
    showToast(`Lembar inspeksi ${id} telah dihapus.`);
  };

  // 3. Simpan Hasil Pengisian Checklist Lapangan
  const handleSaveSheet = (updatedInspection) => {
    const updated = inspections.map((item) =>
      item.id === updatedInspection.id ? updatedInspection : item
    );

    setInspections(updated);
    saveStoredInspections(updated);
    showToast(`Hasil inspeksi ${updatedInspection.id} berhasil disimpan dan dinilai.`);
  };

  // 4. Reset Data ke Awal DEMO
  const handleResetData = () => {
    const confirmReset = window.confirm(
      'Kembalikan seluruh data lembar inspeksi ke data simulasi DEMO?'
    );
    if (!confirmReset) return;

    const resetData = resetStoredInspections();
    setInspections(resetData);
    setSearchQuery('');
    setSelectedCondition('ALL');
    setSelectedShift('ALL');
    showToast('Seluruh data inspeksi berhasil direset ke data simulasi.');
  };

  // 5. Hitung Metrik Statistik Ringkasan
  const stats = useMemo(() => {
    const total = inspections.length;
    const normal = inspections.filter((i) => i.overallCondition === 'Normal').length;
    const warning = inspections.filter((i) => i.overallCondition === 'Warning').length;
    const critical = inspections.filter((i) => i.overallCondition === 'Kritis').length;

    return { total, normal, warning, critical };
  }, [inspections]);

  // 6. Filter Daftar Lembar Inspeksi
  const filteredInspections = useMemo(() => {
    return inspections.filter((ins) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        ins.title?.toLowerCase().includes(q) ||
        ins.id?.toLowerCase().includes(q) ||
        ins.assetName?.toLowerCase().includes(q) ||
        ins.inspector?.toLowerCase().includes(q);

      const matchesCondition =
        selectedCondition === 'ALL' || ins.overallCondition === selectedCondition;

      const matchesShift =
        selectedShift === 'ALL' || ins.shift === selectedShift;

      return matchesSearch && matchesCondition && matchesShift;
    });
  }, [inspections, searchQuery, selectedCondition, selectedShift]);

  return (
    <div>
      {/* Notifikasi Toast */}
      {notification && (
        <div className={`toast-notification toast-${notification.type}`}>
          {notification.type === 'error' ? (
            <XCircle size={18} />
          ) : (
            <CheckCircle size={18} />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Baris 1: 4 Kartu Metrik Inspeksi */}
      <div className="stats-grid">
        <StatCard
          label="Total Lembar Inspeksi"
          value={stats.total}
          description="Seluruh jadwal pemeriksaan"
          color="blue"
          icon={<ClipboardCheck size={20} />}
        />
        <StatCard
          label="Kondisi Panel Normal"
          value={stats.normal}
          description="Memenuhi standar aman PUIL"
          color="green"
          icon={<CheckCircle size={20} />}
        />
        <StatCard
          label="Temuan Catatan Ringan"
          value={stats.warning}
          description="Perlu perhatian saat patroli"
          color="amber"
          icon={<AlertTriangle size={20} />}
        />
        <StatCard
          label="Temuan Kritis / Bahaya"
          value={stats.critical}
          description="Segera buat Work Order darurat!"
          color="red"
          icon={<XCircle size={20} />}
        />
      </div>

      {/* Baris 2: Panel Utama Inspeksi */}
      <div className="content-section">
        {/* Header Bagian */}
        <div className="section-header" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 className="section-title">
              <ClipboardCheck size={20} />
              Daftar Lembar Periksa & Patroli Harian (Shift)
            </h2>
            <StatusBadge status="completed" label="Checklist Lapangan" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleResetData}
              title="Kembalikan inspeksi ke simulasi bawaan"
            >
              <RotateCcw size={14} />
              Reset Data DEMO
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setInspectionToEdit(null);
                setIsFormOpen(true);
              }}
            >
              <Plus size={16} />
              Jadwalkan Inspeksi Baru
            </button>
          </div>
        </div>

        {/* Toolbar Pencarian & Filter */}
        <div className="toolbar-section">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Cari kode inspeksi (INS-...), nama panel, atau teknisi pemeriksa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
              >
                ×
              </button>
            )}
          </div>

          {/* Filter Kondisi Kelayakan */}
          <div className="filter-group">
            <Filter size={15} style={{ color: 'var(--color-text-secondary)' }} />
            <select
              className="filter-select"
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
            >
              <option value="ALL">Semua Kondisi</option>
              <option value="Normal">Normal (Aman)</option>
              <option value="Warning">Warning (Perhatian)</option>
              <option value="Kritis">Kritis (Bahaya)</option>
            </select>
          </div>

          {/* Filter Shift Kerja */}
          <div className="filter-group">
            <select
              className="filter-select"
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
            >
              <option value="ALL">Semua Shift</option>
              <option value="Pagi (07:00 - 15:00)">Shift Pagi</option>
              <option value="Siang (15:00 - 23:00)">Shift Siang</option>
              <option value="Malam (23:00 - 07:00)">Shift Malam</option>
            </select>
          </div>
        </div>

        {/* Tabel Lembar Inspeksi */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>No. Inspeksi</th>
                <th>Judul & Peralatan Sasaran</th>
                <th>Shift Patroli</th>
                <th>Tanggal Pelaksanaan</th>
                <th>Pemeriksa (Inspector)</th>
                <th>Kelayakan Fisik</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Aksi Lembar</th>
              </tr>
            </thead>
            <tbody>
              {filteredInspections.length > 0 ? (
                filteredInspections.map((ins) => (
                  <tr key={ins.id}>
                    <td>
                      <span className="asset-tag-badge">{ins.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                        {ins.title}
                      </div>
                      <div className="table-subtext" style={{ color: 'var(--color-primary-light)' }}>
                        ⚡ {ins.assetName}
                      </div>
                    </td>
                    <td>
                      <span className="frequency-pill">{ins.shift}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>
                        {ins.date}
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                      {ins.inspector}
                    </td>
                    <td>
                      <span
                        className="condition-pill"
                        data-condition={ins.overallCondition}
                      >
                        {ins.overallCondition}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={ins.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-buttons-wrap">
                        {/* Tombol Buka Lembar Periksa Digital */}
                        <button
                          type="button"
                          className="btn-icon"
                          style={{ color: '#059669', borderColor: '#a7f3d0' }}
                          onClick={() => {
                            setSelectedInspectionForSheet(ins);
                            setIsSheetOpen(true);
                          }}
                          title="Buka & Isi Lembar Checklist Digital"
                        >
                          <ClipboardCheck size={16} />
                        </button>

                        {/* Tombol Edit Jadwal */}
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => {
                            setInspectionToEdit(ins);
                            setIsFormOpen(true);
                          }}
                          title="Edit Jadwal Inspeksi"
                        >
                          <Edit2 size={16} />
                        </button>

                        {/* Tombol Hapus Lembar */}
                        <button
                          type="button"
                          className="btn-icon btn-icon-danger"
                          onClick={() => handleDeleteInspection(ins.id, ins.title)}
                          title="Hapus Lembar Inspeksi"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ color: 'var(--color-text-muted)', marginBottom: 8 }}>
                      <ClipboardCheck size={32} style={{ opacity: 0.3, margin: '0 auto 8px' }} />
                      <p style={{ fontWeight: 500 }}>
                        Tidak ada lembar inspeksi yang sesuai dengan pencarian.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="table-footer-info">
          <span>
            Menampilkan <strong>{filteredInspections.length}</strong> dari{' '}
            <strong>{inspections.length}</strong> lembar inspeksi harian kelistrikan.
          </span>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            Inspeksi visual berkala mendeteksi 80% potensi kebakaran listrik sebelum busur api muncul.
          </span>
        </div>
      </div>

      {/* Modal Form Jadwal */}
      <InspectionModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveInspection}
        inspectionToEdit={inspectionToEdit}
        availableAssets={availableAssets}
      />

      {/* Modal Lembar Pengisian Checklist Lapangan */}
      <InspectionSheetModal
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        inspection={selectedInspectionForSheet}
        onSaveInspection={handleSaveSheet}
      />
    </div>
  );
}
