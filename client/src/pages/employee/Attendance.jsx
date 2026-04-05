import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { LogIn, LogOut } from 'lucide-react';

const Attendance = () => {
  const [history, setHistory] = useState([]);
  const [clockedIn, setClockedIn] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/attendance');
      setHistory(res.data);

      // Determine if clocked in today
      const today = new Date().setHours(0, 0, 0, 0);
      const todaysRecord = res.data.find(r => new Date(r.date).setHours(0, 0, 0, 0) === today);
      if (todaysRecord && !todaysRecord.checkOut) {
        setClockedIn(true);
      } else {
        setClockedIn(false);
      }
    } catch (err) {
      toast.error('Failed to load attendance history');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClockIn = async () => {
    try {
      await axios.post('http://localhost:5000/api/attendance/clock-in');
      toast.success('Clocked in successfully');
      setClockedIn(true);
      fetchHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to clock in');
    }
  };

  const handleClockOut = async () => {
    try {
      await axios.put('http://localhost:5000/api/attendance/clock-out');
      toast.success('Clocked out successfully');
      setClockedIn(false);
      fetchHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to clock out');
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>

        {clockedIn ? (
          <button onClick={handleClockOut} className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl flex items-center shadow-md transition-all transform hover:scale-105 active:scale-95 font-semibold text-lg">
            <LogOut className="w-5 h-5 mr-3" />
            Check Out
          </button>
        ) : (
          <button onClick={handleClockIn} className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl flex items-center shadow-md transition-all transform hover:scale-105 active:scale-95 font-semibold text-lg">
            <LogIn className="w-5 h-5 mr-3" />
            Check In
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-700">Attendance History</h2>
        </div>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Check In</th>
                <th className="px-6 py-4">Check Out</th>
                <th className="px-6 py-4">Hours</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map(record => (
                <tr key={record._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : '-'}</td>
                  <td className="px-6 py-4">{record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : '-'}</td>
                  <td className="px-6 py-4">{record.hoursWorked}</td>
                  <td className="px-6 py-4 capitalize">{record.dayType}</td>
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
              {history.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No attendance records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden grid grid-cols-1 gap-4 p-4 bg-gray-50">
          {history.map(record => (
            <div key={record._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-gray-900">{new Date(record.date).toLocaleDateString()}</span>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase
                  ${record.status === 'present' ? 'bg-green-100 text-green-700' :
                    record.status === 'absent' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'}`}>
                  {record.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-50">
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold">Check In</p>
                  <p className="text-sm font-medium">{record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold">Check Out</p>
                  <p className="text-sm font-medium">{record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-gray-500 capitalize">{record.dayType} Day</span>
                <span className="text-sm font-bold text-primary-600">{record.hoursWorked} hrs</span>
              </div>
            </div>
          ))}
          {history.length === 0 && (
             <div className="text-center py-8 text-gray-500 bg-white rounded-xl">No attendance records found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
