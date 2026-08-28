import React from 'react';
import { DollarSign, Edit3, TrendingDown, TrendingUp, ShieldCheck, Info, PlusCircle, ArrowDownLeft } from 'lucide-react';
import { formatCurrency } from '../services/api';

export default function CashCard({ cash, onEditCash, onOpenReceiveMoney }) {
  const initialCash = cash?.initialCash || 0;
  const totalReceived = cash?.totalReceived || 0;
  const totalAvailableCash = cash?.totalAvailableCash !== undefined ? cash.totalAvailableCash : (initialCash + totalReceived);
  const totalUsed = cash?.totalUsed || 0;
  const remainingCash = cash?.remainingCash !== undefined ? cash.remainingCash : (totalAvailableCash - totalUsed);

  let remainingColorClass = 'emerald';
  if (remainingCash < 0) {
    remainingColorClass = 'rose';
  } else if (remainingCash === 0 && totalAvailableCash > 0) {
    remainingColorClass = 'amber';
  }

  return (
    <div className="cash-hero-card">
      <div className="cash-hero-header">
        <div className="cash-title-group">
          <div className="cash-badge">
            <ShieldCheck size={14} />
            Live Cash & Balance Management
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onEditCash}
            id="btn-edit-cash"
          >
            <Edit3 size={15} />
            Set Initial Cash
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={onOpenReceiveMoney}
            id="btn-quick-receive"
          >
            <PlusCircle size={15} />
            + Record Received Amount
          </button>
        </div>
      </div>

      <div className="cash-metrics-grid">
        {/* 1. Initial Cash */}
        <div className="cash-metric-box">
          <div className="metric-label">
            <DollarSign size={16} color="#94a3b8" />
            Initial Cash
          </div>
          <div className="metric-value">
            {formatCurrency(initialCash)}
          </div>
        </div>

        {/* 2. Total Received (+) */}
        <div className="cash-metric-box" style={{ borderColor: 'rgba(16, 185, 129, 0.35)', background: 'rgba(16, 185, 129, 0.05)' }}>
          <div className="metric-label">
            <TrendingUp size={16} color="#34d399" />
            + Received Amount (Inflow)
          </div>
          <div className="metric-value emerald">
            +{formatCurrency(totalReceived)}
          </div>
        </div>

        {/* 3. Total Available */}
        <div className="cash-metric-box">
          <div className="metric-label">
            <DollarSign size={16} color="#38bdf8" />
            = Total Cash (In Hand)
          </div>
          <div className="metric-value" style={{ color: '#38bdf8' }}>
            {formatCurrency(totalAvailableCash)}
          </div>
        </div>

        {/* 4. Total Used / Expenses (-) */}
        <div className="cash-metric-box">
          <div className="metric-label">
            <TrendingDown size={16} color="#f87171" />
            - Total Expenses (All Categories)
          </div>
          <div className="metric-value rose">
            -{formatCurrency(totalUsed)}
          </div>
        </div>

        {/* 5. Remaining Cash */}
        <div className="cash-metric-box highlight" style={{ gridColumn: 'span 1' }}>
          <div className="metric-label">
            <ArrowDownLeft size={16} color="#34d399" />
            = Remaining Cash Balance
          </div>
          <div className={`metric-value ${remainingColorClass}`}>
            {formatCurrency(remainingCash)}
          </div>
        </div>
      </div>

      <div className="cash-note">
        <Info size={14} />
        <strong>Formula:</strong> Remaining Cash = (Initial Cash + Received Amount) - Total Category Expenses.
      </div>
    </div>
  );
}
