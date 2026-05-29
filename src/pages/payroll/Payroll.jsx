import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, DollarSign, FileText, CheckCircle2, Coins, Landmark, Calendar } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import InputField from '../../components/forms/InputField';

export default function Payroll() {
  const { payrollLogs, generatePayroll, updatePayrollStatus, staff, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const [formData, setFormData] = useState({
    month: 'May',
    year: '2026'
  });

  const openGenerateModal = () => {
    setFormData({ month: 'May', year: '2026' });
    setIsGenerateOpen(true);
  };

  const handleGenerateSubmit = (e) => {
    e.preventDefault();
    generatePayroll(`${formData.month} ${formData.year}`, formData.year);
    setIsGenerateOpen(false);
  };

  const viewPayslip = (log) => {
    setSelectedLog(log);
    setIsPayslipOpen(true);
  };

  const totalPayrollVal = payrollLogs.reduce((sum, p) => sum + (p.netSalary || p.basicSalary), 0);
  const paidVal = payrollLogs.filter(p => p.status === 'Paid' || p.paymentStatus === 'Paid').reduce((sum, p) => sum + (p.netSalary || p.basicSalary), 0);
  const pendingVal = payrollLogs.filter(p => p.status === 'Pending' || p.paymentStatus === 'Pending').reduce((sum, p) => sum + (p.netSalary || p.basicSalary), 0);

  const columns = [
    { header: 'Log ID', accessor: 'id', sortable: true },
    { header: 'Staff Name', accessor: 'staffName', sortable: true },
    { header: 'Role', accessor: 'role', sortable: true },
    { header: 'Month', accessor: 'month', sortable: true },
    {
      header: 'Basic (₹)',
      accessor: 'basicSalary',
      render: (row) => <span>₹{row.basicSalary.toLocaleString()}</span>
    },
    {
      header: 'Net Salary (₹)',
      accessor: 'netSalary',
      sortable: true,
      render: (row) => <span className="font-bold text-text">₹{(row.netSalary || row.basicSalary).toLocaleString()}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status || row.paymentStatus} />
    },
    {
      header: 'Actions',
      render: (row) => {
        const isPending = row.status === 'Pending' || row.paymentStatus === 'Pending';
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="p-1 text-primary hover:bg-primary/10" onClick={() => viewPayslip(row)}>
              <FileText className="h-3.5 w-3.5" />
            </Button>
            {currentUser?.role === 'Admin' && isPending && (
              <Button
                variant="ghost"
                size="sm"
                className="p-1 text-success hover:bg-green-50"
                onClick={() => updatePayrollStatus(row.id, 'Paid')}
              >
                Disburse
              </Button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Payroll Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Total Payroll Liability</span>
            <span className="text-lg font-extrabold text-text mt-1 block">₹{totalPayrollVal.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded-xl">
            <Landmark className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Disbursed Wages</span>
            <span className="text-lg font-extrabold text-success mt-1 block">₹{paidVal.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-yellow-100 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400 rounded-xl">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Wages Payable (Pending)</span>
            <span className="text-lg font-extrabold text-warning mt-1 block">₹{pendingVal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search payroll ledger by staff name or role..." />
        {currentUser?.role === 'Admin' && (
          <Button variant="primary" onClick={openGenerateModal} icon={<Plus className="h-4 w-4" />}>
            Generate Monthly Payroll
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={payrollLogs}
        searchQuery={searchQuery}
        searchFields={['staffName', 'role', 'month', 'id']}
        pageSize={10}
        emptyMessage="No payroll records generated."
      />

      {/* Generate Payroll Modal */}
      <Modal isOpen={isGenerateOpen} onClose={() => setIsGenerateOpen(false)} title="Run Monthly Wages Generation" size="sm">
        <form onSubmit={handleGenerateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Payroll Month" value={formData.month} onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))} required />
            <InputField label="Payroll Year" type="number" value={formData.year} onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))} required />
          </div>

          <p className="text-[10px] text-text-muted">
            This will calculate basic wage rates, standard medical allowances (10%), and professional tax deductions (5%) for all {staff.length} staff members.
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsGenerateOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Generate Payroll</Button>
          </div>
        </form>
      </Modal>

      {/* View Payslip Modal */}
      <Modal isOpen={isPayslipOpen} onClose={() => setIsPayslipOpen(false)} title="Employee Salary Slip Breakdown" size="sm">
        {selectedLog && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-border text-center">
              <span className="font-extrabold text-sm text-text block">{selectedLog.staffName}</span>
              <span className="text-[10px] text-text-muted mt-1 block">{selectedLog.role} | Period: {selectedLog.month}</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-text-muted">Basic Salary</span>
                <span className="font-bold text-text">₹{selectedLog.basicSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-text-muted">Allowances / Bonuses</span>
                <span className="font-bold text-success">₹{(selectedLog.bonus || selectedLog.allowances || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-text-muted">Deductions (TDS / Tax)</span>
                <span className="font-bold text-danger">₹{selectedLog.deductions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-border font-extrabold text-sm text-text">
                <span>Net Salary Payable</span>
                <span>₹{(selectedLog.netSalary || selectedLog.basicSalary).toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 bg-border/20 rounded-xl border border-border text-center">
              <span className="text-[10px] font-bold text-text-muted block">Payment Clearance Status</span>
              <span className="mt-1 block"><StatusBadge status={selectedLog.status || selectedLog.paymentStatus} /></span>
            </div>

            <div className="flex justify-end pt-3 border-t border-border">
              <Button variant="ghost" onClick={() => setIsPayslipOpen(false)}>Close Slip</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
