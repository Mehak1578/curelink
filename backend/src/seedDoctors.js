const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
require('dotenv').config();

const doctors = [
  { "name": "Dr. Priya Sharma", "specialty": "Cardiologist", "experience": "8 years" },
  { "name": "Dr. Rajesh Kumar", "specialty": "Dermatologist", "experience": "5 years" },
  { "name": "Dr. Ananya Verma", "specialty": "Pediatrician", "experience": "6 years" },
  { "name": "Dr. Mohan Gupta", "specialty": "General Physician", "experience": "10 years" },
  { "name": "Dr. Neha Kaur", "specialty": "Neurologist", "experience": "7 years" },
  { "name": "Dr. Vivek Agarwal", "specialty": "Orthopedic Surgeon", "experience": "12 years" },
  { "name": "Dr. Sana Fatima", "specialty": "Gynecologist", "experience": "9 years" },
  { "name": "Dr. Rohan Deshmukh", "specialty": "ENT Specialist", "experience": "6 years" },
  { "name": "Dr. Isha Mehta", "specialty": "Psychiatrist", "experience": "5 years" },
  { "name": "Dr. Harsh Patel", "specialty": "Dentist", "experience": "4 years" },
  { "name": "Dr. Kavita Saxena", "specialty": "Endocrinologist", "experience": "11 years" },
  { "name": "Dr. Aditya Nair", "specialty": "Pulmonologist", "experience": "8 years" },
  { "name": "Dr. Sneha Choudhary", "specialty": "Oncologist", "experience": "6 years" },
  { "name": "Dr. Karan Bhatia", "specialty": "Nephrologist", "experience": "9 years" },
  { "name": "Dr. Ritika Singh", "specialty": "Radiologist", "experience": "7 years" },
  { "name": "Dr. Arjun Malhotra", "specialty": "Urologist", "experience": "13 years" },
  { "name": "Dr. Pooja Jain", "specialty": "Gastroenterologist", "experience": "8 years" },
  { "name": "Dr. Sameer Qureshi", "specialty": "Dermatologist", "experience": "6 years" },
  { "name": "Dr. Meena Joshi", "specialty": "General Physician", "experience": "15 years" },
  { "name": "Dr. Ashwin Rao", "specialty": "Cardiologist", "experience": "10 years" }
];

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Check if doctors already exist
    const existingCount = await User.countDocuments({ role: 'doctor' });
    if (existingCount >= 20) {
      console.log('⚠️ Doctors already seeded. Skipping...');
      process.exit(0);
    }

    const doctorUsers = [];
    const doctorProfiles = [];

    for (let i = 0; i < doctors.length; i++) {
      const doc = doctors[i];
      const email = doc.name.toLowerCase().replace(/\s+/g, '.').replace('dr.', '') + '@curelink.com';
      
      // Create User
      const user = new User({
        name: doc.name,
        email: email,
        password: '$2a$10$YourHashedPasswordHere', // Dummy hashed password
        role: 'doctor',
        verified: true
      });
      
      doctorUsers.push(user);
      
      // Create Doctor profile
      const experienceYears = parseInt(doc.experience.split(' ')[0]);
      const doctorProfile = {
        user: user._id,
        specialization: doc.specialty,
        experience: experienceYears,
        fees: 500 + (experienceYears * 50), // Fee based on experience
        verified: true,
        bio: `Experienced ${doc.specialty} with ${doc.experience} of practice.`
      };
      
      doctorProfiles.push(doctorProfile);
    }

    // Insert all users
    await User.insertMany(doctorUsers);
    console.log('✅ 20 doctor users created');

    // Insert all doctor profiles
    await Doctor.insertMany(doctorProfiles);
    console.log('✅ 20 doctor profiles created');

    console.log('🎉 Successfully seeded 20 doctors!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDoctors();
