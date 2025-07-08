const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  contestant_nickname: {
    type: String,
    required: true,
    trim: true,
  },
  award_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Award",
  },
  amount_divided_by_10: {
    type: Number,
  },
  payment_date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
