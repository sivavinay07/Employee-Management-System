import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/api';
import toast from 'react-hot-toast';
import { Download } from 'lucide-react';
import { generatePayslipPDF } from '../../utils/payslipPDF';

const Payroll = () => {
  const [payslips, setPayslips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    employeeId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    basicSalary: 0,
    allowances: 0,
    deductions: 0
  });

  const fetchData = async () => {
    try {
      const [psRes, empRes] = await Promise.all([
        axios.get(`${API_URL}/payslips`),
        axios.get(`${API_URL}/employees`)
      ]);
      setPayslips(psRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/payslips`, formData);
      toast.success('Payslip generated successfully');
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error('Generation failed');
    }
  };

  const selectedEmployee = employees.find(e => e._id === formData.employeeId);
  useEffect(() => {
    if (selectedEmployee) {
      setFormData(prev => ({ ...prev, basicSalary: selectedEmployee.basicSalary || 0 }));
    }
  }, [selectedEmployee]);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payroll & Payslips</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors">
          {showForm ? 'Close Form' : 'Generate Payslip'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-bold mb-4">Generate New Payslip</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleGenerate}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
              <select required className="w-full border border-gray-300 rounded-md p-2" onChange={e => setFormData({...formData, employeeId: e.target.value})}>
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>{emp.name} - {emp.department}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month (1-12)</label>
                <input type="number" min="1" max="12" required className="w-full border border-gray-300 rounded-md p-2" value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input type="number" required className="w-full border border-gray-300 rounded-md p-2" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary ($)</label>
              <input type="number" required className="w-full border border-gray-300 rounded-md p-2" value={formData.basicSalary} onChange={e => setFormData({...formData, basicSalary: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allowances ($)</label>
                <input type="number" className="w-full border border-gray-300 rounded-md p-2 bg-green-50 text-green-700" value={formData.allowances} onChange={e => setFormData({...formData, allowances: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deductions ($)</label>
                <input type="number" className="w-full border border-gray-300 rounded-md p-2 bg-red-50 text-red-700" value={formData.deductions} onChange={e => setFormData({...formData, deductions: e.target.value})} />
              </div>
            </div>
            
            <div className="md:col-span-2 flex justify-end mt-4">
              <div className="flex items-center text-lg font-bold bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 mr-4">
                Net Salary: <span className="text-primary-600 ml-2">${Number(formData.basicSalary) + Number(formData.allowances) - Number(formData.deductions)}</span>
              </div>
              <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg shadow-sm hover:bg-primary-700">Generate</button>
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
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Period</th>
                <th className="px-6 py-4">Basic Salary</th>
                <th className="px-6 py-4">Net Salary</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {payslips.map(ps => (
                <tr key={ps._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{ps.employeeId?.name || 'Unknown'}</td>
                  <td className="px-6 py-4">{ps.month}/{ps.year}</td>
                  <td className="px-6 py-4">${ps.basicSalary}</td>
                  <td className="px-6 py-4 font-bold text-primary-600">${ps.netSalary}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => generatePayslipPDF(ps)} className="text-gray-500 hover:text-primary-600 flex items-center transition-colors">
                      <Download className="w-4 h-4 mr-1" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden grid grid-cols-1 gap-4 p-4 bg-gray-50">
          {payslips.map(ps => (
            <div key={ps._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{ps.employeeId?.name || 'Unknown'}</h3>
                  <p className="text-xs text-gray-500">Period: {ps.month}/{ps.year}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] uppercase text-gray-400 font-bold">Net Salary</p>
                   <p className="font-bold text-primary-600">${ps.netSalary}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 pt-3 border-t border-gray-50">
                <div className="text-sm text-gray-500">
                  Basic: ${ps.basicSalary}
                </div>
                <button 
                  onClick={() => generatePayslipPDF(ps)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-semibold hover:bg-primary-100 transition-colors"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            </div>
          ))}
          {payslips.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-white rounded-xl">No records found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payroll;
