import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  Building2,
  FileText,
  Receipt,
  Pill,
  FlaskConical,
  Bed,
  UserCheck,
  BarChart3,
  Settings,
  LogOut,
  X,
  Activity,
  Clock,
  Bell,
  MessageSquare,
  FolderOpen,
  Shield,
  AlertOctagon,
  Truck,
  HeartPulse,
  ClipboardList,
  CreditCard,
  ListOrdered,
  ThumbsUp,
  History
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Sidebar({ isOpen, onClose }) {
  const { logout, currentUser } = useApp();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['Admin', 'Doctor', 'Receptionist', 'Pharmacist', 'Lab Assistant', 'Patient'] },
    { name: 'Patients', path: '/patients', icon: Users, roles: ['Admin', 'Doctor', 'Receptionist'] },
    { name: 'Doctors', path: '/doctors', icon: Stethoscope, roles: ['Admin', 'Doctor', 'Receptionist', 'Patient'] },
    { name: 'Appointments', path: '/appointments', icon: Calendar, roles: ['Admin', 'Doctor', 'Receptionist', 'Patient'] },
    { name: 'Departments', path: '/departments', icon: Building2, roles: ['Admin', 'Doctor', 'Receptionist', 'Patient'] },
    { name: 'Prescriptions', path: '/prescriptions', icon: FileText, roles: ['Admin', 'Doctor', 'Pharmacist', 'Patient'] },
    { name: 'Billing & Invoices', path: '/billing', icon: Receipt, roles: ['Admin', 'Receptionist', 'Pharmacist', 'Patient'] },
    { name: 'Pharmacy Stock', path: '/pharmacy', icon: Pill, roles: ['Admin', 'Pharmacist'] },
    { name: 'Laboratory', path: '/laboratory', icon: FlaskConical, roles: ['Admin', 'Doctor', 'Lab Assistant', 'Patient'] },
    { name: 'Rooms & Beds', path: '/rooms', icon: Bed, roles: ['Admin', 'Doctor', 'Receptionist'] },
    
    // 14 New Advanced Modules
    { name: 'EMR Portal', path: '/emr', icon: Activity, roles: ['Admin', 'Doctor', 'Patient'] },
    { name: 'Doctor Scheduling', path: '/doctor-schedule', icon: Clock, roles: ['Admin', 'Doctor', 'Receptionist'] },
    { name: 'Notifications Center', path: '/notifications', icon: Bell, roles: ['Admin', 'Doctor', 'Receptionist', 'Pharmacist', 'Lab Assistant'] },
    { name: 'Staff Chat', path: '/internal-chat', icon: MessageSquare, roles: ['Admin', 'Doctor', 'Receptionist', 'Pharmacist', 'Lab Assistant'] },
    { name: 'Medical Documents', path: '/medical-documents', icon: FolderOpen, roles: ['Admin', 'Doctor', 'Receptionist', 'Patient'] },
    { name: 'Insurance Claims', path: '/insurance', icon: Shield, roles: ['Admin', 'Receptionist', 'Patient'] },
    { name: 'Emergency Triage', path: '/emergency', icon: AlertOctagon, roles: ['Admin', 'Doctor', 'Receptionist'] },
    { name: 'Ambulance Dispatch', path: '/ambulance', icon: Truck, roles: ['Admin', 'Doctor', 'Receptionist'] },
    { name: 'ICU Vital Telemetry', path: '/icu-monitoring', icon: HeartPulse, roles: ['Admin', 'Doctor'] },
    { name: 'Staff Attendance', path: '/attendance', icon: ClipboardList, roles: ['Admin'] },
    { name: 'Payroll Manager', path: '/payroll', icon: CreditCard, roles: ['Admin'] },
    { name: 'Token Queue', path: '/queue', icon: ListOrdered, roles: ['Admin', 'Doctor', 'Receptionist', 'Patient'] },
    { name: 'Patient Feedback', path: '/feedback', icon: ThumbsUp, roles: ['Admin', 'Doctor', 'Receptionist', 'Patient'] },
    { name: 'Security Audit Logs', path: '/audit-logs', icon: History, roles: ['Admin'] },

    { name: 'Reports & Analytics', path: '/reports', icon: BarChart3, roles: ['Admin'] },
    { name: 'System Settings', path: '/settings', icon: Settings, roles: ['Admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (!currentUser || !currentUser.role) return false;
    return item.roles.includes(currentUser.role);
  });

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-sidebar-bg border-r border-border/10 text-sidebar-text transform lg:transform-none lg:opacity-100 transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header Branding */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-border/10">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-primary text-white font-bold text-lg shadow-md shadow-primary/20">
              Q
            </div>
            <div>
              <span className="font-bold text-base text-white tracking-wide">Quebix HMS</span>
              <span className="text-xs text-primary font-semibold block -mt-1">Hospital System</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-sidebar-text hover:text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Info Capsule */}
        <div className="px-6 py-4 border-b border-border/10 flex items-center gap-3">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
            alt="User avatar"
            className="h-10 w-10 rounded-xl object-cover ring-2 ring-primary/40"
          />
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-white truncate">{currentUser?.name || 'Quebix User'}</h4>
            <span className="text-xs font-medium text-text-muted capitalize block">{currentUser?.role || 'Staff'}</span>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-1 select-none">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/10'
                      : 'hover:bg-white/5 hover:text-white text-sidebar-text'
                  }`
                }
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-border/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-xl text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
