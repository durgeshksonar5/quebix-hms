import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { History, Search, Trash2, ShieldAlert } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import Button from '../../components/common/Button';

export default function AuditLogs() {
  const { auditLogs, clearAuditLogs, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const columns = [
    { header: 'Audit ID', accessor: 'id', sortable: true },
    {
      header: 'Timestamp',
      accessor: 'timestamp',
      sortable: true,
      render: (row) => <span className="text-[10px] text-text-muted">{row.timestamp || row.dateTime || 'System Time'}</span>
    },
    { header: 'Actor User', accessor: 'user', sortable: true },
    { header: 'Actor Role', accessor: 'role', sortable: true },
    {
      header: 'Hosp Module',
      accessor: 'module',
      sortable: true,
      render: (row) => (
        <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary font-bold text-[10px]">
          {row.module}
        </span>
      )
    },
    {
      header: 'Action Taken',
      accessor: 'action',
      sortable: true,
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
          row.action === 'DELETE' || row.action === 'REMOVE'
            ? 'bg-red-100 text-red-700'
            : row.action === 'ADD' || row.action === 'CREATE' || row.action === 'LOGIN'
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {row.action}
        </span>
      )
    },
    { header: 'Log Description', accessor: 'description', sortable: true },
    { header: 'IP Location', accessor: 'ipAddress' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-border">
        <div>
          <h2 className="text-lg font-bold text-text">Security Audit Logs Ledger</h2>
          <p className="text-xs text-text-muted mt-0.5">Trace all CRUD actions, settings adjustments, and security check-ins.</p>
        </div>
        {currentUser?.role === 'Admin' && auditLogs.length > 0 && (
          <Button variant="outline" size="sm" className="text-danger border-danger/20 hover:bg-danger/5" onClick={clearAuditLogs} icon={<Trash2 className="h-4 w-4" />}>
            Flush Audit Logs
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search security logs ledger..." />
      </div>

      <DataTable
        columns={columns}
        data={auditLogs}
        searchQuery={searchQuery}
        searchFields={['user', 'role', 'module', 'action', 'description', 'id']}
        pageSize={15}
        emptyMessage="Audit trail ledger is clear."
      />
    </div>
  );
}
