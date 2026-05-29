import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileDown, BarChart3, TrendingUp, Calendar, AlertTriangle, HelpCircle } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from 'recharts';
import Button from '../../components/common/Button';
import SelectField from '../../components/forms/SelectField';

export default function Reports() {
  const { patients, doctors, appointments, billing, pharmacy, laboratory, staff, addToast } = useApp();
  const [timeFilter, setTimeFilter] = useState('Monthly');

  // Summary Metrics calculations
  const totalPatients = patients.length;
  const totalDoctors = doctors.length;
  const totalApts = appointments.length;
  const pendingApts = appointments.filter(a => a.status === 'Pending').length;
  const completedApts = appointments.filter(a => a.status === 'Completed').length;
  
  const totalBillCollected = billing
    .filter(i => i.paymentStatus === 'Paid')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const totalOutstanding = billing
    .filter(i => i.paymentStatus === 'Pending' || i.paymentStatus === 'Partially Paid')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const lowStockCount = pharmacy.filter(m => m.quantity <= 30).length;
  const totalTests = laboratory.length;
  const completedTests = laboratory.filter(t => t.reportStatus === 'Completed').length;

  // Chart 1: Patient admission trend
  const patientTrendData = [
    { month: 'Jan', Admitted: 5, Discharged: 3 },
    { month: 'Feb', Admitted: 9, Discharged: 6 },
    { month: 'Mar', Admitted: 12, Discharged: 8 },
    { month: 'Apr', Admitted: 15, Discharged: 11 },
    { month: 'May', Admitted: patients.length, Discharged: patients.filter(p => p.status === 'Discharged').length }
  ];

  // Chart 2: Doctor appointments allocation
  const doctorAptData = doctors.map(doc => {
    const count = appointments.filter(a => a.doctorId === doc.id).length;
    return { name: doc.name.replace('Dr. ', ''), Appointments: count };
  });

  // Dynamic CSV download helper
  const exportToCSV = (filename, data) => {
    if (!data || data.length === 0) {
      addToast('No data available for export', 'warning');
      return;
    }
    
    // Extract headers
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    // Header row
    csvRows.push(headers.join(','));
    
    // Data rows
    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header];
        // Handle values with commas or object representations
        const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
        const escaped = str.replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    
    // Download triggers
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_export.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(`${filename} database exported successfully!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Filters & Actions row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card p-4 border border-border rounded-2xl shadow-sm">
        <SelectField
          label="Reporting Interval"
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          options={['Daily', 'Weekly', 'Monthly', 'Annually']}
          placeholder="Interval"
          className="max-w-[200px]"
        />

        <div className="flex flex-wrap gap-2 pt-4 sm:pt-0">
          <Button variant="outline" size="sm" onClick={() => exportToCSV('Patients', patients)} icon={<FileDown className="h-4 w-4 text-primary" />}>
            Export Patients
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportToCSV('Doctors', doctors)} icon={<FileDown className="h-4 w-4 text-cyan-600" />}>
            Export Doctors
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportToCSV('Appointments', appointments)} icon={<FileDown className="h-4 w-4 text-green-600" />}>
            Export Appointments
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportToCSV('Invoices', billing)} icon={<FileDown className="h-4 w-4 text-amber-600" />}>
            Export Billing
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportToCSV('Staff', staff)} icon={<FileDown className="h-4 w-4 text-purple-600" />}>
            Export Staff
          </Button>
        </div>
      </div>

      {/* Numerical Report Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-card border border-border rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Patient Admittance</span>
          <span className="text-2xl font-extrabold text-text mt-2 block">{totalPatients} Total Folders</span>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-text-muted">
            <TrendingUp className="h-4 w-4 text-success" />
            <span>Active records update live</span>
          </div>
        </div>

        <div className="p-5 bg-card border border-border rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Clinic Appointments</span>
          <span className="text-2xl font-extrabold text-text mt-2 block">{totalApts} Consultations</span>
          <div className="mt-3 flex items-center gap-4 text-[10px] font-bold">
            <span className="text-blue-600">{completedApts} Completed</span>
            <span className="text-yellow-600">{pendingApts} Pending</span>
          </div>
        </div>

        <div className="p-5 bg-card border border-border rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Financial Performance</span>
          <span className="text-2xl font-extrabold text-text mt-2 block">₹{totalBillCollected.toLocaleString()} Paid</span>
          <div className="mt-3 text-[10px] font-bold text-red-500">
            Pending Collection: ₹{totalOutstanding.toLocaleString()}
          </div>
        </div>

        <div className="p-5 bg-card border border-border rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Diagnostics & Pharmacy</span>
          <span className="text-2xl font-extrabold text-text mt-2 block">{totalTests} Lab tests</span>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-text-muted">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span className="font-semibold text-warning">{lowStockCount} Meds Stock Alerts</span>
          </div>
        </div>
      </div>

      {/* Visual Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admission vs Discharge trend line chart */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="mb-4">
            <h3 className="font-bold text-base text-text">Patient Volume Trend</h3>
            <p className="text-xs text-text-muted mt-0.5">Admissions vs discharges logs</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={patientTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="month" stroke="currentColor" className="text-text-muted" fontSize={11} tickLine={false} />
                <YAxis stroke="currentColor" className="text-text-muted" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--color-text)' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="Admitted" stroke="var(--color-primary)" strokeWidth={3} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Discharged" stroke="var(--color-success)" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Doctor consult counts bar chart */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="mb-4">
            <h3 className="font-bold text-base text-text">Clinical Load Allocation</h3>
            <p className="text-xs text-text-muted mt-0.5">Total consultation bookings assigned per physician</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={doctorAptData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="name" stroke="currentColor" className="text-text-muted" fontSize={10} tickLine={false} />
                <YAxis stroke="currentColor" className="text-text-muted" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--color-text)' }} />
                <Bar dataKey="Appointments" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
