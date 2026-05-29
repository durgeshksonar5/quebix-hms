import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Calendar, Clock, Edit2, Trash2, Home } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';

export default function DoctorSchedule() {
  const { schedules, addSchedule, updateSchedule, deleteSchedule, doctors, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const [formData, setFormData] = useState({
    doctorId: '',
    dayOfWeek: 'Monday',
    startTime: '09:00 AM',
    endTime: '01:00 PM',
    maxPatients: 15,
    roomNumber: 'OPD-1'
  });

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.doctorId) errors.doctorId = 'Doctor is required';
    if (!formData.startTime.trim()) errors.startTime = 'Start time is required';
    if (!formData.endTime.trim()) errors.endTime = 'End time is required';
    if (!formData.maxPatients || Number(formData.maxPatients) <= 0) errors.maxPatients = 'Provide maximum patients limit';
    if (!formData.roomNumber.trim()) errors.roomNumber = 'OPD Room is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({
      doctorId: doctors[0]?.id || '',
      dayOfWeek: 'Monday',
      startTime: '09:00 AM',
      endTime: '01:00 PM',
      maxPatients: 15,
      roomNumber: 'OPD-1'
    });
    setFormErrors({});
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const doc = doctors.find(d => d.id === formData.doctorId);
    addSchedule({
      ...formData,
      doctorName: doc ? doc.name : 'Unknown Doctor',
      maxPatients: Number(formData.maxPatients)
    });
    setIsAddOpen(false);
  };

  const openEditModal = (sch) => {
    setSelectedSchedule(sch);
    setFormData({ ...sch });
    setFormErrors({});
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const doc = doctors.find(d => d.id === formData.doctorId);
    updateSchedule({
      ...formData,
      doctorName: doc ? doc.name : formData.doctorName,
      maxPatients: Number(formData.maxPatients)
    });
    setIsEditOpen(false);
  };

  const doctorOptions = doctors.map((d) => ({ value: d.id, label: `${d.name} (${d.specialization})` }));
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const columns = [
    { header: 'Schedule ID', accessor: 'id', sortable: true },
    { header: 'Doctor Name', accessor: 'doctorName', sortable: true },
    { header: 'OPD Day', accessor: 'dayOfWeek', sortable: true },
    {
      header: 'OPD Hours',
      render: (row) => (
        <span className="flex items-center gap-1.5 text-xs text-text font-medium">
          <Clock className="h-3.5 w-3.5 text-primary" /> {row.startTime} - {row.endTime}
        </span>
      )
    },
    { header: 'Max Token Limit', accessor: 'maxPatients', sortable: true },
    {
      header: 'OPD Room',
      render: (row) => (
        <span className="flex items-center gap-1.5 text-xs text-text">
          <Home className="h-3.5 w-3.5 text-secondary" /> {row.roomNumber}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          {currentUser?.role === 'Admin' && (
            <>
              <Button variant="ghost" size="sm" className="p-1 text-secondary hover:bg-secondary/10" onClick={() => openEditModal(row)}>
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1 text-danger hover:bg-danger/10" onClick={() => deleteSchedule(row.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search doctor scheduling profiles..." />
        {currentUser?.role === 'Admin' && (
          <Button variant="primary" onClick={openAddModal} icon={<Plus className="h-4 w-4" />}>
            Configure Doctor Shift
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={schedules}
        searchQuery={searchQuery}
        searchFields={['doctorName', 'dayOfWeek', 'roomNumber']}
        pageSize={10}
        emptyMessage="No schedules configured."
      />

      {/* Add Schedule Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Configure Doctor Schedule Shift">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <SelectField label="Select Doctor" name="doctorId" value={formData.doctorId} onChange={handleInputChange} options={doctorOptions} error={formErrors.doctorId} required />
          <SelectField label="Session Day" name="dayOfWeek" value={formData.dayOfWeek} onChange={handleInputChange} options={days} required />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Start Time (OPD)" name="startTime" value={formData.startTime} onChange={handleInputChange} placeholder="e.g. 09:00 AM" error={formErrors.startTime} required />
            <InputField label="End Time (OPD)" name="endTime" value={formData.endTime} onChange={handleInputChange} placeholder="e.g. 01:00 PM" error={formErrors.endTime} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Max Patients Capacity" type="number" name="maxPatients" value={formData.maxPatients} onChange={handleInputChange} error={formErrors.maxPatients} required />
            <InputField label="OPD Consultation Room" name="roomNumber" value={formData.roomNumber} onChange={handleInputChange} placeholder="e.g. Room 102" error={formErrors.roomNumber} required />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Register Shift</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Schedule Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Modify Session Settings">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <SelectField label="Select Doctor" name="doctorId" value={formData.doctorId} onChange={handleInputChange} options={doctorOptions} required />
          <SelectField label="Session Day" name="dayOfWeek" value={formData.dayOfWeek} onChange={handleInputChange} options={days} required />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Start Time (OPD)" name="startTime" value={formData.startTime} onChange={handleInputChange} required />
            <InputField label="End Time (OPD)" name="endTime" value={formData.endTime} onChange={handleInputChange} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Max Patients Capacity" type="number" name="maxPatients" value={formData.maxPatients} onChange={handleInputChange} required />
            <InputField label="OPD Consultation Room" name="roomNumber" value={formData.roomNumber} onChange={handleInputChange} required />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
