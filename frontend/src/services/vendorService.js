import axiosInstance from './axiosInstance';

export const getProducts = () => axiosInstance.get('/vendor/products');
export const addProduct = (formData) =>
  axiosInstance.post('/vendor/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const updateProduct = (id, formData) =>
  axiosInstance.put(`/vendor/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const deleteProduct = (id) => axiosInstance.delete(`/vendor/products/${id}`);

export const getOrders = () => axiosInstance.get('/vendor/orders');
export const updateOrderStatus = (id, status) =>
  axiosInstance.put(`/vendor/orders/${id}/status`, { status });
export const deleteOrder = (id) => axiosInstance.delete(`/vendor/orders/${id}`);

export const getRequests = () => axiosInstance.get('/vendor/requests');
