/**
 * ============================================================
 * demoData.js - Data Simulasi untuk EMMS
 * ============================================================
 * 
 * PENJELASAN:
 * File ini berisi data palsu (dummy/demo) yang digunakan untuk
 * menampilkan tampilan aplikasi. Data ini BUKAN data nyata.
 * 
 * Semua data diberi label "DEMO" agar pengguna memahami bahwa
 * ini hanya simulasi, bukan sistem yang terhubung ke perangkat
 * listrik sesungguhnya.
 * 
 * Pada tahap selanjutnya, data ini akan diganti dengan data
 * dari LocalStorage yang bisa ditambah/ubah/hapus oleh pengguna.
 * ============================================================
 */

// Statistik ringkasan untuk Dashboard
export const dashboardStats = [
  {
    id: 'total-assets',
    label: 'Total Aset',
    value: 48,
    description: 'Peralatan terdaftar (DEMO)',
    color: 'blue',
    icon: 'Zap',           // Nama ikon dari Lucide
  },
  {
    id: 'active-work-orders',
    label: 'Work Order Aktif',
    value: 12,
    description: '3 mendesak, 9 normal (DEMO)',
    color: 'amber',
    icon: 'ClipboardList',
  },
  {
    id: 'completed-maintenance',
    label: 'PM Selesai',
    value: 156,
    description: 'Tahun ini (DEMO)',
    color: 'green',
    icon: 'CheckCircle',
  },
  {
    id: 'pending-inspections',
    label: 'Inspeksi Tertunda',
    value: 5,
    description: 'Perlu dijadwalkan (DEMO)',
    color: 'red',
    icon: 'AlertTriangle',
  },
];

// Ringkasan tambahan di dashboard
export const quickStats = [
  { label: 'Uptime Sistem', value: '98.5%' },
  { label: 'Rata-rata Response Time', value: '2.3 jam' },
  { label: 'PM Compliance Rate', value: '94%' },
  { label: 'Backlog Work Order', value: '7 item' },
];

// Aktivitas terbaru (timeline)
export const recentActivities = [
  {
    id: 1,
    text: 'PM-024: Pemeliharaan trafo distribusi 500kVA selesai',
    time: '2 jam lalu',
    dotColor: 'green',
  },
  {
    id: 2,
    text: 'WO-089: Perbaikan MCB panel utama Gedung A - dikerjakan',
    time: '4 jam lalu',
    dotColor: 'blue',
  },
  {
    id: 3,
    text: 'Inspeksi rutin panel MDP Gedung B dijadwalkan',
    time: '6 jam lalu',
    dotColor: 'amber',
  },
  {
    id: 4,
    text: 'WO-087: Penggantian kabel NYY 4x16mm² - overdue',
    time: 'Kemarin',
    dotColor: 'red',
  },
  {
    id: 5,
    text: 'PM-023: Pengecekan grounding system selesai',
    time: 'Kemarin',
    dotColor: 'green',
  },
];

// Work orders terbaru untuk tabel di dashboard
export const recentWorkOrders = [
  {
    id: 'WO-089',
    title: 'Perbaikan MCB Panel Utama',
    location: 'Gedung A - Lt.1',
    priority: 'Tinggi',
    status: 'in-progress',
    assignee: 'Ahmad R.',
  },
  {
    id: 'WO-088',
    title: 'Penggantian Lampu Emergency',
    location: 'Gedung B - Lt.2',
    priority: 'Normal',
    status: 'scheduled',
    assignee: 'Budi S.',
  },
  {
    id: 'WO-087',
    title: 'Penggantian Kabel NYY 4x16mm²',
    location: 'Area Produksi',
    priority: 'Tinggi',
    status: 'overdue',
    assignee: 'Cahyo W.',
  },
  {
    id: 'WO-086',
    title: 'Kalibrasi CT Ratio Panel',
    location: 'Gardu Utama',
    priority: 'Normal',
    status: 'completed',
    assignee: 'Dimas P.',
  },
  {
    id: 'WO-085',
    title: 'Pemeriksaan Kapasitor Bank',
    location: 'Ruang Panel',
    priority: 'Rendah',
    status: 'scheduled',
    assignee: 'Eko F.',
  },
];

// Jadwal pemeliharaan mendatang
export const upcomingMaintenance = [
  {
    id: 'PM-025',
    task: 'Pengecekan Isolasi Kabel Tegangan Menengah',
    dueDate: '28 Okt 2026',
    equipment: 'Kabel TM 20kV',
    progress: 0,
  },
  {
    id: 'PM-026',
    task: 'Pembersihan Panel Distribusi',
    dueDate: '30 Okt 2026',
    equipment: 'Panel SDP-01',
    progress: 25,
  },
  {
    id: 'PM-027',
    task: 'Thermography Busbar Utama',
    dueDate: '02 Nov 2026',
    equipment: 'Busbar MDP',
    progress: 0,
  },
];
