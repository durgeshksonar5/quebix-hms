import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Edit2, Trash2, PlusCircle, Trash, DollarSign, Calculator, Eye } from 'lucide-react';
import { calculateInvoiceTotals } from '../../utils/invoiceCalculations';
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
  const { billing, addInvoice, updateInvoice, deleteInvoice, patients, doctors, departments } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    doctorName: '',
    department: '',
    consultationFee: 0,
    medicineCharges: 0,
    labCharges: 0,
    roomCharges: 0,
    discount: 0,
    tax: 0,
    totalAmount: 0,
    paidAmount: 0,
    balance: 0,
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
      
      // Auto-fill department if doctor changes
      if (name === 'doctorId') {
        const selectedDoc = (doctors || []).find((d) => d.id === value);
        updated.doctorName = selectedDoc ? selectedDoc.name : '';
        updated.department = selectedDoc ? selectedDoc.department : '';
      }

      // Auto-recalculate using utility
      const totals = calculateInvoiceTotals({
        consultationFee: updated.consultationFee,
        medicineCharges: updated.medicineCharges,
        labCharges: updated.labCharges,
        roomCharges: updated.roomCharges,
        discount: updated.discount,
        paidAmount: updated.paidAmount
      });

      updated.tax = totals.tax;
      updated.totalAmount = totals.grandTotal;
      updated.balance = totals.balance;

      return updated;
    });
  };

  const addServiceRow = () => {
    if (!serviceRow.name.trim() || !serviceRow.charge) return;
    const chargeVal = Number(serviceRow.charge);

    setFormData((prev) => {
      const services = [...prev.services, { name: serviceRow.name, charge: chargeVal }];
      
      // Increment appropriate charge category for calculations if name matches keywords
      let consult = Number(prev.consultationFee) || 0;
      let meds = Number(prev.medicineCharges) || 0;
      let lab = Number(prev.labCharges) || 0;
      let room = Number(prev.roomCharges) || 0;

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

      const totals = calculateInvoiceTotals({
        consultationFee: consult,
        medicineCharges: meds,
        labCharges: lab,
        roomCharges: room,
        discount: prev.discount,
        paidAmount: prev.paidAmount
      });

      return {
        ...prev,
        services,
        consultationFee: consult,
        medicineCharges: meds,
        labCharges: lab,
        roomCharges: room,
        tax: totals.tax,
        totalAmount: totals.grandTotal,
        balance: totals.balance
      };
    });

    setServiceRow({ name: '', charge: '' });
  };

  const removeServiceRow = (index) => {
    setFormData((prev) => {
      const removed = prev.services[index];
      const services = prev.services.filter((_, idx) => idx !== index);

      let consult = Number(prev.consultationFee) || 0;
      let meds = Number(prev.medicineCharges) || 0;
      let lab = Number(prev.labCharges) || 0;
      let room = Number(prev.roomCharges) || 0;

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

      const totals = calculateInvoiceTotals({
        consultationFee: consult,
        medicineCharges: meds,
        labCharges: lab,
        roomCharges: room,
        discount: prev.discount,
        paidAmount: prev.paidAmount
      });

      return {
        ...prev,
        services,
        consultationFee: consult,
        medicineCharges: meds,
        labCharges: lab,
        roomCharges: room,
        tax: totals.tax,
        totalAmount: totals.grandTotal,
        balance: totals.balance
      };
    });
  };

  const openAddModal = () => {
    setFormData({
      patientId: patients[0]?.id || '',
      doctorId: doctors[0]?.id || '',
      doctorName: doctors[0]?.name || '',
      department: doctors[0]?.department || '',
      consultationFee: 0,
      medicineCharges: 0,
      labCharges: 0,
      roomCharges: 0,
      discount: 0,
      tax: 0,
      totalAmount: 0,
      paidAmount: 0,
      balance: 0,
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
    const doctorObj = (doctors || []).find((d) => d.name === inv.doctorName);
    setFormData({
      ...inv,
      doctorId: doctorObj ? doctorObj.id : (doctors[0]?.id || ''),
      paidAmount: inv.paidAmount || 0,
      balance: inv.balance || 0
    });
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
          <Link to={`/billing/preview?id=${row.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="text-xs flex items-center gap-1 hover:bg-primary/5"
              icon={<Eye className="h-3.5 w-3.5" />}
            >
              Preview Invoice
            </Button>
          </Link>
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

  const patientOptions = (patients || []).map((p) => ({ value: p.id, label: `${p.name} (${p.id})` }));
  const doctorOptions = (doctors || []).map((d) => ({ value: d.id, label: `${d.name} (${d.specialization})` }));
  const paymentMethods = ['Cash', 'UPI', 'Card', 'Insurance'];
  const paymentStatuses = ['Paid', 'Pending', 'Partially Paid'];

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search billing by Patient, Invoice ID, status..." />
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
        searchFields={['id', 'patientName', 'paymentMethod', 'paymentStatus', 'date']}
        filters={{
          paymentStatus: statusFilter
        }}
        pageSize={8}
        emptyMessage="No invoices logged matching filters."
      />

      {/* Generate Invoice Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Generate Invoice Billing Statement" size="lg">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SelectField label="Select Patient File" name="patientId" value={formData.patientId} onChange={handleInputChange} options={patientOptions} required />
            <SelectField label="Select Attending Doctor" name="doctorId" value={formData.doctorId} onChange={handleInputChange} options={doctorOptions} required />
            <InputField label="Department" name="department" value={formData.department} readOnly />
          </div>

          {/* Dynamic Services List Builder */}
          <div className="p-4 bg-border/20 rounded-2xl border border-border">
            <h4 className="text-xs font-bold text-text mb-3 flex items-center gap-1.5 uppercase tracking-wider text-primary">
              <Calculator className="h-4 w-4" />
              <span>Billable Extra Services / Items ({formData.services.length})</span>
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
              <InputField label="Service Description" name="name" value={serviceRow.name} onChange={(e) => setServiceRow(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Specialized ICU Drug, ECG Test" />
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <InputField label="Discount (₹)" type="number" name="discount" value={formData.discount} onChange={handleInputChange} />
            <InputField label="GST Tax (8% Auto)" type="number" name="tax" value={formData.tax} readOnly />
            <InputField label="Amount Paid (₹)" type="number" name="paidAmount" value={formData.paidAmount} onChange={handleInputChange} required />
            
            <div className="flex flex-col gap-1 justify-center bg-[#FD3A25]/5 border border-[#FD3A25]/10 p-2.5 rounded-xl text-center">
              <span className="text-[10px] font-bold text-text-muted uppercase">Grand Total Amount</span>
              <span className="text-base font-extrabold text-primary">₹{formData.totalAmount}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SelectField label="Payment Status" name="paymentStatus" value={formData.paymentStatus} onChange={handleInputChange} options={paymentStatuses} required />
            <SelectField label="Payment Method" name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} options={paymentMethods} required />
            <div className="flex flex-col gap-1 justify-center bg-gray-50 dark:bg-slate-900/50 p-2.5 rounded-xl text-center border border-border">
              <span className="text-[10px] font-bold text-text-muted uppercase">Balance Outstanding</span>
              <span className={`text-base font-extrabold ${formData.balance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                ₹{formData.balance}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Generate Statement</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Invoice Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Modify Billing Statement" size="lg">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SelectField label="Patient" name="patientId" value={formData.patientId} onChange={handleInputChange} options={patientOptions} required />
            <SelectField label="Select Doctor" name="doctorId" value={formData.doctorId} onChange={handleInputChange} options={doctorOptions} required />
            <InputField label="Department" name="department" value={formData.department} readOnly />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <InputField label="Consultation Fee" type="number" name="consultationFee" value={formData.consultationFee} onChange={handleInputChange} required />
            <InputField label="Medicine Charges" type="number" name="medicineCharges" value={formData.medicineCharges} onChange={handleInputChange} required />
            <InputField label="Lab Charges" type="number" name="labCharges" value={formData.labCharges} onChange={handleInputChange} required />
            <InputField label="Room Charges" type="number" name="roomCharges" value={formData.roomCharges} onChange={handleInputChange} required />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <InputField label="Discount (₹)" type="number" name="discount" value={formData.discount} onChange={handleInputChange} />
            <InputField label="Tax (₹)" type="number" name="tax" value={formData.tax} readOnly />
            <InputField label="Amount Paid (₹)" type="number" name="paidAmount" value={formData.paidAmount} onChange={handleInputChange} required />
            <div className="flex flex-col justify-center bg-[#FD3A25]/5 border border-[#FD3A25]/10 p-2.5 rounded-xl text-center">
              <span className="text-[10px] font-bold text-text-muted uppercase">Grand Total</span>
              <span className="text-base font-extrabold text-primary">₹{formData.totalAmount}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SelectField label="Payment Status" name="paymentStatus" value={formData.paymentStatus} onChange={handleInputChange} options={paymentStatuses} required />
            <SelectField label="Payment Method" name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} options={paymentMethods} required />
            <div className="flex flex-col gap-1 justify-center bg-gray-50 dark:bg-slate-900/50 p-2.5 rounded-xl text-center border border-border">
              <span className="text-[10px] font-bold text-text-muted uppercase">Balance Due</span>
              <span className={`text-base font-extrabold ${formData.balance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                ₹{formData.balance}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Invoice</Button>
          </div>
        </form>
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
