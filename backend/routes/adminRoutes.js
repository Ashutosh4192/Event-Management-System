const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roleCheck');
const {
  addMembership,
  getMembership,
  updateMembership,
  cancelMembership,
  addUser,
  updateUser,
  addVendor,
  updateVendor,
  getAllUsers,
  getAllVendors,
} = require('../controllers/adminController');

router.use(protect, requireAdmin);

router.post('/memberships', addMembership);
router.get('/memberships/:number', getMembership);
router.put('/memberships/:number', updateMembership);
router.delete('/memberships/:number', cancelMembership);

router.get('/users/all', getAllUsers);
router.post('/users', addUser);
router.put('/users/:id', updateUser);

router.get('/vendors/all', getAllVendors);
router.post('/vendors', addVendor);
router.put('/vendors/:id', updateVendor);

module.exports = router;
