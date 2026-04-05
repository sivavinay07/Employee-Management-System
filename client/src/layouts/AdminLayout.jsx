import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, LogOut, LayoutDashboard, Calendar, FileText, Menu, X, Clock } from 'lucide-react';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Employees', path: '/admin/employees', icon: Users },
    { name: 'Attendance', path: '/admin/attendance', icon: Clock },
    { name: 'Leaves', path: '/admin/leaves', icon: Calendar },
    { name: 'Payroll', path: '/admin/payroll', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <span className="text-xl font-bold text-primary-600">Admin Portal</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-gray-600">
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out`}>
        <div className="h-16 hidden md:flex items-center px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-primary-600">Admin Portal</span>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors`}
                >
                  <item.icon className={`${isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'} mr-3 flex-shrink-0 h-5 w-5 transition-colors`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50 md:bg-white">
          <div className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700">
             <div className="truncate mr-3">
               <p className="font-semibold text-gray-900">{user?.name}</p>
               <p className="text-xs text-gray-500">{user?.email}</p>
             </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
