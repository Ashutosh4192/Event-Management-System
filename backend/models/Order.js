const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: String,
  productPrice: Number,
  quantity: Number,
  totalPrice: Number,
});

const customerDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pinCode: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    items: [orderItemSchema],
    customerDetails: customerDetailsSchema,
    paymentMethod: { type: String, required: true, enum: ['Cash', 'UPI'] },
    grandTotal: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ['Received', 'Ready for Shipping', 'Out For Delivery'],
      default: 'Received',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
