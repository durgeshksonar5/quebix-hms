import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Stethoscope,
  Calendar,
  DollarSign,
  AlertTriangle,
  Activity,
  BedDouble,
  Clock,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import DashboardCard from '../../components/cards/DashboardCard';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const {
    patients,
    doctors,
    appointments,
    billing,
    pharmacy,
    rooms,
    notifications,
    currentUser
  } = useApp();

  const currentDateStr = '2026-05-29';

  // 1. KPI Counts
  const totalPatients = patients.length;
  const totalDoctors = doctors.length;
  const totalAppointments = appointments.length;
  
  // Total Revenue: Sum totalAmount of Paid / Partially Paid invoices
  const totalRevenue = billing
    .filter(inv => inv.paymentStatus === 'Paid' || inv.paymentStatus === 'Partially Paid')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  // 2. Today's Appointments (Date matches current local date: 2026-05-29)
  const todaysAppointments = appointments
    .filter(apt => apt.date === currentDateStr)
    .slice(0, 5); // Limit to top 5 for dashboard overview

  // 3. Recent Admitted Patients
  const recentPatients = patients.slice(0, 5);

  // 4. Emergency / ICU cases
  const icuPatients = patients.filter(p => p.status === 'ICU');

  // 5. Low Stock Medicines
  const lowStockMeds = pharmacy.filter(m => m.quantity <= 30 || m.status === 'Out of Stock');

  // 6. Bed Availability Metrics
  const totalBeds = rooms.length;
  const occupiedBeds = rooms.filter(r => r.status === 'Occupied').length;
  const availableBeds = rooms.filter(r => r.status === 'Available').length;
  const maintenanceBeds = rooms.filter(r => r.status === 'Maintenance').length;

  // 7. CHART 1: Dynamic Last 7 Days Revenue Tracker
  // We sum invoice values for the last week up to May 29, 2026
  const last7Days = ['2026-05-23', '2026-05-24', '2026-05-25', '2026-05-26', '2026-05-27', '2026-05-28', '2026-05-29'];
  const revenueChartData = last7Days.map(date => {
    const dayInvoices = billing.filter(inv => inv.date === date);
    const dayTotal = dayInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const formattedDate = new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
    return { name: formattedDate, Revenue: dayTotal };
  });

  // 8. CHART 2: Appointment Status Distribution
  const appointmentStatuses = ['Confirmed', 'Pending', 'Completed', 'Cancelled'];
  const statusColors = ['#2563EB', '#F59E0B', '#16A34A', '#DC2626'];
  const statusChartData = appointmentStatuses.map(status => {
    const count = appointments.filter(apt => apt.status === status).length;
    return { name: status, value: count };
  }).filter(d => d.value > 0);

  // 9. CHART 3: Doctors by Department Chart
  const departmentCounts = doctors.reduce((acc, doc) => {
    acc[doc.department] = (acc[doc.department] || 0) + 1;
    return acc;
  }, {});
  const departmentChartData = Object.keys(departmentCounts).map(dept => ({
    name: dept,
    Doctors: departmentCounts[dept]
  }));

  return (
    <div className="space-y-6">
      {/* SaaS Welcome Banner */}
      <div className="p-6 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl border border-primary/20 shadow-md flex flex-col gap-1 transition-all">
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Welcome back to Quebix HMS</h2>
        <p className="text-xs text-white/80 font-medium">Smart Healthcare. Simplified Management. Portal system active.</p>
      </div>

      {/* Quick Action Shortcuts & Role Workspace Capsule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Card */}
        <div className="lg:col-span-2 bg-card border border-border p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-sm text-text mb-4">Quick Operation Shortcuts</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link to="/patients?action=add" className="flex flex-col items-center justify-center p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-center group">
              <div className="p-3 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-text mt-2 block">Add Patient</span>
            </Link>
            
            <Link to="/appointments?action=add" className="flex flex-col items-center justify-center p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-center group">
              <div className="p-3 bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded-xl group-hover:scale-110 transition-transform">
                <Calendar className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-text mt-2 block">Book Appt</span>
            </Link>

            <Link to="/billing?action=add" className="flex flex-col items-center justify-center p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-center group">
              <div className="p-3 bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl group-hover:scale-110 transition-transform">
                <DollarSign className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-text mt-2 block">Create Bill</span>
            </Link>

            <Link to="/pharmacy?action=add" className="flex flex-col items-center justify-center p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-center group">
              <div className="p-3 bg-cyan-100 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 rounded-xl group-hover:scale-110 transition-transform">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-text mt-2 block">Add Medicine</span>
            </Link>
          </div>
        </div>

        {/* Role Workspace Capsule */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-text">Active Role Workspace</h3>
            <p className="text-xs text-text-muted mt-0.5">Permissions & workspace view details</p>
          </div>
          <div className="my-3 flex items-center gap-3 p-3 rounded-xl bg-border/20 border border-border">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
              alt="Avatar"
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-primary/30"
            />
            <div>
              <span className="font-bold text-xs text-text block leading-none">{currentUser?.name}</span>
              <span className="text-[10px] text-primary font-bold uppercase tracking-wider block mt-1">{currentUser?.role} Mode</span>
            </div>
          </div>
          <span className="text-[10px] text-text-muted leading-relaxed block">
            Your login is managed via secure LocalStorage. The sidebar navigation links have been dynamically filtered to match your role credentials.
          </span>
        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <DashboardCard
          title="Total Patients"
          value={totalPatients}
          icon={Users}
          change="+8.3%"
          changeType="increase"
          iconBg="bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
        />
        <DashboardCard
          title="Active Doctors"
          value={totalDoctors}
          icon={Stethoscope}
          change="+4.1%"
          changeType="increase"
          iconBg="bg-cyan-100 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400"
        />
        <DashboardCard
          title="Total Appointments"
          value={totalAppointments}
          icon={Calendar}
          change="+15.2%"
          changeType="increase"
          iconBg="bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400"
        />
        <DashboardCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          change="+12.5%"
          changeType="increase"
          iconBg="bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
        />
      </div>

      {/* Critical System Alerts Bar */}
      {notifications.length > 0 && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/40 rounded-2xl flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-sm font-semibold text-warning block">Attention: Active System Alerts ({notifications.length})</span>
            <p className="text-xs text-text-muted mt-0.5">
              Low medicine levels, approaching stock expirations, or critical ICU assignments require attention. Review notifications.
            </p>
          </div>
          <Link to="/reports">
            <Button variant="ghost" size="sm" className="text-warning hover:bg-warning/10 font-bold">
              View Alerts
            </Button>
          </Link>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue Trend Area Chart */}
        <div className="lg:col-span-2 bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-base text-text">Weekly Revenue Trend</h3>
              <p className="text-xs text-text-muted mt-0.5">Aggregated payments over the last 7 days</p>
            </div>
            <Link to="/billing">
              <Button variant="outline" size="sm">Manage Invoices</Button>
            </Link>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="name" stroke="currentColor" className="text-text-muted" fontSize={11} tickLine={false} />
                <YAxis stroke="currentColor" className="text-text-muted" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--color-text)' }} />
                <Area type="monotone" dataKey="Revenue" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointment Status Pie Chart */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="font-bold text-base text-text">Appointment Statuses</h3>
            <p className="text-xs text-text-muted mt-0.5">Split of scheduled patient visits</p>
          </div>
          <div className="h-56 w-full relative flex-1 flex items-center justify-center">
            {statusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={statusColors[appointmentStatuses.indexOf(entry.name) % statusColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--color-text)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-text-muted">No appointments logged.</span>
            )}
          </div>
          {/* Status Legends */}
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-semibold">
            {statusChartData.map((d, index) => (
              <div key={idx => idx} className="flex items-center gap-2 text-text">
                <span className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: statusColors[appointmentStatuses.indexOf(d.name)] }} />
                <span className="truncate">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Departments Doctors Bar Chart & Beds layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doctors headcount by Department */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm lg:col-span-2">
          <div className="mb-6">
            <h3 className="font-bold text-base text-text">Department Doctors Headcount</h3>
            <p className="text-xs text-text-muted mt-0.5">Active medical staff registered across units</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="name" stroke="currentColor" className="text-text-muted" fontSize={10} tickLine={false} />
                <YAxis stroke="currentColor" className="text-text-muted" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--color-text)' }} />
                <Bar dataKey="Doctors" fill="var(--color-secondary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bed Status Gauge / General Overview */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-text">Beds Availability</h3>
            <p className="text-xs text-text-muted mt-0.5">Total capacity: {totalBeds} bed stations</p>
          </div>

          <div className="my-6 space-y-4">
            <div className="flex justify-between items-center border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-text">Available Beds</span>
              </div>
              <span className="text-base font-bold text-text">{availableBeds}</span>
            </div>
            <div className="flex justify-between items-center border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm font-medium text-text">Occupied Beds</span>
              </div>
              <span className="text-base font-bold text-text">{occupiedBeds}</span>
            </div>
            <div className="flex justify-between items-center pb-1">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-orange-500" />
                <span className="text-sm font-medium text-text">Under Maintenance</span>
              </div>
              <span className="text-base font-bold text-text">{maintenanceBeds}</span>
            </div>
          </div>

          <Link to="/rooms">
            <Button variant="outline" className="w-full flex justify-center items-center gap-2">
              <BedDouble className="h-4 w-4" />
              Manage Wards & Rooms
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid: Todays Appointments & Recent Admitted */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-base text-text">Today's Appointment Board</h3>
              <p className="text-xs text-text-muted mt-0.5">Visits scheduled for May 29, 2026</p>
            </div>
            <Link to="/appointments">
              <Button variant="ghost" size="sm" className="text-primary flex items-center gap-1 font-bold">
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            {todaysAppointments.length > 0 ? (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-text-muted font-bold">
                    <th className="py-2.5">Time</th>
                    <th className="py-2.5">Patient</th>
                    <th className="py-2.5">Doctor</th>
                    <th className="py-2.5">Department</th>
                    <th className="py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-text">
                  {todaysAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-border/5">
                      <td className="py-3 font-semibold flex items-center gap-1.5 text-text-muted">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        {apt.time}
                      </td>
                      <td className="py-3 font-medium">{apt.patientName}</td>
                      <td className="py-3">{apt.doctorName}</td>
                      <td className="py-3 text-text-muted">{apt.department}</td>
                      <td className="py-3">
                        <StatusBadge status={apt.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-12 text-center text-xs text-text-muted">
                No consultations booked for today.
              </div>
            )}
          </div>
        </div>

        {/* Emergency Admitted Patients (ICU) or Recent Patients */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-base text-text">Emergency Cases & ICU Admissions</h3>
              <p className="text-xs text-text-muted mt-0.5">High priority patients requiring constant review</p>
            </div>
            <Link to="/patients">
              <Button variant="ghost" size="sm" className="text-primary flex items-center gap-1 font-bold">
                View Patients <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[300px] space-y-3">
            {icuPatients.length > 0 ? (
              icuPatients.map((pat) => (
                <div
                  key={pat.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-red-200 bg-red-50/50 dark:border-red-950/40 dark:bg-red-950/10 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-950/50 rounded-lg text-red-600 dark:text-red-400">
                      <Activity className="h-4 w-4 animate-pulse" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-text block leading-none">{pat.name}</span>
                      <span className="text-[10px] text-text-muted block mt-1">
                        Age: {pat.age} | Blood: {pat.bloodGroup} | Emergency: {pat.emergencyContact}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600 text-white animate-pulse">
                    CRITICAL (ICU)
                  </span>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-text-muted">
                No active ICU admissions currently.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
