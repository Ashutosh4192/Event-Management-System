import React from 'react';
import { Navigate } from 'react-router-dom';

const getTokenData = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      localStorage.removeItem('authToken');
      return null;
    }
    return payload;
  } catch {
    localStorage.removeItem('authToken');
    return null;
  }
};

const roleLoginMap = {
  admin: '/auth/admin/login',
  vendor: '/auth/vendor/login',
  user: '/auth/user/login',
};

const ProtectedRoute = ({ role, children }) => {
  const user = getTokenData();
  if (!user) return <Navigate to={roleLoginMap[role] || '/'} replace />;
  if (user.role !== role) {
    const dashboardMap = { admin: '/admin', vendor: '/vendor', user: '/user' };
    return <Navigate to={dashboardMap[user.role] || '/'} replace />;
  }
  return children;
};

export { getTokenData };
export default ProtectedRoute;
