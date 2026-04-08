import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/api';
import toast from 'react-hot-toast';
import { Download } from 'lucide-react';
import { generatePayslipPDF } from '../../utils/payslipPDF';

const Payslips = () => {
  const [payslips, setPayslips] = useState([]);

  useEffect(() => {
    const fetchPayslips = async () => {
      try {
        const res = await axios.get(`${API_URL}/payslips`);
        setPayslips(res.data);
      } catch (err) {
        toast.error('Failed to load payslips');
      }
    };
    fetchPayslips();
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Payslips</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">Period</th>
                <th className="px-6 py-4">Basic Salary</th>
                <th className="px-6 py-4">Allowances</th>
                <th className="px-6 py-4">Deductions</th>
                <th className="px-6 py-4">Net Salary</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {payslips.map(ps => (
                <tr key={ps._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{ps.month}/{ps.year}</td>
                  <td className="px-6 py-4">${ps.basicSalary}</td>
                  <td className="px-6 py-4 text-green-600">+${ps.allowances}</td>
                  <td className="px-6 py-4 text-red-600">-${ps.deductions}</td>
                  <td className="px-6 py-4 font-bold text-primary-600">${ps.netSalary}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => generatePayslipPDF(ps)} className="text-primary-600 hover:text-primary-700 flex items-center transition-colors bg-primary-50 px-3 py-1 rounded-md">
                      <Download className="w-4 h-4 mr-1" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
              {payslips.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No payslips available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden grid grid-cols-1 gap-4 p-4 bg-gray-50">
          {payslips.map(ps => (
            <div key={ps._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Salary Period: {ps.month}/{ps.year}</span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold">PAID</span>
              </div>
              <div className="space-y-3 mb-5 border-y border-gray-50 py-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Basic Salary</span>
                  <span className="font-semibold text-gray-700">${ps.basicSalary}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Allowances</span>
                  <span className="font-semibold text-green-600">+${ps.allowances}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Deductions</span>
                  <span className="font-semibold text-red-600">-${ps.deductions}</span>
                </div>
                <div className="flex justify-between items-center pt-2 mt-2 border-t border-dashed border-gray-200">
                   <span className="text-base font-bold text-gray-900">Net Take Home</span>
                   <span className="text-xl font-black text-primary-600">${ps.netSalary}</span>
                </div>
              </div>
              <button 
                onClick={() => generatePayslipPDF(ps)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 text-white rounded-xl font-bold shadow-md hover:bg-primary-700 transition-all active:scale-[0.98]"
              >
                <Download className="w-5 h-5" /> Download PDF Slip
              </button>
            </div>
          ))}
          {payslips.length === 0 && (
             <div className="text-center py-8 text-gray-500 bg-white rounded-xl">No payslips available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payslips;
