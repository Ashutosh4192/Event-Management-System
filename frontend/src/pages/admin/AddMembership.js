import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { addMembership } from '../../services/adminService';
import { MEMBERSHIP_DURATIONS } from '../../utils/constants';
import { validateEmail, validateRequired } from '../../utils/validation';

function AddMembership() {
  const navigate = useNavigate();
  const location = useLocation();
  const accountType = location.state?.type || 'User';

  const [form, setForm] = useState({
    membershipNumber: '',
    name: '',
    email: '',
    duration: '6 months',
    accountType,
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!validateRequired(form.membershipNumber)) errs.membershipNumber = 'Membership number is required';
    if (!validateRequired(form.name)) errs.name = 'Name is required';
    if (!validateRequired(form.email)) errs.email = 'Email is required';
    else if (!validateEmail(form.email)) errs.email = 'Invalid email format';
    if (!validateRequired(form.duration)) errs.duration = 'Duration is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(''); setSuccess('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    try {
      await addMembership(form);
      setSuccess('Membership created successfully');
      setForm({ membershipNumber: '', name: '', email: '', duration: '6 months', accountType });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Error creating membership');
    }
  };

  const handleLogout = () => { localStorage.removeItem('authToken'); navigate('/'); };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 560 }}>
        <div className="top-nav">
          <button className="btn btn-outline" onClick={() => navigate('/admin')}>Home</button>
          <button className="btn btn-outline" onClick={() => navigate(-1)}>Back</button>
          <button className="btn btn-outline" onClick={handleLogout}>LogOut</button>
        </div>
        <div className="title-banner">Add Membership ({accountType})</div>
        {serverError && <div className="error-banner">{serverError}</div>}
        {success && <div className="success-banner">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Membership No.</label>
            <div style={{ flex: 1 }}>
              <input type="text" name="membershipNumber" value={form.membershipNumber} onChange={handleChange} />
              {errors.membershipNumber && <div className="error-text">{errors.membershipNumber}</div>}
            </div>
          </div>
          <div className="form-group">
            <label>Name</label>
            <div style={{ flex: 1 }}>
              <input type="text" name="name" value={form.name} onChange={handleChange} />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <div style={{ flex: 1 }}>
              <input type="email" name="email" value={form.email} onChange={handleChange} />
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Membership Duration</div>
            <div className="radio-group">
              {MEMBERSHIP_DURATIONS.map((d) => (
                <label key={d}>
                  <input
                    type="radio"
                    name="duration"
                    value={d}
                    checked={form.duration === d}
                    onChange={handleChange}
                  />
                  {d}
                </label>
              ))}
            </div>
            {errors.duration && <div className="error-text">{errors.duration}</div>}
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Add Membership</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMembership;
