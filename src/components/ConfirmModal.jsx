import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { formatCurrency } from '../services/api';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Record',
  message = 'Are you sure you want to delete this record?',
  record = null,
  isDeleting = false
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171' }}>
            <AlertTriangle size={20} />
            {title}
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.9375rem', color: '#cbd5e1', marginBottom: '1rem' }}>
            {message}
          </p>

          {record && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '1rem', marginBottom: '4px' }}>
                {record.personName}
              </div>
              <div style={{ color: '#34d399', fontWeight: 700, fontSize: '1.125rem' }}>
                {formatCurrency(record.amount)}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.8125rem', marginTop: '4px' }}>
                Purpose: {record.purpose}
              </div>
            </div>
          )}

          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            💡 Deleting this record will automatically refund <strong style={{ color: '#34d399' }}>{record ? formatCurrency(record.amount) : 'the amount'}</strong> back to your Remaining Cash balance.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
            id="btn-confirm-delete"
          >
            <Trash2 size={16} />
            {isDeleting ? 'Deleting...' : 'Yes, Delete Record'}
          </button>
        </div>
      </div>
    </div>
  );
}
