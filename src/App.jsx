/**
 * ============================================================
 * App.jsx - Komponen Utama & Konfigurasi Rute (Router)
 * ============================================================
 * 
 * PENJELASAN UNTUK SISWA SMK TITL:
 * Bayangkan router ini seperti "Sakelar Pemilih (Selector Switch)"
 * pada panel kontrol listrik.
 * 
 * Ketika posisi switch diubah (URL di browser berubah),
 * sistem akan mengalirkan tampilan ke modul yang sesuai:
 * - Posisi "/"              -> Dashboard
 * - Posisi "/assets"        -> Asset Management
 * - Posisi "/preventive"    -> Preventive Maintenance
 * - Posisi "/work-orders"   -> Work Orders
 * - Posisi "/inspection"    -> Inspection Checklist
 * - Posisi "/history"       -> Maintenance History
 * 
 * Semua halaman dibungkus oleh komponen <Layout />, sehingga
 * Sidebar dan Topbar selalu tampil konsisten di setiap halaman.
 * ============================================================
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AssetManagement from './pages/AssetManagement';
import PreventiveMaintenance from './pages/PreventiveMaintenance';
import WorkOrders from './pages/WorkOrders';
import InspectionChecklist from './pages/InspectionChecklist';
import MaintenanceHistory from './pages/MaintenanceHistory';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Induk: Menggunakan Layout utama (Sidebar + Topbar) */}
        <Route path="/" element={<Layout />}>
          {/* Rute Anak: Ditampilkan melalui <Outlet /> di dalam Layout */}
          <Route index element={<Dashboard />} />
          <Route path="assets" element={<AssetManagement />} />
          <Route path="preventive" element={<PreventiveMaintenance />} />
          <Route path="work-orders" element={<WorkOrders />} />
          <Route path="inspection" element={<InspectionChecklist />} />
          <Route path="history" element={<MaintenanceHistory />} />
          
          {/* Rute Cadangan: Jika ada URL yang tidak dikenali, arahkan ke Dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
