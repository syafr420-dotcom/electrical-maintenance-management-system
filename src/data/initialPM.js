/**
 * ============================================================
 * initialPM.js - Data Simulasi Jadwal Preventive Maintenance (DEMO)
 * ============================================================
 * 
 * PENJELASAN UNTUK SISWA SMK TITL:
 * File ini berisi jadwal pemeliharaan rutin kelistrikan sesuai
 * standar K3 Listrik & PUIL (Panduan Umum Instalasi Listrik).
 * 
 * Struktur Data:
 * - id          : Kode Jadwal (PM-001, PM-002, dst.)
 * - title       : Nama Kegiatan Pemeliharaan
 * - assetId     : Kode Tag Aset yang diperiksa (terkoneksi ke Modul Aset)
 * - assetName   : Nama Peralatan
 * - frequency   : Siklus (Mingguan, Bulanan, Triwulan, Semester, Tahunan)
 * - scheduledDate: Tanggal target pelaksanaan (YYYY-MM-DD)
 * - assignee    : Teknisi penanggung jawab (Instalatur/Teknisi TITL)
 * - priority    : Prioritas (Rendah, Normal, Tinggi)
 * - status      : scheduled (Terjadwal), in-progress (Dikerjakan), completed (Selesai), overdue (Terlambat)
 * - sopSteps    : Langkah-langkah K3 & SOP sebelum menyelesaikan pekerjaan
 * - notes       : Catatan instruksi kerja
 * ============================================================
 */

