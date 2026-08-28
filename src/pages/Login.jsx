import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Wallet } from 'lucide-react';
import { loginUser } from '../services/api';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser(email.trim(), password);
      if (res.success && res.data) {
        onLoginSuccess(res.data.user, res.data.token);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Brand Header */}
        <div className="login-brand-header">
          <div className="login-brand-icon">
            <Wallet size={28} />
          </div>
          <h1 className="login-title">Hisab Tracker</h1>
          <p className="login-subtitle">Secure Category Expense & Money Record System</p>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <div className="login-card-header">
            <div className="login-badge">
              <ShieldCheck size={14} />
              Authorized Access Only
            </div>
            <h2 style={{ fontSize: '1.25rem', marginTop: '0.5rem', marginBottom: '0.25rem' }}>Sign In</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>
              Please enter your authorized email & password to continue.
            </p>
          </div>

          {error && (
            <div className="login-error-box">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">
                <Mail size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: -2 }} />
                Email Address<span className="required">*</span>
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="abdulmanan@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                autoComplete="email"
                autoFocus
                required
                id="input-login-email"
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">
                <Lock size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: -2 }} />
                Password<span className="required">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  autoComplete="current-password"
                  required
                  id="input-login-password"
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem 1rem', marginTop: '0.5rem' }}
              disabled={loading}
              id="btn-login-submit"
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="login-footer">
          🔒 Encrypted & Private Business Ledger System
        </div>
      </div>
    </div>
  );
}
