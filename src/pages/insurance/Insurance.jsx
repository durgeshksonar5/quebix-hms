import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Shield, DollarSign, CheckCircle2, XCircle, AlertCircle, Calendar } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';

export default function Insurance() {
  const { claims, addClaim, updateClaimStatus, patients, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [formData, setFormData] = useState({
    patientName: '',
    providerName: 'Star Health Insurance',
    policyNumber: '',
    claimAmount: '',
    notes: '',
    status: 'Pending'
  });

  const [formErrors, setFormErrors] = useState({});

  const providers = [
    'Star Health Insurance',
    'HDFC Ergo Health',
    'LIC Health Shield',
    'ICICI Lombard',
    'Bajaj Allianz',
    'None'
  ];

  const validateForm = () => {
    const errors = {};
    if (!formData.patientName.trim()) errors.patientName = 'Patient Name is required';
    if (!formData.policyNumber.trim()) errors.policyNumber = 'Policy number is required';
    if (!formData.claimAmount || Number(formData.claimAmount) <= 0) errors.claimAmount = 'Provide valid claim amount';
    if (!formData.notes.trim()) errors.notes = 'Brief cover notes are required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({
      patientName: patients[0]?.name || '',
      providerName: 'Star Health Insurance',
      policyNumber: '',
      claimAmount: '',
      notes: '',
      status: 'Pending'
    });
    setFormErrors({});
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    addClaim({
      ...formData,
      claimAmount: Number(formData.claimAmount),
      approvedAmount: 0
    });
    setIsAddOpen(false);
  };

  // Calculations
  const totalClaimsVal = claims.reduce((sum, c) => sum + c.claimAmount, 0);
  const approvedClaimsVal = claims.filter(c => c.status === 'Approved').reduce((sum, c) => sum + (c.approvedAmount || c.claimAmount), 0);
  const pendingClaimsCount = claims.filter(c => c.status === 'Pending' || c.status === 'Submitted').length;

  const columns = [
    { header: 'Claim ID', accessor: 'id', sortable: true },
    { header: 'Patient Name', accessor: 'patientName', sortable: true },
    { header: 'Provider', accessor: 'providerName', sortable: true },
    { header: 'Policy No.', accessor: 'policyNumber', sortable: true },
    {
      header: 'Requested Amount',
      accessor: 'claimAmount',
      sortable: true,
      render: (row) => <span className="font-semibold text-text">₹{row.claimAmount.toLocaleString()}</span>
    },
    {
      header: 'Approved Amount',
      accessor: 'approvedAmount',
      render: (row) => (
        <span className={`font-semibold ${row.status === 'Approved' ? 'text-success' : 'text-text-muted'}`}>
          ₹{row.approvedAmount ? row.approvedAmount.toLocaleString() : '0'}
        </span>
      )
    },
    { header: 'Date Filed', accessor: 'filedDate', sortable: true },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          {(currentUser?.role === 'Admin' || currentUser?.role === 'Receptionist') && (row.status === 'Pending' || row.status === 'Submitted') && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 text-success hover:bg-green-50"
                onClick={() => {
                  const amt = prompt(`Enter approved cover amount (Requested: ₹${row.claimAmount}):`, row.claimAmount);
                  if (amt !== null) {
                    updateClaimStatus(row.id, 'Approved');
                    // Add approved amount update local state hook or context trigger
                  }
                }}
                title="Approve Claim"
                icon={<CheckCircle2 className="h-4 w-4" />}
              />
              <Button
                variant="ghost"
                size="sm"
                className="p-1 text-danger hover:bg-red-50"
                onClick={() => {
                  if (confirm('Are you sure you want to reject this insurance claim?')) {
                    updateClaimStatus(row.id, 'Rejected');
                  }
                }}
                title="Reject Claim"
                icon={<XCircle className="h-4 w-4" />}
              />
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Total Filed Claims</span>
            <span className="text-lg font-extrabold text-text mt-1 block">₹{totalClaimsVal.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded-xl">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Total Approved Cover</span>
            <span className="text-lg font-extrabold text-success mt-1 block">₹{approvedClaimsVal.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-yellow-100 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400 rounded-xl">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Pending Processing</span>
            <span className="text-lg font-extrabold text-warning mt-1 block">{pendingClaimsCount} Claims</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search claims ledger by patient, provider or policy..." />
        {(currentUser?.role === 'Admin' || currentUser?.role === 'Receptionist') && (
          <Button variant="primary" onClick={openAddModal} icon={<Plus className="h-4 w-4" />}>
            File Insurance Claim
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={claims}
        searchQuery={searchQuery}
        searchFields={['patientName', 'providerName', 'policyNumber', 'id']}
        pageSize={10}
        emptyMessage="No insurance claim logs filed."
      />

      {/* Add Claim Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="File Insurance Coverage Claim">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <InputField
            label="Patient Full Name"
            name="patientName"
            value={formData.patientName}
            onChange={handleInputChange}
            placeholder="e.g. Vikram Singh"
            error={formErrors.patientName}
            required
          />
          <SelectField label="Insurance Provider" name="providerName" value={formData.providerName} onChange={handleInputChange} options={providers.filter(p => p !== 'None')} required />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Policy Certificate Number" name="policyNumber" value={formData.policyNumber} onChange={handleInputChange} placeholder="e.g. POL-882211" error={formErrors.policyNumber} required />
            <InputField label="Claim Amount Requested (₹)" type="number" name="claimAmount" value={formData.claimAmount} onChange={handleInputChange} error={formErrors.claimAmount} required />
          </div>

          <InputField label="Claim Assessment Notes" name="notes" value={formData.notes} onChange={handleInputChange} placeholder="e.g. Emergency ward admission invoice clearance request." error={formErrors.notes} required />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">File Claim</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
