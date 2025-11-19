const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Report = require('../models/Report');

const router = express.Router();

// POST /api/dev/seed - create test users/data and return a token for the test patient
router.post('/seed', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') return res.status(403).json({ msg: 'Not allowed in production' });

    // create or find patient
    let patient = await User.findOne({ email: 'patient@example.com' });
    if (!patient) {
      const pw = await bcrypt.hash('password123', 10);
      patient = new User({ name: 'Test Patient', email: 'patient@example.com', password: pw, role: 'patient' });
      await patient.save();
    }

    // create or find doctor user + profile
    let docUser = await User.findOne({ email: 'doctor@example.com' });
    if (!docUser) {
      const pw = await bcrypt.hash('password123', 10);
      docUser = new User({ name: 'Dr. Alice', email: 'doctor@example.com', password: pw, role: 'doctor' });
      await docUser.save();
    }

    let doctor = await Doctor.findOne({ user: docUser._id });
    if (!doctor) {
      doctor = new Doctor({ user: docUser._id, specialization: 'General Medicine', experience: 5, fees: 30, bio: 'Seeded doctor' });
      await doctor.save();
    }

    // create appointment if missing
    let appt = await Appointment.findOne({ patient: patient._id });
    if (!appt) {
      appt = new Appointment({ patient: patient._id, doctor: docUser._id, date: new Date(Date.now() + 1000*60*60*24), status: 'requested' });
      await appt.save();
    }

    // create report
    let report = await Report.findOne({ patient: patient._id });
    if (!report) {
      report = new Report({ patient: patient._id, filename: 'seed-report.pdf', url: 'https://example.com/seed-report.pdf' });
      await report.save();
    }

    // create token for patient
    const payload = { id: patient.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    res.json({ token, user: { id: patient.id, name: patient.name, email: patient.email, role: patient.role } });
  } catch (err) {
    console.error('dev seed error', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
