/**
 * ============================================================
 * Layout.jsx - Komponen Tata Letak Utama
 * ============================================================
 * 
 * PENJELASAN:
 * Layout menggabungkan Sidebar, Topbar, dan area konten utama
 * menjadi satu struktur halaman. Semua halaman (Dashboard,
 * Asset Management, dll.) ditampilkan di dalam komponen ini.
 * 
 * React Router menggunakan <Outlet /> untuk menampilkan
 * halaman yang sesuai dengan URL saat ini.
 * 
 * STRUKTUR TAMPILAN:
 * ┌─────────┬──────────────────────┐
 * │         │       Topbar         │
 * │ Sidebar ├──────────────────────┤
 * │         │                      │
 * │         │     <Outlet />       │
 * │         │   (Konten Halaman)   │
 * │         │                      │
 * └─────────┴──────────────────────┘
 * ============================================================
 */

import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

// Peta untuk menentukan judul & subtitle berdasarkan URL halaman
const PAGE_TITLES = {
  '/':             { title: 'Dashboard',              subtitle: 'Ringkasan sistem pemeliharaan kelistrikan' },
  '/assets':       { title: 'Asset Management',       subtitle: 'Kelola aset dan peralatan listrik' },
  '/preventive':   { title: 'Preventive Maintenance', subtitle: 'Jadwal pemeliharaan berkala' },
  '/work-orders':  { title: 'Work Orders',            subtitle: 'Kelola perintah kerja' },
  '/inspection':   { title: 'Inspection Checklist',   subtitle: 'Daftar periksa inspeksi' },
  '/history':      { title: 'Maintenance History',    subtitle: 'Riwayat pemeliharaan' },
};

export default function Layout() {
  // State untuk kontrol buka/tutup sidebar di mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // useLocation() memberi tahu URL halaman saat ini
  const location = useLocation();
  
  // Ambil judul berdasarkan URL, atau gunakan default
  const pageInfo = PAGE_TITLES[location.pathname] || {
    title: 'EMMS',
    subtitle: '',
  };

  return (
    <div className="app-layout">
      {/* Sidebar navigasi */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Area utama (Topbar + Konten) */}
      <div className="main-area">
        <Topbar
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        {/* Konten halaman ditampilkan di sini oleh React Router */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
