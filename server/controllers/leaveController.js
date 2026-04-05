const Leave = require('../models/Leave');
const inngest = require('../inngest/client');

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private (Employee)
const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const leave = await Leave.create({
      employeeId: req.user._id,
      leaveType,
      startDate,
      endDate,
      reason
    });

    // Trigger Inngest Event (non-blocking)
    try {
      await inngest.send({
        name: 'leave/created',
        data: {
          leaveId: leave._id
        }
      });
    } catch (inngestError) {
      console.error('Inngest Event Error (Leave-Created):', inngestError.message);
    }

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Leaves (Employee sees own, Admin sees all)
// @route   GET /api/leaves
// @access  Private
const getLeaves = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.employeeId = req.user._id;
    }
    const leaves = await Leave.find(filter).populate('employeeId', 'name email department').sort('-createdAt');
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Leave Status
// @route   PUT /api/leaves/:id
// @access  Private (Admin)
const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    leave.status = status;
    await leave.save();
    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { applyLeave, getLeaves, updateLeaveStatus };
