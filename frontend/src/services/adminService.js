import axiosInstance from './axiosInstance';

export const addMembership = (data) => axiosInstance.post('/admin/memberships', data);
export const getMembership = (number) => axiosInstance.get(`/admin/memberships/${number}`);
export const updateMembership = (number, data) =>
  axiosInstance.put(`/admin/memberships/${number}`, data);
export const cancelMembership = (number) =>
  axiosInstance.delete(`/admin/memberships/${number}`);

export const getAllUsers = () => axiosInstance.get('/admin/users/all');
export const addUser = (data) => axiosInstance.post('/admin/users', data);
export const updateUser = (id, data) => axiosInstance.put(`/admin/users/${id}`, data);

export const getAllVendors = () => axiosInstance.get('/admin/vendors/all');
export const addVendor = (data) => axiosInstance.post('/admin/vendors', data);
export const updateVendor = (id, data) => axiosInstance.put(`/admin/vendors/${id}`, data);
