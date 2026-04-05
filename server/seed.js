const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  await connectDB();
  try {
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (adminExists) {
      console.log('Admin user already exists!');
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await User.create({
      name: 'System Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      department: 'Management',
      designation: 'Administrator',
    });

    console.log('Admin user seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error with seeded data', error);
    process.exit(1);
  }
};

seedAdmin();
