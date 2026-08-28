import React, { useState } from 'react';
import { X, PlusCircle, Tag, Palette } from 'lucide-react';

const PRESET_COLORS = [
  '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b',
  '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#64748b'
];

export default function CategoryModal({
  isOpen,
  onClose,
  onSave,
  isSaving = false
}) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    onSave({
      name: name.trim(),
      color,
      icon: 'folder'
    });
    setName('');
    setError('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Create New Category</div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">
                <Tag size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: -2 }} />
                Category Name<span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Electricity, Transport, Raw Materials"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                autoFocus
              />
              {error && <div className="form-error-msg">{error}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Palette size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: -2 }} />
                Badge Color
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: c,
                      border: color === c ? '3px solid #ffffff' : '1px solid rgba(255,255,255,0.2)',
                      cursor: 'pointer',
                      transform: color === c ? 'scale(1.15)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  />
                ))}
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
            >
              <PlusCircle size={16} />
              {isSaving ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
