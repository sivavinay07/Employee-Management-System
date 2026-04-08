import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/api';
import toast from 'react-hot-toast';

const LeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'casual',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`${API_URL}/leaves`);
      setLeaves(res.data);
    } catch (err) {
      toast.error('Failed to load leave history');
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/leaves`, formData);
      toast.success('Leave application submitted');
      setShowForm(false);
      setFormData({ leaveType: 'casual', startDate: '', endDate: '', reason: '' });
      fetchLeaves();
    } catch (err) {
      toast.error('Failed to submit application');
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors">
          {showForm ? 'Cancel Application' : 'Apply for Leave'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select 
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={formData.leaveType}
                  onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
                  required
                >
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="annual">Annual Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" required className="w-full border border-gray-300 rounded-md p-2" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input type="date" required className="w-full border border-gray-300 rounded-md p-2" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <textarea 
                required 
                rows="3"
                className="w-full border border-gray-300 rounded-md p-2" 
                value={formData.reason} 
                onChange={e => setFormData({...formData, reason: e.target.value})}
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg shadow-sm hover:bg-primary-700">Submit Application</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Start Date</th>
                <th className="px-6 py-4">End Date</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map(leave => (
                <tr key={leave._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 capitalize font-medium text-gray-900">{leave.leaveType}</td>
                  <td className="px-6 py-4">{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 max-w-xs truncate" title={leave.reason}>{leave.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                      ${leave.status === 'approved' ? 'bg-green-100 text-green-700' : 
                        leave.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'}`}>
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No leave history.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100 bg-gray-50 p-4 space-y-4">
          {leaves.map(leave => (
            <div key={leave._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-black text-primary-600 uppercase tracking-wide">{leave.leaveType} Leave</span>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase
                  ${leave.status === 'approved' ? 'bg-green-100 text-green-700' : 
                    leave.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                    'bg-yellow-100 text-yellow-700'}`}>
                  {leave.status}
                </span>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Duration:</span>
                  <span className="font-medium">{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 italic">
                  "{leave.reason}"
                </div>
              </div>
            </div>
          ))}
          {leaves.length === 0 && (
             <div className="text-center py-8 text-gray-500 bg-white rounded-xl">No leave history.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveRequests;
