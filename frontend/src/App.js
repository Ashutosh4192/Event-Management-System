import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './utils/authGuard';

// Public pages
import Index from './pages/Index';
import AdminLogin from './pages/auth/AdminLogin';
import VendorLogin from './pages/auth/VendorLogin';
import VendorSignup from './pages/auth/VendorSignup';
import UserLogin from './pages/auth/UserLogin';
import UserSignup from './pages/auth/UserSignup';

// Vendor pages
import VendorDashboard from './pages/vendor/VendorDashboard';
import AddItem from './pages/vendor/AddItem';
import ProductStatus from './pages/vendor/ProductStatus';
import RequestItem from './pages/vendor/RequestItem';

// User pages
import UserPortal from './pages/user/UserPortal';
import VendorBrowse from './pages/user/VendorBrowse';
import ProductBrowse from './pages/user/ProductBrowse';
import ShoppingCart from './pages/user/ShoppingCart';
import Checkout from './pages/user/Checkout';
import OrderStatus from './pages/user/OrderStatus';
import GuestList from './pages/user/GuestList';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import MaintainUser from './pages/admin/MaintainUser';
import MaintainVendor from './pages/admin/MaintainVendor';
import AddMembership from './pages/admin/AddMembership';
import UpdateMembership from './pages/admin/UpdateMembership';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Index />} />
        <Route path="/auth/admin/login" element={<AdminLogin />} />
        <Route path="/auth/vendor/login" element={<VendorLogin />} />
        <Route path="/auth/vendor/signup" element={<VendorSignup />} />
        <Route path="/auth/user/login" element={<UserLogin />} />
        <Route path="/auth/user/signup" element={<UserSignup />} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/maintain-user" element={<ProtectedRoute role="admin"><MaintainUser /></ProtectedRoute>} />
        <Route path="/admin/maintain-vendor" element={<ProtectedRoute role="admin"><MaintainVendor /></ProtectedRoute>} />
        <Route path="/admin/membership/add" element={<ProtectedRoute role="admin"><AddMembership /></ProtectedRoute>} />
        <Route path="/admin/membership/update" element={<ProtectedRoute role="admin"><UpdateMembership /></ProtectedRoute>} />

        {/* Vendor */}
        <Route path="/vendor" element={<ProtectedRoute role="vendor"><VendorDashboard /></ProtectedRoute>} />
        <Route path="/vendor/items" element={<ProtectedRoute role="vendor"><AddItem /></ProtectedRoute>} />
        <Route path="/vendor/status" element={<ProtectedRoute role="vendor"><ProductStatus /></ProtectedRoute>} />
        <Route path="/vendor/requests" element={<ProtectedRoute role="vendor"><RequestItem /></ProtectedRoute>} />

        {/* User */}
        <Route path="/user" element={<ProtectedRoute role="user"><UserPortal /></ProtectedRoute>} />
        <Route path="/user/vendors" element={<ProtectedRoute role="user"><VendorBrowse /></ProtectedRoute>} />
        <Route path="/user/vendors/:id/products" element={<ProtectedRoute role="user"><ProductBrowse /></ProtectedRoute>} />
        <Route path="/user/cart" element={<ProtectedRoute role="user"><ShoppingCart /></ProtectedRoute>} />
        <Route path="/user/checkout" element={<ProtectedRoute role="user"><Checkout /></ProtectedRoute>} />
        <Route path="/user/orders" element={<ProtectedRoute role="user"><OrderStatus /></ProtectedRoute>} />
        <Route path="/user/guests" element={<ProtectedRoute role="user"><GuestList /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
