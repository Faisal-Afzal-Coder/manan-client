import React, { useState, useEffect } from 'react';
import { X, Save, DollarSign, Calendar, User, FileText, StickyNote, TrendingUp, TrendingDown } from 'lucide-react';
import { formatDateForInput, formatCurrency } from '../services/api';

export default function RecordModal({
  isOpen,
  onClose,
  onSave,
  categoryName,
  initialData = null,
  isSaving = false
}) {
  const isEdit = Boolean(initialData?._id);
  const isIncome = Boolean(
    categoryName === 'Received Amount' ||
    categoryName === 'received-amount' ||
    initialData?.category === 'Received Amount'
  );

  const [formData, setFormData] = useState({
    personName: '',
    amount: '',
    date: formatDateForInput(),
    purpose: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          personName: initialData.personName || '',
          amount: initialData.amount !== undefined ? String(initialData.amount) : '',
          date: formatDateForInput(initialData.date),
          purpose: initialData.purpose || '',
          notes: initialData.notes || ''
        });
      } else {
        setFormData({
          personName: '',
          amount: '',
          date: formatDateForInput(),
          purpose: '',
          notes: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.personName.trim()) {
      newErrors.personName = isIncome ? 'Payer / Received from person name is required' : 'Person name is required';
    }
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.purpose.trim()) {
      newErrors.purpose = isIncome ? 'Source / Reason is required' : 'Purpose / Work is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      category: categoryName,
      personName: formData.personName.trim(),
      amount: Number(formData.amount),
      date: formData.date,
      purpose: formData.purpose.trim(),
      notes: formData.notes.trim()
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={isIncome ? { borderBottomColor: 'rgba(16, 185, 129, 0.25)' } : {}}>
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isIncome ? <TrendingUp size={20} color="#34d399" /> : <TrendingDown size={20} color="#38bdf8" />}
            {isEdit
              ? `Edit ${isIncome ? 'Received Record' : 'Record'}`
              : `${isIncome ? 'Record Received Amount (+)' : `Add New Record to [${categoryName}]`}`}
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {isIncome && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.8125rem',
                color: '#34d399',
                marginBottom: '1rem'
              }}>
                💰 <strong>Cash Inflow:</strong> This received amount will be automatically added to your Total Available Cash!
              </div>
            )}

            {/* Person Name */}
            <div className="form-group">
              <label className="form-label">
                <User size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: -2 }} />
                {isIncome ? 'Received From (Person / Customer / Client Name)' : 'Person Name (Who received the money)'}
                <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder={isIncome ? 'e.g. Customer, Client, Malik Sahab' : 'e.g. Ali, Babar, Aslam'}
                value={formData.personName}
                onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                id="input-person-name"
                autoFocus
              />
              {errors.personName && <div className="form-error-msg">{errors.personName}</div>}
            </div>

            {/* Amount */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">
                  <DollarSign size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: -2 }} />
                  Amount (Rs.)<span className="required">*</span>
                </label>
                {formData.amount && !isNaN(Number(formData.amount)) && Number(formData.amount) > 0 && (
                  <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
                    Preview: {isIncome ? '+' : ''}{formatCurrency(formData.amount)}
                  </span>
                )}
              </div>
              <input
                type="number"
                step="any"
                min="0.01"
                className="form-control"
                placeholder="e.g. 50000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                id="input-amount"
              />
              {errors.amount && <div className="form-error-msg">{errors.amount}</div>}
            </div>

            {/* Date */}
            <div className="form-group">
              <label className="form-label">
                <Calendar size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: -2 }} />
                Date<span className="required">*</span>
              </label>
              <input
                type="date"
                className="form-control"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                id="input-date"
              />
              {errors.date && <div className="form-error-msg">{errors.date}</div>}
            </div>

            {/* Purpose / Work */}
            <div className="form-group">
              <label className="form-label">
                <FileText size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: -2 }} />
                {isIncome ? 'Reason / Source (Why money was received)' : 'Purpose / Work (Why the money was given)'}
                <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder={isIncome ? 'e.g. Sales payment, advance deposit, loan return' : 'e.g. Material purchase, daily wage, repair'}
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                id="input-purpose"
              />
              {errors.purpose && <div className="form-error-msg">{errors.purpose}</div>}
            </div>

            {/* Optional Notes */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                <StickyNote size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: -2 }} />
                Notes (Optional)
              </label>
              <textarea
                className="form-control"
                placeholder="e.g. Received via Cash / Bank Transfer, receipt #456"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                id="input-notes"
                rows={2}
              />
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
              id="btn-save-record"
            >
              <Save size={16} />
              {isSaving ? 'Saving...' : isEdit ? 'Update Record' : (isIncome ? 'Save Received Amount' : 'Save Record')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
