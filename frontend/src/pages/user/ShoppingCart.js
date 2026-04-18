import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeCartItem, clearCart } from '../../services/userService';

const API_URL = process.env.REACT_APP_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';

function ShoppingCart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], grandTotal: 0 });
  const [error, setError] = useState('');

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data);
    } catch { }
  };

  useEffect(() => { fetchCart(); }, []);

  const handleQuantityChange = async (itemId, qty) => {
    try {
      await updateCartItem(itemId, parseInt(qty));
      fetchCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating quantity');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeCartItem(itemId);
      fetchCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Error removing item');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Clear entire cart?')) return;
    try {
      await clearCart();
      fetchCart();
    } catch { }
  };

  const handleLogout = () => { localStorage.removeItem('authToken'); navigate('/'); };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h2>Shopping Cart</h2>
          <div className="nav-buttons">
            <button className="btn btn-outline" onClick={() => navigate('/user')}>Home</button>
            <button className="btn btn-outline" onClick={() => navigate(-1)}>Back</button>
            <button className="btn btn-outline" onClick={handleLogout}>LogOut</button>
          </div>
        </div>
        <div className="title-banner">Shopping Cart</div>
        {error && <div className="error-banner">{error}</div>}

        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>Cart is empty</td></tr>
            ) : cart.items.map((item) => (
              <tr key={item._id}>
                <td>
                  {item.productImage ? (
                    <img src={`${API_URL}/uploads/${item.productImage}`} alt={item.productName} />
                  ) : (
                    <div style={{ width: 50, height: 50, backgroundColor: '#ddd', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#888' }}>
                      No Image
                    </div>
                  )}
                </td>
                <td>{item.productName}</td>
                <td>Rs/{item.productPrice}</td>
                <td>
                  <select
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: 4 }}
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </td>
                <td>Rs/{item.totalPrice}</td>
                <td>
                  <button className="btn btn-danger" style={{ fontSize: 12, padding: '4px 8px' }}
                    onClick={() => handleRemove(item._id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="grand-total-row">
          <span>Grand Total</span>
          <span>Rs/{cart.grandTotal || 0}</span>
          <button className="btn btn-outline" onClick={handleDeleteAll}>Delete All</button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            className="btn btn-outline"
            onClick={() => navigate('/user/checkout', { state: { grandTotal: cart.grandTotal } })}
            disabled={cart.items.length === 0}
          >
            Proceed to CheckOut
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCart;
