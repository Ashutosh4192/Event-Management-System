import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, updateOrderStatus, deleteOrder } from '../../services/vendorService';
import { ORDER_STATUSES } from '../../utils/constants';

function ProductStatus() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [updateRow, setUpdateRow] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('Received');
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch { }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleUpdateClick = (order) => {
    setUpdateRow(order._id);
    setSelectedStatus(order.status);
  };

  const handleStatusUpdate = async (orderId) => {
    try {
      await updateOrderStatus(orderId, selectedStatus);
      setUpdateRow(null);
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await deleteOrder(id);
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting order');
    }
  };

  const handleLogout = () => { localStorage.removeItem('authToken'); navigate('/'); };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="top-nav">
          <button className="btn btn-nav" onClick={() => navigate('/vendor')}>Home</button>
          <button className="btn btn-nav" onClick={() => navigate(-1)}>Back</button>
          <button className="btn btn-nav" onClick={handleLogout}>LogOut</button>
        </div>
        <div className="title-banner">Product Status</div>
        {error && <div className="error-banner">{error}</div>}

        {updateRow && (
          <div style={{ background: '#4a6fa5', padding: 16, borderRadius: 8, marginBottom: 16, maxWidth: 320 }}>
            <h4 style={{ color: '#fff', marginBottom: 12, textAlign: 'center' }}>Update</h4>
            <div className="radio-group">
              {ORDER_STATUSES.map((s) => (
                <label key={s} style={{ color: '#fff' }}>
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={selectedStatus === s}
                    onChange={() => setSelectedStatus(s)}
                  />
                  {s}
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => handleStatusUpdate(updateRow)}>Update</button>
              <button className="btn btn-secondary" onClick={() => setUpdateRow(null)}>Cancel</button>
            </div>
          </div>
        )}

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>E-Mail</th>
              <th>Address</th>
              <th>Status</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>No orders yet</td></tr>
            ) : orders.map((o) => (
              <tr key={o._id}>
                <td>{o.customerDetails?.name}</td>
                <td>{o.customerDetails?.email}</td>
                <td>{o.customerDetails?.address}</td>
                <td>{o.status}</td>
                <td>
                  <button className="btn btn-primary" style={{ fontSize: 12, padding: '4px 8px' }}
                    onClick={() => handleUpdateClick(o)}>Update</button>
                </td>
                <td>
                  <button className="btn btn-danger" style={{ fontSize: 12, padding: '4px 8px' }}
                    onClick={() => handleDelete(o._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductStatus;
