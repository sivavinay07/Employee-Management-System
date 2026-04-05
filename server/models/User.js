const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  department: { type: String },
  designation: { type: String },
  basicSalary: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  bio: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
