import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getVendors } from '../../services/userService';
import { CATEGORIES } from '../../utils/constants';

function VendorBrowse() {
  const navigate = useNavigate();
  const location = useLocation();
  const [vendors, setVendors] = useState([]);
  const [activeCategory, setActiveCategory] = useState(location.state?.category || 'All');

  const fetchVendors = async (cat) => {
    try {
      const res = await getVendors(cat === 'All' ? '' : cat);
      setVendors(res.data);
    } catch { }
  };

  useEffect(() => { fetchVendors(activeCategory); }, [activeCategory]);

  const handleLogout = () => { localStorage.removeItem('authToken'); navigate('/'); };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="top-nav">
          <button className="btn btn-outline" onClick={() => navigate(-1)}>Back</button>
          <button className="btn btn-outline" onClick={handleLogout}>LogOut</button>
        </div>

        <div className="category-tabs">
          <button
            className={activeCategory === 'All' ? 'active' : ''}
            onClick={() => setActiveCategory('All')}
          >
            Vendor
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={activeCategory === c ? 'active' : ''}
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

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
  );
}

export default VendorBrowse;
