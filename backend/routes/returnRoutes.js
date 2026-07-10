const express = require("express");

const {
  createReturn,
  getReturns,
  updateReturnStatus,
} = require("../controllers/returnController");

const router = express.Router();

router.post("/", createReturn);
router.get("/", getReturns);
router.put("/:id/status", updateReturnStatus);

module.exports = router;