/**
 * ============================================================
 * PMExecutionModal.jsx - Lembar Eksekusi SOP Lapangan & K3
 * ============================================================
 * 
 * PENJELASAN UNTUK SISWA SMK TITL:
 * Pekerjaan pemeliharaan listrik tidak boleh sembarangan!
 * Setiap kali teknisi turun ke panel atau gardu, wajib mematuhi
 * Prosedur Operasi Standar (SOP) dan Keselamatan Kerja Listrik (K3):
 * 1. Menggunakan APD yang teruji.
 * 2. Menerapkan Lock-Out Tag-Out (LOTO) agar sakelar tidak dihidupkan orang lain.
 * 3. Memeriksa tegangan nol sebelum menyentuh busbar tembaga.
 * 
 * Komponen ini menyediakan checklist interaktif bagi siswa
 * untuk mengeksekusi tahapan SOP sebelum menandai tugas "Selesai".
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { X, CheckSquare, Square, ShieldCheck, CheckCircle, Clock } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function PMExecutionModal({ isOpen, onClose, pm, onUpdateStatus }) {
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    if (pm && pm.sopSteps) {
      setSteps(pm.sopSteps);
    } else {
      setSteps([]);
    }
  }, [pm]);

  if (!isOpen || !pm) return null;

  // Toggle checklist item
  const handleToggleStep = (index) => {
    const updated = steps.map((s, idx) =>
      idx === index ? { ...s, done: !s.done } : s
    );
    setSteps(updated);
  };

  // Hitung persentase checklist selesai
  const totalSteps = steps.length;
  const completedSteps = steps.filter((s) => s.done).length;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  // Handler update status
  const handleSetStatus = (newStatus) => {
    onUpdateStatus(pm.id, newStatus, steps);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="asset-tag-badge">{pm.id}</span>
                <StatusBadge status={pm.status} />
                <span className="priority-pill" data-priority={pm.priority}>
                  Prioritas {pm.priority}
                </span>
              </div>
              <h2 className="modal-title" style={{ marginTop: 4 }}>{pm.title}</h2>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="pm-execution-body">
          {/* Info Singkat Pekerjaan */}
          <div className="pm-summary-banner">
            <div>
              <div className="pm-summary-label">Peralatan Sasaran</div>
              <div className="pm-summary-val">{pm.assetName} ({pm.assetId})</div>
            </div>
            <div>
              <div className="pm-summary-label">Teknisi Bertugas (PIC)</div>
              <div className="pm-summary-val">{pm.assignee}</div>
            </div>
            <div>
              <div className="pm-summary-label">Target Tanggal</div>
              <div className="pm-summary-val">{pm.scheduledDate}</div>
            </div>
            <div>
              <div className="pm-summary-label">Siklus Pemeliharaan</div>
              <div className="pm-summary-val">{pm.frequency}</div>
            </div>
          </div>

          {/* Progress Bar SOP K3 */}
          <div style={{ margin: '20px 0 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                Kepatuhan Langkah Keselamatan (K3 & SOP)
              </span>
              <span style={{ fontWeight: 700, color: progressPercent === 100 ? '#059669' : 'var(--color-primary)' }}>
                {completedSteps} dari {totalSteps} langkah ({progressPercent}%)
              </span>
            </div>
            <div className="progress-bar-container" style={{ height: 10 }}>
              <div
                className="progress-bar-fill"
                style={{
                  width: `${progressPercent}%`,
                  background: progressPercent === 100
                    ? 'linear-gradient(90deg, #10b981, #059669)'
                    : 'linear-gradient(90deg, #3b82f6, #1e40af)',
                }}
              ></div>
            </div>
          </div>

          {/* Checklist Langkah Kerja Lapangan */}
          <div className="sop-checklist-wrap">
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: 10 }}>
              Daftar Periksa Teknis & Prosedur LOTO:
            </h3>

            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`sop-checklist-item ${step.done ? 'item-done' : ''}`}
                onClick={() => handleToggleStep(idx)}
              >
                <div className="sop-check-icon">
                  {step.done ? (
                    <CheckSquare size={18} color="#059669" />
                  ) : (
                    <Square size={18} color="var(--color-text-muted)" />
                  )}
                </div>
                <div className="sop-check-text">
                  <span style={{ fontWeight: 600, marginRight: 6 }}>Langkah {idx + 1}:</span>
                  {step.text}
                </div>
              </div>
            ))}
          </div>

          {/* Catatan Lapangan */}
          {pm.notes && (
            <div className="detail-notes-card" style={{ marginTop: 16 }}>
              <div className="detail-notes-header">
                <span>Catatan & Rekomendasi Lapangan:</span>
              </div>
              <p className="detail-notes-content">{pm.notes}</p>
            </div>
          )}
        </div>

        {/* Footer Tombol Aksi Status */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            Status Saat Ini: <strong>{pm.status.toUpperCase()}</strong>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {pm.status !== 'in-progress' && pm.status !== 'completed' && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleSetStatus('in-progress')}
              >
                <Clock size={15} />
                Mulai Dikerjakan
              </button>
            )}

            {pm.status !== 'completed' ? (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ background: '#059669' }}
                onClick={() => handleSetStatus('completed')}
              >
                <CheckCircle size={15} />
                Tandai Pekerjaan Selesai
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleSetStatus('scheduled')}
              >
                Kembalikan ke Terjadwal
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
