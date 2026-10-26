/**
 * ============================================================
 * AssetDetailModal.jsx - Plat Nama Digital Peralatan Listrik
 * ============================================================
 * 
 * PENJELASAN UNTUK SISWA SMK TITL:
 * Setiap peralatan listrik industri (seperti motor, trafo, panel)
 * selalu memiliki "Nameplate" (plat nama pabrikan) yang memuat
 * spesifikasi teknik resmi.
 * 
 * Komponen ini berfungsi sebagai Nameplate Digital interaktif
 * untuk melihat detail lengkap aset yang dipilih tanpa mengubah datanya.
 * ============================================================
 */

import { X, Zap, Cpu, MapPin, Activity, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function AssetDetailModal({ isOpen, onClose, asset }) {
  if (!isOpen || !asset) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon">
              <Zap size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="asset-tag-badge">{asset.id}</span>
                <StatusBadge status={asset.status} />
              </div>
              <h2 className="modal-title" style={{ marginTop: 4 }}>{asset.name}</h2>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="asset-detail-body">
          {/* Grid Parameter Listrik */}
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">
                <Cpu size={14} />
                Kategori Peralatan
              </div>
              <div className="detail-val">{asset.category}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <MapPin size={14} />
                Lokasi Fisik
              </div>
              <div className="detail-val">{asset.location}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <Activity size={14} />
                Level Tegangan Kerja
              </div>
              <div className="detail-val highlight-val">{asset.voltageLevel || '-'}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <Zap size={14} />
                Kapasitas / Rating Arus
              </div>
              <div className="detail-val highlight-val">{asset.capacity || '-'}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <Calendar size={14} />
                Tanggal Pemasangan
              </div>
              <div className="detail-val">{asset.installDate || '-'}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <CheckCircle2 size={14} />
                Pemeriksaan Terakhir
              </div>
              <div className="detail-val">{asset.lastCheck || '-'}</div>
            </div>
          </div>

          {/* Catatan Teknis & Proteksi */}
          <div className="detail-notes-card">
            <div className="detail-notes-header">
              <FileText size={16} />
              <span>Spesifikasi Teknis & Proteksi Sistem</span>
            </div>
            <p className="detail-notes-content">
              {asset.notes || 'Tidak ada catatan teknis tambahan untuk peralatan ini.'}
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Tutup Nameplate
          </button>
        </div>
      </div>
    </div>
  );
}
