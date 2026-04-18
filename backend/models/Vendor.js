const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email'],
    },
    password: { type: String, required: true, minlength: 6 },
    category: {
      type: String,
      required: true,
      enum: ['Catering', 'Florist', 'Decoration', 'Lighting'],
    },
    contactDetails: { type: String, default: '' },
    role: { type: String, default: 'vendor' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vendor', vendorSchema);
