const bcrypt = require('bcryptjs');
const Membership = require('../models/Membership');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

// Calculate expiry date based on duration
const calculateExpiry = (startDate, duration) => {
  const date = new Date(startDate);
  if (duration === '6 months') date.setMonth(date.getMonth() + 6);
  else if (duration === '1 year') date.setFullYear(date.getFullYear() + 1);
  else if (duration === '2 years') date.setFullYear(date.getFullYear() + 2);
  return date;
};

// Add Membership
const addMembership = async (req, res) => {
  try {
    const { membershipNumber, name, email, duration, accountType, accountId } = req.body;
    if (!membershipNumber || !name || !email || !duration) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existing = await Membership.findOne({ membershipNumber });
    if (existing) return res.status(400).json({ message: 'Membership number already exists' });

    const startDate = new Date();
    const expiryDate = calculateExpiry(startDate, duration);
    const membership = new Membership({
      membershipNumber,
      name,
      email,
      duration,
      accountType: accountType || 'User',
      accountId,
      startDate,
      expiryDate,
    });
    await membership.save();
    res.status(201).json({ message: 'Membership created successfully', membership });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Membership by number
const getMembership = async (req, res) => {
  try {
    const membership = await Membership.findOne({ membershipNumber: req.params.number });
    if (!membership) return res.status(404).json({ message: 'Membership not found' });
    res.json(membership);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Membership (extend)
const updateMembership = async (req, res) => {
  try {
    const { duration } = req.body;
    const membership = await Membership.findOne({ membershipNumber: req.params.number });
    if (!membership) return res.status(404).json({ message: 'Membership not found' });

    const baseDate = membership.expiryDate > new Date() ? membership.expiryDate : new Date();
    membership.expiryDate = calculateExpiry(baseDate, duration);
    membership.duration = duration;
    await membership.save();
    res.json({ message: 'Membership extended successfully', membership });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel Membership
const cancelMembership = async (req, res) => {
  try {
    const membership = await Membership.findOneAndUpdate(
      { membershipNumber: req.params.number },
      { isActive: false },
      { new: true }
    );
    if (!membership) return res.status(404).json({ message: 'Membership not found' });
    res.json({ message: 'Membership cancelled', membership });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add User (by admin)
const addUser = async (req, res) => {
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
    res.status(201).json({ message: 'User created successfully', user: { id: user._id, name, email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update User (by admin)
const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add Vendor (by admin)
const addVendor = async (req, res) => {
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
    res.status(201).json({ message: 'Vendor created successfully', vendor: { id: vendor._id, name, email, category } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Vendor (by admin)
const updateVendor = async (req, res) => {
  try {
    const { name, email, category } = req.body;
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, { name, email, category }, { new: true }).select('-password');
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json({ message: 'Vendor updated', vendor });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Vendors
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().select('-password').sort({ createdAt: -1 });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
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
};
