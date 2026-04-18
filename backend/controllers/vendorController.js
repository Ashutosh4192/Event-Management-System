const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Add Product
const addProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: 'Product name and price are required' });
    }
    const product = new Product({
      vendorId: req.user.id,
      name,
      price: parseFloat(price),
      image: req.file ? req.file.filename : '',
    });
    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Vendor Products
const getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.user.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (price) updateData.price = parseFloat(price);
    if (req.file) updateData.image = req.file.filename;

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.user.id },
      updateData,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Product (also removes from carts)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, vendorId: req.user.id });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Remove from all carts
    await Cart.updateMany(
      { 'items.productId': req.params.id },
      { $pull: { items: { productId: req.params.id } } }
    );
    // Recalculate grandTotal for affected carts
    const affectedCarts = await Cart.find({ 'items.0': { $exists: true } });
    for (const cart of affectedCarts) {
      cart.grandTotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
      await cart.save();
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Vendor Orders
const getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ vendorId: req.user.id }).populate('userId', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Received', 'Ready for Shipping', 'Out For Delivery'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.user.id },
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ _id: req.params.id, vendorId: req.user.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Requested Items (cart items referencing this vendor's products)
const getRequestedItems = async (req, res) => {
  try {
    const carts = await Cart.find({ 'items.vendorId': req.user.id })
      .populate('userId', 'name email')
      .populate('items.productId', 'name price image');
    const requestedItems = [];
    carts.forEach((cart) => {
      cart.items.forEach((item) => {
        if (item.vendorId && item.vendorId.toString() === req.user.id) {
          requestedItems.push({
            cartId: cart._id,
            userId: cart.userId,
            item,
          });
        }
      });
    });
    res.json(requestedItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  addProduct,
  getVendorProducts,
  updateProduct,
  deleteProduct,
  getVendorOrders,
  updateOrderStatus,
  deleteOrder,
  getRequestedItems,
};
