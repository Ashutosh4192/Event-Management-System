import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../../services/userService';

function OrderStatus() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders().then((res) => setOrders(res.data)).catch(() => {});
  }, []);

  const handleLogout = () => { localStorage.removeItem('authToken'); navigate('/'); };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="top-nav">
          <button className="btn btn-nav" onClick={() => navigate('/user')}>Home</button>
          <button className="btn btn-nav" onClick={handleLogout}>LogOut</button>
        </div>
        <div className="title-banner">User Order Status</div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>E-mail</th>
              <th>Address</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>No orders found</td></tr>
            ) : orders.map((o) => (
              <tr key={o._id}>
                <td>{o.customerDetails?.name}</td>
                <td>{o.customerDetails?.email}</td>
                <td>{o.customerDetails?.address}</td>
                <td>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderStatus;
