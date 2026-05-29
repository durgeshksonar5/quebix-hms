import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Edit2, Trash2, CalendarCheck, ShieldCheck, Mail, DollarSign } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';

export default function Staff() {
  const { staff, addStaff, updateStaff, deleteStaff, updateStaffAttendance, departments } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [shiftFilter, setShiftFilter] = useState('');

  // Modals States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedStaff, setSelectedStaff] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
    phone: '',
    email: '',
    shiftTiming: 'Morning',
    salary: 0
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({
      name: '',
      role: 'Nurse',
      department: departments[0]?.name || '',
      phone: '',
      email: '',
      shiftTiming: 'Morning',
      salary: 30000
    });
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    addStaff({
      ...formData,
      salary: Number(formData.salary)
    });
    setIsAddOpen(false);
  };

  const openEditModal = (member) => {
    setSelectedStaff(member);
    setFormData({ ...member });
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    updateStaff({
      ...formData,
      salary: Number(formData.salary)
    });
    setIsEditOpen(false);
  };

  const openDeleteConfirm = (member) => {
    setSelectedStaff(member);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedStaff) {
      deleteStaff(selectedStaff.id);
      setIsDeleteOpen(false);
      setSelectedStaff(null);
    }
  };

  const toggleAttendance = (member, status) => {
    updateStaffAttendance(member.id, status);
  };

  // Extract distinct roles
  const roles = Array.from(new Set(staff.map((s) => s.role)));
  const shifts = ['Morning', 'Night', 'General'];
  const departmentOptions = [...departments.map(d => d.name), 'Front Desk', 'Laboratory', 'Pharmacy', 'Support Staff'];

  // Table Columns Setup
  const columns = [
    { header: 'Staff ID', accessor: 'id', sortable: true },
    {
      header: 'Staff Name',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs select-none">
            {row.name.charAt(0)}
          </div>
          <span className="font-semibold text-text">{row.name}</span>
        </div>
      )
    },
    { header: 'Role', accessor: 'role', sortable: true },
    { header: 'Assigned Dept', accessor: 'department', sortable: true },
    { header: 'Shift Hours', accessor: 'shiftTiming' },
    { header: 'Monthly Salary', accessor: 'salary', render: (row) => `₹${row.salary.toLocaleString()}` },
    {
      header: 'Attendance',
      accessor: 'attendanceStatus',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1">
          <StatusBadge status={row.attendanceStatus} />
          <div className="relative group">
            <button className="text-[10px] text-text-muted hover:underline hover:text-text focus:outline-none ml-2">
              Mark
            </button>
            {/* Hover popup choices */}
            <div className="hidden group-hover:block absolute bg-card border border-border rounded-xl shadow-lg p-1.5 z-40 space-y-1 -left-10 mt-1">
              <button onClick={() => toggleAttendance(row, 'Present')} className="block text-[10px] w-full text-left font-semibold px-2 py-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 rounded">Present</button>
              <button onClick={() => toggleAttendance(row, 'Absent')} className="block text-[10px] w-full text-left font-semibold px-2 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded">Absent</button>
              <button onClick={() => toggleAttendance(row, 'On Leave')} className="block text-[10px] w-full text-left font-semibold px-2 py-1 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950/20 rounded">On Leave</button>
            </div>
          </div>
        </div>
      )
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
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search staff folders by Name, ID or Department..." />
        <Button variant="primary" onClick={openAddModal} icon={<Plus className="h-4 w-4" />}>
          Register Staff Member
        </Button>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-card border border-border rounded-2xl shadow-sm">
        <FilterDropdown label="Filter Role" value={roleFilter} onChange={setRoleFilter} options={roles} />
        <FilterDropdown label="Duty Shift" value={shiftFilter} onChange={setShiftFilter} options={shifts} />
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={staff}
        searchQuery={searchQuery}
        searchFields={['id', 'name', 'role', 'department']}
        filters={{
          role: roleFilter,
          shiftTiming: shiftFilter
        }}
        pageSize={8}
        emptyMessage="No staff records matched filters."
      />

      {/* Add Staff Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Register Support / Nurse Staff">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <InputField label="Full Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Nurse Sunita" required />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Role Title" name="role" value={formData.role} onChange={handleInputChange} placeholder="e.g. Nurse, Assistant" required />
            <SelectField label="Assigned Department" name="department" value={formData.department} onChange={handleInputChange} options={departmentOptions} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Phone Contact" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="e.g. 9823456700" required />
            <InputField label="Email Address" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="e.g. sunita@quebixhms.com" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Shift Hours" name="shiftTiming" value={formData.shiftTiming} onChange={handleInputChange} options={shifts} required />
            <InputField label="Monthly Salary (₹)" type="number" name="salary" value={formData.salary} onChange={handleInputChange} required />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Add Member</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Staff Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Modify Staff Folder">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <InputField label="Full Name" name="name" value={formData.name} onChange={handleInputChange} required />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Role Title" name="role" value={formData.role} onChange={handleInputChange} required />
            <SelectField label="Assigned Department" name="department" value={formData.department} onChange={handleInputChange} options={departmentOptions} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Phone Contact" name="phone" value={formData.phone} onChange={handleInputChange} required />
            <InputField label="Email Address" type="email" name="email" value={formData.email} onChange={handleInputChange} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Shift Hours" name="shiftTiming" value={formData.shiftTiming} onChange={handleInputChange} options={shifts} required />
            <InputField label="Monthly Salary (₹)" type="number" name="salary" value={formData.salary} onChange={handleInputChange} required />
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
        title="Delete Record"
        message={`Are you sure you want to remove staff log entry for ${selectedStaff?.name}?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
