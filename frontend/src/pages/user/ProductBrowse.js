import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getVendorProducts, addToCart, getCart, updateCartItem, removeCartItem } from '../../services/userService';

const API_URL = process.env.REACT_APP_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';

function ProductBrowse() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [vendorName, setVendorName] = useState('');
  const [message, setMessage] = useState('');
  const [cartItems, setCartItems] = useState({});
  const [cartItemIds, setCartItemIds] = useState({});

  useEffect(() => {
    getVendorProducts(id)
      .then((res) => {
        setProducts(res.data);
        if (res.data.length > 0) setVendorName('Vendor');
      })
      .catch(() => {});
    
    // Fetch cart to get current quantities
    fetchCart();
  }, [id]);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      const cartMap = {};
      const cartIdMap = {};
      res.data.items?.forEach((item) => {
        cartMap[item.productId] = item.quantity;
        cartIdMap[item.productId] = item._id;
      });
      setCartItems(cartMap);
      setCartItemIds(cartIdMap);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 2000);
      // Refresh cart to update quantities
      await fetchCart();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error adding to cart');
    }
  };

  const handleDecreaseQuantity = async (productId) => {
    try {
      const currentQuantity = cartItems[productId];
      const cartItemId = cartItemIds[productId];
      
      if (currentQuantity === 1) {
        // Remove item if quantity is 1
        await removeCartItem(cartItemId);
        setMessage('Item removed from cart');
      } else {
        // Decrease quantity
        await updateCartItem(cartItemId, currentQuantity - 1);
        setMessage('Quantity updated');
      }
      
      setTimeout(() => setMessage(''), 2000);
      // Refresh cart to update quantities
      await fetchCart();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error updating cart');
    }
  };

  const handleLogout = () => { localStorage.removeItem('authToken'); navigate('/'); };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="top-nav">
          <button className="btn btn-outline" onClick={() => navigate('/user')}>Home</button>
          <button className="btn btn-outline" onClick={handleLogout}>LogOut</button>
        </div>
        <div className="title-banner">{vendorName || 'Vendor Name'}</div>
        <div style={{ fontWeight: 'bold', marginBottom: 12 }}>Products</div>
        {message && <div className="success-banner">{message}</div>}
        <div className="cards-grid">
          {products.length === 0 ? (
            <p>No products available</p>
          ) : products.map((p) => {
            const quantityInCart = cartItems[p._id] || 0;
            return (
              <div key={p._id} className="product-card">
                {p.image ? (
                  <img
                    src={`${API_URL}/uploads/${p.image}`}
                    alt={p.name}
                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6 }}
                  />
                ) : (
                  <div style={{ width: 80, height: 80, backgroundColor: '#ddd', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#888' }}>
                    No Image
                  </div>
                )}
                <h4>{p.name}</h4>
                <p>Rs/{p.price}</p>
                {quantityInCart > 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                    <button 
                      className="btn btn-outline" 
                      onClick={() => handleDecreaseQuantity(p._id)}
                      style={{ minWidth: '40px', padding: '8px' }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', minWidth: '60px', textAlign: 'center' }}>
                      Qty: {quantityInCart}
                    </span>
                    <button 
                      className="btn btn-outline" 
                      onClick={() => handleAddToCart(p._id)}
                      style={{ minWidth: '40px', padding: '8px' }}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button className="btn btn-outline" onClick={() => handleAddToCart(p._id)}>
                    Add to Cart
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProductBrowse;
