import React, { useState } from 'react';
import { X, Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { parseTimetableCSV, CSV_TEMPLATE, downloadCSV } from '../utils/csvParser';

export function CsvImportModal({ isOpen, onClose, onImportEvents }) {
  const [csvText, setCsvText] = useState('');
  const [parseResult, setParseResult] = useState(null);
  const [importMode, setImportMode] = useState('merge'); // 'merge' or 'replace'

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setCsvText(content);
        const res = parseTimetableCSV(content);
        setParseResult(res);
      }
    };
    reader.readAsText(file);
  };

  const handleParseText = () => {
    const res = parseTimetableCSV(csvText);
    setParseResult(res);
  };

  const handleLoadSampleCSV = () => {
    setCsvText(CSV_TEMPLATE);
    const res = parseTimetableCSV(CSV_TEMPLATE);
    setParseResult(res);
  };

  const handleDownloadTemplate = () => {
    downloadCSV(CSV_TEMPLATE, 'CampusPilot_Timetable_Template.csv');
  };

  const handleConfirmImport = () => {
    if (parseResult && parseResult.success && parseResult.events.length > 0) {
      onImportEvents(parseResult.events, importMode);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Import Timetable (CSV)</h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: 13, color: 'var(--slate-600)', marginBottom: 14 }}>
          Upload your semester course timetable or paste CSV text directly.
        </p>

        {/* Quick Template Download & Load Sample Buttons */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleDownloadTemplate}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <Download size={14} />
            Download Template
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleLoadSampleCSV}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <FileText size={14} />
            Load Sample Timetable
          </button>
        </div>

        {/* File Drag / Drop Input */}
        <div
          style={{
            border: '2px dashed var(--slate-300)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px',
            textAlign: 'center',
            marginBottom: 14,
            background: 'var(--slate-50)'
          }}
        >
          <Upload size={24} color="var(--slate-400)" style={{ margin: '0 auto 8px auto' }} />
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--primary-600)', cursor: 'pointer' }}>
            Choose CSV file from device
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>
          <span style={{ fontSize: 11, color: 'var(--slate-400)' }}>Supports .csv files</span>
        </div>

        {/* Or Paste CSV Textarea */}
        <div className="form-group">
          <label className="form-label">Or Paste CSV Data Below</label>
          <textarea
            className="form-control"
            rows={4}
            placeholder="Title,Course Code,Type,Day,Start Time,End Time,Venue..."
            value={csvText}
            onChange={(e) => {
              setCsvText(e.target.value);
              setParseResult(null);
            }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}
          />
          {csvText && !parseResult && (
            <button
              type="button"
              onClick={handleParseText}
              style={{
                background: 'var(--slate-800)',
                color: 'white',
                fontSize: 11,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                marginTop: 6
              }}
            >
              Parse Data
            </button>
          )}
        </div>

        {/* Parse Preview Result */}
        {parseResult && (
          <div style={{ marginTop: 14 }}>
            {parseResult.success ? (
              <div
                style={{
                  background: 'var(--emerald-50)',
                  border: '1px solid var(--emerald-200)',
                  borderRadius: 'var(--radius-md)',
                  padding: 12,
                  marginBottom: 14
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--emerald-800)', fontWeight: 700, fontSize: 13 }}>
                  <CheckCircle size={16} />
                  <span>Ready to import {parseResult.count} events!</span>
                </div>

                <div
                  style={{
                    maxHeight: 120,
                    overflowY: 'auto',
                    marginTop: 8,
                    fontSize: 11,
                    color: 'var(--slate-700)'
                  }}
                >
                  {parseResult.events.map((ev, i) => (
                    <div key={i} style={{ padding: '2px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      • <strong>{ev.day} {ev.startTime}</strong>: {ev.courseCode ? `[${ev.courseCode}] ` : ''}{ev.title} @ {ev.venue}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: 'var(--rose-50)',
                  color: 'var(--rose-600)',
                  padding: 12,
                  borderRadius: 'var(--radius-md)',
                  fontSize: 12,
                  marginBottom: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <AlertCircle size={16} />
                <span>{parseResult.error || 'Failed to parse CSV'}</span>
              </div>
            )}

            {/* Import Mode: Merge or Replace */}
            {parseResult.success && (
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--slate-700)', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="importMode"
                    value="merge"
                    checked={importMode === 'merge'}
                    onChange={() => setImportMode('merge')}
                  />
                  Merge with existing events
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--slate-700)', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="importMode"
                    value="replace"
                    checked={importMode === 'replace'}
                    onChange={() => setImportMode('replace')}
                  />
                  Replace all existing events
                </label>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          className="btn-primary"
          disabled={!parseResult || !parseResult.success}
          onClick={handleConfirmImport}
        >
          Confirm & Add to Schedule
        </button>
      </div>
    </div>
  );
}
