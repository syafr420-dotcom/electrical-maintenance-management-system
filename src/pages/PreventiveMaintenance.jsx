/**
 * ============================================================
 * PreventiveMaintenance.jsx - Modul Pemeliharaan Rutin Kelistrikan
 * ============================================================
 * 
 * PENJELASAN UNTUK SISWA SMK TITL:
 * Modul ini berfungsi untuk merencanakan, memonitor, dan mencatat
 * kegiatan pemeliharaan berkala sebelum terjadi kerusakan alat.
 * 
 * Fitur-Fitur:
 * 1. Manajemen Jadwal PM (Tambah, Edit, Hapus).
 * 2. Terkoneksi langsung dengan daftar Aset dari Modul 2.
 * 3. Filter berdasarkan Status (Terjadwal, Dikerjakan, Selesai, Terlambat).
 * 4. Filter berdasarkan Siklus Frekuensi (Mingguan, Bulanan, Semester, Tahunan).
 * 5. Lembar Eksekusi SOP Lapangan (Checklist K3 Listrik & LOTO).
 * 6. Penyimpanan interaktif di LocalStorage.
 * ============================================================
 */

import { useState, useEffect, useMemo } from 'react';
import {
  Wrench,
  Search,
  Plus,
  RotateCcw,
  Edit2,
  Trash2,
  ShieldCheck,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  XCircle,
  Filter,
} from 'lucide-react';

import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import PMModal from '../components/PMModal';
import PMExecutionModal from '../components/PMExecutionModal';
import {
  getStoredPM,
  saveStoredPM,
  resetStoredPM,
  getStoredAssets,
  addHistoryRecord,
} from '../utils/storage';

