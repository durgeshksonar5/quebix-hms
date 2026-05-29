import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ToastContainer from './components/common/Toast';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Portal Pages
import Dashboard from './pages/dashboard/Dashboard';
import Patients from './pages/patients/Patients';
import Doctors from './pages/doctors/Doctors';
import Appointments from './pages/appointments/Appointments';
import Departments from './pages/departments/Departments';
import Prescriptions from './pages/prescriptions/Prescriptions';
import Billing from './pages/billing/Billing';
import InvoicePreview from './pages/billing/InvoicePreview';
import Pharmacy from './pages/pharmacy/Pharmacy';
import Laboratory from './pages/laboratory/Laboratory';
import RoomsBeds from './pages/rooms/RoomsBeds';
import Staff from './pages/staff/Staff';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';

// 14 New Advanced Modules Pages
import EMR from './pages/emr/EMR';
import DoctorSchedule from './pages/doctor-schedule/DoctorSchedule';
import NotificationsPage from './pages/notifications/NotificationsPage';
import InternalChat from './pages/internal-chat/InternalChat';
import MedicalDocuments from './pages/medical-documents/MedicalDocuments';
import Insurance from './pages/insurance/Insurance';
import Emergency from './pages/emergency/Emergency';
import Ambulance from './pages/ambulance/Ambulance';
import ICUMonitoring from './pages/icu-monitoring/ICUMonitoring';
import Attendance from './pages/attendance/Attendance';
import Payroll from './pages/payroll/Payroll';
import QueueManagement from './pages/queue/QueueManagement';
import Feedback from './pages/feedback/Feedback';
import AuditLogs from './pages/audit-logs/AuditLogs';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Secure Portal Layout Shell */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/prescriptions" element={<Prescriptions />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/billing/preview" element={<InvoicePreview />} />
              <Route path="/pharmacy" element={<Pharmacy />} />
              <Route path="/laboratory" element={<Laboratory />} />
              <Route path="/rooms" element={<RoomsBeds />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />

              {/* 14 New Routes */}
              <Route path="/emr" element={<EMR />} />
              <Route path="/doctor-schedule" element={<DoctorSchedule />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/internal-chat" element={<InternalChat />} />
              <Route path="/medical-documents" element={<MedicalDocuments />} />
              <Route path="/insurance" element={<Insurance />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/ambulance" element={<Ambulance />} />
              <Route path="/icu-monitoring" element={<ICUMonitoring />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/payroll" element={<Payroll />} />
              <Route path="/queue" element={<QueueManagement />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/audit-logs" element={<AuditLogs />} />
            </Route>
          </Route>

          {/* Wildcard Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      {/* Global Toast Drawer overlay */}
      <ToastContainer />
    </AppProvider>
  );
}
