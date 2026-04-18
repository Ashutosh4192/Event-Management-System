import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupVendor } from '../../services/authService';
import { CATEGORIES } from '../../utils/constants';
import { validateEmail, validateRequired } from '../../utils/validation';

function VendorSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', category: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!validateRequired(form.name)) errs.name = 'Name is required';
    if (!validateRequired(form.email)) errs.email = 'Email is required';
    else if (!validateEmail(form.email)) errs.email = 'Invalid email format';
    if (!validateRequired(form.password)) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!validateRequired(form.category)) errs.category = 'Category is required';
    return errs;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    try {
      await signupVendor(form);
      navigate('/auth/vendor/login');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 560 }}>
        <div className="top-nav">
          <button className="btn btn-nav" onClick={() => navigate('/')}>Back to Home</button>
        </div>
        <div className="title-banner">Event Management System</div>
        {serverError && <div className="error-banner">{serverError}</div>}
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Name</label>
            <div style={{ flex: 1 }}>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Vendor" />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <div style={{ flex: 1 }}>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Vendor" />
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ flex: 1 }}>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Vendor" />
              {errors.password && <div className="error-text">{errors.password}</div>}
            </div>
          </div>
          <div className="form-group">
            <label>Category</label>
            <div style={{ flex: 1 }}>
              <select name="category" value={form.category} onChange={handleChange}>
                <option value="">Drop Down</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <div className="error-text">{errors.category}</div>}
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VendorSignup;
