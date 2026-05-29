import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Edit2, Trash2, Phone, Mail, Clock, Award, ShieldAlert } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';

export default function Doctors() {
  const { doctors, addDoctor, updateDoctor, deleteDoctor, departments } = useApp();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    department: '',
    qualification: '',
    experience: '',
    phone: '',
    email: '',
    availabilityDays: [],
    timeSlot: '',
    consultationFee: '',
    status: 'Active'
  });

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Doctor name is required';
    if (!formData.specialization.trim()) errors.specialization = 'Specialization is required';
    if (!formData.department) errors.department = 'Department is required';
    if (!formData.qualification.trim()) errors.qualification = 'Qualification is required';
    if (!formData.experience.trim()) errors.experience = 'Experience duration is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Provide a valid email';
    if (formData.availabilityDays.length === 0) errors.availabilityDays = 'Select at least one day';
    if (!formData.timeSlot.trim()) errors.timeSlot = 'Time slot is required';
    if (!formData.consultationFee || Number(formData.consultationFee) < 0) errors.consultationFee = 'Consultation fee is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => {
      const days = [...prev.availabilityDays];
      if (days.includes(day)) {
        return { ...prev, availabilityDays: days.filter((d) => d !== day) };
      } else {
        return { ...prev, availabilityDays: [...days, day] };
      }
    });
  };

  const openAddModal = () => {
    setFormData({
      name: '',
      specialization: '',
      department: departments[0]?.name || '',
      qualification: '',
      experience: '',
      phone: '',
      email: '',
      availabilityDays: ['Mon', 'Wed', 'Fri'],
      timeSlot: '09:00 AM - 01:00 PM',
      consultationFee: 500,
      status: 'Active'
    });
    setFormErrors({});
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    addDoctor({
      ...formData,
      consultationFee: Number(formData.consultationFee)
    });
    setIsAddOpen(false);
  };

  const openEditModal = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({ ...doctor });
    setFormErrors({});
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    updateDoctor({
      ...formData,
      consultationFee: Number(formData.consultationFee)
    });
    setIsEditOpen(false);
  };

  const openDeleteConfirm = (doctor) => {
    setSelectedDoctor(doctor);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedDoctor) {
      deleteDoctor(selectedDoctor.id);
      setIsDeleteOpen(false);
      setSelectedDoctor(null);
    }
  };

  const openViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setIsViewOpen(true);
  };

  // Table Columns
  const columns = [
    { header: 'ID', accessor: 'id', sortable: true },
    {
      header: 'Doctor Name',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs select-none">
            {row.name.replace('Dr. ', '').charAt(0)}
          </div>
          <div>
            <span className="font-semibold text-text block leading-none">{row.name}</span>
            <span className="text-[10px] text-text-muted mt-1 block">{row.specialization}</span>
          </div>
        </div>
      )
    },
    { header: 'Department', accessor: 'department', sortable: true },
    { header: 'Shift / Hours', accessor: 'timeSlot' },
    { header: 'Fee', accessor: 'consultationFee', render: (row) => `₹${row.consultationFee}` },
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
          <Button variant="ghost" size="sm" className="p-1 text-primary hover:bg-primary/10" onClick={() => openViewDetails(row)} icon={<Award className="h-4 w-4" />} />
          <Button variant="ghost" size="sm" className="p-1 text-secondary hover:bg-secondary/10" onClick={() => openEditModal(row)} icon={<Edit2 className="h-4 w-4" />} />
          <Button variant="ghost" size="sm" className="p-1 text-danger hover:bg-danger/10" onClick={() => openDeleteConfirm(row)} icon={<Trash2 className="h-4 w-4" />} />
        </div>
      )
    }
  ];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const departmentOptions = departments.map((d) => d.name);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search doctors by ID, Name or Specialization..." />
        <Button variant="primary" onClick={openAddModal} icon={<Plus className="h-4 w-4" />}>
          Add Doctor
        </Button>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-card border border-border rounded-2xl shadow-sm">
        <FilterDropdown label="Filter Department" value={deptFilter} onChange={setDeptFilter} options={departmentOptions} />
        <FilterDropdown label="Duty Status" value={statusFilter} onChange={setStatusFilter} options={['Active', 'On Leave']} />
      </div>

      {/* Grid List */}
      <DataTable
        columns={columns}
        data={doctors}
        searchQuery={searchQuery}
        searchFields={['id', 'name', 'specialization', 'department']}
        filters={{
          department: deptFilter,
          status: statusFilter
        }}
        pageSize={8}
        emptyMessage="No doctors matching the selected parameters."
      />

      {/* Add Doctor Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Register Physician" size="lg">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Doctor Name" name="name" value={formData.name} onChange={handleInputChange} error={formErrors.name} placeholder="e.g. Dr. Priya Sharma" required />
            <InputField label="Specialization / Area" name="specialization" value={formData.specialization} onChange={handleInputChange} error={formErrors.specialization} placeholder="e.g. Pediatric Cardiologist" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Department Unit" name="department" value={formData.department} onChange={handleInputChange} options={departmentOptions} error={formErrors.department} required />
            <InputField label="Qualification" name="qualification" value={formData.qualification} onChange={handleInputChange} error={formErrors.qualification} placeholder="e.g. MD, DM Cardiology" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Experience" name="experience" value={formData.experience} onChange={handleInputChange} error={formErrors.experience} placeholder="e.g. 10 Years" required />
            <InputField label="Consultation Fee (₹)" type="number" name="consultationFee" value={formData.consultationFee} onChange={handleInputChange} error={formErrors.consultationFee} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} error={formErrors.phone} placeholder="e.g. 9876543210" required />
            <InputField label="Email Address" type="email" name="email" value={formData.email} onChange={handleInputChange} error={formErrors.email} placeholder="e.g. name@quebixhms.com" required />
          </div>

          <InputField label="Routine Duty Shift / Hours" name="timeSlot" value={formData.timeSlot} onChange={handleInputChange} error={formErrors.timeSlot} placeholder="e.g. 09:00 AM - 01:00 PM" required />

          {/* Availability days selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-muted">Weekly Availability Days <span className="text-danger">*</span></label>
            <div className="flex flex-wrap gap-2">
              {weekDays.map((day) => {
                const isSelected = formData.availabilityDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-sm shadow-primary/10'
                        : 'border-border text-text hover:bg-border/30'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            {formErrors.availabilityDays && <span className="text-xs text-danger font-semibold">{formErrors.availabilityDays}</span>}
          </div>

          <SelectField label="Duty Status" name="status" value={formData.status} onChange={handleInputChange} options={['Active', 'On Leave']} required />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Register Doctor</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Doctor Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Modify Doctor Information" size="lg">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Doctor Name" name="name" value={formData.name} onChange={handleInputChange} error={formErrors.name} required />
            <InputField label="Specialization" name="specialization" value={formData.specialization} onChange={handleInputChange} error={formErrors.specialization} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Department Unit" name="department" value={formData.department} onChange={handleInputChange} options={departmentOptions} required />
            <InputField label="Qualification" name="qualification" value={formData.qualification} onChange={handleInputChange} error={formErrors.qualification} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Experience" name="experience" value={formData.experience} onChange={handleInputChange} error={formErrors.experience} required />
            <InputField label="Consultation Fee (₹)" type="number" name="consultationFee" value={formData.consultationFee} onChange={handleInputChange} error={formErrors.consultationFee} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} error={formErrors.phone} required />
            <InputField label="Email Address" type="email" name="email" value={formData.email} onChange={handleInputChange} error={formErrors.email} required />
          </div>

          <InputField label="Shift hours" name="timeSlot" value={formData.timeSlot} onChange={handleInputChange} error={formErrors.timeSlot} required />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-muted">Weekly Availability Days</label>
            <div className="flex flex-wrap gap-2">
              {weekDays.map((day) => {
                const isSelected = formData.availabilityDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-sm shadow-primary/10'
                        : 'border-border text-text hover:bg-border/30'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            {formErrors.availabilityDays && <span className="text-xs text-danger font-semibold">{formErrors.availabilityDays}</span>}
          </div>

          <SelectField label="Duty Status" name="status" value={formData.status} onChange={handleInputChange} options={['Active', 'On Leave']} required />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* View Doctor Profile Modal */}
      <Modal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Physician Profile Details">
        {selectedDoctor && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-border pb-4">
              <div className="h-14 w-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xl">
                {selectedDoctor.name.replace('Dr. ', '').charAt(0)}
              </div>
              <div>
                <h4 className="text-lg font-bold text-text">{selectedDoctor.name}</h4>
                <span className="text-xs font-semibold text-text-muted">{selectedDoctor.qualification} | {selectedDoctor.specialization}</span>
              </div>
              <div className="ml-auto">
                <StatusBadge status={selectedDoctor.status} />
              </div>
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="flex items-center gap-3">
                <Award className="h-4.5 w-4.5 text-text-muted" />
                <span className="text-text-muted">Experience: <strong className="text-text font-bold">{selectedDoctor.experience}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4.5 w-4.5 text-text-muted" />
                <span className="text-text-muted">Contact: <strong className="text-text font-bold">{selectedDoctor.phone}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4.5 w-4.5 text-text-muted" />
                <span className="text-text-muted">Email: <strong className="text-text font-bold">{selectedDoctor.email}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4.5 w-4.5 text-text-muted" />
                <span className="text-text-muted">Shift Time: <strong className="text-text font-bold">{selectedDoctor.timeSlot}</strong></span>
              </div>
            </div>

            <div className="p-4 bg-border/20 rounded-2xl border border-border">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">Days of Practice</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedDoctor.availabilityDays.map((day) => (
                  <span key={day} className="px-2.5 py-1 bg-primary/10 text-primary font-bold text-xs rounded-xl border border-primary/20">
                    {day}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border">
              <span className="text-sm font-semibold text-text-muted">Consultation Fee: <strong className="text-text font-extrabold text-base">₹{selectedDoctor.consultationFee}</strong></span>
              <Button variant="primary" onClick={() => setIsViewOpen(false)}>Done</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Remove Physician"
        message={`Are you sure you want to delete the clinical record for ${selectedDoctor?.name}?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
