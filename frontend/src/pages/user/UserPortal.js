import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../../utils/constants';
import { getVendors } from '../../services/userService';

function UserPortal() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');

  const handleLogout = () => { localStorage.removeItem('authToken'); navigate('/'); };

  const fetchVendors = async (cat) => {
    try {
      const res = await getVendors(cat === 'All' ? '' : cat);
      setVendors(res.data);
    } catch { }
  };

  useEffect(() => { fetchVendors(activeCategory); }, [activeCategory]);

  const handleCategoryChange = (e) => {
    setActiveCategory(e.target.value);
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 900, minHeight: 'calc(100vh - 40px)' }}>
        <div className="title-banner">WELCOME USER</div>
        <div className="dashboard-nav" style={{ flexWrap: 'wrap', justifyContent: 'flex-start', marginTop: 20 }}>
          <select
            value={activeCategory}
            onChange={handleCategoryChange}
            className="btn btn-primary"
            style={{ padding: '12px 24px', fontSize: '16px', minWidth: '180px', cursor: 'pointer' }}
          >
            <option value="All">Vendor</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={() => navigate('/user/cart')}>Cart</button>
          <button className="btn btn-primary" onClick={() => navigate('/user/guests')}>Guest List</button>
          <button className="btn btn-primary" onClick={() => navigate('/user/orders')}>Order Status</button>
          <button className="btn btn-primary" onClick={handleLogout}>LogOut</button>
        </div>

        {/* Vendor Browse Section */}
        <div style={{ marginTop: 24 }}>
          <div className="cards-grid">
            {vendors.length === 0 ? (
              <p>No vendors found</p>
            ) : vendors.map((v) => (
              <div key={v._id} className="vendor-card">
                <h4>{v.name}</h4>
                <p>{v.contactDetails || v.email}</p>
                <button
                  className="btn btn-outline"
                  onClick={() => navigate(`/user/vendors/${v._id}/products`)}
                >
                  Shop Item
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPortal;
