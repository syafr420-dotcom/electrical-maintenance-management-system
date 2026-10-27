/**
 * ============================================================
 * AssetManagement.jsx - Halaman Manajemen Aset Kelistrikan
 * ============================================================
 * 
 * PENJELASAN UNTUK SISWA SMK TITL:
 * Modul ini berfungsi sebagai pusat kendali inventaris peralatan listrik.
 * 
 * Fitur-fitur yang aktif:
 * 1. Menampilkan seluruh peralatan dengan status kelayakan operasional.
 * 2. Pencarian cepat (Search) berdasarkan nama alat, kode tag, atau lokasi.
 * 3. Filter berdasarkan Status dan Kategori.
 * 4. Tambah Aset Baru (tersimpan langsung ke LocalStorage browser).
 * 5. Edit Spesifikasi Aset.
 * 6. Hapus Aset dengan konfirmasi keamanan.
 * 7. Nameplate Digital (melihat spesifikasi teknis lengkap).
 * 8. Tombol Reset untuk mengembalikan data awal simulasi DEMO.
 * ============================================================
 */

import { useState, useEffect, useMemo } from 'react';
import {
  Zap,
  Search,
  Plus,
  RotateCcw,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  AlertTriangle,
  Wrench,
  XCircle,
  Filter,
} from 'lucide-react';

import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import AssetModal from '../components/AssetModal';
import AssetDetailModal from '../components/AssetDetailModal';
import { getStoredAssets, saveStoredAssets, resetStoredAssets } from '../utils/storage';

