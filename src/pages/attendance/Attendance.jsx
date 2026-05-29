import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Calendar, UserCheck, LogOut, CheckCircle, Clock } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import SelectField from '../../components/forms/SelectField';

export default function Attendance() {
  const { attendanceLogs, checkInStaff, checkOutStaff, staff, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState('');

  const handleCheckInSubmit = (e) => {
    e.preventDefault();
    if (!selectedStaffId) return;
    checkInStaff(selectedStaffId);
    setIsCheckInOpen(false);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const columns = [
    { header: 'Log ID', accessor: 'id', sortable: true },
    { header: 'Staff Name', accessor: 'staffName', sortable: true },
    { header: 'Role', accessor: 'role', sortable: true },
    { header: 'Date', accessor: 'date', sortable: true },
    {
      header: 'Check In',
      render: (row) => (
        <span className="flex items-center gap-1 text-xs text-success font-medium">
          <Clock className="h-3.5 w-3.5 text-success" /> {row.checkInTime || row.checkIn || '--:--'}
        </span>
      )
    },
    {
      header: 'Check Out',
      render: (row) => (
        <span className="flex items-center gap-1 text-xs text-text-muted font-medium">
          <LogOut className="h-3.5 w-3.5 text-text-muted" /> {row.checkOutTime || row.checkOut || 'Active Session'}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
          row.status === 'Present'
            ? 'bg-green-100 text-green-700'
            : row.status === 'Late'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => {
        // find staff member id
        const member = staff.find(s => s.name === row.staffName);
        const hasCheckedOut = row.checkOut && row.checkOut !== '--' && row.checkOut !== null;
        return (
          <div className="flex gap-2">
            {currentUser?.role === 'Admin' && member && !hasCheckedOut && (
              <Button
                variant="ghost"
                size="sm"
                className="p-1 text-danger hover:bg-red-50"
                onClick={() => checkOutStaff(member.id)}
                title="Force Clock Out"
              >
                Clock Out
              </Button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search staff attendance logs..." />
        {currentUser?.role === 'Admin' && (
          <div className="flex gap-2">
            <Button variant="primary" onClick={() => setIsCheckInOpen(true)} icon={<UserCheck className="h-4 w-4" />}>
              Clock In Staff
            </Button>
          </div>
        )}
      </div>

      <DataTable
        columns={columns}
        data={attendanceLogs}
        searchQuery={searchQuery}
        searchFields={['staffName', 'role', 'status', 'id']}
        pageSize={10}
        emptyMessage="No attendance logs captured for today."
      />

      {/* Clock In Modal */}
      <Modal isOpen={isCheckInOpen} onClose={() => setIsCheckInOpen(false)} title="Record Staff Clock-In Time" size="sm">
        <form onSubmit={handleCheckInSubmit} className="space-y-4">
          <SelectField
            label="Select Staff Member"
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            options={staff.map(s => ({ value: s.id, label: `${s.name} (${s.role})` }))}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsCheckInOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Clock In Now</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
