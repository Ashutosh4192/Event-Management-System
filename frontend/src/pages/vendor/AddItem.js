import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../services/vendorService';
import { getTokenData } from '../../utils/authGuard';

const API_URL = process.env.REACT_APP_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';

function AddItem() {
  const navigate = useNavigate();
  const user = getTokenData();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', image: null });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch { }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.name || !form.price) {
      setError('Product name and price are required'); return;
    }
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    if (form.image) formData.append('image', form.image);
    try {
      if (editId) {
        await updateProduct(editId, formData);
        setSuccess('Product updated');
      } else {
        await addProduct(formData);
        setSuccess('Product added');
      }
      setForm({ name: '', price: '', image: null });
      setEditId(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, price: p.price, image: null });
    setEditId(p._id);
    setError(''); setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting product');
    }
  };

  const handleLogout = () => { localStorage.removeItem('authToken'); navigate('/'); };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h2>Welcome '{user?.name || 'Vendor'}'</h2>
          <div className="nav-buttons">
            <button className="btn btn-outline" onClick={() => navigate('/vendor')}>Home</button>
            <button className="btn btn-outline" onClick={() => navigate('/vendor/status')}>Product Status</button>
            <button className="btn btn-outline" onClick={() => navigate('/vendor/requests')}>Request Item</button>
            <button className="btn btn-outline" onClick={handleLogout}>Log Out</button>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}
        {success && <div className="success-banner">{success}</div>}

        <div className="split-layout">
          <div className="split-left">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Product Name" />
              </div>
              <div className="form-group">
                <label>Product Price</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Product Price" min="0" step="0.01" />
              </div>
              <div className="form-group">
                <label>Product Image</label>
                <input type="file" name="image" onChange={handleChange} accept="image/*" />
              </div>
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <button type="submit" className="btn btn-outline">
                  {editId ? 'Update Product' : 'Add The Product'}
                </button>
                {editId && (
                  <button type="button" className="btn btn-secondary" style={{ marginLeft: 8 }}
                    onClick={() => { setEditId(null); setForm({ name: '', price: '', image: null }); }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="split-right">
            <table>
              <thead>
                <tr>
                  <th>Product Image</th>
                  <th>Product Name</th>
                  <th>Product Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center' }}>No products yet</td></tr>
                ) : products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      {p.image ? (
                        <img src={`${API_URL}/uploads/${p.image}`} alt={p.name} />
                      ) : (
                        <div style={{ width: 50, height: 50, backgroundColor: '#ddd', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#888' }}>
                          No Image
                        </div>
                      )}
                    </td>
                    <td>{p.name}</td>
                    <td>Rs/{p.price}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <button className="btn btn-danger" style={{ fontSize: 12, padding: '4px 8px' }} onClick={() => handleDelete(p._id)}>Delete</button>
                        <button className="btn btn-primary" style={{ fontSize: 12, padding: '4px 8px' }} onClick={() => handleEdit(p)}>Update</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddItem;
