const express = require('express');
const router = express.Router();
const { generatePayslip, getPayslips } = require('../controllers/payslipController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, admin, generatePayslip)
  .get(protect, getPayslips);

module.exports = router;
