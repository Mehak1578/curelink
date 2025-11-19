// small helper (optional) to seed a doctor account for testing
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const exists = await User.findOne({ email: 'dr@example.com' });
  if (exists) return console.log('Doctor already seeded');
  const hash = await bcrypt.hash('password', 10);
  const u = new User({ name: 'Dr Example', email: 'dr@example.com', password: hash, role: 'doctor', verified: true });
  await u.save();
  console.log('Seeded doctor: dr@example.com / password');
  process.exit(0);
}

seed().catch(err=>{ console.error(err); process.exit(1); });
