import React from 'react';
import { Layers, Plus, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import CashCard from '../components/CashCard';
import CategoryCard from '../components/CategoryCard';
import DateRangeFilter from '../components/DateRangeFilter';

export default function Dashboard({
  dashboardData,
  onSelectCategory,
  onOpenCashModal,
  onOpenAddCategoryModal,
  onOpenReceiveMoney,
  loading,
  error,
  dateRange,
  onDateRangeChange
}) {
  const cash = dashboardData?.cash;
  const categories = dashboardData?.categories || [];

  const incomeCategories = categories.filter(c => c.isIncome || c.name === 'Received Amount');
  const expenseCategories = categories.filter(c => !c.isIncome && c.name !== 'Received Amount');

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          color: '#f87171',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <AlertCircle size={20} />
          <div>
            <strong>Error loading data:</strong> {error}
          </div>
        </div>
      )}

      <div className="dashboard-filter-bar">
        <div>
          <strong>Showing financial activity</strong>
          <span>Choose a period to update this dashboard</span>
        </div>
        <DateRangeFilter value={dateRange} onChange={onDateRangeChange} />
      </div>

      {/* 1. HERO CASH CARD */}
      <CashCard
        cash={cash}
        onEditCash={onOpenCashModal}
        onOpenReceiveMoney={onOpenReceiveMoney}
      />

      {/* 2. RECEIVED AMOUNT / CASH INFLOW SECTION */}
      {incomeCategories.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="categories-section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={22} color="#34d399" />
              <div>
                <h2>Money Received (Raqam Wusool)</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '2px' }}>
                  Amounts added here increase your Total Available Cash balance
                </p>
              </div>
            </div>
          </div>

          <div className="category-grid" style={{ marginBottom: '1rem' }}>
            {incomeCategories.map((cat) => (
              <CategoryCard
                key={cat._id || cat.slug}
                category={cat}
                onClick={onSelectCategory}
              />
            ))}
          </div>
        </div>
      )}

      {/* 3. EXPENSE CATEGORIES SECTION */}
      <div className="categories-section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingDown size={22} color="#38bdf8" />
          <div>
            <h2>Expense Categories (Kharchay)</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '2px' }}>
              Select a category to record expenses. Amounts recorded here deduct from your Total Cash.
            </p>
          </div>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenAddCategoryModal}
          id="btn-add-category-top"
        >
          <Plus size={15} />
          Add Category
        </button>
      </div>

      {loading && !dashboardData ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8' }}>
          <div className="spin" style={{ display: 'inline-block', width: 32, height: 32, border: '3px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
          <div style={{ marginTop: '1rem', fontWeight: 600 }}>Loading category records...</div>
        </div>
      ) : expenseCategories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Layers size={32} />
          </div>
          <h3 className="empty-state-title">No expense categories found</h3>
          <p className="empty-state-desc">Get started by creating your first expense category.</p>
          <button className="btn btn-primary" onClick={onOpenAddCategoryModal}>
            <Plus size={16} /> Add Category
          </button>
        </div>
      ) : (
        <div className="category-grid">
          {expenseCategories.map((cat) => (
            <CategoryCard
              key={cat._id || cat.slug}
              category={cat}
              onClick={onSelectCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
}
