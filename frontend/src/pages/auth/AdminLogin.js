import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../services/authService';

function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ userId: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await loginAdmin(form);
      localStorage.setItem('authToken', res.data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleCancel = () => setForm({ userId: '', password: '' });

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 500 }}>
        <div className="top-nav">
          <button className="btn btn-nav" onClick={() => navigate('/')}>Back to Home</button>
        </div>
        <div className="title-banner">Event Management System</div>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>User Id</label>
            <input
              type="text"
              name="userId"
              value={form.userId}
              onChange={handleChange}
              placeholder="Admin"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Admin"
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-secondary">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
