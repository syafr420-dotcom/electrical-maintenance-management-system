/**
 * ============================================================
 * MaintenanceHistory.jsx - Modul Arsip Riwayat & Buku Logbook
 * ============================================================
 * 
 * PENJELASAN UNTUK SISWA SMK TITL:
 * Modul ini adalah Buku Logbook Resmi yang mendokumentasikan
 * seluruh rekaman pemeliharaan listrik yang telah selesai.
 * 
 * Fitur Utama:
 * 1. Arsip Kronologis seluruh pekerjaan (PM, Work Order, Modifikasi).
 * 2. Lembar Berita Acara Resmi (tindakan teknis, hasil ukur, suku cadang).
 * 3. Catat Riwayat Manual untuk pekerjaan insidental.
 * 4. Filter berdasarkan Jenis Pekerjaan dan Peralatan Kelistrikan.
 * 5. Ekspor Dokumen ke Format CSV Spreadsheet untuk laporan ke guru/atasan.
 * 6. Penyimpanan persisten di LocalStorage browser.
 * ============================================================
 */

import { useState, useEffect, useMemo } from 'react';
import {
  History,
  Search,
  Plus,
  RotateCcw,
  Eye,
  Trash2,
  Download,
  CheckCircle,
  Wrench,
  Clock,
  ShieldCheck,
  FileSpreadsheet,
  XCircle,
  Filter,
} from 'lucide-react';

import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import HistoryDetailModal from '../components/HistoryDetailModal';
import ManualHistoryModal from '../components/ManualHistoryModal';
import {
  getStoredHistory,
  saveStoredHistory,
  resetStoredHistory,
  getStoredAssets,
} from '../utils/storage';

