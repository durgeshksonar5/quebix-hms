import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, FileText, Download, Trash2, Eye, Folder, Calendar } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';

export default function MedicalDocuments() {
  const { documents, uploadDocument, deleteDocument, patients, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [formData, setFormData] = useState({
    patientId: '',
    documentType: 'Prescription',
    fileName: '',
    notes: '',
    uploadedBy: currentUser?.name || 'Dr. Self'
  });

  const [formErrors, setFormErrors] = useState({});

  const docTypes = ['Prescription', 'Lab Report', 'MRI Report', 'Scan', 'Discharge Summary', 'Consent Form'];

  const validateForm = () => {
    const errors = {};
    if (!formData.patientId) errors.patientId = 'Patient selection is required';
    if (!formData.fileName.trim()) errors.fileName = 'Document filename is required';
    if (!formData.notes.trim()) errors.notes = 'Brief description note is required';
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
      documentType: 'Prescription',
      fileName: '',
      notes: '',
      uploadedBy: currentUser?.name || 'Dr. Self'
    });
    setFormErrors({});
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const pat = patients.find(p => p.id === formData.patientId);
    uploadDocument({
      ...formData,
      patientName: pat ? pat.name : 'Unknown Patient',
    });
    setIsAddOpen(false);
  };

  const openViewDoc = (doc) => {
    setSelectedDoc(doc);
    setIsViewOpen(true);
  };

  const patientOptions = patients.map((p) => ({ value: p.id, label: `${p.name} (${p.id})` }));

  const columns = [
    { header: 'Doc ID', accessor: 'id', sortable: true },
    { header: 'Patient Name', accessor: 'patientName', sortable: true },
    { header: 'Doc Type', accessor: 'documentType', sortable: true },
    {
      header: 'File Name',
      render: (row) => (
        <span className="flex items-center gap-1.5 text-xs text-text font-medium select-all">
          <FileText className="h-3.5 w-3.5 text-primary flex-shrink-0" /> {row.fileName}
        </span>
      )
    },
    { header: 'Uploaded By', accessor: 'uploadedBy', sortable: true },
    { header: 'Date Uploaded', accessor: 'uploadDate', sortable: true },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="p-1 text-primary hover:bg-primary/10" onClick={() => openViewDoc(row)} title="View Summary">
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <a
            href={`#download-${row.id}`}
            onClick={(e) => {
              e.preventDefault();
              alert(`Simulating secure download of medical document file: ${row.fileName}`);
            }}
            className="p-1 text-success hover:bg-green-100 rounded-lg"
            title="Download Document"
          >
            <Download className="h-3.5 w-3.5" />
          </a>
          {(currentUser?.role === 'Admin' || currentUser?.role === 'Doctor') && (
            <Button variant="ghost" size="sm" className="p-1 text-danger hover:bg-danger/10" onClick={() => deleteDocument(row.id)} title="Delete Document">
              <Trash2 className="h-3.5 w-3.5" />
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
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search documents library..." />
          <select
            value={docTypeFilter}
            onChange={(e) => setDocTypeFilter(e.target.value)}
            className="px-3 bg-card border border-border rounded-xl text-xs text-text focus:outline-none"
          >
            <option value="">All Types</option>
            {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {(currentUser?.role === 'Admin' || currentUser?.role === 'Doctor') && (
          <Button variant="primary" onClick={openAddModal} icon={<Plus className="h-4 w-4" />}>
            Upload Document
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={documents}
        searchQuery={searchQuery}
        searchFields={['patientName', 'documentType', 'fileName', 'id']}
        filters={{
          documentType: docTypeFilter
        }}
        pageSize={10}
        emptyMessage="No medical files recorded."
      />

      {/* Upload Document Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Upload Medical Document Record">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <SelectField label="Link Patient Record" name="patientId" value={formData.patientId} onChange={handleInputChange} options={patientOptions} error={formErrors.patientId} required />
          <SelectField label="Document Category" name="documentType" value={formData.documentType} onChange={handleInputChange} options={docTypes} required />
          
          <InputField
            label="File Name (with extension)"
            name="fileName"
            value={formData.fileName}
            onChange={handleInputChange}
            placeholder="e.g. prescription_sheet_may2026.pdf"
            error={formErrors.fileName}
            required
          />

          <InputField
            label="Internal Notes / Description"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Provide short memo about the diagnosis report contents."
            error={formErrors.notes}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Upload Record</Button>
          </div>
        </form>
      </Modal>

      {/* View Document Detail Modal */}
      <Modal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Document Summary Card" size="sm">
        {selectedDoc && (
          <div className="space-y-4">
            <div className="p-4 bg-border/20 rounded-xl border border-border flex items-center gap-3">
              <Folder className="h-8 w-8 text-primary flex-shrink-0" />
              <div className="overflow-hidden">
                <span className="font-extrabold text-xs text-text block truncate">{selectedDoc.fileName}</span>
                <span className="text-[10px] text-text-muted mt-1 block">{selectedDoc.documentType} | ID: {selectedDoc.id}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-text-muted">Associated Patient</span>
                <span className="font-semibold text-text">{selectedDoc.patientName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-text-muted">Uploaded By</span>
                <span className="font-medium text-text">{selectedDoc.uploadedBy}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-text-muted">Upload Date</span>
                <span className="font-medium text-text flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-secondary" /> {selectedDoc.uploadDate}
                </span>
              </div>
            </div>

            <div className="bg-primary/5 p-3 rounded-xl border border-primary/10">
              <span className="text-[9px] font-bold uppercase tracking-wider text-primary block">Description Memo</span>
              <p className="text-xs text-text mt-1 leading-relaxed">{selectedDoc.notes}</p>
            </div>

            <div className="flex justify-end pt-3 border-t border-border">
              <Button variant="ghost" onClick={() => setIsViewOpen(false)}>Close Window</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
