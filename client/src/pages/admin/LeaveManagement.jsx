import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/api';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`${API_URL}/leaves`);
      setLeaves(res.data);
    } catch (err) {
      toast.error('Failed to load leave applications');
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`${API_URL}/leaves/${id}`, { status });
      toast.success(`Leave ${status} successfully`);
      fetchLeaves();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Leave Applications</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map(leave => (
                <tr key={leave._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {leave.employeeId?.name || 'Unknown'} <br/>
                    <span className="text-xs text-gray-500">{leave.employeeId?.department}</span>
                  </td>
                  <td className="px-6 py-4 capitalize">{leave.leaveType}</td>
                  <td className="px-6 py-4">
                    {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate" title={leave.reason}>{leave.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                      ${leave.status === 'approved' ? 'bg-green-100 text-green-700' : 
                        leave.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {leave.status === 'pending' && (
                      <>
                        <button onClick={() => handleStatusUpdate(leave._id, 'approved')} className="text-green-500 hover:text-green-700 p-1 bg-green-50 rounded-md transition-colors" title="Approve">
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleStatusUpdate(leave._id, 'rejected')} className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded-md transition-colors" title="Reject">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No leave applications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100 bg-gray-50 p-4 space-y-4">
          {leaves.map(leave => (
            <div key={leave._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{leave.employeeId?.name || 'Unknown'}</h3>
                  <p className="text-xs text-gray-500">{leave.employeeId?.department}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase
                  ${leave.status === 'approved' ? 'bg-green-100 text-green-700' : 
                    leave.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                    'bg-yellow-100 text-yellow-700'}`}>
                  {leave.status}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Type:</span>
                  <span className="font-medium capitalize">{leave.leaveType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Period:</span>
                  <span className="font-medium">{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded text-sm text-gray-600 mt-2 italic">
                  "{leave.reason}"
                </div>
              </div>
              
              {leave.status === 'pending' && (
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleStatusUpdate(leave._id, 'approved')}
                    className="flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-lg font-medium shadow-sm active:scale-95 transition-transform"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(leave._id, 'rejected')}
                    className="flex items-center justify-center gap-2 py-2.5 bg-red-600 text-white rounded-lg font-medium shadow-sm active:scale-95 transition-transform"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
          {leaves.length === 0 && (
             <div className="text-center py-8 text-gray-500 bg-white rounded-xl">No leave applications found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
