import { useState, useEffect } from 'react';
import { Users, Building, ClipboardCheck, ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ employees: 0, departments: 0, presentToday: 0, pendingLeaves: 0 });
  const [deptData, setDeptData] = useState([]);
  const [attendanceTrend, setAttendanceTrend] = useState([]);

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [empRes, attRes, leaveRes] = await Promise.all([
          axios.get('http://localhost:5000/api/employees'),
          axios.get('http://localhost:5000/api/attendance'),
          axios.get('http://localhost:5000/api/leaves')
        ]);
        
        const today = new Date().setHours(0, 0, 0, 0);
        const presentToday = attRes.data.filter(a => new Date(a.date).setHours(0,0,0,0) === today).length;
        const pendingLeaves = leaveRes.data.filter(l => l.status === 'pending').length;

        setStats({
          employees: empRes.data.length || 0,
          departments: [...new Set(empRes.data.map(e => e.department))].length || 0,
          presentToday: presentToday || 0,
          pendingLeaves: pendingLeaves || 0
        });

        // Process Dept Distribution
        const deptCounts = empRes.data.reduce((acc, emp) => {
          acc[emp.department] = (acc[emp.department] || 0) + 1;
          return acc;
        }, {});
        setDeptData(Object.keys(deptCounts).map(name => ({ name, value: deptCounts[name] })));

        // Process Attendance Trend (Last 7 Days)
        const last7Days = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d.toISOString().split('T')[0];
        });
        
        const trend = last7Days.map(dateStr => {
          const count = attRes.data.filter(a => a.date.startsWith(dateStr)).length;
          return { name: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }), count };
        });
        setAttendanceTrend(trend);

      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Employees', value: stats.employees, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Total Departments', value: stats.departments, icon: Building, color: 'text-purple-500', bg: 'bg-purple-50' },
    { title: "Today's Attendance", value: stats.presentToday, icon: ClipboardCheck, color: 'text-green-500', bg: 'bg-green-50' },
    { title: 'Pending Leaves', value: stats.pendingLeaves, icon: ArrowUpRight, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-full ${stat.bg} ${stat.color} mr-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Insights</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dept Distribution */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">Department Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deptData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deptData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attendance Trend */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">7-Day Attendance Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
