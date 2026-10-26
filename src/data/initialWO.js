/**
 * ============================================================
 * initialWO.js - Data Simulasi Work Orders / Tiket Perbaikan Listrik (DEMO)
 * ============================================================
 * 
 * PENJELASAN UNTUK SISWA SMK TITL:
 * Work Order (WO) adalah Surat Perintah Kerja resmi yang diterbitkan
 * saat ada kerusakan alat, lampu padam, trip proteksi, atau kebutuhan
 * instalasi baru di lapangan.
 * 
 * Struktur Tiket Work Order:
 * - id                : Kode Tiket (WO-101, WO-102, dst.)
 * - title             : Judul Kerusakan / Masalah
 * - assetId           : Tag Peralatan Terkait (terkoneksi ke Modul Aset)
 * - assetName         : Nama Peralatan
 * - category          : Kategori (Perbaikan Korektif, Darurat/Emergency, Modifikasi)
 * - priority          : Tingkat Urgensi (Darurat, Tinggi, Normal, Rendah)
 * - status            : open (Menunggu), in-progress (Dikerjakan), completed (Selesai), cancelled (Dibatalkan)
 * - reportedBy        : Pihak yang melaporkan (misal: Operator Mesin / Guru Instruktur)
 * - assignedTo        : Teknisi TITL yang ditugaskan
 * - createdDate       : Tanggal laporan masuk (YYYY-MM-DD)
 * - dueDate           : Target penyelesaian (YYYY-MM-DD)
 * - problemDescription: Gejala kerusakan teknis
 * - actionTaken       : Tindakan perbaikan yang dilakukan teknisi
 * - sparePartsUsed    : Suku cadang kelistrikan yang diganti
 * ============================================================
 */

export const initialWO = [
  {
    id: 'WO-101',
    title: 'Perbaikan MCB 3 Fasa Trip Berulang pada Panel SDP Mesin',
    assetId: 'AST-003',
    assetName: 'Sub Distribution Panel (SDP-01) Bengkel Las',
    category: 'Perbaikan Korektif',
    priority: 'Tinggi',
    status: 'in-progress',
    reportedBy: 'Mandor Bengkel Fabrikasi',
    assignedTo: 'Ahmad Riyadi (Teknisi TITL)',
    createdDate: '2026-10-26',
    dueDate: '2026-10-27',
    problemDescription: 'MCB 3P 63A sering trip mendadak saat mesin las trafo dan mesin gerinda potong dioperasikan serentak. Suhu badan MCB terasa hangat saat diraba.',
    actionTaken: 'Melakukan pengukuran arus tiap fasa menggunakan tang ampere (Clamp Meter). Ditemukan ketidakseimbangan beban berat di Fasa S (58A) mendekati rating trip nominal.',
    sparePartsUsed: 'Kabel jumper NYAF 10mm² untuk redistribusi pembagian beban ke Fasa R dan T.',
  },
  {
    id: 'WO-102',
    title: 'Penggantian Baterai Kering UPS Ruang Server (Baterai Menggembung)',
    assetId: 'AST-007',
    assetName: 'UPS Online Double-Conversion Pusat Server',
    category: 'Darurat (Emergency)',
    priority: 'Darurat',
    status: 'open',
    reportedBy: 'Administrator Jaringan IT',
    assignedTo: 'Budi Santoso & Tim Gardu',
    createdDate: '2026-10-27',
    dueDate: '2026-10-27',
    problemDescription: 'Alarm buzzer UPS berbunyi terus menerus indikasi "Battery Fault". Ruang kontrol mencium bau asam menyengat. Resiko server shutdown mendadak bila PLN padam!',
    actionTaken: 'Menyiapkan modul bypass UPS ke jalur suplai langsung (Maintenance Bypass Switch) sebelum membuka rak baterai.',
    sparePartsUsed: 'Menunggu 4 unit baterai VRLA 12V 100Ah tiba dari gudang spare part.',
  },
  {
    id: 'WO-103',
    title: 'Penggantian Lampu Penerangan Darurat (Emergency Lights) Koridor',
    assetId: 'AST-002',
    assetName: 'Main Distribution Panel (MDP) Gedung A',
    category: 'Pemeliharaan Rutin',
    priority: 'Normal',
    status: 'completed',
    reportedBy: 'Petugas K3 Gedung',
    assignedTo: 'Dimas Prasetyo',
    createdDate: '2026-10-23',
    dueDate: '2026-10-24',
    problemDescription: 'Dua buah lampu emergency LED di jalur tangga darurat lantai 2 tidak menyala saat simulasi pemadaman sakelar penerangan.',
    actionTaken: 'Mengganti baterai modul emergency pack Ni-Cd internal dan menguji ulang simulasi uji putus kontak tombol test switch. Lampu menyala terang selama 2 jam penuh.',
    sparePartsUsed: '2x Emergency Battery Pack Ni-Cd 3.6V 1800mAh, 1x Lampu LED Tube T8 18W.',
  },
  {
    id: 'WO-104',
    title: 'Investigasi Suhu Panas pada Terminal Kabel Kompresor Sentral',
    assetId: 'AST-004',
    assetName: 'Motor Induksi 3 Fasa Kompresor Sentral',
    category: 'Perbaikan Korektif',
    priority: 'Tinggi',
    status: 'open',
    reportedBy: 'Operator Ruang Utilitas',
    assignedTo: 'Cahyo Wicaksono',
    createdDate: '2026-10-26',
    dueDate: '2026-10-28',
    problemDescription: 'Hasil temuan inspeksi rutin mendapati suhu sepatu kabel (cable lug) fasa W di terminal box motor mencapai 78°C, jauh di atas batas normal 45°C.',
    actionTaken: 'Belum dieksekusi. Menunggu jadwal stop produksi kompresor pukul 17:00 WIB untuk pemotongan dan pengepresan ulang sepatu kabel.',
    sparePartsUsed: 'Sepatu kabel tembaga (Cable Lug) 35mm² baut M8, isolasi bakar (Heat shrink tube).',
  },
  {
    id: 'WO-105',
    title: 'Pemasangan Surge Arrester Tambahan di Panel SDP Pompa',
    assetId: 'AST-003',
    assetName: 'Sub Distribution Panel (SDP-01) Bengkel Las',
    category: 'Modifikasi & Upgrade',
    priority: 'Rendah',
    status: 'completed',
    reportedBy: 'Kepala Instalasi Listrik',
    assignedTo: 'Eko Fajar',
    createdDate: '2026-10-18',
    dueDate: '2026-10-21',
    problemDescription: 'Mengantisipasi musim hujan dan bahaya sambaran petir tidak langsung (induksi surja petir) yang sering merusak modul kontrol inverter motor.',
    actionTaken: 'Memasang Surge Protective Device (SPD) Tipe 2 (40kA 400V) pada busbar panel dan menghubungkan kawat pentanahan tembaga BC 16mm² langsung ke ground bar utama.',
    sparePartsUsed: '1 Unit SPD Type 2 3P+N 40kA, Kawat tembaga telanjang BC 16mm² sepanjang 4 meter.',
  },
];
