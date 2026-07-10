const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    reason: String,
    status: {
      type: String,
      default: "Requested",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Return", returnSchema);