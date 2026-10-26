/**
 * ============================================================
 * HistoryDetailModal.jsx - Berita Acara Riwayat Pemeliharaan
 * ============================================================
 * 
 * PENJELASAN UNTUK SISWA SMK TITL:
 * Dokumen ini memodelkan "Berita Acara Penyelesaian Pekerjaan"
 * resmi yang membuktikan bahwa pemeliharaan instalasi telah
 * tuntas dikerjakan, diuji nilai parameternya, dan aman dialiri listrik.
 * ============================================================
 */

import { X, History, CheckCircle2, FileText, User, Calendar, Wrench, Clock, ShieldCheck } from 'lucide-react';

export default function HistoryDetailModal({ isOpen, onClose, record }) {
  if (!isOpen || !record) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: 680 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <History size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="asset-tag-badge">{record.id}</span>
                <span className="source-pill" data-source={record.sourceType}>
                  {record.sourceType}
                </span>
                {record.referenceId && (
                  <span className="frequency-pill">Ref: {record.referenceId}</span>
                )}
              </div>
              <h2 className="modal-title" style={{ marginTop: 4 }}>{record.title}</h2>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="history-detail-body">
          {/* Rincian Peralatan & Pelaksanaan */}
          <div className="detail-grid" style={{ marginBottom: 16 }}>
            <div className="detail-item">
              <div className="detail-label">
                <Wrench size={14} />
                Peralatan Sasaran
              </div>
              <div className="detail-val">{record.assetName} ({record.assetId})</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <User size={14} />
                Teknisi Pelaksana (TITL)
              </div>
              <div className="detail-val">{record.technician}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <Calendar size={14} />
                Tanggal Selesai Pekerjaan
              </div>
              <div className="detail-val highlight-val">{record.date}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <Clock size={14} />
                Durasi Pemadaman (Downtime)
              </div>
              <div className="detail-val">{record.downtime || 'Tanpa Pemadaman'}</div>
            </div>
          </div>

          {/* Uraian Tindakan & Parameter Hasil Uji Ukur */}
          <div className="detail-notes-card" style={{ marginBottom: 14 }}>
            <div className="detail-notes-header">
              <ShieldCheck size={16} />
              <span>Tindakan Teknis & Parameter Uji Lapangan:</span>
            </div>
            <p className="detail-notes-content" style={{ fontSize: 13, lineHeight: 1.6 }}>
              {record.actionSummary}
            </p>
          </div>

          {/* Suku Cadang yang Diganti */}
          <div className="detail-item" style={{ background: '#fdfbf7', border: '1px solid #fed7aa' }}>
            <div className="detail-label" style={{ color: '#c2410c' }}>
              <FileText size={14} />
              Material / Suku Cadang yang Diganti:
            </div>
            <div className="detail-val" style={{ fontSize: 13, color: '#9a3412', fontWeight: 500 }}>
              {record.partsReplaced || 'Tidak ada suku cadang yang diganti (Hanya pembersihan & kalibrasi).'}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Tutup Berita Acara
          </button>
        </div>
      </div>
    </div>
  );
}
