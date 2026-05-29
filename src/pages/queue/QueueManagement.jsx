import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Users, CheckCircle, Clock, Volume2, UserCheck } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';

export default function QueueManagement() {
  const { queueTokens, generateToken, updateTokenStatus, departments, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [formData, setFormData] = useState({
    patientName: '',
    department: 'General Medicine',
    priority: 'Normal'
  });

  const [formErrors, setFormErrors] = useState({});

  const priorities = ['Normal', 'High', 'Critical'];

  const validateForm = () => {
    const errors = {};
    if (!formData.patientName.trim()) errors.patientName = 'Patient Name is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({
      patientName: '',
      department: departments[0]?.name || 'General Medicine',
      priority: 'Normal'
    });
    setFormErrors({});
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    generateToken(formData.patientName, formData.department, formData.priority);
    setIsAddOpen(false);
  };

  // Calculations
  const waitingTokens = queueTokens.filter(t => t.status === 'Waiting');
  const servingToken = queueTokens.find(t => t.status === 'Serving');

  const columns = [
    { header: 'Token ID', accessor: 'id', sortable: true },
    {
      header: 'Token Code',
      accessor: 'tokenNumber',
      sortable: true,
      render: (row) => (
        <span className="px-2.5 py-1 bg-primary/10 text-primary font-extrabold rounded-lg text-xs leading-none">
          {row.tokenNumber}
        </span>
      )
    },
    { header: 'Patient Name', accessor: 'patientName', sortable: true },
    { header: 'OPD Department', accessor: 'department', sortable: true },
    { header: 'Time Issued', accessor: 'createdTime' },
    {
      header: 'Triage Priority',
      accessor: 'priority',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
          row.priority === 'Critical'
            ? 'bg-red-100 text-red-700'
            : row.priority === 'High'
            ? 'bg-orange-100 text-orange-700'
            : 'bg-green-100 text-green-700'
        }`}>
          {row.priority || 'Normal'}
        </span>
      )
    },
    {
      header: 'Queue Status',
      accessor: 'status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          {(currentUser?.role === 'Admin' || currentUser?.role === 'Receptionist' || currentUser?.role === 'Doctor') && row.status === 'Waiting' && (
            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-success hover:bg-green-50 flex items-center gap-1"
              onClick={() => {
                // Call voice announcement
                if ('speechSynthesis' in window) {
                  const speak = new SpeechSynthesisUtterance(`Token number ${row.tokenNumber}, patient ${row.patientName}, please proceed to ${row.department}`);
                  window.speechSynthesis.speak(speak);
                }
                updateTokenStatus(row.id, 'Serving');
              }}
              title="Call Patient"
            >
              <Volume2 className="h-4 w-4" /> Call
            </Button>
          )}
          {(currentUser?.role === 'Admin' || currentUser?.role === 'Receptionist' || currentUser?.role === 'Doctor') && row.status === 'Serving' && (
            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-primary hover:bg-blue-50"
              onClick={() => updateTokenStatus(row.id, 'Completed')}
              title="Finish Treatment"
              icon={<CheckCircle className="h-4 w-4" />}
            />
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Realtime Queue Monitor Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-primary/5 p-6 rounded-3xl border border-primary/20 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary text-white rounded-2xl">
            <Volume2 className="h-8 w-8 animate-bounce" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">Currently Calling</span>
            <h3 className="text-xl font-extrabold text-text mt-1">
              {servingToken ? `${servingToken.tokenNumber} - ${servingToken.patientName}` : 'No Active OPD Session'}
            </h3>
            <span className="text-xs text-text-muted mt-1 block">
              {servingToken ? `Proceed to ${servingToken.department} OPD` : 'Standing by'}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center bg-card border border-border p-4 rounded-2xl">
          <div>
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold block">Patients In Queue</span>
            <span className="text-xl font-extrabold text-text mt-1 block">{waitingTokens.length} Patients Waiting</span>
          </div>
          <Users className="h-8 w-8 text-primary/40" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-1 sm:max-w-md gap-3">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search active queue tokens..." />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 bg-card border border-border rounded-xl text-xs text-text focus:outline-none"
          >
            <option value="">All OPD Units</option>
            {departments.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
          </select>
        </div>
        {(currentUser?.role === 'Admin' || currentUser?.role === 'Receptionist') && (
          <Button variant="primary" onClick={openAddModal} icon={<Plus className="h-4 w-4" />}>
            Issue New Token
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={queueTokens}
        searchQuery={searchQuery}
        searchFields={['patientName', 'tokenNumber', 'department', 'id']}
        filters={{
          department: deptFilter
        }}
        pageSize={10}
        emptyMessage="OPD Token queue is empty."
      />

      {/* Issue Token Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Issue Token Queue Slip">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <InputField label="Patient Full Name" name="patientName" value={formData.patientName} onChange={handleInputChange} placeholder="e.g. Diya Nair" error={formErrors.patientName} required />
          <SelectField label="OPD Department Unit" name="department" value={formData.department} onChange={handleInputChange} options={departments.map(d => d.name)} required />
          <SelectField label="Triage Priority Level" name="priority" value={formData.priority} onChange={handleInputChange} options={priorities} required />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Generate Slip</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
