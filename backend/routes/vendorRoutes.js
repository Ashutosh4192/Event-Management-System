const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { requireVendor } = require('../middleware/roleCheck');
const upload = require('../middleware/upload');
const {
  addProduct,
  getVendorProducts,
  updateProduct,
  deleteProduct,
  getVendorOrders,
  updateOrderStatus,
  deleteOrder,
  getRequestedItems,
} = require('../controllers/vendorController');

router.use(protect, requireVendor);

router.get('/products', getVendorProducts);
router.post('/products', upload.single('image'), addProduct);
router.put('/products/:id', upload.single('image'), updateProduct);
router.delete('/products/:id', deleteProduct);

router.get('/orders', getVendorOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.delete('/orders/:id', deleteOrder);

router.get('/requests', getRequestedItems);

module.exports = router;
