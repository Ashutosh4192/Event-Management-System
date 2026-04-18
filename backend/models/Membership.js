const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema(
  {
    membershipNumber: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email'],
    },
    accountType: { type: String, required: true, enum: ['User', 'Vendor'] },
    accountId: { type: mongoose.Schema.Types.ObjectId },
    duration: { type: String, required: true, enum: ['6 months', '1 year', '2 years'] },
    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Membership', membershipSchema);
