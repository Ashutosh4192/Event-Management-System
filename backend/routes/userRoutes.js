const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { requireUser } = require('../middleware/roleCheck');
const {
  getVendorsByCategory,
  getVendorProducts,
  addToCart,
  getCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  checkout,
  getUserOrders,
  getGuestList,
  addGuest,
  updateGuest,
  deleteGuest,
} = require('../controllers/userController');

router.use(protect, requireUser);

router.get('/vendors', getVendorsByCategory);
router.get('/vendors/:id/products', getVendorProducts);

router.get('/cart', getCart);
router.post('/cart', addToCart);
router.put('/cart/:id', updateCartItemQuantity);
router.delete('/cart/:id', removeCartItem);
router.delete('/cart', clearCart);

router.post('/checkout', checkout);
router.get('/orders', getUserOrders);

router.get('/guests', getGuestList);
router.post('/guests', addGuest);
router.put('/guests/:id', updateGuest);
router.delete('/guests/:id', deleteGuest);

module.exports = router;
