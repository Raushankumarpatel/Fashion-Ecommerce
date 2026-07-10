const Return = require("../models/Return");

// Create Return Request
const createReturn = async (req, res) => {
  try {
    const returnRequest = await Return.create(req.body);

    res.status(201).json(returnRequest);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Return Requests
const getReturns = async (req, res) => {
  try {
    const returns = await Return.find()
      .populate("orderId")
      .sort({ createdAt: -1 });

    res.json(returns);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Return Status
const updateReturnStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const returnRequest = await Return.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(returnRequest);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createReturn,
  getReturns,
  updateReturnStatus,
};