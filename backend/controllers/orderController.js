const Order = require("../models/Order");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Create Order (Default / COD)
const createOrder = async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      paymentMethod: req.body.paymentMethod || "COD",
      paymentStatus: req.body.paymentStatus || "Pending",
    };
    const order = await Order.create(orderData);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body; // Amount in INR
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // Check if key is placeholder / mock mode
    if (!key_id || key_id.includes("sample") || !key_secret || key_secret.includes("sample")) {
      // Return a simulated Razorpay Order structure for test/development
      return res.json({
        id: "order_mock_" + Date.now(),
        currency: "INR",
        amount: Math.round(amount * 100),
        isMock: true,
      });
    }

    const instance = new Razorpay({
      key_id,
      key_secret,
    });

    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ message: error.message || "Razorpay Order Creation Failed" });
  }
};

// Verify Razorpay Payment and Save Order
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
      isMock,
    } = req.body;

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!isMock) {
      const generated_signature = crypto
        .createHmac("sha256", key_secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generated_signature !== razorpay_signature) {
        return res.status(400).json({ message: "Invalid Payment Signature!" });
      }
    }

    // Create the completed order in database
    const newOrder = await Order.create({
      ...orderData,
      paymentMethod: "Razorpay",
      paymentStatus: "Paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature || "mock_signature",
      status: "Pending",
    });

    res.status(201).json({
      message: "Payment Verified & Order Placed Successfully!",
      order: newOrder,
    });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get All Orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("products.productId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Order Item Status (Seller specific)
const updateOrderItemStatus = async (req, res) => {
  try {
    const { id, productId } = req.params;
    const { itemStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Find the product item in the products array
    const item = order.products.find(
      (p) => (p.productId?._id || p.productId || "").toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in order" });
    }

    item.itemStatus = itemStatus;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  createRazorpayOrder,
  verifyPayment,
  getOrders,
  updateOrderStatus,
  updateOrderItemStatus,
};