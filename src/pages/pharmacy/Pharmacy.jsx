import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Edit2, Trash2, AlertTriangle, ShieldCheck, CheckCircle2, ShieldAlert } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';

export default function Pharmacy() {
  const { pharmacy, addMedicine, updateMedicine, deleteMedicine } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedMed, setSelectedMed] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    expiryDate: '',
    supplier: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({
      name: '',
      category: 'Antibiotics',
      price: 10,
      quantity: 100,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      supplier: ''
    });
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
    if (!formData.name.trim()) return;
    addMedicine({
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity)
    });
    setIsAddOpen(false);
  };

  const openEditModal = (med) => {
    setSelectedMed(med);
    setFormData({ ...med });
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    updateMedicine({
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity)
    });
    setIsEditOpen(false);
  };

  const openDeleteConfirm = (med) => {
    setSelectedMed(med);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedMed) {
      deleteMedicine(selectedMed.id);
      setIsDeleteOpen(false);
      setSelectedMed(null);
    }
  };

  // Extract distinct categories
  const categories = Array.from(new Set(pharmacy.map((m) => m.category)));

  // Low stock and expiry lists
  const criticallyLowStock = pharmacy.filter((m) => m.quantity <= 30);
  
  const expiringMeds = pharmacy.filter((m) => {
    const expiry = new Date(m.expiryDate);
    const current = new Date('2026-05-29');
    const diff = expiry - current;
    const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return diffDays <= 60; // expiring within 2 months or already expired
  });

  // Table Columns Setup
  const columns = [
    { header: 'ID', accessor: 'id', sortable: true },
    { header: 'Medicine Name', accessor: 'name', sortable: true, className: 'font-semibold text-text' },
    { header: 'Category', accessor: 'category', sortable: true },
    { header: 'Unit Price', accessor: 'price', render: (row) => `₹${row.price}` },
    { header: 'Quantity In Stock', accessor: 'quantity', sortable: true },
    {
      header: 'Expiry Date',
      accessor: 'expiryDate',
      sortable: true,
      render: (row) => {
        const expiry = new Date(row.expiryDate);
        const current = new Date('2026-05-29');
        const isExp = expiry <= current;
        return (
          <span className={isExp ? 'text-danger font-bold' : 'text-text font-medium'}>
            {row.expiryDate} {isExp && '(Expired)'}
          </span>
        );
      }
    },
    { header: 'Supplier', accessor: 'supplier' },
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
            className="p-1.5 text-secondary hover:bg-secondary/10"
            onClick={() => openEditModal(row)}
            icon={<Edit2 className="h-4 w-4" />}
          />
          <Button
            variant="ghost"
            size="sm"
            className="p-1.5 text-danger hover:bg-danger/10"
            onClick={() => openDeleteConfirm(row)}
            icon={<Trash2 className="h-4 w-4" />}
          />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Alert Widgets section for critical stocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Warning */}
        <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/40 rounded-2xl">
          <div className="flex items-center gap-2 text-warning mb-2 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="h-4.5 w-4.5" />
            <span>Low Stock Notifications ({criticallyLowStock.length})</span>
          </div>
          {criticallyLowStock.length > 0 ? (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-2">
              {criticallyLowStock.map((m) => (
                <div key={m.id} className="flex justify-between text-xs text-text border-b border-border/20 py-1 font-medium">
                  <span>{m.name} ({m.category})</span>
                  <span className="font-bold text-warning">{m.quantity} units left</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted mt-2">All medicine inventory is sufficiently stocked.</p>
          )}
        </div>

        {/* Expiry alerts */}
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-2xl">
          <div className="flex items-center gap-2 text-danger mb-2 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="h-4.5 w-4.5" />
            <span>Expiration Notifications ({expiringMeds.length})</span>
          </div>
          {expiringMeds.length > 0 ? (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-2">
              {expiringMeds.map((m) => {
                const isExp = new Date(m.expiryDate) <= new Date('2026-05-29');
                return (
                  <div key={m.id} className="flex justify-between text-xs text-text border-b border-border/20 py-1 font-medium">
                    <span>{m.name}</span>
                    <span className={`font-bold ${isExp ? 'text-red-600 animate-pulse' : 'text-danger'}`}>
                      {isExp ? 'EXPIRED' : `Expires: ${m.expiryDate}`}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-text-muted mt-2">No drugs approaching expiry within 60 days.</p>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search medicines by Name, ID or Supplier..." />
        <Button variant="primary" onClick={openAddModal} icon={<Plus className="h-4 w-4" />}>
          Register Drug / Item
        </Button>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-card border border-border rounded-2xl shadow-sm">
        <FilterDropdown label="Category" value={categoryFilter} onChange={setCategoryFilter} options={categories} />
        <FilterDropdown label="Inventory Status" value={statusFilter} onChange={setStatusFilter} options={['In Stock', 'Low Stock', 'Out of Stock']} />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={pharmacy}
        searchQuery={searchQuery}
        searchFields={['id', 'name', 'supplier']}
        filters={{
          category: categoryFilter,
          status: statusFilter
        }}
        pageSize={10}
        emptyMessage="No drug matches current search indexes."
      />

      {/* Add Medicine Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Medicine to Inventory">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <InputField label="Medicine Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Amoxicillin (500mg)" required />
          <InputField label="Category Classification" name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g. Antibiotics" required />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Unit Price (₹)" type="number" name="price" value={formData.price} onChange={handleInputChange} required />
            <InputField label="Initial Quantity" type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Expiration Date" type="date" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} required />
            <InputField label="Supplier Company" name="supplier" value={formData.supplier} onChange={handleInputChange} placeholder="e.g. Pfizer Dist." required />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Add to Inventory</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Medicine Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Modify Drug Inventory Log">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <InputField label="Medicine Name" name="name" value={formData.name} onChange={handleInputChange} required />
          <InputField label="Category" name="category" value={formData.category} onChange={handleInputChange} required />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Unit Price (₹)" type="number" name="price" value={formData.price} onChange={handleInputChange} required />
            <InputField label="Quantity In Stock" type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Expiration Date" type="date" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} required />
            <InputField label="Supplier" name="supplier" value={formData.supplier} onChange={handleInputChange} required />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Remove Medicine"
        message={`Are you sure you want to delete ${selectedMed?.name} from pharmacy inventory?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
