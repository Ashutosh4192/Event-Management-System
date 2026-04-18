import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRequests } from '../../services/vendorService';

const API_URL = process.env.REACT_APP_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';

function RequestItem() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getRequests().then((res) => setRequests(res.data)).catch(() => {});
  }, []);

  const handleLogout = () => { localStorage.removeItem('authToken'); navigate('/'); };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="top-nav">
          <button className="btn btn-nav" onClick={() => navigate('/vendor')}>Home</button>
          <button className="btn btn-nav" onClick={() => navigate(-1)}>Back</button>
          <button className="btn btn-nav" onClick={handleLogout}>LogOut</button>
        </div>
        <div style={{ marginTop: 8, fontSize: 13, color: '#555' }}>Vender</div>

        <div className="cards-grid" style={{ marginTop: 16 }}>
          {requests.length === 0 ? (
            <p>No requested items</p>
          ) : requests.map((r, idx) => (
            <div key={idx} className="product-card">
              {r.item?.productImage ? (
                <img src={`${API_URL}/uploads/${r.item.productImage}`} alt={r.item.productName}
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6 }} />
              ) : (
                <div style={{ width: 80, height: 80, backgroundColor: '#ddd', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#888' }}>
                  No Image
                </div>
              )}
              <h4>{r.item?.productName || `Item ${idx + 1}`}</h4>
              <p>Qty: {r.item?.quantity}</p>
              <p>By: {r.userId?.name || 'User'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RequestItem;
