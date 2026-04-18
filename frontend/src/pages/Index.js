import React from 'react';
import { useNavigate } from 'react-router-dom';

function Index() {
  const navigate = useNavigate();
  return (
    <div className="index-page">
      <div className="title-banner" style={{ maxWidth: 900 }}>
        Event Management System
      </div>
      <div className="index-buttons">
        <div className="index-button-group">
          <button className="btn-primary btn" onClick={() => navigate('/auth/admin/login')}>
            Admin Login
          </button>
        </div>
        <div className="index-button-group">
          <button className="btn-primary btn" onClick={() => navigate('/auth/vendor/login')}>
            Vendor Login
          </button>
          <button className="btn-secondary btn" onClick={() => navigate('/auth/vendor/signup')}>
            Vendor Signup
          </button>
        </div>
        <div className="index-button-group">
          <button className="btn-primary btn" onClick={() => navigate('/auth/user/login')}>
            User Login
          </button>
          <button className="btn-secondary btn" onClick={() => navigate('/auth/user/signup')}>
            User Signup
          </button>
        </div>
      </div>
    </div>
  );
}

export default Index;
