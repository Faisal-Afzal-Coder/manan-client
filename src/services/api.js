// Base API URL with environment variable support
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Currency formatter helper: format numbers to "Rs. 125,000"
 */
export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return `Rs. ${num.toLocaleString('en-PK', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  })}`;
};

/**
 * Date formatter helper: format ISO date to readable string (e.g., "27 August 2026")
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Format date for HTML date input: YYYY-MM-DD
 */
export const formatDateForInput = (dateInput) => {
  const date = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(date.getTime())) return new Date().toISOString().split('T')[0];
  return date.toISOString().split('T')[0];
};

/**
 * Generic API request handler with error normalization
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
}

// Authentication API
export const loginUser = (email, password) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

// Dashboard & Cash APIs
export const getDashboardData = (params = {}) => {
  const query = new URLSearchParams();
  if (params.startDate) query.append('startDate', params.startDate);
  if (params.endDate) query.append('endDate', params.endDate);
  const qs = query.toString() ? `?${query.toString()}` : '';
  return request(`/dashboard${qs}`);
};
export const getCashStatus = () => request('/cash');
export const updateInitialCash = (initialCash) =>
  request('/cash', {
    method: 'PUT',
    body: JSON.stringify({ initialCash: Number(initialCash) })
  });

// Category APIs
export const getCategories = () => request('/categories');
export const createCategory = (categoryData) =>
  request('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData)
  });
export const deleteCategory = (id) =>
  request(`/categories/${id}`, {
    method: 'DELETE'
  });

// Record APIs
export const getRecordsByCategory = (categorySlug, params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.startDate) query.append('startDate', params.startDate);
  if (params.endDate) query.append('endDate', params.endDate);

  const qs = query.toString() ? `?${query.toString()}` : '';
  return request(`/records/${encodeURIComponent(categorySlug)}${qs}`);
};

export const createRecord = (recordData) =>
  request('/records', {
    method: 'POST',
    body: JSON.stringify(recordData)
  });

export const updateRecord = (id, recordData) =>
  request(`/records/${id}`, {
    method: 'PUT',
    body: JSON.stringify(recordData)
  });

export const deleteRecord = (id) =>
  request(`/records/${id}`, {
    method: 'DELETE'
  });
