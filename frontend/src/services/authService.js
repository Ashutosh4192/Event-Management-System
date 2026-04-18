import axiosInstance from './axiosInstance';

export const loginAdmin = (data) => axiosInstance.post('/auth/admin/login', data);
export const loginVendor = (data) => axiosInstance.post('/auth/vendor/login', data);
export const loginUser = (data) => axiosInstance.post('/auth/user/login', data);
export const signupVendor = (data) => axiosInstance.post('/auth/vendor/signup', data);
export const signupUser = (data) => axiosInstance.post('/auth/user/signup', data);
export const logout = () => axiosInstance.post('/auth/logout');
