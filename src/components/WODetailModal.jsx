/**
 * ============================================================
 * WODetailModal.jsx - Lembar Kerja & Laporan Perbaikan Teknisi
 * ============================================================
 * 
 * PENJELASAN UNTUK SISWA SMK TITL:
 * Setelah teknisi listrik selesai memeriksa kerusakan di lapangan,
 * mereka harus mengisi:
 * 1. "Tindakan Perbaikan (Action Taken)" - contoh: penggantian kabel, kalibrasi breaker.
 * 2. Mengubah status tiket menjadi "Completed (Selesai)".
 * 
 * Lembar ini mencatat kronologi perbaikan agar menjadi
 * pembelajaran berharga jika gangguan serupa terjadi lagi di masa depan.
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { X, ClipboardList, CheckCircle2, AlertOctagon, User, Calendar, Wrench, Save } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function WODetailModal({ isOpen, onClose, wo, onUpdateWO }) {
  const [actionText, setActionText] = useState('');
  const [partsText, setPartsText] = useState('');

  useEffect(() => {
    if (wo) {
      setActionText(wo.actionTaken || '');
      setPartsText(wo.sparePartsUsed || '');
    }
  }, [wo]);

  if (!isOpen || !wo) return null;

  // Handler simpan catatan perbaikan dan ganti status
  const handleSaveAction = (newStatus = wo.status) => {
    const updated = {
      ...wo,
      actionTaken: actionText,
      sparePartsUsed: partsText,
      status: newStatus,
    };
    onUpdateWO(updated);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <ClipboardList size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="asset-tag-badge">{wo.id}</span>
                <StatusBadge status={wo.status} />
                <span className="priority-pill" data-priority={wo.priority}>
                  Urgensi {wo.priority}
                </span>
              </div>
              <h2 className="modal-title" style={{ marginTop: 4 }}>{wo.title}</h2>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="wo-detail-body">
          {/* Banner Rincian Tiket */}
          <div className="detail-grid" style={{ marginBottom: 16 }}>
            <div className="detail-item">
              <div className="detail-label">
                <Wrench size={14} />
                Peralatan Sasaran
              </div>
              <div className="detail-val">{wo.assetName} ({wo.assetId})</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <User size={14} />
                Teknisi Bertugas (PIC)
              </div>
              <div className="detail-val">{wo.assignedTo}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <Calendar size={14} />
                Tanggal Pelaporan
              </div>
              <div className="detail-val">{wo.createdDate} (Oleh: {wo.reportedBy})</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <Calendar size={14} />
                Target Selesai (Due Date)
              </div>
              <div className="detail-val highlight-val">{wo.dueDate}</div>
            </div>
          </div>

          {/* Kotak Deskripsi Kerusakan */}
          <div className="problem-desc-card">
            <div className="problem-desc-header">
              <AlertOctagon size={16} />
              <span>Gejala & Laporan Kerusakan Lapangan:</span>
            </div>
            <p className="problem-desc-content">{wo.problemDescription}</p>
          </div>

          {/* Form Input Tindakan Perbaikan Teknisi */}
          <div style={{ marginTop: 18 }}>
            <label className="form-label" htmlFor="actionTaken" style={{ marginBottom: 6 }}>
              Tindakan Perbaikan yang Dilakukan Teknisi Listrik:
            </label>
            <textarea
              id="actionTaken"
              className="form-textarea"
              rows="3"
              value={actionText}
              onChange={(e) => setActionText(e.target.value)}
              placeholder="Jelaskan hasil ukur (tegangan/arus), isolasi masalah, dan komponen yang diperbaiki/diganti..."
            ></textarea>
          </div>

          {/* Input Suku Cadang Terpakai */}
          <div style={{ marginTop: 12 }}>
            <label className="form-label" htmlFor="spareParts" style={{ marginBottom: 6 }}>
              Material / Suku Cadang yang Digunakan:
            </label>
            <input
              id="spareParts"
              type="text"
              className="form-input"
              value={partsText}
              onChange={(e) => setPartsText(e.target.value)}
              placeholder="misal: 1x MCB 3P 40A Schneider, 3m Kabel NYM 3x4mm²"
            />
          </div>
        </div>

        {/* Footer Tombol Aksi Status */}
        <div className="modal-footer" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleSaveAction(wo.status)}
            >
              <Save size={14} />
              Simpan Catatan Saja
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {wo.status !== 'in-progress' && wo.status !== 'completed' && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleSaveAction('in-progress')}
              >
                Mulai Dikerjakan
              </button>
            )}

            {wo.status !== 'completed' ? (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ background: '#059669' }}
                onClick={() => handleSaveAction('completed')}
              >
                <CheckCircle2 size={15} />
                Selesaikan Work Order
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleSaveAction('in-progress')}
              >
                Buka Kembali Tiket
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
