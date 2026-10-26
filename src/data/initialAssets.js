/**
 * ============================================================
 * initialAssets.js - Data Simulasi Awal Aset Kelistrikan (DEMO)
 * ============================================================
 * 
 * PENJELASAN UNTUK SISWA SMK TITL:
 * Data ini memodelkan peralatan instalasi tenaga listrik nyata
 * yang umum dijumpai di gardu distribusi, panel daya, dan industri:
 * 
 * Parameter Aset:
 * - id          : Kode Tag Aset (contoh: AST-001)
 * - name        : Nama Peralatan Kelistrikan
 * - category    : Kategori (Trafo, Panel Distribusi, Motor Listrik, dll.)
 * - location    : Lokasi penempatan fisik di area industri
 * - voltageLevel: Level tegangan kerja (TM = 20 kV, TR = 380/220 V)
 * - capacity    : Kapasitas daya/beban (kVA, kW, Ampere)
 * - status      : Status kelayakan (operational, warning, critical, in-progress)
 * - installDate : Tanggal pemasangan / commissioning
 * - lastCheck   : Tanggal inspeksi pemeliharaan terakhir
 * - notes       : Spesifikasi teknis khusus
 * ============================================================
 */

export const initialAssets = [
  {
    id: 'AST-001',
    name: 'Trafo Distribusi Step-Down 20kV / 400V',
    category: 'Transformator',
    location: 'Gardu Utama (Substation A)',
    voltageLevel: 'TM ke TR (20 kV / 400 V)',
    capacity: '630 kVA',
    status: 'operational',
    installDate: '2021-03-15',
    lastCheck: '2026-10-10',
    notes: 'Pendingin Oli ONAN, Proteksi Buchholz relay dan DGPT2 normal.',
  },
  {
    id: 'AST-002',
    name: 'Main Distribution Panel (MDP) Gedung A',
    category: 'Panel Distribusi',
    location: 'Ruang Listrik Utama Lt.1',
    voltageLevel: 'TR (3 Fasa 380/220 V)',
    capacity: 'Incomer ACB 1000A',
    status: 'operational',
    installDate: '2021-04-02',
    lastCheck: '2026-10-18',
    notes: 'Busbar tembaga 4P, dilengkapi digital power meter dan surge arrester.',
  },
  {
    id: 'AST-003',
    name: 'Sub Distribution Panel (SDP-01) Bengkel Las',
    category: 'Panel Distribusi',
    location: 'Bengkel Fabrikasi & Las',
    voltageLevel: 'TR (3 Fasa 380/220 V)',
    capacity: 'MCCB 250A',
    status: 'warning',
    installDate: '2022-01-20',
    lastCheck: '2026-10-22',
    notes: 'Keseimbangan beban fasa R-S-T perlu dievaluasi ulang (Fasa S beban tinggi).',
  },
  {
    id: 'AST-004',
    name: 'Motor Induksi 3 Fasa Kompresor Sentral',
    category: 'Motor Listrik',
    location: 'Ruang Utilitas Utility Room',
    voltageLevel: 'TR (380 V - Starter Star-Delta)',
    capacity: '22 kW (30 HP)',
    status: 'in-progress',
    installDate: '2020-08-11',
    lastCheck: '2026-10-25',
    notes: 'Sedang dalam perbaikan bearing motor dan pengecekan overload relay.',
  },
  {
    id: 'AST-005',
    name: 'Genset Silent Standby Emergency',
    category: 'Pembangkit / Backup',
    location: 'Ruang Genset Luar',
    voltageLevel: 'TR (400/230 V - 50 Hz)',
    capacity: '150 kVA',
    status: 'operational',
    installDate: '2021-06-10',
    lastCheck: '2026-10-15',
    notes: 'Panel ATS-AMF aktif, pemanasan berkala tiap hari Senin berjalan baik.',
  },
  {
    id: 'AST-006',
    name: 'Automatic Power Factor Capacitor Bank',
    category: 'Koreksi Faktor Daya',
    location: 'Ruang MDP Gedung A',
    voltageLevel: 'TR (415 V)',
    capacity: '120 kVAR (6 Steps)',
    status: 'operational',
    installDate: '2022-09-05',
    lastCheck: '2026-10-05',
    notes: 'Menjaga cos φ sistem di atas 0.95 agar terhindar dari denda KVARh PLN.',
  },
  {
    id: 'AST-007',
    name: 'UPS Online Double-Conversion Pusat Server',
    category: 'Pembangkit / Backup',
    location: 'Ruang Kontrol & Server IT',
    voltageLevel: '1 Fasa & 3 Fasa (220/380 V)',
    capacity: '20 kVA',
    status: 'critical',
    installDate: '2023-02-14',
    lastCheck: '2026-10-24',
    notes: 'Bank baterai nomor 3 menunjukkan resistansi internal tinggi, segera ganti.',
  },
];
