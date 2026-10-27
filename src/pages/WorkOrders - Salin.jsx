/**
 * ============================================================
 * WorkOrders.jsx - Halaman Manajemen Perintah Kerja (Work Orders)
 * ============================================================
 * 
 * PENJELASAN UNTUK SISWA SMK TITL:
 * Modul ini berfungsi untuk mengelola seluruh tiket perbaikan listrik
 * yang masuk dari berbagai divisi, mendisposisikan teknisi,
 * memantau proses penanganan, dan merekam histori tindakan teknisi.
 * 
 * Fitur Utama:
 * 1. Manajemen Tiket WO (Tambah, Edit, Hapus).
 * 2. Terkoneksi dengan daftar Aset Kelistrikan dari Modul 2.
 * 3. Indikator Prioritas Darurat / Emergency (berwarna merah menyala).
 * 4. Filter Status (Open, In-Progress, Completed, Cancelled).
 * 5. Lembar Catatan Hasil Perbaikan Teknisi (Action Taken).
 * 6. Tersimpan persisten di LocalStorage browser.
 * ============================================================
 */

import { useState, useEffect, useMemo } from 'react';
import {
  ClipboardList,
  Search,
  Plus,
  RotateCcw,
  Edit2,
  Trash2,
  FileText,
  CheckCircle,
  AlertOctagon,
  Clock,
  XCircle,
  Filter,
} from 'lucide-react';

import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import WOModal from '../components/WOModal';
import WODetailModal from '../components/WODetailModal';
import {
  getStoredWO,
  saveStoredWO,
  resetStoredWO,
  getStoredAssets,
  addHistoryRecord,
} from '../utils/storage';

