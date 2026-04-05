const express = require('express');
const router = express.Router();
const { getEmployees, getEmployeeById, addEmployee, updateEmployee } = require('../controllers/employeeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getEmployees)
  .post(protect, admin, addEmployee);

router.route('/:id')
  .get(protect, getEmployeeById)
  .put(protect, admin, updateEmployee);

module.exports = router;
