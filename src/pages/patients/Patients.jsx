import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Eye, Edit2, Trash2, User, UserPlus, HeartPulse } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';

export default function Patients() {
  const { patients, addPatient, updatePatient, deletePatient } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [bloodFilter, setBloodFilter] = useState('');

  // Modals States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Selected Patient
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    insuranceProvider: 'None',
    medicalHistory: '',
    status: 'Active'
  });

  // Errors state
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.age || Number(formData.age) <= 0) errors.age = 'Provide a valid age';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Provide a valid email';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      bloodGroup: 'O+',
      phone: '',
      email: '',
      address: '',
      emergencyContact: '',
      insuranceProvider: 'None',
      medicalHistory: '',
      status: 'Active'
    });
    setFormErrors({});
    setIsAddOpen(true);
  };

  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      openAddModal();
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('action');
      setSearchParams(newParams);
    }
  }, [searchParams]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    addPatient({
      ...formData,
      age: Number(formData.age)
    });
    setIsAddOpen(false);
  };

  const openEditModal = (patient) => {
    setSelectedPatient(patient);
    setFormData({ ...patient });
    setFormErrors({});
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    updatePatient({
      ...formData,
      age: Number(formData.age)
    });
    setIsEditOpen(false);
  };

  const openViewProfile = (patient) => {
    setSelectedPatient(patient);
    setIsViewOpen(true);
  };

  const openDeleteConfirm = (patient) => {
    setSelectedPatient(patient);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedPatient) {
      deletePatient(selectedPatient.id);
      setIsDeleteOpen(false);
      setSelectedPatient(null);
    }
  };

  // Table Columns Setup
  const columns = [
    { header: 'Patient ID', accessor: 'id', sortable: true },
    {
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs select-none">
            {row.name.charAt(0)}
          </div>
          <span className="font-semibold text-text">{row.name}</span>
        </div>
      )
    },
    { header: 'Age / Gender', accessor: 'age', render: (row) => `${row.age} yrs / ${row.gender}` },
    { header: 'Blood Group', accessor: 'bloodGroup' },
    { header: 'Phone Number', accessor: 'phone' },
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
          <Button
            variant="ghost"
            size="sm"
            className="p-1 text-primary hover:bg-primary/10"
            onClick={() => openViewProfile(row)}
            icon={<Eye className="h-4 w-4" />}
          />
          <Button
            variant="ghost"
            size="sm"
            className="p-1 text-secondary hover:bg-secondary/10"
            onClick={() => openEditModal(row)}
            icon={<Edit2 className="h-4 w-4" />}
          />
          <Button
            variant="ghost"
            size="sm"
            className="p-1 text-danger hover:bg-danger/10"
            onClick={() => openDeleteConfirm(row)}
            icon={<Trash2 className="h-4 w-4" />}
          />
        </div>
      )
    }
  ];

  const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const statuses = ['Active', 'Outpatient', 'ICU', 'Discharged'];
  const genders = ['Male', 'Female', 'Other'];

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by Patient ID, Name, or Phone..."
        />

        <Button
          variant="primary"
          onClick={openAddModal}
          icon={<Plus className="h-4 w-4" />}
        >
          Add Patient
        </Button>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-card border border-border rounded-2xl shadow-sm">
        <FilterDropdown
          label="Admit Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={statuses}
        />
        <FilterDropdown
          label="Blood Group"
          value={bloodFilter}
          onChange={setBloodFilter}
          options={bloodGroups}
        />
        <FilterDropdown
          label="Gender"
          value={genderFilter}
          onChange={setGenderFilter}
          options={genders}
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={patients}
        searchQuery={searchQuery}
        searchFields={['id', 'name', 'phone', 'email']}
        filters={{
          status: statusFilter,
          bloodGroup: bloodFilter,
          gender: genderFilter
        }}
        pageSize={8}
        emptyMessage="No patient folders match the search criteria."
      />

      {/* Add Patient Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Register New Patient Folder" size="lg">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={formErrors.name}
              placeholder="e.g. Diya Nair"
              required
            />
            <InputField
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleInputChange}
              error={formErrors.age}
              placeholder="e.g. 35"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              options={genders}
              required
            />
            <SelectField
              label="Blood Group"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleInputChange}
              options={bloodGroups}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              error={formErrors.phone}
              placeholder="e.g. 9812345678"
              required
            />
            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={formErrors.email}
              placeholder="e.g. name@gmail.com"
            />
          </div>

          <InputField
            label="Home Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="e.g. Flat 102, Shanti Sadan, Mumbai"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Emergency Contact Info"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleInputChange}
              placeholder="e.g. Suresh Nair (9812345600)"
            />
            <InputField
              label="Insurance Provider"
              name="insuranceProvider"
              value={formData.insuranceProvider}
              onChange={handleInputChange}
              placeholder="e.g. Star Health Insurance"
            />
          </div>

          <InputField
            label="Medical History Summary"
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleInputChange}
            placeholder="e.g. History of chronic asthma, allergic to penicillin"
          />

          <SelectField
            label="Initial Patient Status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            options={statuses}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Record</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Patient Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Modify Patient Folder" size="lg">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={formErrors.name}
              required
            />
            <InputField
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleInputChange}
              error={formErrors.age}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              options={genders}
              required
            />
            <SelectField
              label="Blood Group"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleInputChange}
              options={bloodGroups}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              error={formErrors.phone}
              required
            />
            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={formErrors.email}
            />
          </div>

          <InputField
            label="Home Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Emergency Contact Info"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleInputChange}
            />
            <InputField
              label="Insurance Provider"
              name="insuranceProvider"
              value={formData.insuranceProvider}
              onChange={handleInputChange}
            />
          </div>

          <InputField
            label="Medical History Summary"
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleInputChange}
          />

          <SelectField
            label="Patient Status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            options={statuses}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* View Patient Details Profile Modal */}
      <Modal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Patient Medical Record" size="lg">
        {selectedPatient && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-border pb-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                {selectedPatient.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-lg font-bold text-text">{selectedPatient.name}</h4>
                <span className="text-xs font-semibold text-text-muted">ID: {selectedPatient.id} | Blood Type: {selectedPatient.bloodGroup}</span>
              </div>
              <div className="ml-auto">
                <StatusBadge status={selectedPatient.status} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <span className="text-xs font-semibold text-text-muted block">Age & Gender</span>
                <span className="font-medium text-text mt-0.5 block">{selectedPatient.age} Years old ({selectedPatient.gender})</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-text-muted block">Phone Number</span>
                <span className="font-medium text-text mt-0.5 block">{selectedPatient.phone}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-text-muted block">Email Address</span>
                <span className="font-medium text-text mt-0.5 block">{selectedPatient.email || 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-text-muted block">Emergency Contact</span>
                <span className="font-medium text-text mt-0.5 block">{selectedPatient.emergencyContact || 'None Logged'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs font-semibold text-text-muted block">Home Address</span>
                <span className="font-medium text-text mt-0.5 block">{selectedPatient.address || 'No address stored'}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-text-muted block">Insurance Carrier</span>
                <span className="font-medium text-text mt-0.5 block">{selectedPatient.insuranceProvider}</span>
              </div>
            </div>

            {/* Medical History Section */}
            <div className="p-4 bg-border/20 rounded-2xl border border-border">
              <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs uppercase tracking-wider">
                <HeartPulse className="h-4 w-4" />
                <span>Clinical Notes & Medical History</span>
              </div>
              <p className="text-sm leading-relaxed text-text">
                {selectedPatient.medicalHistory || 'No historical logs captured on this folder.'}
              </p>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <Button variant="primary" onClick={() => setIsViewOpen(false)}>Done</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Patient Record"
        message={`Are you sure you want to permanently delete the patient file for ${selectedPatient?.name}? All associated ward beds occupied by this patient will be automatically freed.`}
        confirmText="Delete File"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
