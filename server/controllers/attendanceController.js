const Attendance = require('../models/Attendance');
const inngest = require('../inngest/client');

// @desc    Clock In
// @route   POST /api/attendance/clock-in
// @access  Private (Employee)
const clockIn = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({
      employeeId: req.user._id,
      date: { $gte: today }
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Already clocked in today' });
    }

    const attendance = await Attendance.create({
      employeeId: req.user._id,
      date: new Date(),
      checkIn: new Date(),
      status: 'present'
    });

    // Trigger Inngest Event (non-blocking)
    try {
      await inngest.send({
        name: 'attendance/clock.in',
        data: {
          employeeId: req.user._id,
          attendanceId: attendance._id
        }
      });
    } catch (inngestError) {
      console.error('Inngest Event Error (Clock-In):', inngestError.message);
    }

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clock Out
// @route   PUT /api/attendance/clock-out
// @access  Private (Employee)
const clockOut = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employeeId: req.user._id,
      date: { $gte: today }
    });

    if (!attendance) {
      return res.status(400).json({ message: 'No check-in found for today' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: 'Already clocked out today' });
    }

    attendance.checkOut = new Date();
    const diff = Math.abs(attendance.checkOut - attendance.checkIn) / 36e5;
    attendance.hoursWorked = diff.toFixed(2);
    
    if (diff < 8) {
      attendance.dayType = 'half day';
    }

    await attendance.save();
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get All Attendance or My Attendance
// @route   GET /api/attendance
// @access  Private
const getAttendance = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'employee') {
      filter.employeeId = req.user._id;
    }
    const records = await Attendance.find(filter).populate('employeeId', 'name email department').sort('-date');
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { clockIn, clockOut, getAttendance };
