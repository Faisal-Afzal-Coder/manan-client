import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CategoryDetail from './pages/CategoryDetail';
import Login from './pages/Login';
import RecordModal from './components/RecordModal';
import CashModal from './components/CashModal';
import ConfirmModal from './components/ConfirmModal';
import CategoryModal from './components/CategoryModal';
import Toast from './components/Toast';
import {
  getDashboardData,
  createRecord,
  updateRecord,
  deleteRecord,
  updateInitialCash,
  createCategory,
  formatCurrency
} from './services/api';

export default function App() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'category-detail'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(Date.now());

  // Toast System
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Login handler
  const handleLoginSuccess = (user, token) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_token', token);
    } catch (e) {
      console.error(e);
    }
    addToast(`Welcome back, ${user.name || user.email}!`, 'success');
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
    } catch (e) {
      console.error(e);
    }
    addToast('You have been logged out.', 'info');
  };

  // Modals state
  const [recordModal, setRecordModal] = useState({
    isOpen: false,
    categoryName: '',
    initialData: null,
    isSaving: false
  });

  const [cashModal, setCashModal] = useState({
    isOpen: false,
    isSaving: false
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    record: null,
    isDeleting: false
  });

  const [categoryModal, setCategoryModal] = useState({
    isOpen: false,
    isSaving: false
  });

  // Fetch Dashboard & Cash Data
  const loadDashboard = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getDashboardData();
      if (res.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError(err.message || 'Failed to connect to backend server');
      addToast('Cannot connect to server. Please ensure backend is running.', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadDashboard();
    }
  }, [loadDashboard, refreshTrigger, currentUser]);

  // Navigation handlers
  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setCurrentView('category-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setSelectedCategory(null);
    setCurrentView('dashboard');
    setRefreshTrigger(Date.now());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Record Modal Openers
  const handleOpenAddRecord = (categoryName) => {
    setRecordModal({
      isOpen: true,
      categoryName: categoryName || selectedCategory?.name || 'Received Amount',
      initialData: null,
      isSaving: false
    });
  };

  const handleOpenReceiveMoney = () => {
    handleOpenAddRecord('Received Amount');
  };

  const handleOpenEditRecord = (record) => {
    setRecordModal({
      isOpen: true,
      categoryName: record.category,
      initialData: record,
      isSaving: false
    });
  };

  // Save Record (Create or Edit)
  const handleSaveRecord = async (recordPayload) => {
    try {
      setRecordModal((prev) => ({ ...prev, isSaving: true }));
      let res;
      const isIncome = recordPayload.category === 'Received Amount';

      if (recordModal.initialData?._id) {
        res = await updateRecord(recordModal.initialData._id, recordPayload);
        addToast(`Record for ${recordPayload.personName} updated successfully!`, 'success');
      } else {
        res = await createRecord(recordPayload);
        if (isIncome) {
          addToast(`Received Amount of ${formatCurrency(recordPayload.amount)} added to Total Cash!`, 'success');
        } else {
          addToast(`Record of ${formatCurrency(recordPayload.amount)} saved in ${recordPayload.category}!`, 'success');
        }
      }

      setRecordModal({ isOpen: false, categoryName: '', initialData: null, isSaving: false });
      setRefreshTrigger(Date.now());
    } catch (err) {
      addToast(err.message || 'Failed to save record', 'error');
      setRecordModal((prev) => ({ ...prev, isSaving: false }));
    }
  };

  // Delete Record Opener & Handler
  const handleOpenDeleteConfirm = (record) => {
    setConfirmModal({
      isOpen: true,
      record,
      isDeleting: false
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmModal.record?._id) return;
    const isIncome = confirmModal.record.category === 'Received Amount';
    try {
      setConfirmModal((prev) => ({ ...prev, isDeleting: true }));
      await deleteRecord(confirmModal.record._id);

      if (isIncome) {
        addToast(`Received record of ${formatCurrency(confirmModal.record.amount)} removed from Total Cash.`, 'info');
      } else {
        addToast(`Expense record of ${formatCurrency(confirmModal.record.amount)} deleted. Amount refunded to Remaining Cash.`, 'success');
      }

      setConfirmModal({ isOpen: false, record: null, isDeleting: false });
      setRefreshTrigger(Date.now());
    } catch (err) {
      addToast(err.message || 'Failed to delete record', 'error');
      setConfirmModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // Initial Cash Opener & Handler
  const handleOpenCashModal = () => {
    setCashModal({ isOpen: true, isSaving: false });
  };

  const handleSaveCash = async (initialCashValue) => {
    try {
      setCashModal((prev) => ({ ...prev, isSaving: true }));
      const res = await updateInitialCash(initialCashValue);
      if (res.success) {
        addToast(`Initial Cash updated to ${formatCurrency(initialCashValue)}`, 'success');
        setCashModal({ isOpen: false, isSaving: false });
        setRefreshTrigger(Date.now());
      }
    } catch (err) {
      addToast(err.message || 'Failed to update initial cash', 'error');
      setCashModal((prev) => ({ ...prev, isSaving: false }));
    }
  };

  // Category Modal Opener & Handler
  const handleOpenAddCategoryModal = () => {
    setCategoryModal({ isOpen: true, isSaving: false });
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      setCategoryModal((prev) => ({ ...prev, isSaving: true }));
      const res = await createCategory(categoryData);
      if (res.success) {
        addToast(`Category "${categoryData.name}" created!`, 'success');
        setCategoryModal({ isOpen: false, isSaving: false });
        setRefreshTrigger(Date.now());
      }
    } catch (err) {
      addToast(err.message || 'Failed to create category', 'error');
      setCategoryModal((prev) => ({ ...prev, isSaving: false }));
    }
  };

  // If user is not logged in, render Login page immediately
  if (!currentUser) {
    return (
      <>
        <Login onLoginSuccess={handleLoginSuccess} />
        <Toast toasts={toasts} onClose={removeToast} />
      </>
    );
  }

  return (
    <div className="app-layout">
      {/* Universal Navigation */}
      <Navbar
        currentView={currentView}
        onNavigateHome={handleNavigateHome}
        cashData={dashboardData?.cash}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenCashModal={handleOpenCashModal}
        onOpenAddCategoryModal={handleOpenAddCategoryModal}
        onRefresh={() => setRefreshTrigger(Date.now())}
        loading={loading}
      />

      {/* Main Pages */}
      <main>
        {currentView === 'dashboard' ? (
          <Dashboard
            dashboardData={dashboardData}
            onSelectCategory={handleSelectCategory}
            onOpenCashModal={handleOpenCashModal}
            onOpenAddCategoryModal={handleOpenAddCategoryModal}
            onOpenReceiveMoney={handleOpenReceiveMoney}
            loading={loading}
            error={error}
          />
        ) : (
          <CategoryDetail
            category={selectedCategory}
            onBackToDashboard={handleNavigateHome}
            onOpenAddRecord={handleOpenAddRecord}
            onOpenEditRecord={handleOpenEditRecord}
            onOpenDeleteConfirm={handleOpenDeleteConfirm}
            refreshTrigger={refreshTrigger}
          />
        )}
      </main>

      {/* Modals */}
      <RecordModal
        isOpen={recordModal.isOpen}
        onClose={() => setRecordModal({ isOpen: false, categoryName: '', initialData: null, isSaving: false })}
        onSave={handleSaveRecord}
        categoryName={recordModal.categoryName}
        initialData={recordModal.initialData}
        isSaving={recordModal.isSaving}
      />

      <CashModal
        isOpen={cashModal.isOpen}
        onClose={() => setCashModal({ isOpen: false, isSaving: false })}
        onSave={handleSaveCash}
        cashData={dashboardData?.cash}
        isSaving={cashModal.isSaving}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, record: null, isDeleting: false })}
        onConfirm={handleConfirmDelete}
        record={confirmModal.record}
        isDeleting={confirmModal.isDeleting}
      />

      <CategoryModal
        isOpen={categoryModal.isOpen}
        onClose={() => setCategoryModal({ isOpen: false, isSaving: false })}
        onSave={handleSaveCategory}
        isSaving={categoryModal.isSaving}
      />

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  );
}
