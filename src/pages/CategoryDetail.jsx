import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Plus,
  Search,
  Calendar,
  Edit2,
  Trash2,
  Inbox,
  User,
  CalendarDays,
  X,
  Wallet,
  FileSpreadsheet,
  TrendingUp
} from 'lucide-react';
import {
  getRecordsByCategory,
  formatCurrency,
  formatDate
} from '../services/api';

export default function CategoryDetail({
  category,
  onBackToDashboard,
  onOpenAddRecord,
  onOpenEditRecord,
  onOpenDeleteConfirm,
  refreshTrigger
}) {
  const [records, setRecords] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(category);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const isIncome = Boolean(
    categoryInfo?.isIncome ||
    categoryInfo?.name === 'Received Amount' ||
    categoryInfo?.slug === 'received-amount'
  );

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getRecordsByCategory(category.slug || category.name, {
        search: searchTerm,
        startDate,
        endDate
      });

      if (res.success) {
        setRecords(res.data.records || []);
        if (res.data.category) {
          setCategoryInfo(res.data.category);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load records for this category');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [category, refreshTrigger, searchTerm, startDate, endDate]);

  const clearFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
  };

  const hasFilters = searchTerm || startDate || endDate;
  const totalAmount = categoryInfo?.totalAmount || 0;
  const recordCount = categoryInfo?.recordCount || 0;

  return (
    <div className="container" style={{ paddingTop: '1.75rem', paddingBottom: '3rem' }}>
      {/* 1. TOP NAVIGATION / HEADER */}
      <button className="detail-nav-back" onClick={onBackToDashboard} id="btn-back-dashboard">
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      <div
        className="detail-header-card"
        style={isIncome ? {
          background: 'linear-gradient(135deg, #132729 0%, #182234 100%)',
          borderColor: 'rgba(16, 185, 129, 0.35)'
        } : {}}
      >
        <div className="detail-main-header">
          <div className="detail-title-group">
            <div
              className="category-icon-wrapper"
              style={{
                width: 52,
                height: 52,
                backgroundColor: isIncome ? 'rgba(16, 185, 129, 0.2)' : `${categoryInfo.color || '#3b82f6'}20`,
                color: isIncome ? '#34d399' : (categoryInfo.color || '#3b82f6'),
                border: isIncome ? '1px solid rgba(16, 185, 129, 0.4)' : `1px solid ${categoryInfo.color || '#3b82f6'}40`,
                fontSize: '1.25rem'
              }}
            >
              {isIncome ? <Wallet size={26} /> : <FileSpreadsheet size={26} />}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 style={{ fontSize: '1.75rem', marginBottom: '2px', color: isIncome ? '#34d399' : 'inherit' }}>
                  {categoryInfo.name}
                </h1>
                {isIncome && (
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#34d399',
                    background: 'rgba(16, 185, 129, 0.15)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '9999px',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}>
                    + Cash Inflow (Raqam Wusool)
                  </span>
                )}
              </div>

              <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                {isIncome
                  ? 'All money received / cash inflows that increase your Total Available Cash'
                  : 'Detailed expense & payout records that deduct from your Total Cash'}
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => onOpenAddRecord(categoryInfo.name)}
            id="btn-add-record"
          >
            <Plus size={18} />
            {isIncome ? '+ Record Received Amount' : '+ Add New Record'}
          </button>
        </div>

        <div className="detail-stats-row">
          <div className="detail-stat-item">
            <span className="detail-stat-label">
              {isIncome ? 'Total Received Amount (+)' : 'Category Total Amount (-)'}
            </span>
            <span
              className="detail-stat-val"
              id="cat-total-amount"
              style={{ color: isIncome ? '#34d399' : '#38bdf8' }}
            >
              {isIncome ? `+ ${formatCurrency(totalAmount)}` : formatCurrency(totalAmount)}
            </span>
          </div>

          <div className="detail-stat-item">
            <span className="detail-stat-label">Total Records</span>
            <span className="detail-stat-val" style={{ color: '#f8fafc' }} id="cat-total-records">
              {recordCount}
            </span>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & FILTER TOOLBAR */}
      <div className="toolbar-card">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder={isIncome ? 'Search by payer name, source or notes...' : 'Search by person name, purpose or notes...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="input-search-records"
          />
        </div>

        <div className="date-filters">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color="#94a3b8" />
            <input
              type="date"
              className="date-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              title="Filter from start date"
              id="input-filter-start-date"
            />
            <span style={{ color: '#64748b' }}>to</span>
            <input
              type="date"
              className="date-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              title="Filter to end date"
              id="input-filter-end-date"
            />
          </div>

          {hasFilters && (
            <button className="btn btn-secondary btn-sm" onClick={clearFilters} title="Clear all filters">
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* 3. RECORDS LIST */}
      {loading && records.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8' }}>
          <div className="spin" style={{ display: 'inline-block', width: 32, height: 32, border: '3px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
          <div style={{ marginTop: '1rem', fontWeight: 600 }}>Loading records...</div>
        </div>
      ) : records.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Inbox size={32} />
          </div>
          <h3 className="empty-state-title">
            {hasFilters ? 'No matching records found' : 'No records added yet.'}
          </h3>
          <p className="empty-state-desc">
            {hasFilters
              ? 'Try adjusting or clearing your search and date filters.'
              : isIncome
                ? 'Click "+ Record Received Amount" to record money received from clients or cash sources.'
                : `Click "+ Add New Record" to record money given in ${categoryInfo.name}.`}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => onOpenAddRecord(categoryInfo.name)}
            id="btn-empty-add-record"
          >
            <Plus size={16} /> {isIncome ? '+ Record Received Amount' : '+ Add New Record'}
          </button>
        </div>
      ) : (
        <div className="records-list">
          {records.map((record) => (
            <div
              key={record._id}
              className="record-item-card"
              id={`record-${record._id}`}
              style={isIncome ? { borderColor: 'rgba(16, 185, 129, 0.2)' } : {}}
            >
              {/* Primary Info */}
              <div className="record-primary-info">
                <div className="record-person-name">
                  <User size={16} color={isIncome ? '#34d399' : '#38bdf8'} />
                  <span>{record.personName}</span>
                  {isIncome && (
                    <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
                      (Received From)
                    </span>
                  )}
                </div>

                <div className="record-purpose">
                  <strong>{isIncome ? 'Source / Reason:' : 'Purpose:'}</strong> {record.purpose}
                </div>

                {record.notes && (
                  <div className="record-notes">
                    <strong>Notes:</strong> {record.notes}
                  </div>
                )}
              </div>

              {/* Amount & Date Column */}
              <div className="record-amount-col">
                <div className="record-amount" style={{ color: isIncome ? '#34d399' : '#f87171' }}>
                  {isIncome ? `+ ${formatCurrency(record.amount)}` : `- ${formatCurrency(record.amount)}`}
                </div>

                <div className="record-date">
                  <CalendarDays size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
                  {formatDate(record.date)}
                </div>
              </div>

              {/* Action Buttons: Edit & Delete */}
              <div className="record-actions">
                <button
                  className="btn-icon"
                  title="Edit Record"
                  onClick={() => onOpenEditRecord(record)}
                  id={`btn-edit-${record._id}`}
                >
                  <Edit2 size={15} />
                </button>
                <button
                  className="btn-icon danger"
                  title="Delete Record"
                  onClick={() => onOpenDeleteConfirm(record)}
                  id={`btn-delete-${record._id}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
