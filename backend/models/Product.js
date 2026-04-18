const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: false, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
