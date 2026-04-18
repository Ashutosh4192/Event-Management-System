import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getTokenData } from '../../utils/authGuard';

function VendorDashboard() {
  const navigate = useNavigate();
  const user = getTokenData();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 600, backgroundColor: '#4a6fa5' }}>
        <div className="welcome-header" style={{ backgroundColor: '#c8c8c8' }}>
          Welcome {user?.name || 'Vendor'}
        </div>
        <div className="dashboard-nav" style={{ justifyContent: 'center' }}>
          <button className="btn btn-nav" onClick={() => navigate('/vendor/items')}>Your Item</button>
          <button className="btn btn-nav" onClick={() => navigate('/vendor/items')}>Add New Item</button>
          <button className="btn btn-nav" onClick={() => navigate('/vendor/status')}>Transection</button>
          <button className="btn btn-nav" onClick={handleLogout}>LogOut</button>
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;
