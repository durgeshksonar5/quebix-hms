import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Truck, Navigation, Phone, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';

export default function Ambulance() {
  const { ambulances, addAmbulance, updateAmbulance, dispatchAmbulance, updateAmbulanceStatus, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [selectedAmb, setSelectedAmb] = useState(null);

  const [formData, setFormData] = useState({
    vehicleNumber: '',
    driverName: '',
    driverPhone: '',
    currentLocation: '',
    status: 'Available',
    notes: ''
  });

  const [dispatchData, setDispatchData] = useState({
    driverName: '',
    patientName: '',
    location: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const statuses = ['Available', 'On Duty', 'Maintenance'];

  const validateForm = () => {
    const errors = {};
    if (!formData.vehicleNumber.trim()) errors.vehicleNumber = 'Vehicle registration number is required';
    if (!formData.driverName.trim()) errors.driverName = 'Driver Name is required';
    if (!formData.driverPhone.trim()) errors.driverPhone = 'Driver Phone is required';
    if (!formData.currentLocation.trim()) errors.currentLocation = 'Initial location is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({
      vehicleNumber: '',
      driverName: '',
      driverPhone: '',
      currentLocation: 'Quebix Hospital Compound',
      status: 'Available',
      notes: ''
    });
    setFormErrors({});
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    addAmbulance({
      ...formData,
      assignedEmergencyCase: 'None'
    });
    setIsAddOpen(false);
  };

  const openDispatchModal = (amb) => {
    setSelectedAmb(amb);
    setDispatchData({
      driverName: amb.driverName,
      patientName: '',
      location: ''
    });
    setIsDispatchOpen(true);
  };

  const handleDispatchSubmit = (e) => {
    e.preventDefault();
    if (!dispatchData.patientName.trim() || !dispatchData.location.trim()) return;

    dispatchAmbulance(
      selectedAmb.id,
      dispatchData.driverName,
      dispatchData.patientName,
      dispatchData.location
    );
    setIsDispatchOpen(false);
  };

  // Calculations
  const availableCount = ambulances.filter(a => a.status === 'Available').length;
  const onDutyCount = ambulances.filter(a => a.status === 'On Duty' || a.status === 'Dispatched').length;
  const maintenanceCount = ambulances.filter(a => a.status === 'Maintenance').length;

  const columns = [
    { header: 'Vehicle ID', accessor: 'id', sortable: true },
    { header: 'Registration No.', accessor: 'vehicleNumber', sortable: true },
    { header: 'Driver Name', accessor: 'driverName', sortable: true },
    {
      header: 'Driver Contact',
      render: (row) => (
        <span className="flex items-center gap-1 text-xs text-text">
          <Phone className="h-3.5 w-3.5 text-text-muted" /> {row.driverPhone}
        </span>
      )
    },
    {
      header: 'Current Location',
      render: (row) => (
        <span className="flex items-center gap-1 text-xs text-text-muted">
          <Navigation className="h-3.5 w-3.5 text-primary flex-shrink-0" /> {row.currentLocation}
        </span>
      )
    },
    {
      header: 'Vehicle Status',
      accessor: 'status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status === 'Dispatched' ? 'On Duty' : row.status} />
    },
    {
      header: 'Deployment details',
      accessor: 'currentAssignment',
      render: (row) => <span className="text-[10px] text-text max-w-[150px] truncate block">{row.currentAssignment || 'Standing by'}</span>
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          {(currentUser?.role === 'Admin' || currentUser?.role === 'Receptionist') && row.status === 'Available' && (
            <Button variant="ghost" size="sm" className="p-1 text-primary hover:bg-primary/10" onClick={() => openDispatchModal(row)}>
              Dispatch
            </Button>
          )}
          {(currentUser?.role === 'Admin' || currentUser?.role === 'Receptionist') && row.status !== 'Available' && (
            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-success hover:bg-green-150"
              onClick={() => {
                updateAmbulanceStatus(row.id, 'Available');
                updateAmbulance({ ...row, status: 'Available', currentAssignment: 'Standing by' });
              }}
            >
              Set Available
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Fleet Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded-xl">
            <CheckCircle className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Fleet Standing By</span>
            <span className="text-lg font-extrabold text-success mt-1 block">{availableCount} Ambulances</span>
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Fleet Dispatched</span>
            <span className="text-lg font-extrabold text-text mt-1 block">{onDutyCount} Out on Calls</span>
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-yellow-100 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400 rounded-xl">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Fleet In Service Shop</span>
            <span className="text-lg font-extrabold text-warning mt-1 block">{maintenanceCount} Ambulances</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search ambulance dispatch fleet logs..." />
        {(currentUser?.role === 'Admin' || currentUser?.role === 'Receptionist') && (
          <Button variant="primary" onClick={openAddModal} icon={<Plus className="h-4 w-4" />}>
            Register Vehicle
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={ambulances}
        searchQuery={searchQuery}
        searchFields={['vehicleNumber', 'driverName', 'driverPhone', 'id']}
        pageSize={10}
        emptyMessage="No ambulances registered in Fleet database."
      />

      {/* Add Ambulance Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Register Emergency Ambulance Fleet Vehicle">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <InputField label="Vehicle Registration Number" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleInputChange} placeholder="e.g. MH-12-PQ-9988" error={formErrors.vehicleNumber} required />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Driver Full Name" name="driverName" value={formData.driverName} onChange={handleInputChange} placeholder="e.g. Karan Malhotra" error={formErrors.driverName} required />
            <InputField label="Driver Phone Number" name="driverPhone" value={formData.driverPhone} onChange={handleInputChange} placeholder="e.g. 9876543001" error={formErrors.driverPhone} required />
          </div>

          <InputField label="Vehicle Base / Initial Location" name="currentLocation" value={formData.currentLocation} onChange={handleInputChange} placeholder="e.g. Hospital Compound Gate 2" error={formErrors.currentLocation} required />
          <SelectField label="Fleet Status" name="status" value={formData.status} onChange={handleInputChange} options={statuses} required />
          <InputField label="Fleet Vehicle Notes" name="notes" value={formData.notes} onChange={handleInputChange} placeholder="e.g. Equipped with ALS Kit, defibrillator." />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Add Fleet Vehicle</Button>
          </div>
        </form>
      </Modal>

      {/* Dispatch Ambulance Modal */}
      <Modal isOpen={isDispatchOpen} onClose={() => setIsDispatchOpen(false)} title="Dispatch Emergency EMS Vehicle" size="sm">
        <form onSubmit={handleDispatchSubmit} className="space-y-4">
          <InputField label="Assigned Driver Name" name="driverName" value={dispatchData.driverName} onChange={(e) => setDispatchData(prev => ({ ...prev, driverName: e.target.value }))} required disabled />
          <InputField label="Emergency Patient Name" name="patientName" value={dispatchData.patientName} onChange={(e) => setDispatchData(prev => ({ ...prev, patientName: e.target.value }))} placeholder="e.g. Diya Nair" required />
          <InputField label="Trauma Pickup Location Address" name="location" value={dispatchData.location} onChange={(e) => setDispatchData(prev => ({ ...prev, location: e.target.value }))} placeholder="e.g. Sector 12, Pune Road" required />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsDispatchOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="bg-red-600 hover:bg-red-700 border-none">Dispatch Now</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
