import React, { useState, useEffect } from 'react';
import { X, Save, DollarSign, Calculator, Info } from 'lucide-react';
import { formatCurrency } from '../services/api';

export default function CashModal({
  isOpen,
  onClose,
  onSave,
  cashData,
  isSaving = false
}) {
  const [initialCash, setInitialCash] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && cashData) {
      setInitialCash(cashData.initialCash !== undefined ? String(cashData.initialCash) : '0');
      setError('');
    }
  }, [isOpen, cashData]);

  if (!isOpen) return null;

  const totalUsed = cashData?.totalUsed || 0;
  const numInput = Number(initialCash) || 0;
  const projectedRemaining = numInput - totalUsed;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isNaN(numInput) || numInput < 0) {
      setError('Please enter a valid positive number for Initial Cash');
      return;
    }

    onSave(numInput);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Set / Update Initial Cash</div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              Set your available initial cash amount. Whenever money is given/recorded in any category, it will automatically deduct from this amount.
            </p>

            <div className="form-group">
              <label className="form-label">
                <DollarSign size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: -2 }} />
                Initial Cash Amount (Rs.)<span className="required">*</span>
              </label>
              <input
                type="number"
                step="any"
                min="0"
                className="form-control"
                placeholder="e.g. 500000"
                value={initialCash}
                onChange={(e) => {
                  setInitialCash(e.target.value);
                  setError('');
                }}
                id="input-initial-cash"
                autoFocus
              />
              {error && <div className="form-error-msg">{error}</div>}
            </div>

            {/* Live Calculation Preview */}
            <div style={{
              background: 'rgba(11, 15, 25, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '1rem',
              marginTop: '1.25rem'
            }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Calculator size={14} /> Live Calculation Preview
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#cbd5e1', marginBottom: 4 }}>
                <span>Initial Cash:</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(numInput)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#f87171', marginBottom: 4 }}>
                <span>Total Used (Categories):</span>
                <span style={{ fontWeight: 600 }}>- {formatCurrency(totalUsed)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.9375rem',
                color: projectedRemaining >= 0 ? '#34d399' : '#f87171',
                fontWeight: 700,
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: 6,
                marginTop: 6
              }}>
                <span>Projected Remaining Cash:</span>
                <span>{formatCurrency(projectedRemaining)}</span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
              id="btn-save-cash"
            >
              <Save size={16} />
              {isSaving ? 'Updating...' : 'Update Cash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
