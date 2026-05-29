import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Calendar, Clock, Edit2, XCircle, CheckCircle, RefreshCw } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';

export default function Appointments() {
  const {
    appointments,
    bookAppointment,
    updateAppointment,
    cancelAppointment,
    rescheduleAppointment,
    patients,
    doctors,
    departments
  } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Modals States
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  const [selectedApt, setSelectedApt] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    department: '',
    date: '',
    time: '',
    reason: '',
    status: 'Pending',
    notes: ''
  });

  // Reschedule Form Fields
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    time: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.patientId) errors.patientId = 'Patient selection is required';
    if (!formData.doctorId) errors.doctorId = 'Doctor selection is required';
    if (!formData.date) errors.date = 'Appointment date is required';
    if (!formData.time.trim()) errors.time = 'Appointment time is required';
    if (!formData.reason.trim()) errors.reason = 'Reason for consultation is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-fill department if doctor changes
    if (name === 'doctorId') {
      const selectedDoc = doctors.find((d) => d.id === value);
      setFormData((prev) => ({
        ...prev,
        doctorId: value,
        department: selectedDoc ? selectedDoc.department : prev.department
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const openBookModal = () => {
    setFormData({
      patientId: patients[0]?.id || '',
      doctorId: doctors[0]?.id || '',
      department: doctors[0]?.department || '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      reason: '',
      status: 'Confirmed',
      notes: ''
    });
    setFormErrors({});
    setIsBookOpen(true);
  };

  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      openBookModal();
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('action');
      setSearchParams(newParams);
    }
  }, [searchParams]);

  const handleBookSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    bookAppointment(formData);
    setIsBookOpen(false);
  };

  const openEditModal = (apt) => {
    setSelectedApt(apt);
    setFormData({ ...apt });
    setFormErrors({});
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    updateAppointment(formData);
    setIsEditOpen(false);
  };

  const openRescheduleModal = (apt) => {
    setSelectedApt(apt);
    setRescheduleData({
      date: apt.date,
      time: apt.time
    });
    setIsRescheduleOpen(true);
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!rescheduleData.date || !rescheduleData.time.trim()) return;
    rescheduleAppointment(selectedApt.id, rescheduleData.date, rescheduleData.time);
    setIsRescheduleOpen(false);
  };

  const openCancelConfirm = (apt) => {
    setSelectedApt(apt);
    setIsCancelConfirmOpen(true);
  };

  const handleCancelConfirm = () => {
    if (selectedApt) {
      cancelAppointment(selectedApt.id);
      setIsCancelConfirmOpen(false);
      setSelectedApt(null);
    }
  };

  const handleStatusQuickChange = (apt, newStatus) => {
    updateAppointment({
      ...apt,
      status: newStatus
    });
  };

  // Table Columns Setup
  const columns = [
    { header: 'Apt ID', accessor: 'id', sortable: true },
    { header: 'Patient Name', accessor: 'patientName', sortable: true },
    {
      header: 'Consultant',
      accessor: 'doctorName',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-semibold text-text block leading-none">{row.doctorName}</span>
          <span className="text-[10px] text-text-muted mt-1 block">{row.department}</span>
        </div>
      )
    },
    {
      header: 'Scheduled Date/Time',
      accessor: 'date',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-text flex items-center gap-1.5">
            <Calendar className="h-3 w-3 text-primary" />
            {row.date}
          </span>
          <span className="text-text-muted font-medium flex items-center gap-1.5 mt-0.5">
            <Clock className="h-3 w-3 text-secondary" />
            {row.time}
          </span>
        </div>
      )
    },
    {
      header: 'Reason',
      accessor: 'reason',
      render: (row) => <span className="text-xs text-text truncate block max-w-[150px]">{row.reason}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'Pending' && (
            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-success hover:bg-green-100"
              onClick={() => handleStatusQuickChange(row, 'Confirmed')}
              title="Confirm Appointment"
              icon={<CheckCircle className="h-4 w-4" />}
            />
          )}
          {row.status === 'Confirmed' && (
            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-success hover:bg-green-100"
              onClick={() => handleStatusQuickChange(row, 'Completed')}
              title="Mark Completed"
              icon={<CheckCircle className="h-4 w-4" />}
            />
          )}
          {row.status !== 'Completed' && row.status !== 'Cancelled' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 text-primary hover:bg-primary/10"
                onClick={() => openRescheduleModal(row)}
                title="Reschedule"
                icon={<RefreshCw className="h-4 w-4" />}
              />
              <Button
                variant="ghost"
                size="sm"
                className="p-1 text-secondary hover:bg-secondary/10"
                onClick={() => openEditModal(row)}
                title="Edit Details"
                icon={<Edit2 className="h-4 w-4" />}
              />
              <Button
                variant="ghost"
                size="sm"
                className="p-1 text-danger hover:bg-danger/10"
                onClick={() => openCancelConfirm(row)}
                title="Cancel Appointment"
                icon={<XCircle className="h-4 w-4" />}
              />
            </>
          )}
        </div>
      )
    }
  ];

  // Map values for Select options
  const patientOptions = patients.map((p) => ({ value: p.id, label: `${p.name} (${p.id})` }));
  const doctorOptions = doctors.map((d) => ({ value: d.id, label: `${d.name} (${d.specialization})` }));
  const departmentOptions = departments.map((d) => d.name);
  const statusOptions = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search schedules by Patient, Doctor or Reason..." />
        <Button variant="primary" onClick={openBookModal} icon={<Plus className="h-4 w-4" />}>
          Book Appointment
        </Button>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-card border border-border rounded-2xl shadow-sm">
        <FilterDropdown label="Consultation Doctor" value={doctorFilter} onChange={setDoctorFilter} options={doctors.map((d) => ({ value: d.name, label: d.name }))} />
        <FilterDropdown label="Status" value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
        <InputField type="date" label="Filter Date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="min-w-[150px] !py-0.5" />
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={appointments}
        searchQuery={searchQuery}
        searchFields={['patientName', 'doctorName', 'reason', 'id']}
        filters={{
          status: statusFilter,
          doctorName: doctorFilter,
          date: dateFilter
        }}
        pageSize={10}
        emptyMessage="No medical appointments scheduled for the selected filter."
      />

      {/* Book Appointment Modal */}
      <Modal isOpen={isBookOpen} onClose={() => setIsBookOpen(false)} title="Schedule Consultation Appointment">
        <form onSubmit={handleBookSubmit} className="space-y-4">
          <SelectField label="Select Patient File" name="patientId" value={formData.patientId} onChange={handleInputChange} options={patientOptions} error={formErrors.patientId} required />
          <SelectField label="Assign Medical Professional" name="doctorId" value={formData.doctorId} onChange={handleInputChange} options={doctorOptions} error={formErrors.doctorId} required />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Preferred Date" type="date" name="date" value={formData.date} onChange={handleInputChange} error={formErrors.date} required />
            <InputField label="Preferred Time Slot" name="timeSlot" value={formData.time} onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))} error={formErrors.time} placeholder="e.g. 10:00 AM" required />
          </div>

          <InputField label="Reason for Consultation" name="reason" value={formData.reason} onChange={handleInputChange} error={formErrors.reason} placeholder="e.g. Annual cardiovascular routine checkup" required />
          
          <SelectField label="Initial Appointment Status" name="status" value={formData.status} onChange={handleInputChange} options={statusOptions} required />

          <InputField label="Internal Notes / Directives" name="notes" value={formData.notes} onChange={handleInputChange} placeholder="e.g. Patient needs blood sugar levels tested fasting." />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsBookOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Confirm Booking</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Appointment Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Update Consultation Details">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <SelectField label="Select Patient File" name="patientId" value={formData.patientId} onChange={handleInputChange} options={patientOptions} required />
          <SelectField label="Assign Medical Professional" name="doctorId" value={formData.doctorId} onChange={handleInputChange} options={doctorOptions} required />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Scheduled Date" type="date" name="date" value={formData.date} onChange={handleInputChange} required />
            <InputField label="Scheduled Time" name="time" value={formData.time} onChange={handleInputChange} required />
          </div>

          <InputField label="Reason for Consultation" name="reason" value={formData.reason} onChange={handleInputChange} required />
          <SelectField label="Status" name="status" value={formData.status} onChange={handleInputChange} options={statusOptions} required />
          <InputField label="Internal Notes" name="notes" value={formData.notes} onChange={handleInputChange} />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* Reschedule Modal */}
      <Modal isOpen={isRescheduleOpen} onClose={() => setIsRescheduleOpen(false)} title="Reschedule Consultation Slot" size="sm">
        <form onSubmit={handleRescheduleSubmit} className="space-y-4">
          <InputField label="New Appointment Date" type="date" name="date" value={rescheduleData.date} onChange={(e) => setRescheduleData((prev) => ({ ...prev, date: e.target.value }))} required />
          <InputField label="New Time Slot" name="time" value={rescheduleData.time} onChange={(e) => setRescheduleData((prev) => ({ ...prev, time: e.target.value }))} placeholder="e.g. 02:30 PM" required />
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsRescheduleOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Confirm Reschedule</Button>
          </div>
        </form>
      </Modal>

      {/* Cancel Confirmation */}
      <ConfirmDialog
        isOpen={isCancelConfirmOpen}
        title="Cancel Appointment"
        message={`Are you sure you want to cancel the consultation scheduled for ${selectedApt?.patientName} with ${selectedApt?.doctorName}?`}
        onConfirm={handleCancelConfirm}
        onCancel={() => setIsCancelConfirmOpen(false)}
      />
    </div>
  );
}
