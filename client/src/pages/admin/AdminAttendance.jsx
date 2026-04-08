import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/api';
import toast from 'react-hot-toast';
import { Search, Clock } from 'lucide-react';

const AdminAttendance = () => {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');

  const fetchAllAttendance = async () => {
    try {
      const res = await axios.get(`${API_URL}/attendance`);
      setHistory(res.data);
    } catch (err) {
      toast.error('Failed to load attendance records');
    }
  };

  useEffect(() => {
    fetchAllAttendance();
  }, []);

  const filteredHistory = history.filter(record => 
    record.employeeId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    record.employeeId?.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Monitoring</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative w-full md:w-72">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search by employee or dept..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Clock In</th>
                <th className="px-6 py-4">Clock Out</th>
                <th className="px-6 py-4">Hours</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map(record => (
                <tr key={record._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {record.employeeId?.name || 'Unknown'} <br/>
                    <span className="text-xs text-gray-500">{record.employeeId?.department}</span>
                  </td>
                  <td className="px-6 py-4">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : '-'}</td>
                  <td className="px-6 py-4">{record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : '-'}</td>
                  <td className="px-6 py-4 font-semibold text-primary-600">{record.hoursWorked}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                      ${record.status === 'present' ? 'bg-green-100 text-green-700' :
                        record.status === 'absent' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden grid grid-cols-1 gap-4 p-4 bg-gray-50">
          {filteredHistory.map(record => (
            <div key={record._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                   <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold mr-3 text-xs">
                     {record.employeeId?.name?.charAt(0) || '?'}
                   </div>
                   <div>
                     <h3 className="font-bold text-gray-900 text-sm">{record.employeeId?.name || 'Unknown'}</h3>
                     <p className="text-[10px] text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
                   </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase
                  ${record.status === 'present' ? 'bg-green-100 text-green-700' :
                    record.status === 'absent' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'}`}>
                  {record.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-50 bg-gray-50/50 px-2 rounded-lg">
                <div>
                  <p className="text-[9px] uppercase text-gray-400 font-bold mb-1">Clock In</p>
                  <p className="text-xs font-semibold">{record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase text-gray-400 font-bold mb-1">Clock Out</p>
                  <p className="text-xs font-semibold">{record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3 px-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{record.employeeId?.department}</span>
                <span className="text-sm font-black text-primary-600">{record.hoursWorked} hrs</span>
              </div>
            </div>
          ))}
          {filteredHistory.length === 0 && (
             <div className="text-center py-8 text-gray-500 bg-white rounded-xl">No records found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAttendance;
