import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkout } from '../../services/userService';
import { validateCheckoutForm } from '../../utils/validation';
import { PAYMENT_METHODS } from '../../utils/constants';

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const grandTotal = location.state?.grandTotal || 0;

  const [form, setForm] = useState({
    name: '', phone: '', email: '', paymentMethod: '',
    address: '', state: '', city: '', pinCode: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [orderData, setOrderData] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validateCheckoutForm(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    try {
      const res = await checkout(form);
      setOrderData({ ...form, grandTotal });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Checkout failed');
    }
  };

  const handleContinue = () => navigate('/user');

  if (orderData) {
    return (
      <div className="page-wrapper">
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>PopUp<br />THANK YOU</h3>
            <div className="detail-row">
              <span className="detail-label">Total Amount</span>
              <span>Rs/{orderData.grandTotal}</span>
            </div>
            {[
              ['Name', orderData.name],
              ['Number', orderData.phone],
              ['E-mail', orderData.email],
              ['Payment Method', orderData.paymentMethod],
              ['Address', orderData.address],
              ['State', orderData.state],
              ['City', orderData.city],
              ['Pin Code', orderData.pinCode],
            ].map(([label, value]) => (
              <div className="detail-row" key={label}>
                <span className="detail-label">{label}</span>
                <span>{value}</span>
              </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <button className="btn btn-primary" onClick={handleContinue}>Continue Shopping</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 700 }}>
        <div className="top-nav">
          <button className="btn btn-nav" onClick={() => navigate('/user')}>Home</button>
          <button className="btn btn-nav" onClick={() => navigate(-1)}>Back</button>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ background: '#4a6fa5', color: '#fff', padding: '10px 20px', borderRadius: 6, display: 'inline-block' }}>
            Item<br />Grand Total &nbsp; Rs/{grandTotal}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ background: '#4a6fa5', color: '#fff', padding: '8px 20px', borderRadius: 6, display: 'inline-block' }}>
            Details
          </div>
        </div>
        {serverError && <div className="error-banner">{serverError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="checkout-grid">
            <div>
              <div className="form-group">
                <label>Name</label>
                <div style={{ flex: 1 }}>
                  <input type="text" name="name" value={form.name} onChange={handleChange} />
                  {errors.name && <div className="error-text">{errors.name}</div>}
                </div>
              </div>
              <div className="form-group">
                <label>E-mail</label>
                <div style={{ flex: 1 }}>
                  <input type="email" name="email" value={form.email} onChange={handleChange} />
                  {errors.email && <div className="error-text">{errors.email}</div>}
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <div style={{ flex: 1 }}>
                  <input type="text" name="address" value={form.address} onChange={handleChange} />
                  {errors.address && <div className="error-text">{errors.address}</div>}
                </div>
              </div>
              <div className="form-group">
                <label>City</label>
                <div style={{ flex: 1 }}>
                  <input type="text" name="city" value={form.city} onChange={handleChange} />
                  {errors.city && <div className="error-text">{errors.city}</div>}
                </div>
              </div>
            </div>
            <div>
              <div className="form-group">
                <label>Number</label>
                <div style={{ flex: 1 }}>
                  <input type="text" name="phone" value={form.phone} onChange={handleChange} />
                  {errors.phone && <div className="error-text">{errors.phone}</div>}
                </div>
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <div style={{ flex: 1 }}>
                  <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
                    <option value="">Select</option>
                    {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  {errors.paymentMethod && <div className="error-text">{errors.paymentMethod}</div>}
                </div>
              </div>
              <div className="form-group">
                <label>State</label>
                <div style={{ flex: 1 }}>
                  <input type="text" name="state" value={form.state} onChange={handleChange} />
                  {errors.state && <div className="error-text">{errors.state}</div>}
                </div>
              </div>
              <div className="form-group">
                <label>Pin Code</label>
                <div style={{ flex: 1 }}>
                  <input type="text" name="pinCode" value={form.pinCode} onChange={handleChange} />
                  {errors.pinCode && <div className="error-text">{errors.pinCode}</div>}
                </div>
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Place Order</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
