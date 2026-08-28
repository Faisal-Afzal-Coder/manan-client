import React from 'react';
import { ArrowRight, Folder, Tag, Users, Building, Zap, Truck, Wrench, Wallet, PlusCircle } from 'lucide-react';
import { formatCurrency } from '../services/api';

const getCategoryIcon = (iconName, isIncome, size = 20) => {
  if (isIncome || iconName === 'wallet') return <Wallet size={size} />;
  switch (iconName) {
    case 'users': return <Users size={size} />;
    case 'building': return <Building size={size} />;
    case 'zap': return <Zap size={size} />;
    case 'truck': return <Truck size={size} />;
    case 'tool': return <Wrench size={size} />;
    case 'tag': return <Tag size={size} />;
    default: return <Folder size={size} />;
  }
};

export default function CategoryCard({ category, onClick }) {
  const isIncome = Boolean(
    category.isIncome ||
    category.name === 'Received Amount' ||
    category.slug === 'received-amount'
  );

  const color = isIncome ? '#10b981' : (category.color || '#3b82f6');
  const recordCount = category.recordCount || 0;
  const totalAmount = category.totalAmount || 0;

  return (
    <div
      className={`category-card ${isIncome ? 'income-card' : ''}`}
      onClick={() => onClick(category)}
      id={`cat-card-${category.slug}`}
      style={isIncome ? {
        border: '1px solid rgba(16, 185, 129, 0.4)',
        background: 'linear-gradient(145deg, #132729 0%, #182234 100%)'
      } : {}}
    >
      <div>
        <div className="category-card-top">
          <div
            className="category-icon-wrapper"
            style={{
              backgroundColor: `${color}20`,
              color: color,
              border: `1px solid ${color}40`
            }}
          >
            {getCategoryIcon(category.icon, isIncome, 22)}
          </div>

          {isIncome ? (
            <span style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.15)',
              padding: '0.2rem 0.5rem',
              borderRadius: '9999px',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              + Cash Inflow (Raqam Wusool)
            </span>
          ) : (
            <ArrowRight size={18} className="category-arrow" />
          )}
        </div>

        <h3 className="category-card-name" style={isIncome ? { color: '#34d399' } : {}}>
          {category.name}
        </h3>
      </div>

      <div className="category-card-stats">
        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600' }}>
            {isIncome ? 'Total Received (+)' : 'Total Expense (-)'}
          </div>
          <div
            className="category-card-amount"
            style={{ color: isIncome ? '#34d399' : '#38bdf8' }}
          >
            {isIncome ? `+ ${formatCurrency(totalAmount)}` : formatCurrency(totalAmount)}
          </div>
        </div>

        <div className="category-card-count">
          {recordCount} {recordCount === 1 ? 'Record' : 'Records'}
        </div>
      </div>
    </div>
  );
}
