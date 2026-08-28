import React from 'react';
import { Wallet, RefreshCw, PlusCircle, ArrowLeft, LogOut, User } from 'lucide-react';
import { formatCurrency } from '../services/api';

export default function Navbar({
  currentView,
  onNavigateHome,
  cashData,
  currentUser,
  onLogout,
  onOpenCashModal,
  onOpenAddCategoryModal,
  onRefresh,
  loading
}) {
  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <div className="brand-logo" onClick={onNavigateHome}>
            <div className="brand-icon">
              <Wallet size={22} />
            </div>
            <div>
              <div className="brand-title">Hisab Tracker</div>
              <div className="brand-subtitle">Category Money Record System</div>
            </div>
          </div>

          <div className="nav-actions">
            {currentView !== 'dashboard' && (
              <button className="btn btn-secondary btn-sm" onClick={onNavigateHome} id="nav-btn-dashboard">
                <ArrowLeft size={16} />
                <span className="hide-on-mobile">Dashboard</span>
              </button>
            )}

            {cashData && (
              <button
                className="btn btn-secondary btn-sm nav-cash-btn"
                onClick={onOpenCashModal}
                title="Click to edit Initial Cash"
              >
                <span style={{ color: '#94a3b8' }} className="hide-on-mobile">Remaining:</span>
                <span style={{ color: '#34d399', fontWeight: '700' }}>
                  {formatCurrency(cashData.remainingCash)}
                </span>
              </button>
            )}

            {currentView === 'dashboard' && (
              <button
                className="btn btn-secondary btn-sm hide-on-mobile"
                onClick={onOpenAddCategoryModal}
                title="Add New Category"
              >
                <PlusCircle size={16} />
                New Category
              </button>
            )}

            <button
              className="btn-icon"
              onClick={onRefresh}
              title="Refresh Data"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'spin' : ''} />
            </button>

            {/* User Profile & Logout */}
            {currentUser && (
              <div className="user-nav-group">
                <div className="user-badge hide-on-mobile" title={currentUser.email}>
                  <User size={13} />
                  <span>{currentUser.name || currentUser.email.split('@')[0]}</span>
                </div>
                <button
                  className="btn-icon danger"
                  onClick={onLogout}
                  title="Logout"
                  id="btn-logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
