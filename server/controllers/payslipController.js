const Payslip = require('../models/Payslip');
const User = require('../models/User');

// @desc    Generate Payslip
// @route   POST /api/payslips
// @access  Private (Admin)
const generatePayslip = async (req, res) => {
  try {
    const { employeeId, month, year, basicSalary, allowances, deductions } = req.body;
    
    // Calculate net salary
    const netSalary = Number(basicSalary) + Number(allowances) - Number(deductions);

    const payslip = await Payslip.create({
      employeeId,
      month,
      year,
      basicSalary,
      allowances,
      deductions,
      netSalary
    });

    const fullPayslip = await Payslip.findById(payslip._id).populate('employeeId', 'name email department designation');
    res.status(201).json(fullPayslip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Payslips
// @route   GET /api/payslips
// @access  Private
const getPayslips = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.employeeId = req.user._id;
    }
    const payslips = await Payslip.find(filter).populate('employeeId', 'name email department designation').sort('-year -month');
    res.json(payslips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generatePayslip, getPayslips };
