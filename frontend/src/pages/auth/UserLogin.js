import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';

function UserLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await loginUser(form);
      localStorage.setItem('authToken', res.data.token);
      navigate('/user');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleCancel = () => setForm({ email: '', password: '' });

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
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="User"
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
              placeholder="User"
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

export default UserLogin;
