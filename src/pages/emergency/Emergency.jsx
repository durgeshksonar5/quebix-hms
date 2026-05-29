import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, AlertCircle, Eye, Edit2, ShieldAlert } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';

export default function Emergency() {
  const { emergencies, addEmergencyCase, updateEmergencyCase, doctors, rooms, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    emergencyType: '',
    assignedDoctorId: '',
    assignedBedId: '',
    priority: 'High',
    status: 'Admitted',
    notes: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const priorities = ['Normal', 'High', 'Critical'];
  const statuses = ['Admitted', 'Under Treatment', 'Transferred to ICU', 'Discharged'];

  const validateForm = () => {
    const errors = {};
    if (!formData.patientName.trim()) errors.patientName = 'Patient name is required';
    if (!formData.age || Number(formData.age) <= 0) errors.age = 'Provide a valid age';
    if (!formData.emergencyType.trim()) errors.emergencyType = 'Trauma/Emergency reason is required';
    if (!formData.assignedDoctorId) errors.assignedDoctorId = 'Attending Doctor is required';
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
      age: '',
      emergencyType: '',
      assignedDoctorId: doctors[0]?.id || '',
      assignedBedId: rooms.filter(r => r.status === 'Available')[0]?.id || 'None',
      priority: 'High',
      status: 'Admitted',
      notes: ''
    });
    setFormErrors({});
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const doc = doctors.find(d => d.id === formData.assignedDoctorId);
    const bed = rooms.find(r => r.id === formData.assignedBedId);

    addEmergencyCase({
      ...formData,
      age: Number(formData.age),
      assignedDoctor: doc ? doc.name : 'Unknown Doctor',
      assignedBed: bed ? `${bed.roomNumber} - ${bed.bedNumber}` : 'None'
    });
    setIsAddOpen(false);
  };

  const openEditModal = (caseItem) => {
    setSelectedCase(caseItem);
    const doctorObj = doctors.find(d => d.name === caseItem.assignedDoctor);
    const bedObj = rooms.find(r => `${r.roomNumber} - ${r.bedNumber}` === caseItem.assignedBed);

    setFormData({
      ...caseItem,
      assignedDoctorId: doctorObj ? doctorObj.id : '',
      assignedBedId: bedObj ? bedObj.id : ''
    });
    setFormErrors({});
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const doc = doctors.find(d => d.id === formData.assignedDoctorId);
    const bed = rooms.find(r => r.id === formData.assignedBedId);

    updateEmergencyCase({
      ...formData,
      age: Number(formData.age),
      assignedDoctor: doc ? doc.name : formData.assignedDoctor,
      assignedBed: bed ? `${bed.roomNumber} - ${bed.bedNumber}` : formData.assignedBed
    });
    setIsEditOpen(false);
  };

  const doctorOptions = doctors.map((d) => ({ value: d.id, label: `${d.name} (${d.specialization})` }));
  const bedOptions = [
    { value: 'None', label: 'No Bed Allocated / OPD' },
    ...rooms.filter(r => r.status === 'Available').map(r => ({ value: r.id, label: `Room ${r.roomNumber} - ${r.bedNumber} (${r.roomType})` }))
  ];

  const columns = [
    { header: 'Triage ID', accessor: 'id', sortable: true },
    { header: 'Patient Name', accessor: 'patientName', sortable: true },
    { header: 'Age', accessor: 'age' },
    { header: 'Emergency Condition', accessor: 'emergencyType', sortable: true },
    {
      header: 'Triage Priority',
      accessor: 'priority',
      sortable: true,
      render: (row) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
          row.priority === 'Critical'
            ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/40'
            : row.priority === 'High'
            ? 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/40'
            : 'bg-green-50 text-green-600 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/40'
        }`}>
          {row.priority}
        </span>
      )
    },
    { header: 'Admitted Doctor', accessor: 'assignedDoctor', sortable: true },
    { header: 'Bed Station', accessor: 'assignedBed', sortable: true },
    { header: 'Arrival Time', accessor: 'arrivalTime', sortable: true },
    {
      header: 'Triage Status',
      accessor: 'status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          {(currentUser?.role === 'Admin' || currentUser?.role === 'Doctor' || currentUser?.role === 'Receptionist') && (
            <Button variant="ghost" size="sm" className="p-1 text-secondary hover:bg-secondary/10" onClick={() => openEditModal(row)} title="Update Status">
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-1 sm:max-w-md gap-3">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search active emergency cases..." />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 bg-card border border-border rounded-xl text-xs text-text focus:outline-none"
          >
            <option value="">All Priorities</option>
            {priorities.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        {(currentUser?.role === 'Admin' || currentUser?.role === 'Receptionist' || currentUser?.role === 'Doctor') && (
          <Button variant="primary" className="bg-red-600 hover:bg-red-700 text-white border-none" onClick={openAddModal} icon={<Plus className="h-4 w-4" />}>
            Log Emergency Case
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={emergencies}
        searchQuery={searchQuery}
        searchFields={['patientName', 'emergencyType', 'assignedDoctor', 'id']}
        filters={{
          priority: priorityFilter
        }}
        pageSize={10}
        emptyMessage="No active emergency triage cases."
      />

      {/* Add Emergency Case Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Log Emergency Trauma Triage Case">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <InputField label="Patient Full Name" name="patientName" value={formData.patientName} onChange={handleInputChange} placeholder="e.g. Rahul Gupta" error={formErrors.patientName} required />
            </div>
            <InputField label="Age" type="number" name="age" value={formData.age} onChange={handleInputChange} error={formErrors.age} required />
          </div>

          <InputField label="Emergency Trauma Type" name="emergencyType" value={formData.emergencyType} onChange={handleInputChange} placeholder="e.g. Heart Attack, Head Injury from road accident" error={formErrors.emergencyType} required />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Attending Emergency Doctor" name="assignedDoctorId" value={formData.assignedDoctorId} onChange={handleInputChange} options={doctorOptions} error={formErrors.assignedDoctorId} required />
            <SelectField label="Allocate Triage Bed" name="assignedBedId" value={formData.assignedBedId} onChange={handleInputChange} options={bedOptions} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Triage Priority Level" name="priority" value={formData.priority} onChange={handleInputChange} options={priorities} required />
            <SelectField label="Admission Status" name="status" value={formData.status} onChange={handleInputChange} options={statuses} required />
          </div>

          <InputField label="Trauma Vitals / Notes" name="notes" value={formData.notes} onChange={handleInputChange} placeholder="e.g. Pulse 110, BP 90/60. Immediate oxygen given." />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Confirm Trauma Triage</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Emergency Case Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Update Emergency Status & Bed Allocations">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <InputField label="Patient Name" name="patientName" value={formData.patientName} onChange={handleInputChange} required />
            </div>
            <InputField label="Age" type="number" name="age" value={formData.age} onChange={handleInputChange} required />
          </div>

          <InputField label="Trauma Details" name="emergencyType" value={formData.emergencyType} onChange={handleInputChange} required />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Assigned Doctor" name="assignedDoctorId" value={formData.assignedDoctorId} onChange={handleInputChange} options={doctorOptions} required />
            <SelectField label="Reallocated Bed" name="assignedBedId" value={formData.assignedBedId} onChange={handleInputChange} options={bedOptions} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Priority Level" name="priority" value={formData.priority} onChange={handleInputChange} options={priorities} required />
            <SelectField label="Status" name="status" value={formData.status} onChange={handleInputChange} options={statuses} required />
          </div>

          <InputField label="Vitals / Notes" name="notes" value={formData.notes} onChange={handleInputChange} />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Update Triage</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
