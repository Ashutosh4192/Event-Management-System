import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllVendors } from '../../services/adminService';

function MaintainVendor() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [error, setError] = useState('');

  const handleLogout = () => { localStorage.removeItem('authToken'); navigate('/'); };

  const fetchVendors = async () => {
    try {
      const res = await getAllVendors();
      setVendors(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError(err.response?.data?.message || err.message || 'Error fetching vendors');
    }
  };

  useEffect(() => { fetchVendors(); }, []);

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="top-nav">
          <button className="btn btn-outline" onClick={() => navigate('/admin')}>Home</button>
          <button className="btn btn-outline" onClick={() => navigate(-1)}>Back</button>
          <button className="btn btn-outline" onClick={handleLogout}>LogOut</button>
        </div>

        <div className="title-banner">Vendor Management</div>

        <div className="maintain-section">
          <div className="section-label">Membership</div>
          <div className="section-buttons">
            <button className="btn btn-outline" onClick={() => navigate('/admin/membership/add', { state: { type: 'Vendor' } })}>
              Add
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/admin/membership/update', { state: { type: 'Vendor' } })}>
              Update
            </button>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div style={{ marginTop: 24 }}>
          <h3 style={{ marginBottom: 12 }}>Registered Vendors</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Category</th>
                <th>Registered Date</th>
              </tr>
            </thead>
            <tbody>
              {vendors.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center' }}>No vendors registered</td></tr>
              ) : vendors.map((vendor) => (
                <tr key={vendor._id}>
                  <td>{vendor.name}</td>
                  <td>{vendor.email}</td>
                  <td>{vendor.category}</td>
                  <td>{new Date(vendor.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MaintainVendor;
