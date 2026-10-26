/**
 * ============================================================
 * storage.js - Utilitas Penyimpanan Data Lokal (LocalStorage)
 * ============================================================
 * 
 * PENJELASAN UNTUK SISWA SMK TITL:
 * Bayangkan LocalStorage ini seperti "Buku Catatan Inventaris
 * Tahan Bencana" di lemari bengkel listrik.
 * 
 * Sekalipun komputer dimatikan atau browser di-refresh,
 * data yang disimpan di LocalStorage akan TETAP ADA di memori
 * browser komputer Anda tanpa memerlukan koneksi server internet.
 * 
 * Operasi Utama:
 * 1. getStoredAssets() : Membaca seluruh aset dari memori.
 * 2. saveStoredAssets(): Menulis/memperbarui daftar aset ke memori.
 * 3. resetStoredAssets(): Mengembalikan data ke kondisi DEMO awal.
 * ============================================================
 */

import { initialAssets } from '../data/initialAssets';
import { initialPM } from '../data/initialPM';
import { initialWO } from '../data/initialWO';
import { initialInspections } from '../data/initialInspections';
import { initialHistory } from '../data/initialHistory';

// Kunci penyimpanan unik di dalam LocalStorage browser
const STORAGE_KEY_ASSETS = 'emms_assets_data';
const STORAGE_KEY_PM = 'emms_pm_data';
const STORAGE_KEY_WO = 'emms_wo_data';
const STORAGE_KEY_INSPECTIONS = 'emms_inspections_data';
const STORAGE_KEY_HISTORY = 'emms_history_data';

/**
 * Mengambil daftar aset dari LocalStorage.
 * Jika belum ada data sama sekali, sistem otomatis mengisi dengan
 * data simulasi awal (initialAssets).
 */
export function getStoredAssets() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY_ASSETS);
    if (!rawData) {
      // Belum ada data di browser, inisialisasi dengan data demo
      localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(initialAssets));
      return initialAssets;
    }
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Gagal membaca data dari LocalStorage:', error);
    return initialAssets;
  }
}

/**
 * Menyimpan array daftar aset terbaru ke LocalStorage.
 * @param {Array} assets - Array objek aset
 */
export function saveStoredAssets(assets) {
  try {
    localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(assets));
  } catch (error) {
    console.error('Gagal menyimpan data ke LocalStorage:', error);
  }
}

/**
 * Mengembalikan data aset ke data awal DEMO (Reset).
 */
export function resetStoredAssets() {
  try {
    localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(initialAssets));
    return initialAssets;
  } catch (error) {
    console.error('Gagal mereset data aset:', error);
    return initialAssets;
  }
}

// ============================================================
// PREVENTIVE MAINTENANCE STORAGE FUNCTIONS
// ============================================================

/**
 * Mengambil seluruh jadwal Preventive Maintenance dari LocalStorage.
 */
export function getStoredPM() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY_PM);
    if (!rawData) {
      localStorage.setItem(STORAGE_KEY_PM, JSON.stringify(initialPM));
      return initialPM;
    }
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Gagal membaca data PM dari LocalStorage:', error);
    return initialPM;
  }
}

/**
 * Menyimpan daftar jadwal PM terbaru ke LocalStorage.
 * @param {Array} pmList - Array objek PM
 */
export function saveStoredPM(pmList) {
  try {
    localStorage.setItem(STORAGE_KEY_PM, JSON.stringify(pmList));
  } catch (error) {
    console.error('Gagal menyimpan data PM ke LocalStorage:', error);
  }
}

/**
 * Mereset data jadwal PM ke data awal DEMO.
 */
export function resetStoredPM() {
  try {
    localStorage.setItem(STORAGE_KEY_PM, JSON.stringify(initialPM));
    return initialPM;
  } catch (error) {
    console.error('Gagal mereset data PM:', error);
    return initialPM;
  }
}

// ============================================================
// WORK ORDERS STORAGE FUNCTIONS
// ============================================================

