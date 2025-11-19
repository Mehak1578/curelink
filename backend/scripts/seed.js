const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config({ path: __dirname + '/../../.env' });

const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const Doctor = require('../src/models/Doctor');
const Appointment = require('../src/models/Appointment');
const Report = require('../src/models/Report');

async function run(){
  await connectDB();

  // create a patient user
  let patient = await User.findOne({ email: 'patient@example.com' });
  if(!patient){
    const pw = await bcrypt.hash('password123', 10);
    patient = new User({ name: 'Test Patient', email: 'patient@example.com', password: pw, role: 'patient' });
    await patient.save();
    console.log('Created patient', patient.email);
  }

  // create a doctor user + profile
  let docUser = await User.findOne({ email: 'doctor@example.com' });
  if(!docUser){
    const pw = await bcrypt.hash('password123', 10);
    docUser = new User({ name: 'Dr. Alice', email: 'doctor@example.com', password: pw, role: 'doctor' });
    await docUser.save();
    console.log('Created doctor user', docUser.email);
  }

  let doctor = await Doctor.findOne({ user: docUser._id });
  if(!doctor){
    doctor = new Doctor({ user: docUser._id, specialization: 'General Medicine', experience: 5, fees: 30, bio: 'Seeded doctor' });
    await doctor.save();
    console.log('Created doctor profile');
  }

  // create appointment
  let appt = await Appointment.findOne({ patient: patient._id });
  if(!appt){
    appt = new Appointment({ patient: patient._id, doctor: docUser._id, date: new Date(Date.now() + 1000*60*60*24), status: 'requested' });
    await appt.save();
    console.log('Created appointment');
  }

  // create a dummy report
  let report = await Report.findOne({ patient: patient._id });
  if(!report){
    report = new Report({ patient: patient._id, filename: 'seed-report.pdf', url: 'https://example.com/seed-report.pdf' });
    await report.save();
    console.log('Created report');
  }

  console.log('Seed complete.');
  process.exit(0);
}

run().catch(err=>{ console.error(err); process.exit(1); });
