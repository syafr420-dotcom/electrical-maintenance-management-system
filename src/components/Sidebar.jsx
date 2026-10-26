/**
 * ============================================================
 * Sidebar.jsx - Komponen Menu Navigasi Kiri
 * ============================================================
 * 
 * PENJELASAN:
 * Sidebar adalah menu utama di sisi kiri layar. Berisi:
 * - Logo dan nama aplikasi
 * - 6 menu modul (Dashboard, Asset Management, dst.)
 * - Badge DEMO MODE di bagian bawah
 * 
 * Sidebar menggunakan React Router (NavLink) agar menu yang
 * aktif otomatis diberi highlight/warna berbeda.
 * 
 * Di layar kecil (ponsel), sidebar tersembunyi dan muncul
 * saat tombol hamburger (☰) ditekan.
 * ============================================================
 */

import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Zap,
  Wrench,
  ClipboardList,
  ClipboardCheck,
  History,
  X,
} from 'lucide-react';

// Daftar menu navigasi
// "path" = URL halaman, "label" = teks yang tampil, "icon" = komponen ikon
const NAV_ITEMS = [
  { path: '/',                    label: 'Dashboard',             icon: LayoutDashboard },
  { path: '/assets',              label: 'Asset Management',      icon: Zap },
  { path: '/preventive',         label: 'Preventive Maintenance', icon: Wrench },
  { path: '/work-orders',        label: 'Work Orders',            icon: ClipboardList },
  { path: '/inspection',         label: 'Inspection Checklist',   icon: ClipboardCheck },
  { path: '/history',            label: 'Maintenance History',    icon: History },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay gelap di belakang sidebar (hanya muncul di mobile) */}
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      />

      {/* Sidebar utama */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        
        {/* --- Header: Logo + Nama Aplikasi --- */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Zap size={22} />
          </div>
          <div className="sidebar-brand">
            <span className="sidebar-brand-name">EMMS</span>
            <span className="sidebar-brand-sub">Maintenance System</span>
          </div>
          
          {/* Tombol tutup (hanya muncul di mobile saat sidebar terbuka) */}
          {isOpen && (
            <button
              onClick={onClose}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: 'var(--sidebar-text)',
                cursor: 'pointer',
                padding: '4px',
              }}
              aria-label="Tutup menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* --- Navigasi Menu --- */}
        <nav className="sidebar-nav">
          <span className="sidebar-section-label">Menu Utama</span>
          
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={onClose} // Tutup sidebar di mobile saat menu diklik
            >
              <item.icon size={20} className="sidebar-link-icon" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* --- Footer Sidebar --- */}
        <div className="sidebar-footer">
          <span className="sidebar-demo-badge">⚡ DEMO MODE</span>
          <div style={{ marginTop: 8 }}>EMMS v1.0 — Tahap 1</div>
        </div>
      </aside>
    </>
  );
}
