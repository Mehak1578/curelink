const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'usd' },
  provider: { type: String, enum: ['stripe','razorpay'], default: 'stripe' },
  providerId: { type: String },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  status: { type: String, enum: ['pending','succeeded','failed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
