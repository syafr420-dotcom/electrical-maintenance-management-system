/**
 * ============================================================
 * initialInspections.js - Data Simulasi Inspeksi Rutin Kelistrikan (DEMO)
 * ============================================================
 * 
 * PENJELASAN UNTUK SISWA SMK TITL:
 * Inspeksi adalah patroli pemeriksaan fisik dan visual pada panel
 * atau gardu listrik yang dilakukan secara periodik (harian/tiap shift).
 * 
 * Tujuannya adalah mendeteksi kelainan sekecil apapun sebelum
 * memicu trip proteksi atau korsleting (hubung singkat).
 * 
 * Kriteria Hasil Checkpoint:
 * - pass   : Kondisi baik, aman, dan normal sesuai standar PUIL.
 * - warning: Ada gejala ringan yang perlu diperhatikan (misal: debu tebal, 1 lampu fasa redup).
 * - fail   : Kondisi bahaya! (misal: bau sangit isolasi, baut busbar kendor berderit, air merembes).
 * ============================================================
 */

export const initialInspections = [
  {
    id: 'INS-201',
    title: 'Inspeksi Visual & Pengawasan Shift Pagi Gardu Utama Trafo',
    assetId: 'AST-001',
    assetName: 'Trafo Distribusi Step-Down 20kV / 400V',
    inspector: 'Ahmad Riyadi (Teknisi TITL)',
    date: '2026-10-27',
    shift: 'Pagi (07:00 - 15:00)',
    status: 'completed',
    overallCondition: 'Normal', // Normal | Warning | Kritis
    checkpoints: [
      {
        category: 'Kondisi Fisik & Visual',
        item: 'Pintu gardu terkunci rapat dan rambu bahaya tegangan tinggi terpasang jelas.',
        result: 'pass',
        notes: 'Pintu dan gembok berfungsi baik.',
      },
      {
        category: 'Kondisi Fisik & Visual',
        item: 'Tidak ada serangga, tikus, atau kotoran yang berpotensi menyebabkan korsleting.',
        result: 'pass',
        notes: 'Ruang gardu bersih dan kering.',
      },
      {
        category: 'Indikator & Suhu Trafo',
        item: 'Termometer oli trafo menunjukkan suhu di bawah 75°C pada beban normal.',
        result: 'pass',
        notes: 'Suhu tercatat 52°C, aman.',
      },
      {
        category: 'Pendeteksian Bau & Suara',
        item: 'Tidak terdengar suara dengung keras abnormal atau bunyi desis (corona discharge).',
        result: 'pass',
        notes: 'Suara dengung trafo dalam batas wajar.',
      },
      {
        category: 'K3 & Alat Pemadam',
        item: 'Tabung APAR gas CO2 di dekat trafo dalam kondisi siap pakai (jarum manometer hijau).',
        result: 'pass',
        notes: 'Manometer berada pada zona hijau (OK).',
      },
    ],
    findingsSummary: 'Kondisi keseluruhan gardu dan transformator 20kV dalam keadaan aman, bersih, dan beroperasi normal.',
  },
  {
    id: 'INS-202',
    title: 'Patroli Pemeriksaan Panel Utama MDP Gedung A',
    assetId: 'AST-002',
    assetName: 'Main Distribution Panel (MDP) Gedung A',
    inspector: 'Budi Santoso',
    date: '2026-10-26',
    shift: 'Siang (15:00 - 23:00)',
    status: 'completed',
    overallCondition: 'Warning',
    checkpoints: [
      {
        category: 'Kondisi Fisik & Visual',
        item: 'Semua lampu pilot lamp penunjuk Fasa R-S-T menyala terang dan seimbang.',
        result: 'warning',
        notes: 'Lampu pilot lamp Fasa S padam, kemungkinan bohlam LED putus atau sekring kontrol putus.',
      },
      {
        category: 'Indikator & Suhu',
        item: 'Voltmeter menunjukkan tegangan fasa-ke-fasa 380V - 400V (toleransi ±5%).',
        result: 'pass',
        notes: 'Tegangan terukur: RS=395V, ST=392V, TR=394V.',
      },
      {
        category: 'Ventilasi & Suhu Panel',
        item: 'Kipas pendingin panel (exhaust fan) berputar lancar tanpa hambatan.',
        result: 'pass',
        notes: 'Aliran udara ventilasi normal.',
      },
      {
        category: 'K3 & Kebersihan',
        item: 'Karet isolasi lantai kerja di depan panel terpasang rapi tanpa sobekan.',
        result: 'pass',
        notes: 'Karpet isolator 1000V dalam posisi tepat.',
      },
    ],
    findingsSummary: 'Pilot lamp Fasa S padam. Perlu penggantian lampu indikator, namun sistem penyaluran tenaga tetap aman.',
  },
  {
    id: 'INS-203',
    title: 'Pemeriksaan Rutin Sub Distribution Panel (SDP) Bengkel Las',
    assetId: 'AST-003',
    assetName: 'Sub Distribution Panel (SDP-01) Bengkel Las',
    inspector: 'Cahyo Wicaksono',
    date: '2026-10-27',
    shift: 'Pagi (07:00 - 15:00)',
    status: 'completed',
    overallCondition: 'Kritis',
    checkpoints: [
      {
        category: 'Kondisi Fisik & Visual',
        item: 'Pintu panel dapat ditutup rapat dan tidak terganjal kabel temporer.',
        result: 'warning',
        notes: 'Ditemukan kabel colokan darurat mesin las diselipkan keluar dari celah pintu panel.',
      },
      {
        category: 'Pendeteksian Bau & Suara',
        item: 'Tidak tercium bau gosong isolasi kabel PVC atau timbul percikan api.',
        result: 'fail',
        notes: 'BAHAYA: Tercium bau sangit isolasi kabel di sekitar MCB grup stop kontak mesin las nomor 4!',
      },
      {
        category: 'Indikator & Metering',
        item: 'Beban arus tidak melebihi kapasitas kabel dan MCB pembagi.',
        result: 'fail',
        notes: 'Kabel fasa terasa panas saat disentuh dengan sarung tangan isolasi. Beban overload.',
      },
      {
        category: 'K3 & Grounding',
        item: 'Bodi panel terhubung kokoh ke kawat pembumian (grounding busbar).',
        result: 'pass',
        notes: 'Kawat grounding terikat kencang.',
      },
    ],
    findingsSummary: 'TEMUAN KRITIS: Ditemukan kabel fasa mengalami panas berlebih (overheat) dan bau sangit isolasi. Segera terbitkan Work Order darurat!',
  },
  {
    id: 'INS-204',
    title: 'Inspeksi Kesiapan Genset Standby & Panel ATS',
    assetId: 'AST-005',
    assetName: 'Genset Silent Standby Emergency 150 kVA',
    inspector: 'Dimas Prasetyo',
    date: '2026-10-28',
    shift: 'Pagi (07:00 - 15:00)',
    status: 'scheduled',
    overallCondition: 'Normal',
    checkpoints: [
      {
        category: 'Kondisi Fisik & Visual',
        item: 'Level oli pelumas mesin dan air radiator pendingin berada di garis batas aman.',
        result: 'pass',
        notes: '',
      },
      {
        category: 'Kelistrikan Baterai',
        item: 'Tegangan baterai aki minimal 24 VDC dan terminal kutub bebas dari korosi garam asam.',
        result: 'pass',
        notes: '',
      },
      {
        category: 'Panel Kontrol ATS-AMF',
        item: 'Selektor posisi sakelar berada pada mode "AUTO" agar siap start otomatis saat listrik padam.',
        result: 'pass',
        notes: '',
      },
      {
        category: 'Bahan Bakar',
        item: 'Level solar tangki harian mencukupi untuk operasional darurat minimal 8 jam.',
        result: 'pass',
        notes: '',
      },
    ],
    findingsSummary: 'Jadwal inspeksi rutin mingguan kesiapan darurat genset.',
  },
];
