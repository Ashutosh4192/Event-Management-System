const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Vendor = require('../models/Vendor');
const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');

// Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) {
      return res.status(400).json({ message: 'User ID and password are required' });
    }
    const admin = await Admin.findOne({ userId });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken({ id: admin._id, userId: admin.userId, role: 'admin' });
    res.json({ token, user: { id: admin._id, userId: admin.userId, role: 'admin' } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Vendor Login
const loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const vendor = await Vendor.findOne({ email: email.toLowerCase() });
    if (!vendor) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken({ id: vendor._id, email: vendor.email, name: vendor.name, role: 'vendor' });
    res.json({ token, user: { id: vendor._id, email: vendor.email, name: vendor.name, role: 'vendor' } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// User Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken({ id: user._id, email: user.email, name: user.name, role: 'user' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: 'user' } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Vendor Signup
const signupVendor = async (req, res) => {
  try {
    const { name, email, password, category } = req.body;
    if (!name || !email || !password || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existing = await Vendor.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const vendor = new Vendor({ name, email, password: hashedPassword, category });
    await vendor.save();
    res.status(201).json({ message: 'Vendor registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// User Signup
const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Logout (client removes token)
const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

module.exports = { loginAdmin, loginVendor, loginUser, signupVendor, signupUser, logout };
