import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus, Search, Edit2, Trash2, UserX, UserCheck } from 'lucide-react';

const DEPARTMENTS = ['Human Resources', 'Engineering', 'Marketing', 'Sales', 'Finance', 'Operations'];
const DESIGNATIONS = ['Intern', 'Junior Developer', 'Senior Developer', 'Team Lead', 'Manager', 'Director', 'HR Specialist', 'Sales Representative'];

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', department: '', designation: '', basicSalary: 0
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/employees`);
      setEmployees(res.data);
    } catch (err) {
      toast.error('Failed to load employees');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/employees`, formData);
      toast.success('Employee added successfully');
      setShowForm(false);
      setFormData({ name: '', email: '', password: '', department: '', designation: '', basicSalary: 0 });
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add employee');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/employees/${editingId}`, editData);
      toast.success('Employee updated successfully');
      setEditingId(null);
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update employee');
    }
  };

  const toggleStatus = async (employee) => {
    try {
      const newStatus = employee.status === 'active' ? 'inactive' : 'active';
      await axios.put(`${API_URL}/employees/${employee._id}`, { status: newStatus });
      toast.success(`Employee ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      fetchEmployees();
    } catch (err) {
      toast.error('Failed to change status');
    }
  };

  const startEdit = (emp) => {
    setEditingId(emp._id);
    setConfirmDeleteId(null);
    setEditData({
      name: emp.name,
      department: emp.department,
      designation: emp.designation,
      basicSalary: emp.basicSalary,
      bio: emp.bio
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/employees/${id}`);
      toast.success('Employee removed successfully');
      setConfirmDeleteId(null);
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete employee');
    }
  };

  const filteredEmployees = employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 border-b-2 border-primary-500 pb-1 w-fit">Employee Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center shadow-md transition-all active:scale-95 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? 'Cancel' : 'Add Employee'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-bold mb-4">Add New Employee</h2>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" required className="w-full border border-gray-300 rounded-md p-2" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" required className="w-full border border-gray-300 rounded-md p-2" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" required className="w-full border border-gray-300 rounded-md p-2" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select className="w-full border border-gray-300 rounded-md p-2 bg-white" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <select className="w-full border border-gray-300 rounded-md p-2 bg-white" value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })}>
                  <option value="">Select Designation</option>
                  {DESIGNATIONS.map(desig => <option key={desig} value={desig}>{desig}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary ($)</label>
                <input type="number" required className="w-full border border-gray-300 rounded-md p-2" value={formData.basicSalary} onChange={e => setFormData({ ...formData, basicSalary: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg shadow-sm hover:bg-primary-700">Submit</button>
            </div>
          </form>
        </div>
      )}

      {editingId && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 mb-8 ring-2 ring-blue-500">
          <h2 className="text-lg font-bold mb-4">Edit Employee</h2>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" required className="w-full border border-gray-300 rounded-md p-2" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select className="w-full border border-gray-300 rounded-md p-2 bg-white" value={editData.department} onChange={e => setEditData({ ...editData, department: e.target.value })}>
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <select className="w-full border border-gray-300 rounded-md p-2 bg-white" value={editData.designation} onChange={e => setEditData({ ...editData, designation: e.target.value })}>
                  <option value="">Select Designation</option>
                  {DESIGNATIONS.map(desig => <option key={desig} value={desig}>{desig}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary ($)</label>
                <input type="number" required className="w-full border border-gray-300 rounded-md p-2" value={editData.basicSalary} onChange={e => setEditData({ ...editData, basicSalary: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setEditingId(null)} className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg shadow-sm hover:bg-primary-700 transition-colors">Update Changes</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative w-full md:w-72">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search employees..."
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
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Designation</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold mr-3">
                      {emp.name.charAt(0)}
                    </div>
                    {emp.name}
                  </td>
                  <td className="px-6 py-4">{emp.department}</td>
                  <td className="px-6 py-4">{emp.designation}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(emp)}
                      className={`px-2 py-1 rounded-full text-xs font-semibold cursor-pointer transition-opacity hover:opacity-80 ${emp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {emp.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <button onClick={() => startEdit(emp)} className="text-blue-500 hover:text-blue-700 p-2 bg-blue-50 rounded-lg transition-all active:scale-95" title="Edit Profile">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    
                    <button 
                      onClick={() => toggleStatus(emp)} 
                      className={`p-2 rounded-lg transition-all active:scale-95 ${emp.status === 'active' ? 'text-orange-500 bg-orange-50 hover:bg-orange-100' : 'text-green-500 bg-green-50 hover:bg-green-100'}`}
                      title={emp.status === 'active' ? 'Deactivate Employee' : 'Activate Employee'}
                    >
                      {emp.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>

                    {confirmDeleteId === emp._id ? (
                      <span className="inline-flex items-center gap-1 animate-in slide-in-from-right-2">
                        <button
                          onClick={() => handleDelete(emp._id)}
                          className="text-[10px] px-2 py-1 bg-red-500 text-white rounded-md font-bold hover:bg-red-600"
                        >Confirm</button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-[10px] px-2 py-1 bg-gray-200 text-gray-700 rounded-md font-bold hover:bg-gray-300"
                        >Cancel</button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(emp._id)}
                        className="text-red-500 hover:text-red-700 p-2 bg-red-100 rounded-lg transition-all active:scale-95"
                        title="Delete Employee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No employees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden grid grid-cols-1 gap-6 p-4 bg-gray-50/30">
          {filteredEmployees.map(emp => (
            <div key={emp._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative group transition-all">
              {/* Status Badge - Top Right */}
              <div className="absolute top-6 right-6">
                <button 
                  onClick={() => toggleStatus(emp)}
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all active:scale-95 ${emp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {emp.status}
                </button>
              </div>

              {/* Header Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-2xl border-2 border-blue-100">
                  {emp.name.charAt(0).toLowerCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight capitalize">{emp.name}</h3>
                  <p className="text-sm text-gray-400 font-medium">{emp.email}</p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-50 flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Department</span>
                  <span className="font-bold text-gray-800 text-sm overflow-hidden text-ellipsis">{emp.department || 'IT'}</span>
                </div>
                <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-50 flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Designation</span>
                  <span className="font-bold text-gray-800 text-sm overflow-hidden text-ellipsis">{emp.designation || 'Developer'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="h-14">
                {confirmDeleteId === emp._id ? (
                  <div className="flex h-full gap-3 animate-in fade-in zoom-in-95 duration-200">
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="flex-1 bg-gray-100 text-gray-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(emp._id)}
                      className="flex-[2] bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-md shadow-red-100"
                    >
                      Confirm Delete
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 h-full">
                    <button 
                      onClick={() => startEdit(emp)}
                      className="flex-[2] flex items-center justify-center gap-2 border border-blue-100 rounded-2xl text-blue-600 font-black text-xs tracking-wider uppercase hover:bg-blue-50 transition-all active:scale-[0.98] group"
                    >
                      <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> Edit
                    </button>
                    
                    <button 
                      onClick={() => toggleStatus(emp)}
                      className={`flex-1 flex items-center justify-center rounded-2xl transition-all active:scale-95 ${emp.status === 'active' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-green-50 text-green-600 border border-green-100'}`}
                      title={emp.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      {emp.status === 'active' ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                    </button>

                    <button
                      onClick={() => setConfirmDeleteId(emp._id)}
                      className="flex-1 flex items-center justify-center border border-red-50 rounded-2xl text-red-500 hover:bg-red-50 transition-all active:scale-95 group/del"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5 group-hover/del:scale-110 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {filteredEmployees.length === 0 && (
            <div className="text-center py-12 text-gray-400 font-medium bg-white rounded-3xl border border-dashed border-gray-200">
              No employees found match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;
