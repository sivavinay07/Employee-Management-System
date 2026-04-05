const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  checkIn: { type: Date },
  checkOut: { type: Date },
  hoursWorked: { type: Number, default: 0 },
  dayType: { type: String, enum: ['full day', 'half day', 'absent'], default: 'full day' },
  status: { type: String, enum: ['present', 'late', 'absent'], default: 'present' },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