export default function MaintenanceHistory() {
  const [historyList, setHistoryList] = useState([]);
  const [availableAssets, setAvailableAssets] = useState([]);

  // State pencarian & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSourceType, setSelectedSourceType] = useState('ALL');
  const [selectedAsset, setSelectedAsset] = useState('ALL');

  // State Modal Detail Berita Acara
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState(null);

  // State Modal Catat Manual
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // State Notifikasi Toast
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setHistoryList(getStoredHistory());
    setAvailableAssets(getStoredAssets());
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // --- Operasi CRUD Riwayat ---

  // 1. Simpan Riwayat Manual Baru
  const handleSaveManualRecord = (formData) => {
    const isDuplicate = historyList.some((h) => h.id.toLowerCase() === formData.id.toLowerCase());
    if (isDuplicate) {
      showToast(`Kode arsip ${formData.id} sudah ada! Silakan ganti kode.`, 'error');
      return;
    }

    const updated = [formData, ...historyList];
    setHistoryList(updated);
    saveStoredHistory(updated);
    showToast(`Catatan riwayat ${formData.id} berhasil ditambahkan ke buku logbook.`);
  };

  // 2. Hapus Riwayat
  const handleDeleteRecord = (id, title) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus catatan riwayat "${title}" (${id})?`
    );
    if (!confirmDelete) return;

    const filtered = historyList.filter((item) => item.id !== id);
    setHistoryList(filtered);
    saveStoredHistory(filtered);
    showToast(`Catatan riwayat ${id} telah dihapus.`);
  };

  // 3. Reset Data ke Awal DEMO
  const handleResetData = () => {
    const confirmReset = window.confirm(
      'Kembalikan seluruh arsip buku riwayat ke data simulasi DEMO?'
    );
    if (!confirmReset) return;

    const resetData = resetStoredHistory();
    setHistoryList(resetData);
    setSearchQuery('');
    setSelectedSourceType('ALL');
    setSelectedAsset('ALL');
    showToast('Data buku riwayat pemeliharaan berhasil direset.');
  };

  // 4. Ekspor Data ke File CSV Spreadsheet
  const handleExportCSV = () => {
    if (filteredHistory.length === 0) {
      showToast('Tidak ada data riwayat untuk diekspor!', 'error');
      return;
    }

    // Header Kolom CSV
    const headers = [
      'Kode Arsip',
      'Tanggal',
      'Jenis Pekerjaan',
      'Referensi Tiket',
      'Nama Pekerjaan',
      'Peralatan Sasaran',
      'Teknisi Pelaksana',
      'Tindakan & Nilai Ukur',
      'Suku Cadang Diganti',
      'Durasi Pemadaman',
    ];

    // Baris Konten CSV
    const rows = filteredHistory.map((item) => [
      `"${item.id}"`,
      `"${item.date}"`,
      `"${item.sourceType}"`,
      `"${item.referenceId || '-'}"`,
      `"${item.title.replace(/"/g, '""')}"`,
      `"${item.assetName} (${item.assetId})"`,
      `"${item.technician}"`,
      `"${item.actionSummary.replace(/"/g, '""')}"`,
      `"${(item.partsReplaced || '-').replace(/"/g, '""')}"`,
      `"${item.downtime || '-'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    // Trigger unduhan file di browser pengguna
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EMMS_Logbook_Pemeliharaan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Berhasil mengekspor ${filteredHistory.length} data riwayat ke file CSV.`);
  };

  // 5. Hitung Metrik Statistik Ringkasan
  const stats = useMemo(() => {
    const total = historyList.length;
    const pmCount = historyList.filter((h) => h.sourceType.toLowerCase().includes('preventive')).length;
    const woCount = historyList.filter((h) => h.sourceType.toLowerCase().includes('work order') || h.sourceType.toLowerCase().includes('perbaikan')).length;
    const partsCount = historyList.filter((h) => h.partsReplaced && !h.partsReplaced.toLowerCase().includes('tidak ada')).length;

    return { total, pmCount, woCount, partsCount };
  }, [historyList]);

  // 6. Filter Daftar Riwayat
  const filteredHistory = useMemo(() => {
    return historyList.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.id?.toLowerCase().includes(q) ||
        item.assetName?.toLowerCase().includes(q) ||
        item.technician?.toLowerCase().includes(q) ||
        item.referenceId?.toLowerCase().includes(q);

      const matchesSource =
        selectedSourceType === 'ALL' || item.sourceType === selectedSourceType;

      const matchesAsset =
        selectedAsset === 'ALL' || item.assetId === selectedAsset;

      return matchesSearch && matchesSource && matchesAsset;
    });
  }, [historyList, searchQuery, selectedSourceType, selectedAsset]);

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

      {/* Baris 1: 4 Kartu Metrik Riwayat */}
      <div className="stats-grid">
        <StatCard
          label="Total Arsip Pekerjaan"
          value={stats.total}
          description="Catatan riwayat tuntas"
          color="purple"
          icon={<History size={20} />}
        />
        <StatCard
          label="Pemeliharaan Rutin Selesai"
          value={stats.pmCount}
          description="Sesuai jadwal berkala"
          color="blue"
          icon={<ShieldCheck size={20} />}
        />
        <StatCard
          label="Perbaikan Gangguan Tuntas"
          value={stats.woCount}
          description="Penanganan trip & kerusakan"
          color="amber"
          icon={<Wrench size={20} />}
        />
        <StatCard
          label="Log Penggantian Part"
          value={stats.partsCount}
          description="Peralatan diberi spare part baru"
          color="green"
          icon={<CheckCircle size={20} />}
        />
      </div>

      {/* Baris 2: Panel Utama Buku Riwayat */}
      <div className="content-section">
        {/* Header Bagian */}
        <div className="section-header" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 className="section-title">
              <History size={20} />
              Buku Logbook Riwayat Pemeliharaan Listrik
            </h2>
            <StatusBadge status="completed" label="Arsip Resmi" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleResetData}
              title="Kembalikan arsip ke data simulasi"
            >
              <RotateCcw size={14} />
              Reset DEMO
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleExportCSV}
              title="Unduh logbook dalam format Excel / CSV"
            >
              <FileSpreadsheet size={15} style={{ color: '#059669' }} />
              Ekspor CSV
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setIsManualModalOpen(true)}
            >
              <Plus size={16} />
              Catat Log Manual
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
              placeholder="Cari kode arsip (HIST-...), rujukan (PM/WO), pekerjaan, atau teknisi..."
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

          {/* Filter Jenis Pekerjaan */}
          <div className="filter-group">
            <Filter size={15} style={{ color: 'var(--color-text-secondary)' }} />
            <select
              className="filter-select"
              value={selectedSourceType}
              onChange={(e) => setSelectedSourceType(e.target.value)}
            >
              <option value="ALL">Semua Jenis Pekerjaan</option>
              <option value="Preventive Maintenance">Preventive Maintenance</option>
              <option value="Work Order">Work Order</option>
              <option value="Modifikasi & Upgrade">Modifikasi & Upgrade</option>
              <option value="Perbaikan Insidental">Perbaikan Insidental</option>
            </select>
          </div>

          {/* Filter Berdasarkan Peralatan */}
          <div className="filter-group">
            <select
              className="filter-select"
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
            >
              <option value="ALL">Semua Peralatan</option>
              {availableAssets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  [{asset.id}] {asset.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabel Riwayat Pemeliharaan */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>No. Berita Acara</th>
                <th>Nama Pekerjaan & Rujukan</th>
                <th>Peralatan Sasaran</th>
                <th>Jenis Pekerjaan</th>
                <th>Tanggal Selesai</th>
                <th>Teknisi (TITL)</th>
                <th>Pemadaman (Downtime)</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="asset-tag-badge">{item.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                        {item.title}
                      </div>
                      {item.referenceId && (
                        <div className="table-subtext" style={{ color: 'var(--color-primary-light)' }}>
                          Rujukan: {item.referenceId}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>
                        {item.assetName}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                        Kode: {item.assetId}
                      </div>
                    </td>
                    <td>
                      <span className="source-pill" data-source={item.sourceType}>
                        {item.sourceType}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, fontWeight: 500 }}>
                      {item.date}
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                      {item.technician}
                    </td>
                    <td>
                      <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                        {item.downtime || 'Tanpa Pemadaman'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-buttons-wrap">
                        {/* Tombol Lihat Berita Acara */}
                        <button
                          type="button"
                          className="btn-icon"
                          style={{ color: '#7c3aed', borderColor: '#ddd6fe' }}
                          onClick={() => {
                            setSelectedRecordForDetail(item);
                            setIsDetailOpen(true);
                          }}
                          title="Lihat Berita Acara Resmi"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Tombol Hapus Riwayat */}
                        <button
                          type="button"
                          className="btn-icon btn-icon-danger"
                          onClick={() => handleDeleteRecord(item.id, item.title)}
                          title="Hapus Catatan Riwayat"
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
                      <History size={32} style={{ opacity: 0.3, margin: '0 auto 8px' }} />
                      <p style={{ fontWeight: 500 }}>
                        Tidak ada catatan riwayat pemeliharaan yang cocok dengan pencarian.
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
            Menampilkan <strong>{filteredHistory.length}</strong> dari{' '}
            <strong>{historyList.length}</strong> arsip berita acara pemeliharaan listrik.
          </span>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            Data riwayat ini menjadi bukti kepatuhan K3 dan standar inspeksi PUIL.
          </span>
        </div>
      </div>

      {/* Modal Detail Berita Acara */}
      <HistoryDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        record={selectedRecordForDetail}
      />

      {/* Modal Catat Manual */}
      <ManualHistoryModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSave={handleSaveManualRecord}
        availableAssets={availableAssets}
      />
    </div>
  );
}