export default function AssetManagement() {
  // State daftar aset yang dimuat dari LocalStorage
  const [assets, setAssets] = useState([]);

  // State untuk pencarian dan filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // State kontrol Modal Form (Tambah / Edit)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState(null);

  // State kontrol Modal Detail (Plat Nama)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAssetDetail, setSelectedAssetDetail] = useState(null);

  // State pesan notifikasi aksi (Toast)
  const [notification, setNotification] = useState(null);

  // Muat data saat halaman pertama kali dibuka
  useEffect(() => {
    const loadedAssets = getStoredAssets();
    setAssets(loadedAssets);
  }, []);

  // Tampilkan notifikasi sesaat lalu sembunyikan otomatis
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // --- Operasi CRUD (Create, Read, Update, Delete) ---

  // 1. Simpan Aset (Tambah Baru atau Update yang sudah ada)
  const handleSaveAsset = (formData) => {
    let updatedList;
    if (assetToEdit) {
      // Mode Edit: cari indeks dan perbarui
      updatedList = assets.map((item) =>
        item.id === formData.id ? formData : item
      );
      showToast(`Aset ${formData.name} berhasil diperbarui.`);
    } else {
      // Mode Tambah Baru: masukkan ke urutan pertama
      // Periksa apakah ID sudah dipakai
      const isDuplicate = assets.some((a) => a.id.toLowerCase() === formData.id.toLowerCase());
      if (isDuplicate) {
        showToast(`Kode Tag ${formData.id} sudah digunakan! Silakan gunakan kode lain.`, 'error');
        return;
      }
      updatedList = [formData, ...assets];
      showToast(`Aset baru ${formData.name} berhasil ditambahkan ke inventaris.`);
    }

    setAssets(updatedList);
    saveStoredAssets(updatedList);
    setAssetToEdit(null);
  };

  // 2. Hapus Aset
  const handleDeleteAsset = (assetId, assetName) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus aset "${assetName}" (${assetId}) dari inventaris?`
    );
    if (!confirmDelete) return;

    const filteredList = assets.filter((item) => item.id !== assetId);
    setAssets(filteredList);
    saveStoredAssets(filteredList);
    showToast(`Aset ${assetName} telah dihapus.`);
  };

  // 3. Reset ke Data Awal DEMO
  const handleResetData = () => {
    const confirmReset = window.confirm(
      'Kembalikan seluruh daftar inventaris ke data awal DEMO? Seluruh perubahan lokal Anda akan diganti dengan data bawaan.'
    );
    if (!confirmReset) return;

    const resetData = resetStoredAssets();
    setAssets(resetData);
    setSearchQuery('');
    setSelectedStatus('ALL');
    setSelectedCategory('ALL');
    showToast('Data aset berhasil direset ke data simulasi DEMO.');
  };

  // 4. Buka Form Edit
  const handleOpenEdit = (asset) => {
    setAssetToEdit(asset);
    setIsFormModalOpen(true);
  };

  // 5. Buka Plat Nama Detail
  const handleOpenDetail = (asset) => {
    setSelectedAssetDetail(asset);
    setIsDetailModalOpen(true);
  };

  // 6. Hitung Metrik Statistik secara Real-Time
  const stats = useMemo(() => {
    const total = assets.length;
    const operational = assets.filter((a) => a.status === 'operational').length;
    const warning = assets.filter((a) => a.status === 'warning').length;
    const criticalOrMaintenance = assets.filter(
      (a) => a.status === 'critical' || a.status === 'in-progress'
    ).length;

    return { total, operational, warning, criticalOrMaintenance };
  }, [assets]);

  // 7. Ambil daftar kategori unik dari data yang ada untuk opsi dropdown
  const categoriesList = useMemo(() => {
    const setCats = new Set(assets.map((a) => a.category).filter(Boolean));
    return Array.from(setCats);
  }, [assets]);

  // 8. Filter data berdasarkan pencarian teks, status, dan kategori
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Filter teks pencarian (Nama, ID, Lokasi, Catatan)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        asset.name?.toLowerCase().includes(q) ||
        asset.id?.toLowerCase().includes(q) ||
        asset.location?.toLowerCase().includes(q) ||
        asset.category?.toLowerCase().includes(q);

      // Filter Status
      const matchesStatus =
        selectedStatus === 'ALL' || asset.status === selectedStatus;

      // Filter Kategori
      const matchesCategory =
        selectedCategory === 'ALL' || asset.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [assets, searchQuery, selectedStatus, selectedCategory]);

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

      {/* Baris 1: 4 Kartu Metrik Inventaris Aset */}
      <div className="stats-grid">
        <StatCard
          label="Total Aset Terdaftar"
          value={stats.total}
          description="Aset dalam database lokal"
          color="blue"
          icon={<Zap size={20} />}
        />
        <StatCard
          label="Operasional Normal"
          value={stats.operational}
          description="Kondisi siap bekerja penuh"
          color="green"
          icon={<CheckCircle size={20} />}
        />
        <StatCard
          label="Perlu Perhatian"
          value={stats.warning}
          description="Perlu pengecekan berkala"
          color="amber"
          icon={<AlertTriangle size={20} />}
        />
        <StatCard
          label="Perbaikan / Kritis"
          value={stats.criticalOrMaintenance}
          description="Sedang ditangani teknisi"
          color="red"
          icon={<Wrench size={20} />}
        />
      </div>

      {/* Baris 2: Panel Utama Inventaris */}
      <div className="content-section">
        {/* Header Bagian dengan Tombol Aksi */}
        <div className="section-header" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 className="section-title">
              <Zap size={20} />
              Daftar Peralatan & Panel Listrik
            </h2>
            <StatusBadge status="info" label="LocalStorage" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleResetData}
              title="Kembalikan ke data awal bawaan sistem"
            >
              <RotateCcw size={14} />
              Reset Data DEMO
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setAssetToEdit(null);
                setIsFormModalOpen(true);
              }}
            >
              <Plus size={16} />
              Tambah Aset Baru
            </button>
          </div>
        </div>

        {/* Toolbar Pencarian & Filter */}
        <div className="toolbar-section">
          {/* Kotak Pencarian */}
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Cari nama peralatan, kode tag (AST-...), atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Hapus pencarian"
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
              <option value="operational">Operasional (Normal)</option>
              <option value="warning">Perhatian</option>
              <option value="in-progress">Dikerjakan (Pemeliharaan)</option>
              <option value="critical">Kritis</option>
            </select>
          </div>

          {/* Filter Kategori */}
          <div className="filter-group">
            <select
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="ALL">Semua Kategori</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabel Data Aset */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tag Aset</th>
                <th>Nama Peralatan</th>
                <th>Kategori</th>
                <th>Lokasi Penempatan</th>
                <th>Level Tegangan / Rating</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <tr key={asset.id}>
                    <td>
                      <span className="asset-tag-badge">{asset.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                        {asset.name}
                      </div>
                      {asset.notes && (
                        <div className="table-subtext">{asset.notes}</div>
                      )}
                    </td>
                    <td>
                      <span className="category-pill">{asset.category}</span>
                    </td>
                    <td style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
                      {asset.location}
                    </td>
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>
                        {asset.voltageLevel || '-'}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                        {asset.capacity || '-'}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={asset.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-buttons-wrap">
                        {/* Tombol Lihat Nameplate */}
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => handleOpenDetail(asset)}
                          title="Lihat Plat Nama Teknis"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Tombol Edit */}
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => handleOpenEdit(asset)}
                          title="Edit Spesifikasi Aset"
                        >
                          <Edit2 size={16} />
                        </button>

                        {/* Tombol Hapus */}
                        <button
                          type="button"
                          className="btn-icon btn-icon-danger"
                          onClick={() => handleDeleteAsset(asset.id, asset.name)}
                          title="Hapus Aset"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ color: 'var(--color-text-muted)', marginBottom: 8 }}>
                      <Zap size={32} style={{ opacity: 0.3, margin: '0 auto 8px' }} />
                      <p style={{ fontWeight: 500 }}>
                        Tidak ada peralatan listrik yang cocok dengan kriteria pencarian.
                      </p>
                    </div>
                    {(searchQuery || selectedStatus !== 'ALL' || selectedCategory !== 'ALL') && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ marginTop: 8 }}
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedStatus('ALL');
                          setSelectedCategory('ALL');
                        }}
                      >
                        Reset Filter Pencarian
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Tabel dengan Info Jumlah */}
        <div className="table-footer-info">
          <span>
            Menampilkan <strong>{filteredAssets.length}</strong> dari{' '}
            <strong>{assets.length}</strong> total aset kelistrikan.
          </span>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            Tersimpan secara lokal di browser Anda.
          </span>
        </div>
      </div>

      {/* Modal Form Tambah / Edit */}
      <AssetModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveAsset}
        assetToEdit={assetToEdit}
      />

      {/* Modal Nameplate Detail */}
      <AssetDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        asset={selectedAssetDetail}
      />
    </div>
  );
}
