import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const handleLogout = () => { localStorage.removeItem('authToken'); navigate('/'); };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 500 }}>
        <div className="top-nav">
          <button className="btn btn-outline" onClick={() => navigate('/admin')}>Home</button>
          <button className="btn btn-outline" onClick={handleLogout}>LogOut</button>
        </div>
        <div className="welcome-header">Welcome Admin</div>
        <div className="dashboard-nav" style={{ justifyContent: 'center', marginTop: 24 }}>
          <button className="btn btn-outline" onClick={() => navigate('/admin/maintain-user')}>
            Maintain User
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/admin/maintain-vendor')}>
            Maintain Vendor
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
