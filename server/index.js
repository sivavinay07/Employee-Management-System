const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { serve } = require('inngest/express');
const inngest = require('./inngest/client');
const { dailyAttendanceReminder, handleClockIn, handleLeaveCreate } = require('./inngest/functions');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Inngest
app.use('/api/inngest', serve({ client: inngest, functions: [dailyAttendanceReminder, handleClockIn, handleLeaveCreate] }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/payslips', require('./routes/payslipRoutes'));

app.get('/', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
