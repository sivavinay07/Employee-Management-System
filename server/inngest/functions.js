const inngest = require('./client');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const nodemailer = require('nodemailer');

// Mock email function since Brevo/SMTP isn't fully configured with real keys yet
const sendEmail = async (to, subject, text) => {
  console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | Text: ${text}`);
};

// 1. Daily Attendance Reminders (Cron Job)
const dailyAttendanceReminder = inngest.createFunction(
  { id: "daily-attendance-reminder" },
  { cron: "TZ=Asia/Kolkata 30 11 * * *" }, // 11:30 AM IST
  async ({ step }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeEmployees = await step.run("fetch-active-employees", async () => {
      return await User.find({ role: 'employee', status: 'active' });
    });

    const employeesOnLeave = await step.run("fetch-employees-on-leave", async () => {
      const leaves = await Leave.find({
        status: 'approved',
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() }
      });
      return leaves.map(l => l.employeeId.toString());
    });

    const checkedInEmployees = await step.run("fetch-checked-in-employees", async () => {
      const attendances = await Attendance.find({ date: { $gte: today } });
      return attendances.map(a => a.employeeId.toString());
    });

    await step.run("send-reminders", async () => {
      for (const employee of activeEmployees) {
        if (!employeesOnLeave.includes(employee._id.toString()) && 
            !checkedInEmployees.includes(employee._id.toString())) {
          await sendEmail(employee.email, "Attendance Reminder", "Please mark your attendance for today.");
        }
      }
    });
  }
);

// 2. Auto-Checkout & Shift Reminders
const handleClockIn = inngest.createFunction(
  { id: "handle-clock-in" },
  { event: "attendance/clock.in" },
  async ({ event, step }) => {
    const { employeeId, attendanceId } = event.data;
    
    // Wait for 9 hours
    await step.sleep("wait-9-hours", "9h");

    const attendanceCheck1 = await step.run("check-checkout-status", async () => {
      return await Attendance.findById(attendanceId);
    });

    if (!attendanceCheck1.checkOut) {
      const employee = await step.run("fetch-employee", async () => await User.findById(employeeId));
      await step.run("send-checkout-reminder", async () => {
        await sendEmail(employee.email, "Checkout Reminder", "It's been 9 hours. Please remember to clock out.");
      });

      // Wait for an additional 1 hour (10 hours total)
      await step.sleep("wait-1-more-hour", "1h");

      const attendanceCheck2 = await step.run("final-checkout-check", async () => {
        return await Attendance.findById(attendanceId);
      });

      if (!attendanceCheck2.checkOut) {
        await step.run("force-checkout", async () => {
          attendanceCheck2.checkOut = new Date();
          attendanceCheck2.hoursWorked = 4;
          attendanceCheck2.dayType = 'half day';
          attendanceCheck2.status = 'late';
          await attendanceCheck2.save();
        });
      }
    }
  }
);

// 3. Pending Leave Notification
const handleLeaveCreate = inngest.createFunction(
  { id: "handle-leave-create" },
  { event: "leave/created" },
  async ({ event, step }) => {
    const { leaveId } = event.data;

    await step.sleep("wait-24-hours", "24h");

    const leave = await step.run("check-leave-status", async () => {
      return await Leave.findById(leaveId);
    });

    if (leave.status === 'pending') {
      const adminUsers = await step.run("fetch-admins", async () => {
        return await User.find({ role: 'admin' });
      });

      await step.run("notify-admins", async () => {
        for (const admin of adminUsers) {
          await sendEmail(admin.email, "Pending Leave Request", "A leave request has been pending for 24 hours.");
        }
      });
    }
  }
);

module.exports = { dailyAttendanceReminder, handleClockIn, handleLeaveCreate };