/**
 * Mengambil seluruh Work Order dari LocalStorage.
 */
export function getStoredWO() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY_WO);
    if (!rawData) {
      localStorage.setItem(STORAGE_KEY_WO, JSON.stringify(initialWO));
      return initialWO;
    }
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Gagal membaca data Work Order dari LocalStorage:', error);
    return initialWO;
  }
}

/**
 * Menyimpan daftar Work Order terbaru ke LocalStorage.
 * @param {Array} woList - Array objek Work Order
 */
export function saveStoredWO(woList) {
  try {
    localStorage.setItem(STORAGE_KEY_WO, JSON.stringify(woList));
  } catch (error) {
    console.error('Gagal menyimpan data Work Order ke LocalStorage:', error);
  }
}

/**
 * Mereset data Work Order ke data awal DEMO.
 */
export function resetStoredWO() {
  try {
    localStorage.setItem(STORAGE_KEY_WO, JSON.stringify(initialWO));
    return initialWO;
  } catch (error) {
    console.error('Gagal mereset data Work Order:', error);
    return initialWO;
  }
}

// ============================================================
// INSPECTION CHECKLIST STORAGE FUNCTIONS
// ============================================================

/**
 * Mengambil seluruh lembar inspeksi dari LocalStorage.
 */
export function getStoredInspections() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY_INSPECTIONS);
    if (!rawData) {
      localStorage.setItem(STORAGE_KEY_INSPECTIONS, JSON.stringify(initialInspections));
      return initialInspections;
    }
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Gagal membaca data Inspeksi dari LocalStorage:', error);
    return initialInspections;
  }
}

/**
 * Menyimpan daftar lembar inspeksi terbaru ke LocalStorage.
 * @param {Array} list - Array objek Inspeksi
 */
export function saveStoredInspections(list) {
  try {
    localStorage.setItem(STORAGE_KEY_INSPECTIONS, JSON.stringify(list));
  } catch (error) {
    console.error('Gagal menyimpan data Inspeksi ke LocalStorage:', error);
  }
}

/**
 * Mereset data Inspeksi ke data awal DEMO.
 */
export function resetStoredInspections() {
  try {
    localStorage.setItem(STORAGE_KEY_INSPECTIONS, JSON.stringify(initialInspections));
    return initialInspections;
  } catch (error) {
    console.error('Gagal mereset data Inspeksi:', error);
    return initialInspections;
  }
}

// ============================================================
// MAINTENANCE HISTORY STORAGE FUNCTIONS
// ============================================================

/**
 * Mengambil seluruh catatan riwayat pemeliharaan dari LocalStorage.
 */
export function getStoredHistory() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!rawData) {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(initialHistory));
      return initialHistory;
    }
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Gagal membaca data Riwayat dari LocalStorage:', error);
    return initialHistory;
  }
}

/**
 * Menyimpan daftar riwayat pemeliharaan terbaru ke LocalStorage.
 * @param {Array} list - Array objek Riwayat
 */
export function saveStoredHistory(list) {
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(list));
  } catch (error) {
    console.error('Gagal menyimpan data Riwayat ke LocalStorage:', error);
  }
}

/**
 * Mereset data riwayat pemeliharaan ke data awal DEMO.
 */
export function resetStoredHistory() {
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(initialHistory));
    return initialHistory;
  } catch (error) {
    console.error('Gagal mereset data Riwayat:', error);
    return initialHistory;
  }
}

/**
 * Menambahkan 1 rekaman riwayat baru secara otomatis ke daftar riwayat.
 * Berguna saat teknisi menyelesaikan PM atau Work Order di modul lain.
 * @param {Object} record - Objek data riwayat
 */
export function addHistoryRecord(record) {
  try {
    const currentList = getStoredHistory();
    const updated = [record, ...currentList];
    saveStoredHistory(updated);
    return updated;
  } catch (error) {
    console.error('Gagal menambahkan catatan riwayat baru:', error);
  }
}