export default function WorkOrders() {
  const [woList, setWoList] = useState([]);
  const [availableAssets, setAvailableAssets] = useState([]);

  // State pencarian & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');

  // State Modal Form (Tambah / Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [woToEdit, setWoToEdit] = useState(null);

  // State Modal Detail Tindakan
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedWOForDetail, setSelectedWOForDetail] = useState(null);

  // State Notifikasi Toast
  const [notification, setNotification] = useState(null);

  // Muat data awal dari LocalStorage
  useEffect(() => {
    setWoList(getStoredWO());
    setAvailableAssets(getStoredAssets());
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // --- Operasi CRUD Work Orders ---

  // 1. Simpan Tiket WO (Tambah / Update)
  const handleSaveWO = (formData) => {
    let updatedList;
    if (woToEdit) {
      updatedList = woList.map((item) =>
        item.id === formData.id ? formData : item
      );
      showToast(`Tiket ${formData.id} berhasil diperbarui.`);
    } else {
      const isDuplicate = woList.some((w) => w.id.toLowerCase() === formData.id.toLowerCase());
      if (isDuplicate) {
        showToast(`Kode tiket ${formData.id} sudah ada! Silakan ganti kode.`, 'error');
        return;
      }
      updatedList = [formData, ...woList];
      showToast(`Tiket perbaikan ${formData.id} berhasil diterbitkan.`);
    }

    setWoList(updatedList);
    saveStoredWO(updatedList);
    setWoToEdit(null);
  };

  // 2. Hapus Tiket
  const handleDeleteWO = (woId, woTitle) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus Work Order "${woTitle}" (${woId})?`
    );
    if (!confirmDelete) return;

    const filtered = woList.filter((item) => item.id !== woId);
    setWoList(filtered);
    saveStoredWO(filtered);
    showToast(`Tiket ${woId} telah dihapus.`);
  };

  // 3. Update Status & Catatan Tindakan Teknisi dari Modal Detail
  const handleUpdateWODetail = (updatedWO) => {
    const prevWO = woList.find((item) => item.id === updatedWO.id);
    const updated = woList.map((item) =>
      item.id === updatedWO.id ? updatedWO : item
    );

    setWoList(updated);
    saveStoredWO(updated);

    // Bila status ditandai 'completed' dan sebelumnya bukan completed, catat ke Buku Logbook Riwayat
    if (updatedWO.status === 'completed' && prevWO?.status !== 'completed') {
      const histId = `HIST-${Math.floor(400 + Math.random() * 600)}`;
      addHistoryRecord({
        id: histId,
        date: new Date().toISOString().split('T')[0],
        sourceType: 'Work Order',
        referenceId: updatedWO.id,
        title: `Penyelesaian WO: ${updatedWO.title}`,
        assetId: updatedWO.assetId,
        assetName: updatedWO.assetName,
        technician: updatedWO.assignedTo || 'Tim Reaksi Cepat TITL',
        actionSummary: updatedWO.actionTaken || 'Perbaikan gangguan kelistrikan selesai dilaksanakan dan unit diuji coba dengan beban normal.',
        partsReplaced: updatedWO.partsReplaced || 'Pengecekan dan rekondisi perkabelan / terminal.',
        downtime: '30 Menit penanganan gangguan',
      });
      showToast(`Work Order ${updatedWO.id} selesai & otomatis dicatat di Buku Riwayat!`);
    } else {
      showToast(`Laporan perbaikan untuk ${updatedWO.id} berhasil disimpan.`);
    }
  };

  // 4. Reset Data ke Awal DEMO
  const handleResetData = () => {
    const confirmReset = window.confirm(
      'Kembalikan seluruh data Work Order ke data simulasi DEMO?'
    );
    if (!confirmReset) return;

    const resetData = resetStoredWO();
    setWoList(resetData);
    setSearchQuery('');
    setSelectedStatus('ALL');
    setSelectedPriority('ALL');
    showToast('Seluruh data Work Order berhasil direset ke data simulasi.');
  };

  // 5. Hitung Metrik Statistik Ringkasan
  const stats = useMemo(() => {
    const total = woList.length;
    const active = woList.filter((w) => w.status === 'open' || w.status === 'in-progress').length;
    const emergencyOrHigh = woList.filter(
      (w) => w.priority === 'Darurat' || w.priority === 'Tinggi'
    ).length;
    const completed = woList.filter((w) => w.status === 'completed').length;

    return { total, active, emergencyOrHigh, completed };
  }, [woList]);

  // 6. Filter Daftar Work Order
  const filteredWO = useMemo(() => {
    return woList.filter((wo) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        wo.title?.toLowerCase().includes(q) ||
        wo.id?.toLowerCase().includes(q) ||
        wo.assetName?.toLowerCase().includes(q) ||
        wo.assignedTo?.toLowerCase().includes(q) ||
        wo.reportedBy?.toLowerCase().includes(q);

      const matchesStatus =
        selectedStatus === 'ALL' || wo.status === selectedStatus;

      const matchesPriority =
        selectedPriority === 'ALL' || wo.priority === selectedPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [woList, searchQuery, selectedStatus, selectedPriority]);

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

      {/* Baris 1: 4 Kartu Metrik Work Orders */}
      <div className="stats-grid">
        <StatCard
          label="Total Tiket WO Masuk"
          value={stats.total}
          description="Seluruh perintah kerja terdata"
          color="blue"
          icon={<ClipboardList size={20} />}
        />
        <StatCard
          label="WO Aktif Ditangani"
          value={stats.active}
          description="Perlu tindakan teknisi di lapangan"
          color="amber"
          icon={<Clock size={20} />}
        />
        <StatCard
          label="Urgensi Darurat & Tinggi"
          value={stats.emergencyOrHigh}
          description="Resiko padam total / bahaya K3"
          color="red"
          icon={<AlertOctagon size={20} />}
        />
        <StatCard
          label="Perbaikan Sukses Selesai"
          value={stats.completed}
          description="Alat normal kembali beroperasi"
          color="green"
          icon={<CheckCircle size={20} />}
        />
      </div>

      {/* Baris 2: Panel Utama Work Orders */}
      <div className="content-section">
        {/* Header Bagian */}
        <div className="section-header" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 className="section-title">
              <ClipboardList size={20} />
              Daftar Surat Perintah Kerja (Work Orders)
            </h2>
            <StatusBadge status="warning" label="Penanganan Gangguan" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleResetData}
              title="Kembalikan tiket ke simulasi bawaan"
            >
              <RotateCcw size={14} />
              Reset Data DEMO
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setWoToEdit(null);
                setIsFormOpen(true);
              }}
            >
              <Plus size={16} />
              Terbitkan Work Order Baru
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
              placeholder="Cari kode tiket (WO-...), masalah, peralatan, atau teknisi..."
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

          {/* Filter Status */}
          <div className="filter-group">
            <Filter size={15} style={{ color: 'var(--color-text-secondary)' }} />
            <select
              className="filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="ALL">Semua Status</option>
              <option value="open">Open (Menunggu)</option>
              <option value="in-progress">In-Progress (Dikerjakan)</option>
              <option value="completed">Completed (Selesai)</option>
              <option value="cancelled">Cancelled (Dibatalkan)</option>
            </select>
          </div>

          {/* Filter Tingkat Urgensi */}
          <div className="filter-group">
            <select
              className="filter-select"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="ALL">Semua Urgensi</option>
              <option value="Darurat">Darurat (Emergency)</option>
              <option value="Tinggi">Tinggi</option>
              <option value="Normal">Normal</option>
              <option value="Rendah">Rendah</option>
            </select>
          </div>
        </div>

        {/* Tabel Work Orders */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>No. Tiket</th>
                <th>Masalah & Peralatan Sasaran</th>
                <th>Kategori</th>
                <th>Tingkat Urgensi</th>
                <th>Teknisi Bertugas</th>
                <th>Target Selesai</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredWO.length > 0 ? (
                filteredWO.map((wo) => (
                  <tr key={wo.id}>
                    <td>
                      <span className="asset-tag-badge">{wo.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                        {wo.title}
                      </div>
                      <div className="table-subtext" style={{ color: 'var(--color-primary-light)' }}>
                        ⚡ {wo.assetName} ({wo.assetId})
                      </div>
                    </td>
                    <td>
                      <span className="category-pill">{wo.category}</span>
                    </td>
                    <td>
                      <span className="priority-pill" data-priority={wo.priority}>
                        {wo.priority}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>
                        {wo.assignedTo}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                        Pelapor: {wo.reportedBy}
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                      {wo.dueDate}
                    </td>
                    <td>
                      <StatusBadge status={wo.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-buttons-wrap">
                        {/* Tombol Lembar Kerja Tindakan */}
                        <button
                          type="button"
                          className="btn-icon"
                          style={{ color: '#2563eb', borderColor: '#bfdbfe' }}
                          onClick={() => {
                            setSelectedWOForDetail(wo);
                            setIsDetailOpen(true);
                          }}
                          title="Buka Lembar Tindakan & Update Status"
                        >
                          <FileText size={16} />
                        </button>

                        {/* Tombol Edit Tiket */}
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => {
                            setWoToEdit(wo);
                            setIsFormOpen(true);
                          }}
                          title="Edit Rincian Tiket WO"
                        >
                          <Edit2 size={16} />
                        </button>

                        {/* Tombol Hapus Tiket */}
                        <button
                          type="button"
                          className="btn-icon btn-icon-danger"
                          onClick={() => handleDeleteWO(wo.id, wo.title)}
                          title="Hapus Tiket WO"
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
                      <ClipboardList size={32} style={{ opacity: 0.3, margin: '0 auto 8px' }} />
                      <p style={{ fontWeight: 500 }}>
                        Tidak ada tiket perintah kerja yang sesuai dengan filter.
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
            Menampilkan <strong>{filteredWO.length}</strong> dari{' '}
            <strong>{woList.length}</strong> total tiket perintah kerja.
          </span>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            Gunakan alat ukur berkalibrasi dan patuhi batas arus beban saat perbaikan.
          </span>
        </div>
      </div>

      {/* Modal Buat / Edit WO */}
      <WOModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveWO}
        woToEdit={woToEdit}
        availableAssets={availableAssets}
      />

      {/* Modal Detail Tindakan Perbaikan */}
      <WODetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        wo={selectedWOForDetail}
        onUpdateWO={handleUpdateWODetail}
      />
    </div>
  );
}
