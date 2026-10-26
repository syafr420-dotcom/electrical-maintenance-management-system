/**
 * ============================================================
 * Topbar.jsx - Komponen Bar Atas
 * ============================================================
 * 
 * PENJELASAN:
 * Topbar adalah bilah di bagian atas halaman yang menampilkan:
 * - Judul halaman yang sedang aktif
 * - Indikator DEMO MODE
 * - Waktu saat ini (diupdate setiap detik)
 * 
 * PROPS:
 * - title    : Judul halaman (contoh: "Dashboard")
 * - subtitle : Keterangan tambahan (opsional)
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { Clock, Menu } from 'lucide-react';

export default function Topbar({ title, subtitle, onMenuClick }) {
  // State untuk menyimpan waktu saat ini
  const [currentTime, setCurrentTime] = useState(new Date());

  // useEffect: jalankan kode saat komponen pertama kali muncul
  // setInterval mengupdate waktu setiap 1 detik (1000 ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup: hentikan interval saat komponen dihapus
    // Ini penting agar tidak terjadi "memory leak"
    return () => clearInterval(timer);
  }, []);

  // Format waktu menjadi "HH:MM:SS" dalam zona waktu lokal
  const timeString = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Format tanggal menjadi "Senin, 27 Oktober 2026"
  const dateString = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Tombol hamburger (hanya tampil di mobile via CSS) */}
        <button
          className="sidebar-toggle"
          onClick={onMenuClick}
          aria-label="Buka menu navigasi"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="topbar-title">{title}</h1>
          {subtitle && <p className="topbar-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="topbar-right">
        {/* Waktu */}
        <div className="topbar-time">
          <Clock size={14} />
          <span>{dateString} • {timeString}</span>
        </div>

        {/* Indikator DEMO */}
        <div className="topbar-demo-indicator">
          <span className="topbar-demo-dot"></span>
          DEMO
        </div>
      </div>
    </header>
  );
}
