import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Edit2, Trash2, Printer, CheckSquare, RefreshCw, FlaskConical, FileText } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';

export default function Laboratory() {
  const { laboratory, addLabTest, updateLabTest, deleteLabTest, patients, doctors } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  const [selectedTest, setSelectedTest] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    testName: '',
    testDate: '',
    resultSummary: '',
    reportStatus: 'Pending',
    price: 0
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({
      patientId: patients[0]?.id || '',
      doctorId: doctors[0]?.id || '',
      testName: '',
      testDate: new Date().toISOString().split('T')[0],
      resultSummary: '',
      reportStatus: 'Pending',
      price: 500
    });
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.testName.trim()) return;
    addLabTest({
      ...formData,
      price: Number(formData.price)
    });
    setIsAddOpen(false);
  };

  const openEditModal = (test) => {
    setSelectedTest(test);
    setFormData({ ...test });
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formData.testName.trim()) return;
    updateLabTest({
      ...formData,
      price: Number(formData.price)
    });
    setIsEditOpen(false);
  };

  const openDeleteConfirm = (test) => {
    setSelectedTest(test);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedTest) {
      deleteLabTest(selectedTest.id);
      setIsDeleteOpen(false);
      setSelectedTest(null);
    }
  };

  const openPrintModal = (test) => {
    setSelectedTest(test);
    setIsPrintOpen(true);
  };

  const handlePrintTrigger = () => {
    window.print();
  };

  const handleStatusChange = (test, newStatus) => {
    updateLabTest({
      ...test,
      reportStatus: newStatus,
      // Default dummy results if completing
      resultSummary: newStatus === 'Completed' && !test.resultSummary ? 'All parameters assessed and verified within standard biological reference ranges.' : test.resultSummary
    });
  };

  // Table Columns Setup
  const columns = [
    { header: 'Test ID', accessor: 'id', sortable: true },
    { header: 'Patient Name', accessor: 'patientName', sortable: true },
    { header: 'Prescribing Doctor', accessor: 'doctorName', sortable: true },
    { header: 'Test Name', accessor: 'testName', sortable: true, className: 'font-semibold text-text' },
    { header: 'Scheduled Date', accessor: 'testDate', sortable: true },
    { header: 'Price', accessor: 'price', render: (row) => `₹${row.price}` },
    {
      header: 'Report Status',
      accessor: 'reportStatus',
      sortable: true,
      render: (row) => <StatusBadge status={row.reportStatus} />
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.reportStatus === 'Pending' && (
            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-primary hover:bg-primary/10"
              onClick={() => handleStatusChange(row, 'In Progress')}
              title="Start Analysis"
              icon={<RefreshCw className="h-4 w-4" />}
            />
          )}
          {row.reportStatus === 'In Progress' && (
            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-success hover:bg-green-100"
              onClick={() => openEditModal(row)} // edit to complete with results
              title="Complete with Results"
              icon={<CheckSquare className="h-4 w-4" />}
            />
          )}
          {row.reportStatus === 'Completed' && (
            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-primary hover:bg-primary/10"
              onClick={() => openPrintModal(row)}
              title="View & Print Report"
              icon={<Printer className="h-4 w-4" />}
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            className="p-1 text-secondary hover:bg-secondary/10"
            onClick={() => openEditModal(row)}
            title="Edit Order"
            icon={<Edit2 className="h-4 w-4" />}
          />
          <Button
            variant="ghost"
            size="sm"
            className="p-1 text-danger hover:bg-danger/10"
            onClick={() => openDeleteConfirm(row)}
            title="Delete Order"
            icon={<Trash2 className="h-4 w-4" />}
          />
        </div>
      )
    }
  ];

  const patientOptions = patients.map((p) => ({ value: p.id, label: `${p.name} (${p.id})` }));
  const doctorOptions = doctors.map((d) => ({ value: d.id, label: `${d.name} (${d.specialization})` }));
  const reportStatuses = ['Pending', 'In Progress', 'Completed'];

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search lab queue by Patient, Doctor or Test name..." />
        <Button variant="primary" onClick={openAddModal} icon={<Plus className="h-4 w-4" />}>
          Assign Lab Test
        </Button>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-card border border-border rounded-2xl shadow-sm">
        <FilterDropdown label="Progress Status" value={statusFilter} onChange={setStatusFilter} options={reportStatuses} />
        <div className="flex items-center justify-end text-xs font-semibold text-text-muted">
          Active Lab Orders: {laboratory.length}
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={laboratory}
        searchQuery={searchQuery}
        searchFields={['id', 'patientName', 'doctorName', 'testName']}
        filters={{
          reportStatus: statusFilter
        }}
        pageSize={10}
        emptyMessage="No laboratory tests logged matching filters."
      />

      {/* Assign Test Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Schedule Laboratory Diagnostics">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <SelectField label="Select Patient File" name="patientId" value={formData.patientId} onChange={handleInputChange} options={patientOptions} required />
          <SelectField label="Prescribing Physician" name="doctorId" value={formData.doctorId} onChange={handleInputChange} options={doctorOptions} required />

          <InputField label="Diagnostic Test Name" name="testName" value={formData.testName} onChange={handleInputChange} placeholder="e.g. Complete Blood Count (CBC)" required />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Scheduled Date" type="date" name="testDate" value={formData.testDate} onChange={handleInputChange} required />
            <InputField label="Billing Price (₹)" type="number" name="price" value={formData.price} onChange={handleInputChange} required />
          </div>

          <SelectField label="Initial Report Status" name="reportStatus" value={formData.reportStatus} onChange={handleInputChange} options={reportStatuses} required />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Schedule Test</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Lab Test Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Modify Laboratory Order & Results" size="lg">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Patient" name="patientId" value={formData.patientId} onChange={handleInputChange} options={patientOptions} required />
            <SelectField label="Doctor" name="doctorId" value={formData.doctorId} onChange={handleInputChange} options={doctorOptions} required />
          </div>

          <InputField label="Test Name" name="testName" value={formData.testName} onChange={handleInputChange} required />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Test Date" type="date" name="testDate" value={formData.testDate} onChange={handleInputChange} required />
            <InputField label="Billing Price (₹)" type="number" name="price" value={formData.price} onChange={handleInputChange} required />
          </div>

          <SelectField label="Report Status" name="reportStatus" value={formData.reportStatus} onChange={handleInputChange} options={reportStatuses} required />

          {/* Results Summary Upload / Demo field */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-semibold text-text-muted">Result Findings & Summary (Uploads/Entry)</label>
            <textarea
              name="resultSummary"
              value={formData.resultSummary}
              onChange={handleInputChange}
              rows="3"
              placeholder="e.g. Hemoglobin: 14.2 g/dL (Normal: 13.5-17.5). White Blood Cells: 6.8 x10^3/uL (Normal: 4.5-11.0)..."
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Confirm Updates</Button>
          </div>
        </form>
      </Modal>

      {/* Printable Report View Modal */}
      <Modal isOpen={isPrintOpen} onClose={() => setIsPrintOpen(false)} title="Laboratory Diagnostics Report" size="lg">
        {selectedTest && (
          <div className="space-y-6">
            {/* Report Paper */}
            <div className="p-8 border-2 border-dashed border-border bg-white text-black space-y-8 print-style-block">
              {/* letterhead */}
              <div className="flex justify-between items-start border-b-2 border-black pb-5">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-wide text-blue-900">QUEBIX LABS</h2>
                  <p className="text-xs text-gray-600 font-medium">742 Evergreen Terrace, Medical District, NY</p>
                  <p className="text-[10px] text-gray-500">Phone: +91 7769971133 | Email: support@quebixdigital.in</p>
                </div>
                <div className="text-right">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-1.5 justify-end">
                    <FlaskConical className="h-5 w-5 text-blue-900" />
                    CLINICAL DIAGNOSTICS
                  </h3>
                  <p className="text-xs text-gray-600 font-semibold mt-1">Report ID: {selectedTest.id}</p>
                  <p className="text-[10px] text-gray-500">Analysis Date: {selectedTest.testDate}</p>
                </div>
              </div>

              {/* metadata */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Patient Information</span>
                  <p className="font-bold text-gray-900">{selectedTest.patientName}</p>
                  <p className="text-gray-600">ID: {selectedTest.patientId}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Requesting Clinician</span>
                  <p className="font-bold text-gray-900">{selectedTest.doctorName}</p>
                  <p className="text-gray-600">Quebix MD</p>
                </div>
              </div>

              {/* Findings */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-gray-700 block border-b border-gray-200 pb-1">
                  Test Conducted: {selectedTest.testName}
                </span>

                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 min-h-[120px]">
                  <strong className="text-xs text-gray-700 block mb-2">Findings Summary:</strong>
                  <p className="text-xs leading-relaxed text-gray-950 whitespace-pre-line font-mono">
                    {selectedTest.resultSummary || 'No analytical notes logged.'}
                  </p>
                </div>
              </div>

              {/* disclaimer */}
              <div className="text-[10px] text-gray-400 leading-normal">
                Disclaimer: This laboratory test result is verified electronically by licensed clinical pathology assistants. Results should be interpreted by a qualified clinical practitioner.
              </div>

              {/* Signatures */}
              <div className="flex justify-between items-end pt-12 text-xs">
                <div>
                  <p className="text-[10px] text-gray-400">Electronic verification ID: {selectedTest.id}-SECURE</p>
                </div>
                <div className="text-center w-40 border-t border-black pt-1">
                  <p className="font-bold text-gray-900">Dr. Sandeep Sen</p>
                  <p className="text-[10px] text-gray-500">Chief Pathologist</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setIsPrintOpen(false)}>Close</Button>
              <Button variant="primary" onClick={handlePrintTrigger} icon={<Printer className="h-4 w-4" />}>
                Print Results
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Cancel Order"
        message={`Are you sure you want to delete Lab record entry ${selectedTest?.id}?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
