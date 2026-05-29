import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Building, User, Users, Edit2, Trash2 } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';

export default function Departments() {
  const { departments, addDepartment, updateDepartment, deleteDepartment, doctors } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedDept, setSelectedDept] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    headDoctor: '',
    status: 'Active'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({
      name: '',
      description: '',
      headDoctor: doctors[0]?.name || '',
      status: 'Active'
    });
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    addDepartment(formData);
    setIsAddOpen(false);
  };

  const openEditModal = (dept) => {
    setSelectedDept(dept);
    setFormData({ ...dept });
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    updateDepartment(formData);
    setIsEditOpen(false);
  };

  const openDeleteConfirm = (dept) => {
    setSelectedDept(dept);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedDept) {
      deleteDepartment(selectedDept.id);
      setIsDeleteOpen(false);
      setSelectedDept(null);
    }
  };

  // Filter department list by search query
  const filteredDefts = departments.filter((d) => {
    const q = searchQuery.toLowerCase();
    return d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q) || d.headDoctor.toLowerCase().includes(q);
  });

  const doctorOptions = doctors.map((d) => d.name);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search departments by Name, Doctor or Details..." />
        <Button variant="primary" onClick={openAddModal} icon={<Plus className="h-4 w-4" />}>
          Add Department
        </Button>
      </div>

      {/* Grid of Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDefts.map((dept) => {
          // Dynamic doctor count in department
          const actualDocCount = doctors.filter((doc) => doc.department === dept.name).length;
          
          return (
            <div
              key={dept.id}
              className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <Building className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={dept.status} />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-text mb-2">{dept.name}</h3>
                <p className="text-xs text-text-muted leading-relaxed mb-5 min-h-[48px]">{dept.description}</p>
                
                <div className="space-y-2 border-t border-border/60 pt-4 mb-6">
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <User className="h-4 w-4 text-text-muted/60" />
                    <span>Head: <strong className="text-text font-semibold">{dept.headDoctor}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Users className="h-4 w-4 text-text-muted/60" />
                    <span>Registered Physicians: <strong className="text-text font-semibold">{actualDocCount || dept.totalDoctors}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1.5 text-secondary hover:bg-secondary/10"
                  onClick={() => openEditModal(dept)}
                  icon={<Edit2 className="h-4 w-4" />}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1.5 text-danger hover:bg-danger/10"
                  onClick={() => openDeleteConfirm(dept)}
                  icon={<Trash2 className="h-4 w-4" />}
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDefts.length === 0 && (
        <div className="p-12 text-center text-text-muted bg-card border border-border rounded-2xl shadow-sm">
          No medical departments found.
        </div>
      )}

      {/* Add Department Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create Hospital Unit">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <InputField label="Department Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Gynecology" required />
          
          <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-semibold text-text-muted">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Summary of services and focus..."
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <SelectField label="Appointed Unit Head (Doctor)" name="headDoctor" value={formData.headDoctor} onChange={handleInputChange} options={doctorOptions} required />
          <SelectField label="Status" name="status" value={formData.status} onChange={handleInputChange} options={['Active', 'Inactive']} required />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Department</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Department Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Modify Unit Information">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <InputField label="Department Name" name="name" value={formData.name} onChange={handleInputChange} required />
          
          <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-semibold text-text-muted">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <SelectField label="Appointed Unit Head" name="headDoctor" value={formData.headDoctor} onChange={handleInputChange} options={doctorOptions} required />
          <SelectField label="Status" name="status" value={formData.status} onChange={handleInputChange} options={['Active', 'Inactive']} required />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Department Unit"
        message={`Are you sure you want to remove ${selectedDept?.name}?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
