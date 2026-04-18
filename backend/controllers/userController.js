const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const GuestList = require('../models/GuestList');

// Get Vendors (with optional category filter)
const getVendorsByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'All' ? { category } : {};
    const vendors = await Vendor.find(filter).select('-password');
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Vendor Products (public for users)
const getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.params.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add to Cart
const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [], grandTotal: 0 });
    }

    const existingItem = cart.items.find((i) => i.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.totalPrice = existingItem.productPrice * existingItem.quantity;
    } else {
      cart.items.push({
        productId: product._id,
        productName: product.name,
        productPrice: product.price,
        productImage: product.image,
        vendorId: product.vendorId,
        quantity: 1,
        totalPrice: product.price,
      });
    }

    cart.grandTotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    cart.updatedAt = Date.now();
    await cart.save();
    res.json({ message: 'Item added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.json({ items: [], grandTotal: 0 });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Cart Item Quantity
const updateCartItemQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.id(req.params.id);
    if (!item) return res.status(404).json({ message: 'Cart item not found' });

    item.quantity = parseInt(quantity);
    item.totalPrice = item.productPrice * item.quantity;
    cart.grandTotal = cart.items.reduce((sum, i) => sum + i.totalPrice, 0);
    cart.updatedAt = Date.now();
    await cart.save();
    res.json({ message: 'Cart updated', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove Cart Item
const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter((i) => i._id.toString() !== req.params.id);
    cart.grandTotal = cart.items.reduce((sum, i) => sum + i.totalPrice, 0);
    cart.updatedAt = Date.now();
    await cart.save();
    res.json({ message: 'Item removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Clear Cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      cart.items = [];
      cart.grandTotal = 0;
      cart.updatedAt = Date.now();
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Checkout
const checkout = async (req, res) => {
  try {
    const { name, phone, email, address, city, state, pinCode, paymentMethod } = req.body;
    if (!name || !phone || !email || !address || !city || !state || !pinCode || !paymentMethod) {
      return res.status(400).json({ message: 'All checkout fields are required' });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Group items by vendor
    const vendorMap = {};
    cart.items.forEach((item) => {
      const vid = item.vendorId.toString();
      if (!vendorMap[vid]) vendorMap[vid] = [];
      vendorMap[vid].push(item);
    });

    const orders = [];
    for (const [vendorId, items] of Object.entries(vendorMap)) {
      const grandTotal = items.reduce((sum, i) => sum + i.totalPrice, 0);
      const order = new Order({
        userId: req.user.id,
        vendorId,
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.productName,
          productPrice: i.productPrice,
          quantity: i.quantity,
          totalPrice: i.totalPrice,
        })),
        customerDetails: { name, phone, email, address, city, state, pinCode },
        paymentMethod,
        grandTotal,
        status: 'Received',
      });
      await order.save();
      orders.push(order);
    }

    // Clear cart
    cart.items = [];
    cart.grandTotal = 0;
    await cart.save();

    res.status(201).json({
      message: 'Order placed successfully',
      orders,
      orderDetails: { name, phone, email, address, city, state, pinCode, paymentMethod, grandTotal: cart.grandTotal },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get User Orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate('vendorId', 'name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Guest List CRUD
const getGuestList = async (req, res) => {
  try {
    const guests = await GuestList.find({ userId: req.user.id });
    res.json(guests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addGuest = async (req, res) => {
  try {
    const { guestName, guestEmail, guestPhone, guestAddress, notes } = req.body;
    if (!guestName) return res.status(400).json({ message: 'Guest name is required' });
    const guest = new GuestList({ userId: req.user.id, guestName, guestEmail, guestPhone, guestAddress, notes });
    await guest.save();
    res.status(201).json({ message: 'Guest added', guest });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateGuest = async (req, res) => {
  try {
    const guest = await GuestList.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!guest) return res.status(404).json({ message: 'Guest not found' });
    res.json({ message: 'Guest updated', guest });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteGuest = async (req, res) => {
  try {
    const guest = await GuestList.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!guest) return res.status(404).json({ message: 'Guest not found' });
    res.json({ message: 'Guest deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getVendorsByCategory,
  getVendorProducts,
  addToCart,
  getCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  checkout,
  getUserOrders,
  getGuestList,
  addGuest,
  updateGuest,
  deleteGuest,
};
