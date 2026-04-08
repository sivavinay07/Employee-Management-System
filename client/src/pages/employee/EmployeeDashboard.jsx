import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/api';
import { Calendar, Wallet, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ present: 0, pendingLeaves: 0, lastPayout: 0 });

  useEffect(() => {
    // Mocking quick API calls for dashboard overview
    const fetchOverview = async () => {
      try {
        const [attRes, leaveRes, payRes] = await Promise.all([
           axios.get(`${API_URL}/attendance`),
           axios.get(`${API_URL}/leaves`),
           axios.get(`${API_URL}/payslips`)
        ]);
        
        setStats({
          present: attRes.data.filter(a => a.status === 'present').length,
          pendingLeaves: leaveRes.data.filter(l => l.status === 'pending').length,
          lastPayout: payRes.data[0]?.netSalary || 0
        });
      } catch(err) {
        console.error(err);
      }
    }
    fetchOverview();
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-primary-600 to-indigo-700 rounded-2xl p-8 mb-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="opacity-90">Here is your activity overview for the current month.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 flex items-center shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4 rounded-full bg-green-50 text-green-500 mr-4">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Days Present</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.present}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 flex items-center shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4 rounded-full bg-orange-50 text-orange-500 mr-4">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Leaves</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingLeaves}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 flex items-center shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4 rounded-full bg-blue-50 text-blue-500 mr-4">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Last Payout</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">${stats.lastPayout}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
