import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, FileText, Heart, Activity, Trash2, Edit2, ShieldAlert } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';

export default function EMR() {
  const { emrList, addEMR, updateEMR, deleteEMR, patients, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedEMR, setSelectedEMR] = useState(null);

  const [formData, setFormData] = useState({
    patientId: '',
    bloodPressure: '120/80',
    heartRate: '72',
    oxygenLevel: '98',
    diagnosis: '',
    complaints: '',
    treatmentPlan: '',
    doctorName: currentUser?.name || 'Dr. Self'
  });

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.patientId) errors.patientId = 'Patient selection is required';
    if (!formData.diagnosis.trim()) errors.diagnosis = 'Diagnosis is required';
    if (!formData.complaints.trim()) errors.complaints = 'Chief complaints are required';
    if (!formData.treatmentPlan.trim()) errors.treatmentPlan = 'Treatment plan is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({
      patientId: patients[0]?.id || '',
      bloodPressure: '120/80',
      heartRate: '72',
      oxygenLevel: '98',
      diagnosis: '',
      complaints: '',
      treatmentPlan: '',
      doctorName: currentUser?.name || 'Dr. Self'
    });
    setFormErrors({});
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const patient = patients.find(p => p.id === formData.patientId);
    addEMR({
      ...formData,
      patientName: patient ? patient.name : 'Unknown Patient',
      heartRate: Number(formData.heartRate),
      oxygenLevel: Number(formData.oxygenLevel)
    });
    setIsAddOpen(false);
  };

  const openEditModal = (emr) => {
    setSelectedEMR(emr);
    setFormData({ ...emr });
    setFormErrors({});
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const patient = patients.find(p => p.id === formData.patientId);
    updateEMR({
      ...formData,
      patientName: patient ? patient.name : formData.patientName,
      heartRate: Number(formData.heartRate),
      oxygenLevel: Number(formData.oxygenLevel)
    });
    setIsEditOpen(false);
  };

  const openViewModal = (emr) => {
    setSelectedEMR(emr);
    setIsViewOpen(true);
  };

  const patientOptions = patients.map((p) => ({ value: p.id, label: `${p.name} (${p.id})` }));

  const columns = [
    { header: 'EMR ID', accessor: 'id', sortable: true },
    { header: 'Patient Name', accessor: 'patientName', sortable: true },
    { header: 'Diagnosis', accessor: 'diagnosis', sortable: true },
    {
      header: 'Vitals Checked',
      render: (row) => (
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1 font-semibold text-red-500">
            <Heart className="h-3 w-3" /> {row.heartRate} bpm
          </span>
          <span className="flex items-center gap-1 font-semibold text-blue-500">
            <Activity className="h-3 w-3" /> BP {row.bloodPressure}
          </span>
        </div>
      )
    },
    { header: 'Consultant', accessor: 'doctorName', sortable: true },
    { header: 'Record Date', accessor: 'date', sortable: true },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="p-1 text-primary hover:bg-primary/10" onClick={() => openViewModal(row)}>
            View Detail
          </Button>
          {(currentUser?.role === 'Admin' || currentUser?.role === 'Doctor') && (
            <>
              <Button variant="ghost" size="sm" className="p-1 text-secondary hover:bg-secondary/10" onClick={() => openEditModal(row)}>
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1 text-danger hover:bg-danger/10" onClick={() => deleteEMR(row.id)}>
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
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search EMR files by diagnosis, patient name or consultant..." />
        {(currentUser?.role === 'Admin' || currentUser?.role === 'Doctor') && (
          <Button variant="primary" onClick={openAddModal} icon={<Plus className="h-4 w-4" />}>
            Create EMR Record
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={emrList}
        searchQuery={searchQuery}
        searchFields={['patientName', 'diagnosis', 'doctorName', 'id']}
        pageSize={10}
        emptyMessage="No EMR files recorded."
      />

      {/* Add EMR Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create New EMR Record">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <SelectField label="Select Patient File" name="patientId" value={formData.patientId} onChange={handleInputChange} options={patientOptions} error={formErrors.patientId} required />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField label="Blood Pressure" name="bloodPressure" value={formData.bloodPressure} onChange={handleInputChange} placeholder="e.g. 120/80" required />
            <InputField label="Heart Rate (bpm)" type="number" name="heartRate" value={formData.heartRate} onChange={handleInputChange} required />
            <InputField label="SpO2 Oxygen (%)" type="number" name="oxygenLevel" value={formData.oxygenLevel} onChange={handleInputChange} required />
          </div>

          <InputField label="Diagnosis" name="diagnosis" value={formData.diagnosis} onChange={handleInputChange} error={formErrors.diagnosis} placeholder="e.g. Acute Gastritis, Stage 2 Hypertension" required />
          <InputField label="Chief Complaints" name="complaints" value={formData.complaints} onChange={handleInputChange} error={formErrors.complaints} placeholder="e.g. Stomach pain, dizziness" required />
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-text-muted">Treatment Plan & Prescription Notes</label>
            <textarea
              name="treatmentPlan"
              value={formData.treatmentPlan}
              onChange={handleInputChange}
              rows={4}
              placeholder="Detail out drugs prescribed, diagnostic tests, therapy..."
              className="p-3 bg-surface border border-border rounded-xl text-xs text-text focus:outline-none focus:border-primary w-full"
              required
            />
            {formErrors.treatmentPlan && <span className="text-[10px] text-danger mt-1">{formErrors.treatmentPlan}</span>}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Record</Button>
          </div>
        </form>
      </Modal>

      {/* Edit EMR Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Modify EMR Record">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <SelectField label="Select Patient File" name="patientId" value={formData.patientId} onChange={handleInputChange} options={patientOptions} required />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField label="Blood Pressure" name="bloodPressure" value={formData.bloodPressure} onChange={handleInputChange} required />
            <InputField label="Heart Rate (bpm)" type="number" name="heartRate" value={formData.heartRate} onChange={handleInputChange} required />
            <InputField label="SpO2 Oxygen (%)" type="number" name="oxygenLevel" value={formData.oxygenLevel} onChange={handleInputChange} required />
          </div>

          <InputField label="Diagnosis" name="diagnosis" value={formData.diagnosis} onChange={handleInputChange} required />
          <InputField label="Chief Complaints" name="complaints" value={formData.complaints} onChange={handleInputChange} required />
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-text-muted">Treatment Plan & Prescription Notes</label>
            <textarea
              name="treatmentPlan"
              value={formData.treatmentPlan}
              onChange={handleInputChange}
              rows={4}
              className="p-3 bg-surface border border-border rounded-xl text-xs text-text focus:outline-none focus:border-primary w-full"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Update Record</Button>
          </div>
        </form>
      </Modal>

      {/* View EMR Detail Modal */}
      <Modal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Electronic Health Record Summary" size="lg">
        {selectedEMR && (
          <div className="space-y-5">
            <div className="flex justify-between items-start pb-4 border-b border-border">
              <div>
                <h4 className="font-extrabold text-sm text-text leading-none">{selectedEMR.patientName}</h4>
                <span className="text-[10px] text-text-muted mt-1 block">Patient ID Reference: {selectedEMR.patientId}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-text-muted block">Date: {selectedEMR.date}</span>
                <span className="text-[10px] text-primary font-bold block mt-1">EMR ID: {selectedEMR.id}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 bg-border/10 p-4 rounded-xl border border-border text-center">
              <div>
                <span className="text-[10px] text-text-muted block">Blood Pressure</span>
                <span className="font-bold text-xs text-text mt-1 block">{selectedEMR.bloodPressure}</span>
              </div>
              <div>
                <span className="text-[10px] text-text-muted block">Heart Rate</span>
                <span className="font-bold text-xs text-red-500 mt-1 block flex justify-center items-center gap-1">
                  <Heart className="h-3.5 w-3.5 fill-red-500 animate-pulse" /> {selectedEMR.heartRate} bpm
                </span>
              </div>
              <div>
                <span className="text-[10px] text-text-muted block">Oxygen Level</span>
                <span className="font-bold text-xs text-blue-500 mt-1 block">{selectedEMR.oxygenLevel}% SpO2</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold text-text-muted uppercase block">Diagnosis Summary</span>
                <div className="mt-1 p-3 bg-card border border-border rounded-xl text-xs font-semibold text-text">
                  {selectedEMR.diagnosis}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-text-muted uppercase block">Chief Complaints</span>
                <p className="mt-1 text-xs text-text leading-relaxed p-1">{selectedEMR.complaints}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-text-muted uppercase block">Treatment & Therapeutic Plan</span>
                <div className="mt-1 p-3 bg-primary/5 border border-primary/20 rounded-xl text-xs text-text leading-relaxed whitespace-pre-line">
                  {selectedEMR.treatmentPlan}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-between items-center text-[10px] text-text-muted">
              <span>Attending Medical Practitioner: <strong>{selectedEMR.doctorName}</strong></span>
              <Button variant="ghost" onClick={() => setIsViewOpen(false)}>Close Window</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