export const initialPM = [
  {
    id: 'PM-001',
    title: 'Thermovisi & Pengencangan Busbar MDP',
    assetId: 'AST-002',
    assetName: 'Main Distribution Panel (MDP) Gedung A',
    frequency: 'Bulanan',
    scheduledDate: '2026-10-30',
    assignee: 'Ahmad Riyadi (Teknisi TITL)',
    priority: 'Tinggi',
    status: 'scheduled',
    sopSteps: [
      { text: 'Gunakan APD: Kacamata safety, sarung tangan pelindung busur api (Arc Flash), dan sepatu isolasi 1000V.', done: false },
      { text: 'Lakukan pemindaian suhu sambungan busbar menggunakan Thermal Camera (Cari titik panas/hotspot).', done: false },
      { text: 'Lakukan pemadaman terkoordinasi dan pasang gembok pengaman LOTO (Lock-Out Tag-Out).', done: false },
      { text: 'Uji tegangan nol menggunakan Voltage Tester sebelum menyentuh konduktor tembaga.', done: false },
      { text: 'Kencangkan baut sambungan busbar dengan kunci torsi sesuai spesifikasi pabrikan.', done: false },
    ],
    notes: 'Prioritas pada sambungan incoming ACB 1000A dan terminal outgoing fasa S.',
  },
  {
    id: 'PM-002',
    title: 'Pengujian Tahanan Isolasi (Megger) & Dielektrik Oli Trafo',
    assetId: 'AST-001',
    assetName: 'Trafo Distribusi Step-Down 20kV / 400V',
    frequency: 'Semester',
    scheduledDate: '2026-11-15',
    assignee: 'Budi Santoso & Tim Gardu',
    priority: 'Tinggi',
    status: 'scheduled',
    sopSteps: [
      { text: 'Koordinasikan pemadaman sisi Tegangan Menengah 20kV dengan penyedia daya.', done: false },
      { text: 'Pemasangan kawat pentanahan sementara (Earthing switch grounding) di sisi primer dan sekunder.', done: false },
      { text: 'Ukur nilai tahanan isolasi Primer-Sekunder, Primer-Ground, Sekunder-Ground dengan Megger 2500V/5000V.', done: false },
      { text: 'Ambil sampel oli trafo untuk uji tegangan tembus (Dielectric Breakdown Voltage).', done: false },
      { text: 'Periksa fungsi alarm Buchholz Relay dan silika gel pada tabung pernapasan (breather).', done: false },
    ],
    notes: 'Pastikan silika gel yang sudah berubah warna menjadi pink/lembab segera diganti dengan silika gel biru kering.',
  },
  {
    id: 'PM-003',
    title: 'Uji Pemanasan & Otomatisasi ATS-AMF Genset',
    assetId: 'AST-005',
    assetName: 'Genset Silent Standby Emergency 150 kVA',
    frequency: 'Mingguan',
    scheduledDate: '2026-10-27',
    assignee: 'Cahyo Wicaksono',
    priority: 'Normal',
    status: 'in-progress',
    sopSteps: [
      { text: 'Pemeriksaan level oli mesin, air radiator coolant, dan bahan bakar solar pada tangki harian.', done: true },
      { text: 'Periksa tegangan baterai starter aki (Accu) minimal 24-27 VDC.', done: true },
      { text: 'Simulasikan kegagalan daya PLN pada modul ATS (Automatic Transfer Switch).', done: false },
      { text: 'Ukur waktu starting hingga genset mengambil alih beban (target < 10 detik).', done: false },
      { text: 'Catat frekuensi (50 Hz), tegangan fasa (380-400V), dan suhu mesin saat running test.', done: false },
    ],
    notes: 'Lakukan uji beban minimal 30 menit untuk mencegah penumpukan karbon (wet stacking).',
  },
  {
    id: 'PM-004',
    title: 'Pengukuran Tahanan Pembumian (Earth Grounding Test)',
    assetId: 'AST-002',
    assetName: 'Main Distribution Panel (MDP) Gedung A',
    frequency: 'Tahunan',
    scheduledDate: '2026-10-20',
    assignee: 'Dimas Prasetyo',
    priority: 'Tinggi',
    status: 'completed',
    sopSteps: [
      { text: 'Siapkan Earth Resistance Tester digital dan kabel bantu elektroda arus/tegangan.', done: true },
      { text: 'Tancapkan pasak pembantu berjarak 5 meter dan 10 meter dari elektroda utama.', done: true },
      { text: 'Lepaskan klem uji (test link) pentanahan sebelum melakukan pengukuran.', done: true },
      { text: 'Ukur nilai resistansi tanah (Standar PUIL wajib di bawah 5 Ohm).', done: true },
      { text: 'Sambungkan kembali klem grounding dan berikan lapisan anti karat.', done: true },
    ],
    notes: 'Hasil ukur: 1.8 Ohm (Memenuhi syarat PUIL < 5 Ohm). Grounding dalam kondisi prima.',
  },
  {
    id: 'PM-005',
    title: 'Pembersihan & Penggantian Kontaktor Step Kapasitor Bank',
    assetId: 'AST-006',
    assetName: 'Automatic Power Factor Capacitor Bank',
    frequency: 'Triwulan',
    scheduledDate: '2026-10-15',
    assignee: 'Eko Fajar',
    priority: 'Normal',
    status: 'completed',
    sopSteps: [
      { text: 'Matikan kontroler cos phi digital dan buka breaker utama kapasitor bank.', done: true },
      { text: 'TUNGGU minimal 5 menit agar resistor pelepasan (discharge resistor) mengosongkan muatan listrik kapasitor.', done: true },
      { text: 'Ukur tegangan sisa pada setiap terminal kapasitor sebelum menyentuh (Waspada sengatan arus sisa!).', done: true },
      { text: 'Bersihkan debu isolator dengan kuas kering dan vakum.', done: true },
      { text: 'Periksa fisik tabung kapasitor apakah ada yang menggembung atau bocor minyak.', done: true },
    ],
    notes: 'Kontaktor khusus kapasitor step-2 diganti karena ujung kontak peredam arus mula (inrush current) aus.',
  },
  {
    id: 'PM-006',
    title: 'Pengecekan Tahanan Isolasi Lilitan Motor & Bearing',
    assetId: 'AST-004',
    assetName: 'Motor Induksi 3 Fasa Kompresor Sentral',
    frequency: 'Bulanan',
    scheduledDate: '2026-10-22',
    assignee: 'Ahmad Riyadi (Teknisi TITL)',
    priority: 'Tinggi',
    status: 'overdue',
    sopSteps: [
      { text: 'Matikan sakelar MCB motor dan pasang gembok LOTO pada handle starter panel.', done: false },
      { text: 'Buka tutup terminal motor (U1-V1-W1 dan U2-V2-W2).', done: false },
      { text: 'Ukur nilai isolasi antar fasa dan fasa ke bodi motor menggunakan Megger 1000V.', done: false },
      { text: 'Periksa kelonggaran bearing motor dan beri pelumas grease tahan panas (Lithium base).', done: false },
      { text: 'Uji putaran manual poros motor dengan tangan, pastikan tidak seret.', done: false },
    ],
    notes: 'Jadwal terlewati 5 hari karena menunggu suku cadang seal bearing dari pemasok.',
  },
];
