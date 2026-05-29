import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Edit2, Trash2, Printer, PlusCircle, Trash, Pill, User, HeartPulse } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import SearchBar from '../../components/common/SearchBar';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';

export default function Prescriptions() {
  const { prescriptions, addPrescription, updatePrescription, deletePrescription, patients, doctors } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  const [selectedPrescription, setSelectedPrescription] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    diagnosis: '',
    symptoms: '',
    medicines: [], // array of { name, dosage, frequency, duration }
    dosageInstructions: '',
    testsRecommended: '',
    followUpDate: '',
    notes: ''
  });

  // Temporary row state for medicine adding in form
  const [medRow, setMedRow] = useState({ name: '', dosage: '', frequency: '1-0-1', duration: '5 Days' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMedRowChange = (e) => {
    const { name, value } = e.target;
    setMedRow((prev) => ({ ...prev, [name]: value }));
  };

  const addMedicineRow = () => {
    if (!medRow.name.trim() || !medRow.dosage.trim()) return;
    setFormData((prev) => ({
      ...prev,
      medicines: [...prev.medicines, medRow]
    }));
    setMedRow({ name: '', dosage: '', frequency: '1-0-1', duration: '5 Days' });
  };

  const removeMedicineRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, idx) => idx !== index)
    }));
  };

  const openAddModal = () => {
    setFormData({
      patientId: patients[0]?.id || '',
      doctorId: doctors[0]?.id || '',
      diagnosis: '',
      symptoms: '',
      medicines: [],
      dosageInstructions: '',
      testsRecommended: '',
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: ''
    });
    setMedRow({ name: '', dosage: '', frequency: '1-0-1', duration: '5 Days' });
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (formData.medicines.length === 0) {
      alert('Please add at least one medicine to the prescription');
      return;
    }
    addPrescription(formData);
    setIsAddOpen(false);
  };

  const openEditModal = (prx) => {
    setSelectedPrescription(prx);
    setFormData({ ...prx });
    setMedRow({ name: '', dosage: '', frequency: '1-0-1', duration: '5 Days' });
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (formData.medicines.length === 0) {
      alert('Please add at least one medicine');
      return;
    }
    updatePrescription(formData);
    setIsEditOpen(false);
  };

  const openDeleteConfirm = (prx) => {
    setSelectedPrescription(prx);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedPrescription) {
      deletePrescription(selectedPrescription.id);
      setIsDeleteOpen(false);
      setSelectedPrescription(null);
    }
  };

  const openPrintModal = (prx) => {
    setSelectedPrescription(prx);
    setIsPrintOpen(true);
  };

  const handlePrintTrigger = () => {
    window.print();
  };

  // Table Columns Setup
  const columns = [
    { header: 'Rx ID', accessor: 'id', sortable: true },
    { header: 'Patient Name', accessor: 'patientName', sortable: true },
    { header: 'Prescribed By', accessor: 'doctorName', sortable: true },
    { header: 'Diagnosis', accessor: 'diagnosis' },
    {
      header: 'Meds Prescribed',
      accessor: 'medicines',
      render: (row) => `${row.medicines.length} Medicines`
    },
    { header: 'Follow Up', accessor: 'followUpDate', sortable: true },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-1 text-primary hover:bg-primary/10"
            onClick={() => openPrintModal(row)}
            title="Print Prescription"
            icon={<Printer className="h-4 w-4" />}
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
            onClick={() => openDeleteConfirm(row)}
            title="Delete Prescription"
            icon={<Trash2 className="h-4 w-4" />}
          />
        </div>
      )
    }
  ];

  const patientOptions = patients.map((p) => ({ value: p.id, label: `${p.name} (${p.id})` }));
  const doctorOptions = doctors.map((d) => ({ value: d.id, label: `${d.name} (${d.specialization})` }));

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search prescriptions by ID, Patient, Doctor, Diagnosis..." />
        <Button variant="primary" onClick={openAddModal} icon={<Plus className="h-4 w-4" />}>
          Generate Prescription (Rx)
        </Button>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={prescriptions}
        searchQuery={searchQuery}
        searchFields={['id', 'patientName', 'doctorName', 'diagnosis']}
        pageSize={8}
        emptyMessage="No prescription charts matched search index."
      />

      {/* Add Prescription Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Issue Prescription Chart" size="lg">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Patient Folder" name="patientId" value={formData.patientId} onChange={handleInputChange} options={patientOptions} required />
            <SelectField label="Prescribing Physician" name="doctorId" value={formData.doctorId} onChange={handleInputChange} options={doctorOptions} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Diagnosis Summary" name="diagnosis" value={formData.diagnosis} onChange={handleInputChange} placeholder="e.g. Essential Hypertension" required />
            <InputField label="Primary Symptoms" name="symptoms" value={formData.symptoms} onChange={handleInputChange} placeholder="e.g. Headache, chest tightness" />
          </div>

          {/* Medicines dynamic builder */}
          <div className="p-4 bg-border/20 rounded-2xl border border-border">
            <h4 className="text-xs font-bold text-text mb-3 flex items-center gap-1.5 uppercase tracking-wider text-primary">
              <Pill className="h-4 w-4" />
              <span>Medications List ({formData.medicines.length})</span>
            </h4>

            {formData.medicines.length > 0 && (
              <div className="mb-4 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border font-semibold text-text-muted">
                      <th className="py-2">Drug Name</th>
                      <th className="py-2">Dosage</th>
                      <th className="py-2">Frequency</th>
                      <th className="py-2">Duration</th>
                      <th className="py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-text">
                    {formData.medicines.map((med, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 font-semibold">{med.name}</td>
                        <td className="py-2.5">{med.dosage}</td>
                        <td className="py-2.5">{med.frequency}</td>
                        <td className="py-2.5">{med.duration}</td>
                        <td className="py-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => removeMedicineRow(idx)}
                            className="p-1 text-danger hover:bg-red-50 dark:hover:bg-red-950/20 rounded"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Form row to add */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/40">
              <InputField label="Drug Name" name="name" value={medRow.name} onChange={handleMedRowChange} placeholder="e.g. Paracetamol" />
              <InputField label="Dosage Strength" name="dosage" value={medRow.dosage} onChange={handleMedRowChange} placeholder="e.g. 500mg" />
              <SelectField label="Frequency" name="frequency" value={medRow.frequency} onChange={handleMedRowChange} options={['1-0-1 (Twice daily)', '1-0-0 (Morning)', '0-0-1 (Night)', '1-1-1 (Thrice daily)', 'As needed']} />
              <InputField label="Duration" name="duration" value={medRow.duration} onChange={handleMedRowChange} placeholder="e.g. 5 Days" />
            </div>
            <div className="flex justify-end mt-3">
              <Button type="button" variant="outline" size="sm" onClick={addMedicineRow} icon={<PlusCircle className="h-3.5 w-3.5 text-primary" />}>
                Add Drug
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Follow-Up Date" type="date" name="followUpDate" value={formData.followUpDate} onChange={handleInputChange} />
            <InputField label="General Dosage Instructions" name="dosageInstructions" value={formData.dosageInstructions} onChange={handleInputChange} placeholder="e.g. Post-meal, take with plenty of water" />
          </div>

          <InputField label="Laboratory Tests Recommended" name="testsRecommended" value={formData.testsRecommended} onChange={handleInputChange} placeholder="e.g. ECG, Lipid Profile" />
          <InputField label="Physician Notes" name="notes" value={formData.notes} onChange={handleInputChange} placeholder="e.g. Patient to restrict sodium intake." />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Confirm Prescription</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Prescription Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Modify Prescription details" size="lg">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Patient" name="patientId" value={formData.patientId} onChange={handleInputChange} options={patientOptions} required />
            <SelectField label="Doctor" name="doctorId" value={formData.doctorId} onChange={handleInputChange} options={doctorOptions} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Diagnosis" name="diagnosis" value={formData.diagnosis} onChange={handleInputChange} required />
            <InputField label="Symptoms" name="symptoms" value={formData.symptoms} onChange={handleInputChange} />
          </div>

          {/* Medicines dynamic builder */}
          <div className="p-4 bg-border/20 rounded-2xl border border-border">
            <h4 className="text-xs font-bold text-text mb-3 flex items-center gap-1.5 uppercase tracking-wider text-primary">
              <Pill className="h-4 w-4" />
              <span>Medications List ({formData.medicines.length})</span>
            </h4>

            {formData.medicines.length > 0 && (
              <div className="mb-4 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border font-semibold text-text-muted">
                      <th className="py-2">Drug Name</th>
                      <th className="py-2">Dosage</th>
                      <th className="py-2">Frequency</th>
                      <th className="py-2">Duration</th>
                      <th className="py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-text">
                    {formData.medicines.map((med, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 font-semibold">{med.name}</td>
                        <td className="py-2.5">{med.dosage}</td>
                        <td className="py-2.5">{med.frequency}</td>
                        <td className="py-2.5">{med.duration}</td>
                        <td className="py-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => removeMedicineRow(idx)}
                            className="p-1 text-danger hover:bg-red-50 dark:hover:bg-red-950/20 rounded"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Form row to add */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/40">
              <InputField label="Drug Name" name="name" value={medRow.name} onChange={handleMedRowChange} />
              <InputField label="Dosage" name="dosage" value={medRow.dosage} onChange={handleMedRowChange} />
              <SelectField label="Frequency" name="frequency" value={medRow.frequency} onChange={handleMedRowChange} options={['1-0-1 (Twice daily)', '1-0-0 (Morning)', '0-0-1 (Night)', '1-1-1 (Thrice daily)', 'As needed']} />
              <InputField label="Duration" name="duration" value={medRow.duration} onChange={handleMedRowChange} />
            </div>
            <div className="flex justify-end mt-3">
              <Button type="button" variant="outline" size="sm" onClick={addMedicineRow} icon={<PlusCircle className="h-3.5 w-3.5 text-primary" />}>
                Add Drug
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Follow-Up Date" type="date" name="followUpDate" value={formData.followUpDate} onChange={handleInputChange} />
            <InputField label="General Dosage Instructions" name="dosageInstructions" value={formData.dosageInstructions} onChange={handleInputChange} />
          </div>

          <InputField label="Laboratory Tests Recommended" name="testsRecommended" value={formData.testsRecommended} onChange={handleInputChange} />
          <InputField label="Notes" name="notes" value={formData.notes} onChange={handleInputChange} />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* Print Prescription View Modal */}
      <Modal isOpen={isPrintOpen} onClose={() => setIsPrintOpen(false)} title="Prescription Layout (Rx)" size="lg">
        {selectedPrescription && (
          <div className="space-y-6">
            {/* Print Area Container */}
            <div className="p-8 border-2 border-dashed border-border rounded-2xl bg-white text-black space-y-8 print-style-block">
              {/* letterhead */}
              <div className="flex justify-between items-start border-b-2 border-black pb-5">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-wide text-blue-900">QUEBIX CLINIC</h2>
                  <p className="text-xs text-gray-600 font-medium">742 Evergreen Terrace, Medical District, NY</p>
                  <p className="text-[10px] text-gray-500">Phone: +91 7769971133 | Email: support@quebixdigital.in</p>
                </div>
                <div className="text-right">
                  <h3 className="text-lg font-bold text-gray-800">PRESCRIPTION</h3>
                  <p className="text-xs text-gray-600 font-semibold mt-1">Rx ID: {selectedPrescription.id}</p>
                  <p className="text-[10px] text-gray-500">Date Issued: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Patient and Doctor metadata */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Patient Details</span>
                  <p className="font-bold text-gray-900">{selectedPrescription.patientName}</p>
                  <p className="text-gray-600">ID: {selectedPrescription.patientId}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Issued By</span>
                  <p className="font-bold text-gray-900">{selectedPrescription.doctorName}</p>
                  <p className="text-gray-600">Prescribing MD</p>
                </div>
              </div>

              {/* Symptoms and diagnosis */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <strong className="text-gray-700 block">Reported Symptoms:</strong>
                  <p className="text-gray-900 mt-0.5">{selectedPrescription.symptoms || 'None reported'}</p>
                </div>
                <div>
                  <strong className="text-gray-700 block">Provisional Diagnosis:</strong>
                  <p className="text-gray-900 mt-0.5">{selectedPrescription.diagnosis}</p>
                </div>
              </div>

              {/* Medicine Table list */}
              <div>
                <span className="text-xs font-bold text-gray-700 block mb-2 border-b border-gray-200 pb-1">Rx (Medications Rx)</span>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300 text-gray-600 font-bold">
                      <th className="py-2 w-1/3">Medicine Name</th>
                      <th className="py-2">Dosage</th>
                      <th className="py-2">Frequency</th>
                      <th className="py-2 text-right">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-900">
                    {selectedPrescription.medicines.map((med, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 font-bold flex items-center gap-1.5">
                          <span className="text-gray-400">℞</span>
                          {med.name}
                        </td>
                        <td className="py-2.5">{med.dosage}</td>
                        <td className="py-2.5">{med.frequency}</td>
                        <td className="py-2.5 text-right font-medium">{med.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Instructions */}
              <div className="space-y-3 text-xs border-t border-gray-200 pt-4">
                <div>
                  <strong className="text-gray-700 block">Dosage & Lifestyle Instructions:</strong>
                  <p className="text-gray-900 mt-0.5">{selectedPrescription.dosageInstructions || 'Take medications post meal regularly.'}</p>
                </div>
                {selectedPrescription.testsRecommended && (
                  <div>
                    <strong className="text-gray-700 block">Laboratory Diagnostics Recommended:</strong>
                    <p className="text-gray-900 mt-0.5">{selectedPrescription.testsRecommended}</p>
                  </div>
                )}
                {selectedPrescription.followUpDate && (
                  <div>
                    <strong className="text-gray-700 block">Follow-Up Date:</strong>
                    <p className="text-gray-900 mt-0.5">{selectedPrescription.followUpDate}</p>
                  </div>
                )}
              </div>

              {/* Signature block */}
              <div className="flex justify-between items-end pt-12 text-xs">
                <div>
                  <p className="text-[10px] text-gray-400">Quebix HMS Digital Signature Verified</p>
                </div>
                <div className="text-center w-40 border-t border-black pt-1">
                  <p className="font-bold text-gray-900">{selectedPrescription.doctorName}</p>
                  <p className="text-[10px] text-gray-500">Authorized Clinician</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setIsPrintOpen(false)}>Close</Button>
              <Button variant="primary" onClick={handlePrintTrigger} icon={<Printer className="h-4 w-4" />}>
                Print Document
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Prescription Folder"
        message={`Are you sure you want to delete Rx entry ${selectedPrescription?.id}?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
