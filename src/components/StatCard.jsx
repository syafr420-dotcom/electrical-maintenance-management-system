/**
 * ============================================================
 * StatCard.jsx - Komponen Kartu Statistik (Reusable)
 * ============================================================
 * 
 * PENJELASAN:
 * Komponen ini menampilkan satu kartu statistik di dashboard.
 * Komponen ini "reusable" artinya bisa dipakai berulang kali
 * dengan data yang berbeda-beda.
 * 
 * PROPS (parameter yang diterima):
 * - label    : Judul statistik (contoh: "Total Aset")
 * - value    : Angka yang ditampilkan (contoh: 48)
 * - description : Keterangan tambahan
 * - color    : Warna tema kartu (blue/green/amber/red/purple/cyan)
 * - icon     : Komponen ikon dari Lucide React
 * ============================================================
 */

/**
 * Cara menggunakan komponen ini:
 * 
 * <StatCard
 *   label="Total Aset"
 *   value={48}
 *   description="Peralatan terdaftar (DEMO)"
 *   color="blue"
 *   icon={<Zap size={20} />}
 * />
 */
export default function StatCard({ label, value, description, color, icon }) {
  return (
    <div className="stat-card" data-color={color}>
      {/* Bagian atas: label + ikon */}
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        <div className="stat-card-icon" data-color={color}>
          {icon}
        </div>
      </div>

      {/* Angka besar */}
      <div className="stat-card-value">{value}</div>

      {/* Keterangan kecil di bawah */}
      {description && (
        <div className="stat-card-description">{description}</div>
      )}
    </div>
  );
}
