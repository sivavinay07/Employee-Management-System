import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import AdminLayout from './layouts/AdminLayout';
import EmployeeLayout from './layouts/EmployeeLayout';

// Admin Views
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeeManagement from './pages/admin/EmployeeManagement';
import LeaveManagement from './pages/admin/LeaveManagement';
import Payroll from './pages/admin/Payroll';
import AdminAttendance from './pages/admin/AdminAttendance';

// Employee Views
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import Attendance from './pages/employee/Attendance';
import LeaveRequests from './pages/employee/LeaveRequests';
import Payslips from './pages/employee/Payslips';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin' : '/employee'} />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={user && user.role === 'admin' ? <AdminLayout /> : <Navigate to="/login" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="leaves" element={<LeaveManagement />} />
            <Route path="payroll" element={<Payroll />} />
          </Route>

          {/* Employee Routes */}
          <Route path="/employee" element={user && user.role === 'employee' ? <EmployeeLayout /> : <Navigate to="/login" />}>
            <Route index element={<EmployeeDashboard />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="leaves" element={<LeaveRequests />} />
            <Route path="payslips" element={<Payslips />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
