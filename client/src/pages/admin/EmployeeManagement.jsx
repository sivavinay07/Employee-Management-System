import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Search, Edit2 } from 'lucide-react';

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

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/employees');
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
      await axios.post('http://localhost:5000/api/employees', formData);
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
      await axios.put(`http://localhost:5000/api/employees/${editingId}`, editData);
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
      await axios.put(`http://localhost:5000/api/employees/${employee._id}`, { status: newStatus });
      toast.success(`Employee ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      fetchEmployees();
    } catch (err) {
      toast.error('Failed to change status');
    }
  };

  const startEdit = (emp) => {
    setEditingId(emp._id);
    setEditData({
      name: emp.name,
      department: emp.department,
      designation: emp.designation,
      basicSalary: emp.basicSalary,
      bio: emp.bio
    });
  };

  const filteredEmployees = employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors">
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
                <input type="text" required className="w-full border border-gray-300 rounded-md p-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" required className="w-full border border-gray-300 rounded-md p-2" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" required className="w-full border border-gray-300 rounded-md p-2" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select className="w-full border border-gray-300 rounded-md p-2 bg-white" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <select className="w-full border border-gray-300 rounded-md p-2 bg-white" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})}>
                  <option value="">Select Designation</option>
                  {DESIGNATIONS.map(desig => <option key={desig} value={desig}>{desig}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary ($)</label>
                <input type="number" required className="w-full border border-gray-300 rounded-md p-2" value={formData.basicSalary} onChange={e => setFormData({...formData, basicSalary: e.target.value})} />
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
                <input type="text" required className="w-full border border-gray-300 rounded-md p-2" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select className="w-full border border-gray-300 rounded-md p-2 bg-white" value={editData.department} onChange={e => setEditData({...editData, department: e.target.value})}>
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <select className="w-full border border-gray-300 rounded-md p-2 bg-white" value={editData.designation} onChange={e => setEditData({...editData, designation: e.target.value})}>
                  <option value="">Select Designation</option>
                  {DESIGNATIONS.map(desig => <option key={desig} value={desig}>{desig}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary ($)</label>
                <input type="number" required className="w-full border border-gray-300 rounded-md p-2" value={editData.basicSalary} onChange={e => setEditData({...editData, basicSalary: e.target.value})} />
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
                  <td className="px-6 py-4">
                    <button onClick={() => startEdit(emp)} className="text-blue-500 hover:text-blue-700 p-1 bg-blue-50 rounded-md transition-colors mr-2">
                      <Edit2 className="w-4 h-4" />
                    </button>
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
        <div className="md:hidden grid grid-cols-1 gap-4 p-4 bg-gray-50">
          {filteredEmployees.map(emp => (
            <div key={emp._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold mr-3">
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{emp.name}</h3>
                    <p className="text-xs text-gray-500">{emp.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleStatus(emp)}
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${emp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {emp.status}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold">Department</p>
                  <p className="truncate">{emp.department}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold">Designation</p>
                  <p className="truncate">{emp.designation}</p>
                </div>
              </div>
              <button 
                onClick={() => startEdit(emp)}
                className="w-full flex items-center justify-center gap-2 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
            </div>
          ))}
          {filteredEmployees.length === 0 && (
             <div className="text-center py-8 text-gray-500 bg-white rounded-xl">No employees found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;
