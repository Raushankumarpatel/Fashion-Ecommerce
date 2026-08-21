const express = require("express");

const {
  createOrder,
  createRazorpayOrder,
  verifyPayment,
  getOrders,
  updateOrderStatus,
  updateOrderItemStatus,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", createOrder);
router.post("/razorpay-order", createRazorpayOrder);
router.post("/verify-payment", verifyPayment);
router.get("/", getOrders);
router.put("/:id/status", updateOrderStatus);
router.put("/:id/item/:productId", updateOrderItemStatus);

module.exports = router;