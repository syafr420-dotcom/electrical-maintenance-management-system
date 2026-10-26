/**
 * ============================================================
 * StatusBadge.jsx - Komponen Badge Status (Reusable)
 * ============================================================
 * 
 * PENJELASAN:
 * Komponen kecil untuk menampilkan label status dengan warna
 * yang sesuai. Contoh: "Selesai" (hijau), "Dikerjakan" (kuning),
 * "Overdue" (merah).
 * 
 * PROPS:
 * - status : String status (operational/completed/warning/
 *            in-progress/critical/overdue/info/scheduled)
 * - label  : Teks yang ditampilkan (opsional, default = status)
 * ============================================================
 */

// Peta untuk mengubah kode status menjadi label yang ramah pengguna
const STATUS_LABELS = {
  'operational': 'Operasional',
  'completed': 'Selesai',
  'warning': 'Perhatian',
  'in-progress': 'Dikerjakan',
  'critical': 'Kritis',
  'overdue': 'Terlambat',
  'info': 'Info',
  'scheduled': 'Terjadwal',
};

export default function StatusBadge({ status, label }) {
  // Gunakan label custom jika disediakan, jika tidak pakai dari peta
  const displayLabel = label || STATUS_LABELS[status] || status;

  return (
    <span className={`status-badge status-badge--${status}`}>
      {/* Titik kecil berwarna di samping teks */}
      <span className="status-badge-dot"></span>
      {displayLabel}
    </span>
  );
}