export default function PreventiveMaintenance() {
  // State daftar jadwal PM & aset terdaftar
  const [pmList, setPmList] = useState([]);
  const [availableAssets, setAvailableAssets] = useState([]);

  // State pencarian & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedFrequency, setSelectedFrequency] = useState('ALL');

  // State Modal Form (Tambah / Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pmToEdit, setPmToEdit] = useState(null);

  // State Modal Eksekusi SOP
  const [isExecutionOpen, setIsExecutionOpen] = useState(false);
  const [selectedPmForExecution, setSelectedPmForExecution] = useState(null);

  // State Notifikasi Toast
  const [notification, setNotification] = useState(null);

  // Muat data awal dari LocalStorage
  useEffect(() => {
    setPmList(getStoredPM());
    setAvailableAssets(getStoredAssets());
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // --- Operasi CRUD Jadwal PM ---

  // 1. Simpan Jadwal (Tambah / Update)
  const handleSavePM = (formData) => {
    let updatedList;
    if (pmToEdit) {
      updatedList = pmList.map((item) =>
        item.id === formData.id ? formData : item
      );
      showToast(`Jadwal ${formData.title} berhasil diperbarui.`);
    } else {
      const isDuplicate = pmList.some((p) => p.id.toLowerCase() === formData.id.toLowerCase());
      if (isDuplicate) {
        showToast(`Kode jadwal ${formData.id} sudah ada! Silakan ganti kode.`, 'error');
        return;
      }
      updatedList = [formData, ...pmList];
      showToast(`Jadwal baru ${formData.title} berhasil ditambahkan.`);
    }

    setPmList(updatedList);
    saveStoredPM(updatedList);
    setPmToEdit(null);
  };

  // 2. Hapus Jadwal
  const handleDeletePM = (pmId, pmTitle) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus jadwal pemeliharaan "${pmTitle}" (${pmId})?`
    );
    if (!confirmDelete) return;

    const filtered = pmList.filter((item) => item.id !== pmId);
    setPmList(filtered);
    saveStoredPM(filtered);
    showToast(`Jadwal ${pmTitle} telah dihapus.`);
  };

  // 3. Update Status Pekerjaan dari Modal Eksekusi SOP
  const handleUpdateStatus = (pmId, newStatus, updatedSteps) => {
    let completedPM = null;
    const updated = pmList.map((item) => {
      if (item.id === pmId) {
        const itemUpdated = {
          ...item,
          status: newStatus,
          sopSteps: updatedSteps,
          lastCompletedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : item.lastCompletedDate,
        };
        if (newStatus === 'completed') {
          completedPM = itemUpdated;
        }
        return itemUpdated;
      }
      return item;
    });

    setPmList(updated);
    saveStoredPM(updated);

    // Otomatis catat ke Buku Logbook Riwayat bila status menjadi 'completed'
    if (newStatus === 'completed' && completedPM) {
      const histId = `HIST-${Math.floor(400 + Math.random() * 600)}`;
      addHistoryRecord({
        id: histId,
        date: new Date().toISOString().split('T')[0],
        sourceType: 'Preventive Maintenance',
        referenceId: completedPM.id,
        title: `Pelaksanaan PM: ${completedPM.title}`,
        assetId: completedPM.assetId,
        assetName: completedPM.assetName,
        technician: completedPM.assignee || 'Tim Teknisi TITL',
        actionSummary: `Pemeliharaan berkala siklus ${completedPM.frequency} selesai dilaksanakan sesuai SOP & K3 Listrik. Seluruh checklist diverifikasi. Parameter operasional normal.`,
        partsReplaced: 'Pembersihan kontak & pelumasan mekanik (tanpa penggantian part mayor).',
        downtime: '15 Menit pemadaman terencana',
      });
    }

    showToast(
      newStatus === 'completed'
        ? `Pemeliharaan ${pmId} selesai dan diverifikasi! Otomatis dicatat di Buku Riwayat.`
        : `Status pemeliharaan ${pmId} diperbarui ke ${newStatus}.`
    );
  };

  // 4. Reset Data PM ke Bawaan DEMO
  const handleResetData = () => {
    const confirmReset = window.confirm(
      'Kembalikan seluruh jadwal pemeliharaan ke data awal DEMO?'
    );
    if (!confirmReset) return;

    const resetData = resetStoredPM();
    setPmList(resetData);
    setSearchQuery('');
    setSelectedStatus('ALL');
    setSelectedFrequency('ALL');
    showToast('Data jadwal PM berhasil direset ke data simulasi.');
  };

  // 5. Hitung Metrik Statistik Ringkasan
  const stats = useMemo(() => {
    const total = pmList.length;
    const scheduled = pmList.filter((p) => p.status === 'scheduled').length;
    const inProgress = pmList.filter((p) => p.status === 'in-progress').length;
    const completed = pmList.filter((p) => p.status === 'completed').length;
    const overdue = pmList.filter((p) => p.status === 'overdue').length;

    return { total, scheduled, inProgress, completed, overdue };
  }, [pmList]);

  // 6. Filter Jadwal berdasarkan Pencarian dan Dropdown
  const filteredPM = useMemo(() => {
    return pmList.filter((pm) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        pm.title?.toLowerCase().includes(q) ||
        pm.id?.toLowerCase().includes(q) ||
        pm.assetName?.toLowerCase().includes(q) ||
        pm.assignee?.toLowerCase().includes(q);

      const matchesStatus =
        selectedStatus === 'ALL' || pm.status === selectedStatus;

      const matchesFrequency =
        selectedFrequency === 'ALL' || pm.frequency === selectedFrequency;

      return matchesSearch && matchesStatus && matchesFrequency;
    });
  }, [pmList, searchQuery, selectedStatus, selectedFrequency]);

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

      {/* Baris 1: 4 Kartu Metrik Jadwal PM */}
      <div className="stats-grid">
        <StatCard
          label="Total Rencana PM"
          value={stats.total}
          description="Seluruh jadwal terdaftar"
          color="blue"
          icon={<Wrench size={20} />}
        />
        <StatCard
          label="Menunggu Jadwal"
          value={stats.scheduled}
          description="Siap dikerjakan teknisi"
          color="cyan"
          icon={<Calendar size={20} />}
        />
        <StatCard
          label="Sedang Dikerjakan"
          value={stats.inProgress}
          description="Teknisi berada di lokasi"
          color="amber"
          icon={<Clock size={20} />}
        />
        <StatCard
          label="PM Berhasil Selesai"
          value={stats.completed}
          description={`${stats.overdue} jadwal terlambat/overdue`}
          color={stats.overdue > 0 ? 'red' : 'green'}
          icon={stats.overdue > 0 ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
        />
      </div>

      {/* Baris 2: Panel Utama Pemeliharaan Berkala */}
      <div className="content-section">
        {/* Header Bagian */}
        <div className="section-header" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 className="section-title">
              <Calendar size={20} />
              Jadwal Pemeliharaan Rutin Kelistrikan
            </h2>
            <StatusBadge status="info" label="SOP & K3 Listrik" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleResetData}
              title="Kembalikan ke jadwal standar bawaan sistem"
            >
              <RotateCcw size={14} />
              Reset Data DEMO
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setPmToEdit(null);
                setIsFormOpen(true);
              }}
            >
              <Plus size={16} />
              Buat Jadwal PM Baru
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
              placeholder="Cari nama kegiatan, kode PM, peralatan, atau teknisi..."
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
              <option value="scheduled">Terjadwal</option>
              <option value="in-progress">Dikerjakan</option>
              <option value="completed">Selesai</option>
              <option value="overdue">Terlambat (Overdue)</option>
            </select>
          </div>

          {/* Filter Siklus Frekuensi */}
          <div className="filter-group">
            <select
              className="filter-select"
              value={selectedFrequency}
              onChange={(e) => setSelectedFrequency(e.target.value)}
            >
              <option value="ALL">Semua Siklus</option>
              <option value="Mingguan">Mingguan</option>
              <option value="Bulanan">Bulanan</option>
              <option value="Triwulan (3 Bulan)">Triwulan (3 Bulan)</option>
              <option value="Semester (6 Bulan)">Semester (6 Bulan)</option>
              <option value="Tahunan">Tahunan</option>
            </select>
          </div>
        </div>

        {/* Tabel Jadwal PM */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID PM</th>
                <th>Kegiatan & Peralatan Sasaran</th>
                <th>Siklus Frekuensi</th>
                <th>Target Tanggal</th>
                <th>Teknisi (PIC)</th>
                <th>Prioritas</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Aksi SOP</th>
              </tr>
            </thead>
            <tbody>
              {filteredPM.length > 0 ? (
                filteredPM.map((pm) => (
                  <tr key={pm.id}>
                    <td>
                      <span className="asset-tag-badge">{pm.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                        {pm.title}
                      </div>
                      <div className="table-subtext" style={{ color: 'var(--color-primary-light)' }}>
                        ⚡ {pm.assetName} ({pm.assetId})
                      </div>
                    </td>
                    <td>
                      <span className="frequency-pill">{pm.frequency}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>
                        {pm.scheduledDate}
                      </div>
                      {pm.status === 'overdue' && (
                        <div style={{ fontSize: 11, color: '#dc2626', fontWeight: 600 }}>
                          Melewati Target
                        </div>
                      )}
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                      {pm.assignee}
                    </td>
                    <td>
                      <span className="priority-pill" data-priority={pm.priority}>
                        {pm.priority}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={pm.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-buttons-wrap">
                        {/* Tombol Buka Lembar Eksekusi SOP */}
                        <button
                          type="button"
                          className="btn-icon"
                          style={{ color: '#059669', borderColor: '#a7f3d0' }}
                          onClick={() => {
                            setSelectedPmForExecution(pm);
                            setIsExecutionOpen(true);
                          }}
                          title="Buka Lembar Kerja SOP & Checklist K3"
                        >
                          <ShieldCheck size={16} />
                        </button>

                        {/* Tombol Edit */}
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => {
                            setPmToEdit(pm);
                            setIsFormOpen(true);
                          }}
                          title="Edit Jadwal PM"
                        >
                          <Edit2 size={16} />
                        </button>

                        {/* Tombol Hapus */}
                        <button
                          type="button"
                          className="btn-icon btn-icon-danger"
                          onClick={() => handleDeletePM(pm.id, pm.title)}
                          title="Hapus Jadwal PM"
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
                      <Wrench size={32} style={{ opacity: 0.3, margin: '0 auto 8px' }} />
                      <p style={{ fontWeight: 500 }}>
                        Tidak ada jadwal pemeliharaan yang cocok dengan pencarian.
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
            Menampilkan <strong>{filteredPM.length}</strong> dari{' '}
            <strong>{pmList.length}</strong> jadwal pemeliharaan berkala.
          </span>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            LOTO (Lock-Out Tag-Out) wajib dipatuhi sebelum setiap pekerjaan listrik.
          </span>
        </div>
      </div>

      {/* Modal Form Tambah / Edit */}
      <PMModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSavePM}
        pmToEdit={pmToEdit}
        availableAssets={availableAssets}
      />

      {/* Modal Eksekusi SOP Lapangan */}
      <PMExecutionModal
        isOpen={isExecutionOpen}
        onClose={() => setIsExecutionOpen(false)}
        pm={selectedPmForExecution}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
