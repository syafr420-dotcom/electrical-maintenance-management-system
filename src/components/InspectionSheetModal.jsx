/**
 * ============================================================
 * InspectionSheetModal.jsx - Lembar Pengisian Checklist Lapangan
 * ============================================================
 * 
 * PENJELASAN UNTUK SISWA SMK TITL:
 * Komponen ini berfungsi seperti tablet digital yang dibawa teknisi
 * saat berkeliling memeriksa panel listrik dan trafo.
 * 
 * Fitur Penilaian Otomatis (Automatic Scoring):
 * - Teknisi mengklik pilihan pada setiap baris: [Normal / OK], [Perhatian], atau [Bahaya].
 * - Jika ditemukan minimal 1 item [Bahaya], sistem otomatis menetapkan
 *   hasil kelayakan menjadi "Kritis (Bahaya)" dan memberi peringatan
 *   agar segera diterbitkan Work Order darurat!
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { X, ClipboardCheck, CheckCircle2, AlertTriangle, XCircle, Save, FileText, User, Calendar } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function InspectionSheetModal({ isOpen, onClose, inspection, onSaveInspection }) {
  const [checkpoints, setCheckpoints] = useState([]);
  const [summary, setSummary] = useState('');

  useEffect(() => {
    if (inspection) {
      setCheckpoints(inspection.checkpoints || []);
      setSummary(inspection.findingsSummary || '');
    }
  }, [inspection]);

  if (!isOpen || !inspection) return null;

  // Ubah hasil checkpoint (pass, warning, fail)
  const handleSetResult = (index, resultType) => {
    const updated = checkpoints.map((cp, idx) =>
      idx === index ? { ...cp, result: resultType } : cp
    );
    setCheckpoints(updated);
  };

  // Ubah catatan temuan per baris
  const handleSetNotes = (index, text) => {
    const updated = checkpoints.map((cp, idx) =>
      idx === index ? { ...cp, notes: text } : cp
    );
    setCheckpoints(updated);
  };

  // Kalkulasi Otomatis Skor & Status Kelayakan Keseluruhan
  const failCount = checkpoints.filter((c) => c.result === 'fail').length;
  const warningCount = checkpoints.filter((c) => c.result === 'warning').length;
  const passCount = checkpoints.filter((c) => c.result === 'pass').length;

  let computedCondition = 'Normal';
  if (failCount > 0) {
    computedCondition = 'Kritis';
  } else if (warningCount > 0) {
    computedCondition = 'Warning';
  }

  // Handler simpan hasil pengisian
  const handleSave = (markCompleted = true) => {
    const updatedInspection = {
      ...inspection,
      checkpoints,
      findingsSummary: summary,
      overallCondition: computedCondition,
      status: markCompleted ? 'completed' : inspection.status,
    };
    onSaveInspection(updatedInspection);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: 740 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
              <ClipboardCheck size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="asset-tag-badge">{inspection.id}</span>
                <StatusBadge status={inspection.status} />
                <span
                  className="condition-pill"
                  data-condition={computedCondition}
                >
                  Kondisi: {computedCondition.toUpperCase()}
                </span>
              </div>
              <h2 className="modal-title" style={{ marginTop: 4 }}>{inspection.title}</h2>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="inspection-sheet-body">
          {/* Header Info Patroli */}
          <div className="pm-summary-banner" style={{ marginBottom: 16 }}>
            <div>
              <div className="pm-summary-label">Peralatan Diperiksa</div>
              <div className="pm-summary-val">{inspection.assetName}</div>
            </div>
            <div>
              <div className="pm-summary-label">Shift Patroli</div>
              <div className="pm-summary-val">{inspection.shift}</div>
            </div>
            <div>
              <div className="pm-summary-label">Teknisi Pemeriksa</div>
              <div className="pm-summary-val">{inspection.inspector}</div>
            </div>
            <div>
              <div className="pm-summary-label">Tanggal Pelaksanaan</div>
              <div className="pm-summary-val">{inspection.date}</div>
            </div>
          </div>

          {/* Bar Ringkasan Skor Kelayakan */}
          <div className="score-summary-bar">
            <div className="score-chip score-pass">
              <CheckCircle2 size={15} />
              <span>{passCount} Normal / OK</span>
            </div>
            <div className="score-chip score-warn">
              <AlertTriangle size={15} />
              <span>{warningCount} Perhatian</span>
            </div>
            <div className="score-chip score-fail">
              <XCircle size={15} />
              <span>{failCount} Temuan Bahaya</span>
            </div>
          </div>

          {/* Banner Peringatan jika Kondisi Kritis */}
          {computedCondition === 'Kritis' && (
            <div className="form-error-banner" style={{ margin: '14px 0 6px' }}>
              <XCircle size={20} />
              <span>
                <strong>PERINGATAN BAHAYA LISTRIK:</strong> Ditemukan indikasi bahaya berat pada checkpoint inspeksi! Segera terbitkan tiket Work Order untuk perbaikan darurat.
              </span>
            </div>
          )}

          {/* Daftar Checkpoint Pemeriksaan */}
          <div className="checkpoints-list-wrap">
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', margin: '16px 0 10px' }}>
              Daftar Pemeriksaan Standar K3 & PUIL:
            </h3>

            {checkpoints.map((cp, idx) => (
              <div key={idx} className="checkpoint-row">
                <div className="checkpoint-main">
                  <div className="checkpoint-category">{cp.category}</div>
                  <div className="checkpoint-desc">{cp.item}</div>
                </div>

                {/* 3 Tombol Opsi Hasil: Normal, Perhatian, Bahaya */}
                <div className="checkpoint-actions">
                  <button
                    type="button"
                    className={`cp-btn cp-btn-pass ${cp.result === 'pass' ? 'active' : ''}`}
                    onClick={() => handleSetResult(idx, 'pass')}
                    title="Kondisi Normal / Baik"
                  >
                    <CheckCircle2 size={14} />
                    OK
                  </button>
                  <button
                    type="button"
                    className={`cp-btn cp-btn-warn ${cp.result === 'warning' ? 'active' : ''}`}
                    onClick={() => handleSetResult(idx, 'warning')}
                    title="Ada Indikasi Perhatian"
                  >
                    <AlertTriangle size={14} />
                    Catatan
                  </button>
                  <button
                    type="button"
                    className={`cp-btn cp-btn-fail ${cp.result === 'fail' ? 'active' : ''}`}
                    onClick={() => handleSetResult(idx, 'fail')}
                    title="Kondisi Bahaya / Gagal"
                  >
                    <XCircle size={14} />
                    Bahaya
                  </button>
                </div>

                {/* Input Temuan Khusus bila ada catatan */}
                {(cp.result === 'warning' || cp.result === 'fail' || cp.notes) && (
                  <div className="checkpoint-notes-field">
                    <input
                      type="text"
                      className="form-input form-input-sm"
                      placeholder="Tuliskan temuan fisik (misal: kabel panas, baut kendur, pilot lamp mati)..."
                      value={cp.notes || ''}
                      onChange={(e) => handleSetNotes(idx, e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Kesimpulan Akhir Teknisi */}
          <div style={{ marginTop: 18 }}>
            <label className="form-label" htmlFor="inspectionSummary" style={{ marginBottom: 6 }}>
              Kesimpulan & Catatan Lapangan Teknisi:
            </label>
            <textarea
              id="inspectionSummary"
              className="form-textarea"
              rows="2"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Tuliskan rekomendasi atau kesimpulan kondisi panel secara menyeluruh..."
            ></textarea>
          </div>
        </div>

        {/* Footer Tombol Aksi */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleSave(false)}
          >
            <Save size={14} />
            Simpan Draf Saja
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            style={{ background: computedCondition === 'Kritis' ? '#dc2626' : '#059669' }}
            onClick={() => handleSave(true)}
          >
            <CheckCircle2 size={15} />
            Simpan & Selesaikan Inspeksi
          </button>
        </div>
      </div>
    </div>
  );
}
