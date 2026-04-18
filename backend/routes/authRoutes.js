const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  loginVendor,
  loginUser,
  signupVendor,
  signupUser,
  logout,
} = require('../controllers/authController');

router.post('/admin/login', loginAdmin);
router.post('/vendor/login', loginVendor);
router.post('/vendor/signup', signupVendor);
router.post('/user/login', loginUser);
router.post('/user/signup', signupUser);
router.post('/logout', logout);

module.exports = router;
