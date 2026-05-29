import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Bed, ShieldAlert, CheckCircle, RefreshCw, XCircle, LogOut } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';

export default function RoomsBeds() {
  const { rooms, addRoom, updateRoomBed, assignBed, dischargePatientBed, patients } = useApp();

  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  const [selectedBed, setSelectedBed] = useState(null);
  const [assignPatientId, setAssignPatientId] = useState('');

  // Form Fields for new Room/Bed
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: 'General Ward',
    bedNumber: '',
    chargesPerDay: 1000
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'roomType') {
        // Set standard charges per day based on type
        const charges = {
          'General Ward': 1000,
          'Semi-private Room': 1800,
          'Private Room': 3000,
          'ICU': 5000
        };
        updated.chargesPerDay = charges[value] || 1000;
      }
      return updated;
    });
  };

  const openAddRoomModal = () => {
    setFormData({
      roomNumber: '',
      roomType: 'General Ward',
      bedNumber: 'Bed 1',
      chargesPerDay: 1000
    });
    setIsAddRoomOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.roomNumber.trim() || !formData.bedNumber.trim()) return;
    addRoom({
      ...formData,
      chargesPerDay: Number(formData.chargesPerDay)
    });
    setIsAddRoomOpen(false);
  };

  const openAssignModal = (bed) => {
    setSelectedBed(bed);
    // Find first patient who is not currently admitted (status Outpatient or Discharged)
    const availablePatients = patients.filter(p => p.status !== 'Active' && p.status !== 'ICU');
    setAssignPatientId(availablePatients[0]?.id || '');
    setIsAssignOpen(true);
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!assignPatientId || !selectedBed) return;
    const success = assignBed(selectedBed.id, assignPatientId);
    if (success) {
      setIsAssignOpen(false);
      setSelectedBed(null);
    }
  };

  const handleDischarge = (bed) => {
    if (confirm(`Discharge patient ${bed.patientName} from Room ${bed.roomNumber} - ${bed.bedNumber}?`)) {
      dischargePatientBed(bed.id);
    }
  };

  const handleMaintenanceToggle = (bed) => {
    const newStatus = bed.status === 'Maintenance' ? 'Available' : 'Maintenance';
    updateRoomBed({
      ...bed,
      status: newStatus
    });
  };

  // Group rooms by Room Number
  const roomsGrouped = rooms.reduce((acc, bed) => {
    const key = bed.roomNumber;
    if (!acc[key]) {
      acc[key] = {
        roomNumber: key,
        roomType: bed.roomType,
        charges: bed.chargesPerDay,
        beds: []
      };
    }
    acc[key].beds.push(bed);
    return acc;
  }, {});

  const roomGroupsList = Object.values(roomsGrouped);

  // Stats summaries
  const totalBeds = rooms.length;
  const occupiedBeds = rooms.filter(r => r.status === 'Occupied').length;
  const availableBeds = rooms.filter(r => r.status === 'Available').length;
  const maintenanceBeds = rooms.filter(r => r.status === 'Maintenance').length;

  const roomTypes = ['General Ward', 'ICU', 'Private Room', 'Semi-private Room'];
  const outpatientList = patients.filter(p => p.status !== 'Active' && p.status !== 'ICU');
  const patientOptions = outpatientList.map(p => ({ value: p.id, label: `${p.name} (${p.id})` }));

  return (
    <div className="space-y-6">
      {/* KPI Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="p-4 bg-card border border-border rounded-2xl text-center shadow-sm">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Total Beds</span>
          <span className="text-2xl font-bold text-text mt-1.5 block">{totalBeds}</span>
        </div>
        <div className="p-4 bg-card border border-border rounded-2xl text-center shadow-sm">
          <span className="text-xs font-semibold text-success uppercase tracking-wider block">Available</span>
          <span className="text-2xl font-bold text-success mt-1.5 block">{availableBeds}</span>
        </div>
        <div className="p-4 bg-card border border-border rounded-2xl text-center shadow-sm">
          <span className="text-xs font-semibold text-danger uppercase tracking-wider block">Occupied</span>
          <span className="text-2xl font-bold text-danger mt-1.5 block">{occupiedBeds}</span>
        </div>
        <div className="p-4 bg-card border border-border rounded-2xl text-center shadow-sm">
          <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider block">Maintenance</span>
          <span className="text-2xl font-bold text-orange-500 mt-1.5 block">{maintenanceBeds}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-end gap-3">
        <Button variant="primary" onClick={openAddRoomModal} icon={<Plus className="h-4 w-4" />}>
          Add Room / Bed
        </Button>
      </div>

      {/* Wards visualization */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {roomGroupsList.map((roomGroup) => (
          <div key={roomGroup.roomNumber} className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-base text-text">Room {roomGroup.roomNumber}</h3>
                  <span className="text-xs font-semibold text-text-muted mt-0.5 block">{roomGroup.roomType}</span>
                </div>
                <span className="text-xs font-extrabold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-xl">
                  ₹{roomGroup.charges}/day
                </span>
              </div>

              {/* Beds grid inside room */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {roomGroup.beds.map((bed) => {
                  let bedClass = '';
                  if (bed.status === 'Available') {
                    bedClass = 'border-green-200 bg-green-50/40 hover:bg-green-50 dark:border-green-950/20 dark:bg-green-950/5';
                  } else if (bed.status === 'Occupied') {
                    bedClass = 'border-red-200 bg-red-50/40 dark:border-red-950/20 dark:bg-red-950/5';
                  } else {
                    bedClass = 'border-orange-200 bg-orange-50/40 dark:border-orange-950/20 dark:bg-orange-950/5';
                  }

                  return (
                    <div
                      key={bed.id}
                      className={`p-3.5 border rounded-xl flex flex-col justify-between items-center text-center transition-all ${bedClass}`}
                    >
                      <Bed className={`h-8 w-8 mb-2 ${
                        bed.status === 'Available' ? 'text-green-500' : bed.status === 'Occupied' ? 'text-red-500 animate-pulse' : 'text-orange-500'
                      }`} />
                      <span className="text-xs font-bold text-text block leading-none">{bed.bedNumber}</span>
                      
                      <div className="mt-2.5 w-full">
                        {bed.status === 'Available' ? (
                          <Button variant="outline" size="sm" className="w-full text-[10px] !py-1 text-green-700 border-green-300 hover:bg-green-100" onClick={() => openAssignModal(bed)}>
                            Admit
                          </Button>
                        ) : bed.status === 'Occupied' ? (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-text truncate block w-full" title={bed.patientName}>{bed.patientName}</span>
                            <Button variant="outline" size="sm" className="w-full text-[10px] !py-1 text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => handleDischarge(bed)} icon={<LogOut className="h-3 w-3" />}>
                              Discharge
                            </Button>
                          </div>
                        ) : (
                          <Button variant="outline" size="sm" className="w-full text-[10px] !py-1 text-orange-600 border-orange-200" onClick={() => handleMaintenanceToggle(bed)}>
                            Ready
                          </Button>
                        )}
                      </div>

                      {bed.status !== 'Occupied' && (
                        <button
                          onClick={() => handleMaintenanceToggle(bed)}
                          className="text-[9px] text-text-muted mt-2 hover:underline focus:outline-none"
                        >
                          {bed.status === 'Maintenance' ? 'Set Available' : 'Set Maintenance'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Room Modal */}
      <Modal isOpen={isAddRoomOpen} onClose={() => setIsAddRoomOpen(false)} title="Register Room / Bed Station">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <InputField label="Room Number / Block" name="roomNumber" value={formData.roomNumber} onChange={handleInputChange} placeholder="e.g. 104" required />
          <SelectField label="Room Category" name="roomType" value={formData.roomType} onChange={handleInputChange} options={roomTypes} required />
          
          <InputField label="Bed Identification Number" name="bedNumber" value={formData.bedNumber} onChange={handleInputChange} placeholder="e.g. Bed A" required />
          <InputField label="Daily Charges (₹)" type="number" name="chargesPerDay" value={formData.chargesPerDay} onChange={handleInputChange} required />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsAddRoomOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Add Station</Button>
          </div>
        </form>
      </Modal>

      {/* Assign Bed Modal */}
      <Modal isOpen={isAssignOpen} onClose={() => setIsAssignOpen(false)} title="Admit Patient to Station">
        <form onSubmit={handleAssignSubmit} className="space-y-4">
          <div className="p-3 bg-border/25 border border-border rounded-xl">
            <span className="text-[10px] text-text-muted font-bold block uppercase tracking-wider">Station Allocation</span>
            <span className="text-sm font-semibold text-text mt-1.5 block">
              Room {selectedBed?.roomNumber} - {selectedBed?.bedNumber} ({selectedBed?.roomType})
            </span>
          </div>

          {patientOptions.length > 0 ? (
            <SelectField
              label="Select Patient to Admit"
              name="assignPatientId"
              value={assignPatientId}
              onChange={(e) => setAssignPatientId(e.target.value)}
              options={patientOptions}
              placeholder="Pick patient file..."
              required
            />
          ) : (
            <div className="p-4 text-center border border-dashed border-border rounded-2xl bg-yellow-50 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-200">
              No registered outpatients or discharged files are ready for admission. Add a patient folder first.
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={patientOptions.length === 0}>Admit Patient</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
