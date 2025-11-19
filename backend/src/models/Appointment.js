const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  reason: { type: String },
  status: { type: String, enum: ['requested','confirmed','cancelled','completed'], default: 'requested' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
