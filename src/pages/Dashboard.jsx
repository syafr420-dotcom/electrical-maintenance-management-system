/**
 * ============================================================
 * Dashboard.jsx - Halaman Utama Dashboard
 * ============================================================
 * 
 * PENJELASAN:
 * Halaman Dashboard menampilkan ringkasan seluruh sistem:
 * 1. Kartu statistik (4 kartu di atas)
 * 2. Tabel work order terbaru
 * 3. Timeline aktivitas terbaru
 * 4. Jadwal pemeliharaan mendatang
 * 5. Quick stats (statistik singkat)
 * 
 * Semua data berasal dari file demoData.js (data simulasi).
 * Dashboard ini TIDAK terhubung ke sistem kelistrikan nyata.
 * ============================================================
 */

import { useState, useEffect } from 'react';
import {
  Zap,
  ClipboardList,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Activity,
} from 'lucide-react';

import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import {
  dashboardStats,
  recentActivities,
  recentWorkOrders,
  quickStats,
} from '../data/demoData';
import { getStoredAssets, getStoredPM, getStoredWO, getStoredInspections, getStoredHistory } from '../utils/storage';

// Peta nama ikon (string) ke komponen Lucide
// Ini digunakan karena data di demoData menyimpan nama ikon sebagai string
const ICON_MAP = {
  Zap: Zap,
  ClipboardList: ClipboardList,
  CheckCircle: CheckCircle,
  AlertTriangle: AlertTriangle,
};

export default function Dashboard() {
  const [assetCount, setAssetCount] = useState(0);
  const [pmList, setPmList] = useState([]);
  const [woList, setWoList] = useState([]);
  const [inspectionsList, setInspectionsList] = useState([]);
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    // Ambil data riil dari LocalStorage
    const storedAssets = getStoredAssets();
    setAssetCount(storedAssets.length);

    const storedPM = getStoredPM();
    setPmList(storedPM);

    const storedWO = getStoredWO();
    setWoList(storedWO);

    const storedInspections = getStoredInspections();
    setInspectionsList(storedInspections);

    const storedHistory = getStoredHistory();
    setHistoryList(storedHistory);
  }, []);

  const completedPMCount = pmList.filter((p) => p.status === 'completed').length;
  const upcomingPMList = pmList.filter((p) => p.status !== 'completed').slice(0, 3);
  const activeWOCount = woList.filter((w) => w.status === 'open' || w.status === 'in-progress').length;
  const urgentWOCount = woList.filter((w) => w.priority === 'Darurat' || w.priority === 'Tinggi').length;
  const pendingInspections = inspectionsList.filter((i) => i.status === 'scheduled').length;
  const criticalFindings = inspectionsList.filter((i) => i.overallCondition === 'Kritis').length;

  return (
    <div>
      {/* ---- Baris 1: Kartu Statistik ---- */}
      <div className="stats-grid">
        {dashboardStats.map((stat) => {
          // Ambil komponen ikon berdasarkan nama string
          const IconComponent = ICON_MAP[stat.icon];
          
          let displayValue = stat.value;
          let displayDesc = stat.description;

          if (stat.id === 'total-assets') {
            displayValue = assetCount || stat.value;
            displayDesc = 'Peralatan di LocalStorage';
          } else if (stat.id === 'active-work-orders') {
            displayValue = activeWOCount;
            displayDesc = `${urgentWOCount} tiket butuh tindakan cepat`;
          } else if (stat.id === 'completed-maintenance') {
            displayValue = completedPMCount;
            displayDesc = 'Telah diverifikasi SOP K3';
          } else if (stat.id === 'pending-inspections') {
            displayValue = pendingInspections + criticalFindings;
            displayDesc = `${criticalFindings} temuan kritis / bahaya`;
          }
          
          return (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={displayValue}
              description={displayDesc}
              color={stat.color}
              icon={IconComponent ? <IconComponent size={20} /> : null}
            />
          );
        })}
      </div>

      {/* ---- Baris 2: Tabel + Aktivitas (2 kolom) ---- */}
      <div className="dashboard-grid">
        
        {/* Kolom Kiri: Tabel Work Order Terbaru */}
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">
              <ClipboardList size={18} />
              Work Order Terbaru
            </h2>
            <StatusBadge status="warning" label="Real-time WO" />
          </div>
          <div className="section-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pekerjaan</th>
                  <th>Peralatan</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {woList.slice(0, 5).map((wo) => (
                  <tr key={wo.id}>
                    <td style={{ fontWeight: 600, fontFamily: 'monospace' }}>
                      {wo.id}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{wo.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                        Prioritas: {wo.priority}
                      </div>
                    </td>
                    <td style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
                      {wo.assetName}
                    </td>
                    <td>
                      <StatusBadge status={wo.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kolom Kanan: Aktivitas Terbaru */}
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">
              <Activity size={18} />
              Aktivitas Terbaru
            </h2>
            <StatusBadge status="completed" label="Buku Logbook" />
          </div>
          <div className="section-body">
            {historyList.length > 0 ? (
              historyList.slice(0, 5).map((item) => {
                let dotColor = 'purple';
                if (item.sourceType === 'Preventive Maintenance') dotColor = 'green';
                else if (item.sourceType === 'Work Order') dotColor = 'amber';
                else if (item.sourceType === 'Inspeksi Rutin') dotColor = 'blue';

                return (
                  <div key={item.id} className="activity-item">
                    <span className={`activity-dot activity-dot--${dotColor}`}></span>
                    <div style={{ flex: 1 }}>
                      <div className="activity-text" style={{ fontWeight: 600 }}>
                        {item.title}
                      </div>
                      <div className="activity-time" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                        <span>⚡ {item.assetName}</span>
                        <span>{item.date} • {item.technician}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <span className={`activity-dot activity-dot--${activity.dotColor}`}></span>
                  <div>
                    <div className="activity-text">{activity.text}</div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ---- Baris 3: Jadwal PM + Quick Stats ---- */}
      <div className="dashboard-grid" style={{ marginTop: 0 }}>
        
        {/* Jadwal Pemeliharaan Mendatang */}
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">
              <Calendar size={18} />
              Jadwal PM Mendatang
            </h2>
            <StatusBadge status="info" label="DEMO" />
          </div>
          <div className="section-body">
            {upcomingPMList.length > 0 ? (
              upcomingPMList.map((pm) => {
                const totalSteps = pm.sopSteps ? pm.sopSteps.length : 1;
                const doneSteps = pm.sopSteps ? pm.sopSteps.filter((s) => s.done).length : 0;
                const progress = Math.round((doneSteps / totalSteps) * 100);

                return (
                  <div key={pm.id} style={{ marginBottom: 16 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 4,
                    }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>
                        {pm.id}: {pm.title}
                      </span>
                      <StatusBadge status={pm.status} />
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 12,
                      color: 'var(--color-text-secondary)',
                      marginBottom: 6,
                    }}>
                      <span>⚡ {pm.assetName}</span>
                      <span>Target: {pm.scheduledDate}</span>
                    </div>
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${progress}%`,
                          background: pm.status === 'overdue' ? '#dc2626' : undefined,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '20px 0' }}>
                Seluruh jadwal pemeliharaan telah diselesaikan!
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">
              <TrendingUp size={18} />
              Performa Sistem
            </h2>
            <StatusBadge status="info" label="DEMO" />
          </div>
          <div className="section-body">
            {quickStats.map((stat, index) => (
              <div key={index} className="quick-stat">
                <span className="quick-stat-label">{stat.label}</span>
                <span className="quick-stat-value">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
