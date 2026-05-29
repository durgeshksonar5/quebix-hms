import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Edit2, Trash2, Printer, PlusCircle, Trash, DollarSign, Calculator } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';

export default function Billing() {
  const { billing, addInvoice, updateInvoice, deleteInvoice, patients } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    patientId: '',
    consultationFee: 0,
    medicineCharges: 0,
    labCharges: 0,
    roomCharges: 0,
    discount: 0,
    tax: 0,
    totalAmount: 0,
    paymentStatus: 'Pending',
    paymentMethod: 'Cash',
    services: [] // list of { name, charge }
  });

  // Service row builder
  const [serviceRow, setServiceRow] = useState({ name: '', charge: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Auto-recalculate subtotal, tax, total when charges change
      const consult = Number(updated.consultationFee) || 0;
      const meds = Number(updated.medicineCharges) || 0;
      const lab = Number(updated.labCharges) || 0;
      const room = Number(updated.roomCharges) || 0;
      const disc = Number(updated.discount) || 0;

      const subtotal = consult + meds + lab + room - disc;
      const calculatedTax = Math.round(subtotal * 0.08); // 8% tax
      const total = subtotal + calculatedTax;

      updated.tax = calculatedTax >= 0 ? calculatedTax : 0;
      updated.totalAmount = total >= 0 ? total : 0;

      return updated;
    });
  };

  const addServiceRow = () => {
    if (!serviceRow.name.trim() || !serviceRow.charge) return;
    const chargeVal = Number(serviceRow.charge);

    setFormData((prev) => {
      const services = [...prev.services, { name: serviceRow.name, charge: chargeVal }];
      
      // Increment appropriate charge category for calculations if name matches keywords
      let consult = prev.consultationFee;
      let meds = prev.medicineCharges;
      let lab = prev.labCharges;
      let room = prev.roomCharges;

      const nameLower = serviceRow.name.toLowerCase();
      if (nameLower.includes('consult')) {
        consult += chargeVal;
      } else if (nameLower.includes('med') || nameLower.includes('pharmacy')) {
        meds += chargeVal;
      } else if (nameLower.includes('lab') || nameLower.includes('test') || nameLower.includes('scan')) {
        lab += chargeVal;
      } else if (nameLower.includes('room') || nameLower.includes('icu') || nameLower.includes('ward')) {
        room += chargeVal;
      } else {
        // default to lab charges
        lab += chargeVal;
      }

      const subtotal = consult + meds + lab + room - prev.discount;
      const calculatedTax = Math.round(subtotal * 0.08);
      const total = subtotal + calculatedTax;

      return {
        ...prev,
        services,
        consultationFee: consult,
        medicineCharges: meds,
        labCharges: lab,
        roomCharges: room,
        tax: calculatedTax >= 0 ? calculatedTax : 0,
        totalAmount: total >= 0 ? total : 0
      };
    });

    setServiceRow({ name: '', charge: '' });
  };

  const removeServiceRow = (index) => {
    setFormData((prev) => {
      const removed = prev.services[index];
      const services = prev.services.filter((_, idx) => idx !== index);

      let consult = prev.consultationFee;
      let meds = prev.medicineCharges;
      let lab = prev.labCharges;
      let room = prev.roomCharges;

      const nameLower = removed.name.toLowerCase();
      if (nameLower.includes('consult')) {
        consult = Math.max(0, consult - removed.charge);
      } else if (nameLower.includes('med') || nameLower.includes('pharmacy')) {
        meds = Math.max(0, meds - removed.charge);
      } else if (nameLower.includes('lab') || nameLower.includes('test') || nameLower.includes('scan')) {
        lab = Math.max(0, lab - removed.charge);
      } else if (nameLower.includes('room') || nameLower.includes('icu') || nameLower.includes('ward')) {
        room = Math.max(0, room - removed.charge);
      } else {
        lab = Math.max(0, lab - removed.charge);
      }

      const subtotal = consult + meds + lab + room - prev.discount;
      const calculatedTax = Math.round(subtotal * 0.08);
      const total = subtotal + calculatedTax;

      return {
        ...prev,
        services,
        consultationFee: consult,
        medicineCharges: meds,
        labCharges: lab,
        roomCharges: room,
        tax: calculatedTax >= 0 ? calculatedTax : 0,
        totalAmount: total >= 0 ? total : 0
      };
    });
  };

  const openAddModal = () => {
    setFormData({
      patientId: patients[0]?.id || '',
      consultationFee: 0,
      medicineCharges: 0,
      labCharges: 0,
      roomCharges: 0,
      discount: 0,
      tax: 0,
      totalAmount: 0,
      paymentStatus: 'Pending',
      paymentMethod: 'Cash',
      services: []
    });
    setServiceRow({ name: '', charge: '' });
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
    if (formData.totalAmount === 0 && formData.services.length === 0) {
      alert('Invoice must have services added or amount allocated.');
      return;
    }
    addInvoice(formData);
    setIsAddOpen(false);
  };

  const openEditModal = (inv) => {
    setSelectedInvoice(inv);
    setFormData({ ...inv });
    setServiceRow({ name: '', charge: '' });
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateInvoice(formData);
    setIsEditOpen(false);
  };

  const openDeleteConfirm = (inv) => {
    setSelectedInvoice(inv);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedInvoice) {
      deleteInvoice(selectedInvoice.id);
      setIsDeleteOpen(false);
      setSelectedInvoice(null);
    }
  };

  const openPrintModal = (inv) => {
    setSelectedInvoice(inv);
    setIsPrintOpen(true);
  };

  const handlePrintTrigger = () => {
    window.print();
  };

  // Table Columns Setup
  const columns = [
    { header: 'Invoice ID', accessor: 'id', sortable: true },
    { header: 'Patient Name', accessor: 'patientName', sortable: true },
    { header: 'Total Amount', accessor: 'totalAmount', sortable: true, render: (row) => `₹${row.totalAmount.toLocaleString()}` },
    { header: 'Method', accessor: 'paymentMethod' },
    { header: 'Date', accessor: 'date', sortable: true },
    {
      header: 'Payment Status',
      accessor: 'paymentStatus',
      sortable: true,
      render: (row) => <StatusBadge status={row.paymentStatus} />
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-1 text-primary hover:bg-primary/10"
            onClick={() => openPrintModal(row)}
            title="Print Invoice"
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
            title="Delete Invoice"
            icon={<Trash2 className="h-4 w-4" />}
          />
        </div>
      )
    }
  ];

  const patientOptions = patients.map((p) => ({ value: p.id, label: `${p.name} (${p.id})` }));
  const paymentMethods = ['Cash', 'UPI', 'Card', 'Insurance'];
  const paymentStatuses = ['Paid', 'Pending', 'Partially Paid'];

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search billing by Patient name, Invoice ID..." />
        <Button variant="primary" onClick={openAddModal} icon={<Plus className="h-4 w-4" />}>
          Generate Invoice
        </Button>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-card border border-border rounded-2xl shadow-sm">
        <FilterDropdown label="Payment Status" value={statusFilter} onChange={setStatusFilter} options={paymentStatuses} />
        <div className="flex items-center gap-2 text-xs font-semibold text-text-muted justify-end">
          Total Invoices: {billing.length}
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={billing}
        searchQuery={searchQuery}
        searchFields={['id', 'patientName', 'paymentMethod']}
        filters={{
          paymentStatus: statusFilter
        }}
        pageSize={8}
        emptyMessage="No invoices logged matching filters."
      />

      {/* Generate Invoice Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Generate Invoice Billing Statement" size="lg">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <SelectField label="Select Patient File" name="patientId" value={formData.patientId} onChange={handleInputChange} options={patientOptions} required />

          {/* Dynamic Services List Builder */}
          <div className="p-4 bg-border/20 rounded-2xl border border-border">
            <h4 className="text-xs font-bold text-text mb-3 flex items-center gap-1.5 uppercase tracking-wider text-primary">
              <Calculator className="h-4 w-4" />
              <span>Billable Services / Items ({formData.services.length})</span>
            </h4>

            {formData.services.length > 0 && (
              <div className="mb-4">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border font-semibold text-text-muted">
                      <th className="py-2">Service Description</th>
                      <th className="py-2 text-right">Charge (₹)</th>
                      <th className="py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-text">
                    {formData.services.map((srv, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 font-medium">{srv.name}</td>
                        <td className="py-2.5 text-right font-semibold">₹{srv.charge}</td>
                        <td className="py-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => removeServiceRow(idx)}
                            className="p-1 text-danger hover:bg-red-50 dark:hover:bg-red-950/20 rounded font-medium"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-border/40 items-end">
              <InputField label="Service Description" name="name" value={serviceRow.name} onChange={(e) => setServiceRow(p => ({ ...p, name: e.target.value }))} placeholder="e.g. General OPD Consultation, MRI Test" />
              <div className="flex gap-2 items-end">
                <InputField label="Charge (₹)" type="number" name="charge" value={serviceRow.charge} onChange={(e) => setServiceRow(p => ({ ...p, charge: e.target.value }))} placeholder="500" />
                <Button type="button" variant="outline" onClick={addServiceRow} icon={<PlusCircle className="h-4 w-4" />}>
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Individual Charge summary inputs for manual overrides */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <InputField label="Consultation Fee" type="number" name="consultationFee" value={formData.consultationFee} onChange={handleInputChange} required />
            <InputField label="Medicine Charges" type="number" name="medicineCharges" value={formData.medicineCharges} onChange={handleInputChange} required />
            <InputField label="Lab Charges" type="number" name="labCharges" value={formData.labCharges} onChange={handleInputChange} required />
            <InputField label="Room & Bed Charges" type="number" name="roomCharges" value={formData.roomCharges} onChange={handleInputChange} required />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <InputField label="Discount Allocated (₹)" type="number" name="discount" value={formData.discount} onChange={handleInputChange} />
            <InputField label="Taxes Calculated (8% Auto)" type="number" name="tax" value={formData.tax} onChange={handleInputChange} readOnly />
            <div className="flex flex-col gap-1 w-full justify-center">
              <span className="text-xs font-semibold text-text-muted">Total Billing Statement</span>
              <span className="text-lg font-extrabold text-primary">₹{formData.totalAmount}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Payment Status" name="paymentStatus" value={formData.paymentStatus} onChange={handleInputChange} options={paymentStatuses} required />
            <SelectField label="Payment Method" name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} options={paymentMethods} required />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Generate Statement</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Invoice Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Modify Billing Statement">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <SelectField label="Patient" name="patientId" value={formData.patientId} onChange={handleInputChange} options={patientOptions} required />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <InputField label="Consultation Fee" type="number" name="consultationFee" value={formData.consultationFee} onChange={handleInputChange} required />
            <InputField label="Medicine Charges" type="number" name="medicineCharges" value={formData.medicineCharges} onChange={handleInputChange} required />
            <InputField label="Lab Charges" type="number" name="labCharges" value={formData.labCharges} onChange={handleInputChange} required />
            <InputField label="Room Charges" type="number" name="roomCharges" value={formData.roomCharges} onChange={handleInputChange} required />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <InputField label="Discount" type="number" name="discount" value={formData.discount} onChange={handleInputChange} />
            <InputField label="Tax" type="number" name="tax" value={formData.tax} onChange={handleInputChange} readOnly />
            <div className="flex flex-col justify-center">
              <span className="text-xs font-semibold text-text-muted">Total Billing Statement</span>
              <span className="text-lg font-extrabold text-primary">₹{formData.totalAmount}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Payment Status" name="paymentStatus" value={formData.paymentStatus} onChange={handleInputChange} options={paymentStatuses} required />
            <SelectField label="Payment Method" name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} options={paymentMethods} required />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Invoice</Button>
          </div>
        </form>
      </Modal>

      {/* Print Invoice Modal */}
      <Modal isOpen={isPrintOpen} onClose={() => setIsPrintOpen(false)} title="Billing Invoice Preview" size="lg">
        {selectedInvoice && (
          <div className="space-y-6">
            {/* Printable Paper */}
            <div className="p-8 border-2 border-dashed border-border bg-white text-black space-y-8 print-style-block">
              {/* Header Letterhead */}
              <div className="flex justify-between items-start border-b-2 border-black pb-5">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-wide text-blue-900">QUEBIX CLINIC</h2>
                  <p className="text-xs text-gray-600 font-medium">742 Evergreen Terrace, Medical District, NY</p>
                  <p className="text-[10px] text-gray-500">Phone: +91 7769971133 | Email: support@quebixdigital.in</p>
                </div>
                <div className="text-right">
                  <h3 className="text-lg font-bold text-gray-800">STATEMENT OF INVOICE</h3>
                  <p className="text-xs text-gray-600 font-semibold mt-1">Invoice ID: {selectedInvoice.id}</p>
                  <p className="text-[10px] text-gray-500">Date Billed: {selectedInvoice.date || new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Patient and Bill Info metadata */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Billed To</span>
                  <p className="font-bold text-gray-900">{selectedInvoice.patientName}</p>
                  <p className="text-gray-600">Patient ID: {selectedInvoice.patientId}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Status Summary</span>
                  <p className="font-bold text-gray-900">Status: {selectedInvoice.paymentStatus}</p>
                  <p className="text-gray-600">Method: {selectedInvoice.paymentMethod}</p>
                </div>
              </div>

              {/* Services Itemized list */}
              <div>
                <span className="text-xs font-bold text-gray-700 block mb-2 border-b border-gray-200 pb-1">Itemized Charges</span>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300 text-gray-600 font-bold">
                      <th className="py-2">Item Description</th>
                      <th className="py-2 text-right">Cost (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-900 font-medium">
                    {/* Render specific categories if services array is empty for older seeds */}
                    {selectedInvoice.services && selectedInvoice.services.length > 0 ? (
                      selectedInvoice.services.map((srv, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5">{srv.name}</td>
                          <td className="py-2.5 text-right">₹{srv.charge}</td>
                        </tr>
                      ))
                    ) : (
                      <>
                        {selectedInvoice.consultationFee > 0 && (
                          <tr>
                            <td className="py-2.5">Clinician Consultation Fee</td>
                            <td className="py-2.5 text-right">₹{selectedInvoice.consultationFee}</td>
                          </tr>
                        )}
                        {selectedInvoice.medicineCharges > 0 && (
                          <tr>
                            <td className="py-2.5">Pharmacy Prescriptions Charges</td>
                            <td className="py-2.5 text-right">₹{selectedInvoice.medicineCharges}</td>
                          </tr>
                        )}
                        {selectedInvoice.labCharges > 0 && (
                          <tr>
                            <td className="py-2.5">Laboratory Diagnostics Test</td>
                            <td className="py-2.5 text-right">₹{selectedInvoice.labCharges}</td>
                          </tr>
                        )}
                        {selectedInvoice.roomCharges > 0 && (
                          <tr>
                            <td className="py-2.5">Room Admission Station Charges</td>
                            <td className="py-2.5 text-right">₹{selectedInvoice.roomCharges}</td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Financial Breakdowns */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <div className="w-64 space-y-1.5 text-xs text-right">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-semibold">Subtotal:</span>
                    <span className="font-bold text-gray-900">
                      ₹{(selectedInvoice.consultationFee + selectedInvoice.medicineCharges + selectedInvoice.labCharges + selectedInvoice.roomCharges).toLocaleString()}
                    </span>
                  </div>
                  {selectedInvoice.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="font-semibold">Discount:</span>
                      <span>-₹{selectedInvoice.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-semibold">Tax (8%):</span>
                    <span className="font-bold text-gray-900">₹{selectedInvoice.tax}</span>
                  </div>
                  <div className="flex justify-between border-t border-black pt-2 text-sm font-extrabold text-gray-900">
                    <span>Total Amount Billed:</span>
                    <span>₹{selectedInvoice.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Terms and Signatures */}
              <div className="text-[10px] text-gray-400 space-y-1">
                <p>Terms: Invoices are net-15 terms. All payment records are maintained securely under local clinical directives.</p>
                <p>For questions or assistance regarding this billing transaction, contact support@quebixdigital.in.</p>
              </div>

              <div className="flex justify-between items-end pt-8 text-xs">
                <div>
                  <p className="text-[10px] text-gray-400">Electronic verification matches print record</p>
                </div>
                <div className="text-center w-40 border-t border-black pt-1">
                  <p className="font-bold text-gray-900">Quebix Billing</p>
                  <p className="text-[10px] text-gray-500">Authorized Clerk</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setIsPrintOpen(false)}>Close</Button>
              <Button variant="primary" onClick={handlePrintTrigger} icon={<Printer className="h-4 w-4" />}>
                Print Invoice
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Statement"
        message={`Are you sure you want to remove Invoice entry ${selectedInvoice?.id}?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
