import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMembership, updateMembership, cancelMembership } from '../../services/adminService';
import { MEMBERSHIP_DURATIONS } from '../../utils/constants';

function UpdateMembership() {
  const navigate = useNavigate();
  const [lookupNumber, setLookupNumber] = useState('');
  const [membership, setMembership] = useState(null);
  const [duration, setDuration] = useState('6 months');
  const [cancelChecked, setCancelChecked] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');

  const handleLookup = async () => {
    setLookupError(''); setMembership(null); setSuccess(''); setServerError('');
    if (!lookupNumber.trim()) { setLookupError('Membership number is required'); return; }
    try {
      const res = await getMembership(lookupNumber.trim());
      setMembership(res.data);
      setDuration('6 months');
      setCancelChecked(false);
    } catch (err) {
      setLookupError(err.response?.data?.message || 'Membership not found');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setServerError(''); setSuccess('');
    try {
      if (cancelChecked) {
        await cancelMembership(membership.membershipNumber);
        setSuccess('Membership cancelled successfully');
      } else {
        await updateMembership(membership.membershipNumber, { duration });
        setSuccess('Membership extended successfully');
      }
      setMembership(null);
      setLookupNumber('');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Error updating membership');
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
        <div className="title-banner">Update Membership</div>
        {success && <div className="success-banner">{success}</div>}
        {serverError && <div className="error-banner">{serverError}</div>}

        <div className="form-group" style={{ marginBottom: 16 }}>
          <label>Membership No.</label>
          <input
            type="text"
            value={lookupNumber}
            onChange={(e) => setLookupNumber(e.target.value)}
            placeholder="Enter membership number"
          />
          <button className="btn btn-primary" style={{ marginLeft: 8 }} onClick={handleLookup}>
            Lookup
          </button>
        </div>
        {lookupError && <div className="error-banner">{lookupError}</div>}

        {membership && (
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={membership.name} readOnly style={{ background: '#ddd' }} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="text" value={membership.email} readOnly style={{ background: '#ddd' }} />
            </div>
            <div className="form-group">
              <label>Current Duration</label>
              <input type="text" value={membership.duration} readOnly style={{ background: '#ddd' }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Extend By</div>
              <div className="radio-group">
                {MEMBERSHIP_DURATIONS.map((d) => (
                  <label key={d}>
                    <input
                      type="radio"
                      name="duration"
                      value={d}
                      checked={duration === d}
                      onChange={() => setDuration(d)}
                      disabled={cancelChecked}
                    />
                    {d}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={cancelChecked}
                  onChange={(e) => setCancelChecked(e.target.checked)}
                />
                Cancel Membership
              </label>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {cancelChecked ? 'Cancel Membership' : 'Extend Membership'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default UpdateMembership;
