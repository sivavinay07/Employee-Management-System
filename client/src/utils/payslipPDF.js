import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePayslipPDF = (payslip) => {
  try {
    const doc = new jsPDF();
    const employee = payslip.employeeId || {};
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); // primary-600
    doc.text('Employee Management System', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text('OFFICIAL MONTHLY SALARY SLIP', 105, 30, { align: 'center' });
    
    // horizontal line
    doc.setDrawColor(200);
    doc.line(20, 35, 190, 35);
    
    // Employee Info
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text('Employee Details:', 20, 48);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${employee.name || 'N/A'}`, 25, 55);
    doc.text(`ID: ${employee._id ? employee._id.slice(-6).toUpperCase() : 'N/A'}`, 25, 62);
    doc.text(`Department: ${employee.department || 'N/A'}`, 25, 69);
    doc.text(`Designation: ${employee.designation || 'N/A'}`, 25, 76);
    
    // Payment Period
    doc.setFont('helvetica', 'bold');
    doc.text('Pay Period Details:', 130, 48);
    doc.setFont('helvetica', 'normal');
    doc.text(`Month: ${payslip.month}`, 135, 55);
    doc.text(`Year: ${payslip.year}`, 135, 62);
    doc.text(`Status: Paid`, 135, 69);
    
    // Salary Data Preparation (Safely convert to Number)
    const basic = Number(payslip.basicSalary || 0);
    const allow = Number(payslip.allowances || 0);
    const deduct = Number(payslip.deductions || 0);
    const net = Number(payslip.netSalary || 0);

    const columns = [
      { header: 'Description', dataKey: 'desc' },
      { header: 'Amount ($)', dataKey: 'amount' }
    ];

    const body = [
      { desc: 'Basic Salary', amount: basic.toFixed(2) },
      { desc: 'House Rent & Other Allowances', amount: `+ ${allow.toFixed(2)}` },
      { desc: 'Deductions (Leaves/Taxes)', amount: `- ${deduct.toFixed(2)}` }
    ];
    
    // Generate Table
    autoTable(doc, {
      startY: 90,
      head: [['Earnings & Deductions', 'Amount (USD)']],
      body: body.map(row => [row.desc, row.amount]),
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], fontStyle: 'bold' },
      columnStyles: { 1: { halign: 'right' } },
      margin: { horizontal: 20 }
    });
    
    // Net Salary Section
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL NET SALARY: $${net.toFixed(2)}`, 190, finalY, { align: 'right' });
    
    // Signature
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Authorized Signatory', 20, finalY + 30);
    doc.line(20, finalY + 25, 70, finalY + 25);
    
    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text('Generated on: ' + new Date().toLocaleString(), 105, 285, { align: 'center' });
    
    // Save the PDF
    doc.save(`Payslip_${employee.name || 'Emp'}_${payslip.month}_${payslip.year}.pdf`);
  } catch (err) {
    console.error('PDF Generation Error:', err);
    alert('Failed to generate PDF. Please ensure all employee data is complete.');
  }
};
