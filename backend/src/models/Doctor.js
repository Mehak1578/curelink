const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: { type: Number },
  comment: { type: String }
}, { timestamps: true });

const DoctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: { type: String },
  experience: { type: Number },
  fees: { type: Number },
  availableSlots: [{ date: Date }],
  verified: { type: Boolean, default: false },
  ratings: [RatingSchema],
  bio: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema);
