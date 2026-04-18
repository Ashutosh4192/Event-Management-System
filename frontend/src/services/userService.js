import axiosInstance from './axiosInstance';

export const getVendors = (category) =>
  axiosInstance.get('/user/vendors', { params: category && category !== 'All' ? { category } : {} });
export const getVendorProducts = (vendorId) =>
  axiosInstance.get(`/user/vendors/${vendorId}/products`);

export const getCart = () => axiosInstance.get('/user/cart');
export const addToCart = (productId) => axiosInstance.post('/user/cart', { productId });
export const updateCartItem = (id, quantity) =>
  axiosInstance.put(`/user/cart/${id}`, { quantity });
export const removeCartItem = (id) => axiosInstance.delete(`/user/cart/${id}`);
export const clearCart = () => axiosInstance.delete('/user/cart');

export const checkout = (data) => axiosInstance.post('/user/checkout', data);
export const getOrders = () => axiosInstance.get('/user/orders');

export const getGuests = () => axiosInstance.get('/user/guests');
export const addGuest = (data) => axiosInstance.post('/user/guests', data);
export const updateGuest = (id, data) => axiosInstance.put(`/user/guests/${id}`, data);
export const deleteGuest = (id) => axiosInstance.delete(`/user/guests/${id}`);
