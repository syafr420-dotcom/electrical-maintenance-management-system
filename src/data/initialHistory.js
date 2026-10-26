/**
 * ============================================================
 * initialHistory.js - Data Simulasi Arsip Riwayat Pemeliharaan (DEMO)
 * ============================================================
 * 
 * PENJELASAN UNTUK SISWA SMK TITL:
 * File ini berisi arsip permanen rekam jejak pemeliharaan,
 * perbaikan, penggantian suku cadang, dan pengujian berkala
 * pada seluruh instalasi listrik industri.
 * 
 * Setiap rekaman riwayat mencatat:
 * - id           : Kode Berita Acara (HIST-301, HIST-302, dst.)
 * - date         : Tanggal pekerjaan selesai dilakukan
 * - sourceType   : Jenis pekerjaan (Work Order, Preventive Maintenance, Inspeksi, Modifikasi)
 * - referenceId  : Nomor tiket rujukan asal (misal: PM-004, WO-103)
 * - title        : Nama pekerjaan yang telah diselesaikan
 * - assetId      : Kode peralatan yang dirawat
 * - assetName    : Nama peralatan
 * - technician   : Teknisi penanggung jawab
 * - actionSummary: Uraian tindakan teknis dan parameter uji ukur
 * - partsReplaced: Daftar komponen atau kabel yang diganti
 * - downtime     : Lama pemadaman listrik yang dibutuhkan selama pekerjaan
 * ============================================================
 */

export const initialHistory = [
  {
    id: 'HIST-301',
    date: '2026-10-20',
    sourceType: 'Preventive Maintenance',
    referenceId: 'PM-004',
    title: 'Pengukuran Tahanan Pembumian (Earth Grounding Test)',
    assetId: 'AST-002',
    assetName: 'Main Distribution Panel (MDP) Gedung A',
    technician: 'Dimas Prasetyo',
    actionSummary: 'Pengukuran nilai tahanan elektroda grounding utama menggunakan Digital Earth Tester. Hasil ukur 1.8 Ohm (Memenuhi syarat PUIL < 5 Ohm). Klem dibersihkan dan dilapisi gemuk pelindung korosi.',
    partsReplaced: 'Klem grounding kuningan baut M10 (2 pcs).',
    downtime: 'Tanpa Pemadaman (Live working grounding bar)',
  },
  {
    id: 'HIST-302',
    date: '2026-10-24',
    sourceType: 'Work Order',
    referenceId: 'WO-103',
    title: 'Penggantian Lampu Penerangan Darurat (Emergency Lights) Koridor',
    assetId: 'AST-002',
    assetName: 'Main Distribution Panel (MDP) Gedung A',
    technician: 'Dimas Prasetyo',
    actionSummary: 'Penggantian modul baterai emergency pack Ni-Cd internal yang soak. Uji simulasi pemadaman sakelar penerangan membuktikan lampu menyala terang 2 jam penuh.',
    partsReplaced: '2x Emergency Battery Pack Ni-Cd 3.6V 1800mAh, 1x Lampu LED Tube T8 18W.',
    downtime: '15 Menit pemadaman grup penerangan lantai 2',
  },
  {
    id: 'HIST-303',
    date: '2026-10-15',
    sourceType: 'Preventive Maintenance',
    referenceId: 'PM-005',
    title: 'Pembersihan & Penggantian Kontaktor Step Kapasitor Bank',
    assetId: 'AST-006',
    assetName: 'Automatic Power Factor Capacitor Bank',
    technician: 'Eko Fajar',
    actionSummary: 'Pembersihan debu busbar kapasitor, pengosongan muatan listrik statis, dan penggantian kontaktor step 2 yang aus kontak peredam inrush current. Cos phi sistem terjaga di angka 0.96.',
    partsReplaced: '1x Kontaktor Kapasitor Khusus 3P 25 kVAR 400V (Schneider LC1D).',
    downtime: '1 Jam pemadaman panel kapasitor bank',
  },
  {
    id: 'HIST-304',
    date: '2026-10-21',
    sourceType: 'Modifikasi & Upgrade',
    referenceId: 'WO-105',
    title: 'Pemasangan Surge Protective Device (SPD) Tipe 2 di Panel SDP Pompa',
    assetId: 'AST-003',
    assetName: 'Sub Distribution Panel (SDP-01) Bengkel Las',
    technician: 'Eko Fajar & Ahmad Riyadi',
    actionSummary: 'Pemasangan unit Surge Arrester 40kA 400V untuk proteksi surja petir terhadap inverter motor. Pengawatan dihubungkan ke busbar fasa R-S-T-N dan kawat tembaga BC 16mm² ke grounding bar.',
    partsReplaced: '1x SPD Type 2 3P+N 40kA, Kawat tembaga telanjang BC 16mm² (4 meter).',
    downtime: '30 Menit pemadaman panel SDP',
  },
  {
    id: 'HIST-305',
    date: '2026-10-10',
    sourceType: 'Preventive Maintenance',
    referenceId: 'PM-002',
    title: 'Pembersihan & Pemeriksaan Rutin Bushing Trafo 20kV',
    assetId: 'AST-001',
    assetName: 'Trafo Distribusi Step-Down 20kV / 400V',
    technician: 'Budi Santoso & Tim Gardu',
    actionSummary: 'Pembersihan isolator keramik bushing tegangan menengah dan tegangan rendah dari jelaga debu industri. Pengencangan baut sepatu kabel bushing sekunder fasa R-S-T-N.',
    partsReplaced: 'Silika gel breather tabung pernapasan (2 kg silika biru).',
    downtime: '2 Jam pemadaman terkoordinasi dengan PLN',
  },
];
