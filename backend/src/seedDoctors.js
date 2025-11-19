const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
require('dotenv').config();

const doctors = [
  { name: "Dr. Priya Sharma", specialization: "Cardiologist", experience: 8 },
  { name: "Dr. Rajesh Kumar", specialization: "Dermatologist", experience: 5 },
  { name: "Dr. Ananya Verma", specialization: "Pediatrician", experience: 6 },
  { name: "Dr. Mohan Gupta", specialization: "General Physician", experience: 10 },
  { name: "Dr. Neha Kaur", specialization: "Neurologist", experience: 7 },
  { name: "Dr. Vivek Agarwal", specialization: "Orthopedic Surgeon", experience: 12 },
  { name: "Dr. Sana Fatima", specialization: "Gynecologist", experience: 9 },
  { name: "Dr. Rohan Deshmukh", specialization: "ENT Specialist", experience: 6 },
  { name: "Dr. Isha Mehta", specialization: "Psychiatrist", experience: 5 },
  { name: "Dr. Harsh Patel", specialization: "Dentist", experience: 4 },
  { name: "Dr. Kavita Saxena", specialization: "Endocrinologist", experience: 11 },
  { name: "Dr. Aditya Nair", specialization: "Pulmonologist", experience: 8 },
  { name: "Dr. Sneha Choudhary", specialization: "Oncologist", experience: 6 },
  { name: "Dr. Karan Bhatia", specialization: "Nephrologist", experience: 9 },
  { name: "Dr. Ritika Singh", specialization: "Radiologist", experience: 7 },
  { name: "Dr. Arjun Malhotra", specialization: "Urologist", experience: 13 },
  { name: "Dr. Pooja Jain", specialization: "Gastroenterologist", experience: 8 },
  { name: "Dr. Sameer Qureshi", specialization: "Dermatologist", experience: 6 },
  { name: "Dr. Meena Joshi", specialization: "General Physician", experience: 15 },
  { name: "Dr. Ashwin Rao", specialization: "Cardiologist", experience: 10 }
];

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Delete all existing doctor users and doctor profiles
    await User.deleteMany({ role: 'doctor' });
    await Doctor.deleteMany({});
    console.log('🗑️  Cleared existing doctors');

    // Hash default password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const doctorUsers = [];
    const doctorProfiles = [];

    for (let i = 0; i < doctors.length; i++) {
      const doc = doctors[i];
      
      // Generate email from name
      const email = doc.name
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace('dr.', 'dr')
        + '@gmail.com';
      
      // Create User document
      const user = new User({
        name: doc.name,
        email: email,
        password: hashedPassword,
        role: 'doctor',
        verified: true
      });
      
      await user.save();
      doctorUsers.push(user);
      
      // Create Doctor profile
      const doctorProfile = new Doctor({
        user: user._id,
        specialization: doc.specialization,
        experience: doc.experience,
        fees: 500,
        verified: true,
        bio: `Experienced ${doc.specialization} with ${doc.experience} years of practice.`
      });
      
      await doctorProfile.save();
      doctorProfiles.push(doctorProfile);
      
      console.log(`✅ Created: ${doc.name}`);
    }

    console.log(`\n🎉 Successfully seeded ${doctors.length} doctors!`);
    console.log(`📧 Default password for all doctors: password123`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDoctors();
