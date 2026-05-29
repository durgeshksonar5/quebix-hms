import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  defaultDepartments,
  defaultDoctors,
  defaultPatients,
  defaultAppointments,
  defaultPrescriptions,
  defaultBilling,
  defaultPharmacy,
  defaultLaboratory,
  defaultRooms,
  defaultStaff,
  demoUsers,
  defaultHospitalSettings,
  defaultEMR,
  defaultDoctorSchedules,
  defaultChatMessages,
  defaultMedicalDocuments,
  defaultInsuranceClaims,
  defaultEmergencyCases,
  defaultAmbulances,
  defaultICUMonitoring,
  defaultAttendanceLogs,
  defaultPayrollLogs,
  defaultQueueTokens,
  defaultFeedbackList,
  defaultAuditLogs
} from '../data/mockData';
import { getData, saveData, generateId } from '../utils/localStorage';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('quebix_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('quebix_user');
    if (saved) {
      const lowerSaved = saved.toLowerCase();
      if (
        lowerSaved.includes('medicore') ||
        lowerSaved.includes('connor') ||
        lowerSaved.includes('doe') ||
        lowerSaved.includes('smith') ||
        lowerSaved.includes('parker')
      ) {
        localStorage.removeItem('quebix_user');
        return null;
      }
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Collections State
  const [patients, setPatients] = useState(() => getData('patients', defaultPatients));
  const [doctors, setDoctors] = useState(() => getData('doctors', defaultDoctors));
  const [appointments, setAppointments] = useState(() => getData('appointments', defaultAppointments));
  const [departments, setDepartments] = useState(() => getData('departments', defaultDepartments));
  const [prescriptions, setPrescriptions] = useState(() => getData('prescriptions', defaultPrescriptions));
  const [billing, setBilling] = useState(() => getData('billing', defaultBilling));
  const [pharmacy, setPharmacy] = useState(() => getData('pharmacy', defaultPharmacy));
  const [laboratory, setLaboratory] = useState(() => getData('laboratory', defaultLaboratory));
  const [rooms, setRooms] = useState(() => getData('rooms', defaultRooms));
  const [staff, setStaff] = useState(() => getData('staff', defaultStaff));
  const [hospitalSettings, setHospitalSettings] = useState(() => getData('hospitalSettings', defaultHospitalSettings));
  const [usersList, setUsersList] = useState(() => getData('usersList', demoUsers));

  // 14 New Collections States
  const [emrList, setEmrList] = useState(() => getData('emrList', defaultEMR));
  const [schedules, setSchedules] = useState(() => getData('schedules', defaultDoctorSchedules));
  const [chatMessages, setChatMessages] = useState(() => getData('chatMessages', defaultChatMessages));
  const [documents, setDocuments] = useState(() => getData('documents', defaultMedicalDocuments));
  const [claims, setClaims] = useState(() => getData('claims', defaultInsuranceClaims));
  const [emergencies, setEmergencies] = useState(() => getData('emergencies', defaultEmergencyCases));
  const [ambulances, setAmbulances] = useState(() => getData('ambulances', defaultAmbulances));
  const [icuVitals, setIcuVitals] = useState(() => getData('icuVitals', defaultICUMonitoring));
  const [attendanceLogs, setAttendanceLogs] = useState(() => getData('attendanceLogs', defaultAttendanceLogs));
  const [payrollLogs, setPayrollLogs] = useState(() => getData('payrollLogs', defaultPayrollLogs));
  const [queueTokens, setQueueTokens] = useState(() => getData('queueTokens', defaultQueueTokens));
  const [feedbackList, setFeedbackList] = useState(() => getData('feedbackList', defaultFeedbackList));
  const [auditLogs, setAuditLogs] = useState(() => getData('auditLogs', defaultAuditLogs));
  const [persistentNotifications, setPersistentNotifications] = useState(() => getData('persistentNotifications', []));

  // Notification Alerts (Dashboard logs)
  const [notifications, setNotifications] = useState([]);
  // Toasts
  const [toasts, setToasts] = useState([]);

  // Save collections when they change
  useEffect(() => {
    localStorage.setItem('quebix_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('quebix_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('quebix_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('quebix_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('quebix_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem('quebix_billing', JSON.stringify(billing));
  }, [billing]);

  useEffect(() => {
    localStorage.setItem('quebix_pharmacy', JSON.stringify(pharmacy));
  }, [pharmacy]);

  useEffect(() => {
    localStorage.setItem('quebix_laboratory', JSON.stringify(laboratory));
  }, [laboratory]);

  useEffect(() => {
    localStorage.setItem('quebix_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('quebix_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('quebix_hospitalSettings', JSON.stringify(hospitalSettings));
  }, [hospitalSettings]);

  useEffect(() => {
    localStorage.setItem('quebix_usersList', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem('quebix_emrList', JSON.stringify(emrList));
  }, [emrList]);

  useEffect(() => {
    localStorage.setItem('quebix_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('quebix_chatMessages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('quebix_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('quebix_claims', JSON.stringify(claims));
  }, [claims]);

  useEffect(() => {
    localStorage.setItem('quebix_emergencies', JSON.stringify(emergencies));
  }, [emergencies]);

  useEffect(() => {
    localStorage.setItem('quebix_ambulances', JSON.stringify(ambulances));
  }, [ambulances]);

  useEffect(() => {
    localStorage.setItem('quebix_icuVitals', JSON.stringify(icuVitals));
  }, [icuVitals]);

  useEffect(() => {
    localStorage.setItem('quebix_attendanceLogs', JSON.stringify(attendanceLogs));
  }, [attendanceLogs]);

  useEffect(() => {
    localStorage.setItem('quebix_payrollLogs', JSON.stringify(payrollLogs));
  }, [payrollLogs]);

  useEffect(() => {
    localStorage.setItem('quebix_queueTokens', JSON.stringify(queueTokens));
  }, [queueTokens]);

  useEffect(() => {
    localStorage.setItem('quebix_feedbackList', JSON.stringify(feedbackList));
  }, [feedbackList]);

  useEffect(() => {
    localStorage.setItem('quebix_auditLogs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('quebix_persistentNotifications', JSON.stringify(persistentNotifications));
  }, [persistentNotifications]);

  // Apply Theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('quebix_theme', theme);
  }, [theme]);

  // Check pharmacy stocks and create emergency/notification list
  useEffect(() => {
    const alerts = [];
    // Low stock medicines
    pharmacy.forEach(med => {
      if (med.quantity <= 30) {
        alerts.push({
          id: `alert-stock-${med.id}`,
          type: 'warning',
          title: 'Low Medicine Stock',
          message: `${med.name} quantity is very low (${med.quantity} remaining).`,
          date: new Date().toLocaleDateString()
        });
      }
      // Expiring medicines (within 2 months of current local date May 2026)
      const expiry = new Date(med.expiryDate);
      const current = new Date('2026-05-29');
      const diffTime = expiry - current;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 60 && diffDays > 0) {
        alerts.push({
          id: `alert-expiry-${med.id}`,
          type: 'danger',
          title: 'Medicine Nearing Expiry',
          message: `${med.name} will expire in ${diffDays} days (${med.expiryDate}).`,
          date: new Date().toLocaleDateString()
        });
      } else if (diffDays <= 0) {
        alerts.push({
          id: `alert-expired-${med.id}`,
          type: 'danger',
          title: 'Medicine Expired',
          message: `${med.name} has expired on ${med.expiryDate}!`,
          date: new Date().toLocaleDateString()
        });
      }
    });

    // ICU Patients
    patients.forEach(pat => {
      if (pat.status === 'ICU') {
        alerts.push({
          id: `alert-patient-${pat.id}`,
          type: 'info',
          title: 'Critical Patient in ICU',
          message: `${pat.name} is currently admitted in the ICU.`,
          date: new Date().toLocaleDateString()
        });
      }
    });

    setNotifications(alerts);
  }, [pharmacy, patients]);

  // Toast Helpers
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Centralized Audit Activity Logger
  const logActivity = (module, action, description) => {
    const newLog = {
      id: generateId('AUD'),
      timestamp: new Date().toISOString(),
      user: currentUser ? currentUser.name : 'System',
      role: currentUser ? currentUser.role : 'System',
      module,
      action,
      description,
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 254 + 1)
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Auth Operations
  const login = (email, password) => {
    const user = usersList.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('quebix_user', JSON.stringify(user));
      addToast(`Welcome back, ${user.name}!`, 'success');
      logActivity('Auth', 'LOGIN', `User ${user.name} logged in successfully`);
      return true;
    }
    addToast('Invalid email or password', 'danger');
    return false;
  };

  const logout = () => {
    const name = currentUser ? currentUser.name : 'Unknown User';
    setCurrentUser(null);
    localStorage.removeItem('quebix_user');
    addToast('You have logged out successfully', 'info');
    logActivity('Auth', 'LOGOUT', `User ${name} logged out`);
  };

  const register = (name, email, password, role) => {
    const exists = usersList.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      addToast('User with this email already exists', 'danger');
      return false;
    }
    const newUser = {
      name,
      email,
      password,
      role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop'
    };
    setUsersList(prev => [...prev, newUser]);
    addToast('Account created successfully! Please login.', 'success');
    logActivity('Auth', 'REGISTER', `New account created for ${name} (${role})`);
    return true;
  };

  // CRUD for Patients
  const addPatient = (patient) => {
    const newId = `PAT-${String(patients.length + 1).padStart(3, '0')}`;
    const newPatient = { ...patient, id: newId };
    setPatients(prev => [newPatient, ...prev]);
    addToast('Patient record added successfully', 'success');
    logActivity('Patients', 'ADD', `Patient ${newPatient.name} (${newPatient.id}) registered`);
    return newPatient;
  };

  const updatePatient = (updated) => {
    setPatients(prev => prev.map(p => p.id === updated.id ? updated : p));
    setAppointments(prev => prev.map(apt => apt.patientId === updated.id ? { ...apt, patientName: updated.name } : apt));
    setPrescriptions(prev => prev.map(prx => prx.patientId === updated.id ? { ...prx, patientName: updated.name } : prx));
    setBilling(prev => prev.map(inv => inv.patientId === updated.id ? { ...inv, patientName: updated.name } : inv));
    setLaboratory(prev => prev.map(lab => lab.patientId === updated.id ? { ...lab, patientName: updated.name } : lab));
    setRooms(prev => prev.map(room => room.patientId === updated.id ? { ...room, patientName: updated.name } : room));
    addToast('Patient record updated successfully', 'success');
    logActivity('Patients', 'UPDATE', `Patient ${updated.name} (${updated.id}) details updated`);
  };

  const deletePatient = (id) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    setRooms(prev => prev.map(room => room.patientId === id ? { ...room, patientId: null, patientName: null, status: 'Available' } : room));
    addToast('Patient record deleted successfully', 'warning');
    logActivity('Patients', 'DELETE', `Patient record ${id} deleted`);
  };

  // CRUD for Doctors
  const addDoctor = (doctor) => {
    const newId = `DOC-${String(doctors.length + 1).padStart(3, '0')}`;
    const newDoctor = { ...doctor, id: newId };
    setDoctors(prev => [...prev, newDoctor]);
    addToast('Doctor added successfully', 'success');
    logActivity('Doctors', 'ADD', `Doctor ${newDoctor.name} (${newDoctor.id}) added`);
    return newDoctor;
  };

  const updateDoctor = (updated) => {
    setDoctors(prev => prev.map(d => d.id === updated.id ? updated : d));
    setAppointments(prev => prev.map(apt => apt.doctorId === updated.id ? { ...apt, doctorName: updated.name } : apt));
    addToast('Doctor details updated successfully', 'success');
    logActivity('Doctors', 'UPDATE', `Doctor ${updated.name} (${updated.id}) details updated`);
  };

  const deleteDoctor = (id) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
    addToast('Doctor removed successfully', 'warning');
    logActivity('Doctors', 'DELETE', `Doctor record ${id} removed`);
  };

  // CRUD for Appointments
  const bookAppointment = (appointment) => {
    const newId = `APT-${String(appointments.length + 1).padStart(3, '0')}`;
    const patientObj = patients.find(p => p.id === appointment.patientId);
    const doctorObj = doctors.find(d => d.id === appointment.doctorId);
    const newApt = {
      ...appointment,
      id: newId,
      patientName: patientObj ? patientObj.name : 'Unknown Patient',
      doctorName: doctorObj ? doctorObj.name : 'Unknown Doctor',
      status: appointment.status || 'Pending'
    };
    setAppointments(prev => [newApt, ...prev]);
    addToast('Appointment scheduled successfully', 'success');
    logActivity('Appointments', 'BOOK', `Appointment ${newApt.id} booked for patient ${newApt.patientName}`);
    return newApt;
  };

  const updateAppointment = (updated) => {
    setAppointments(prev => prev.map(apt => apt.id === updated.id ? updated : apt));
    addToast('Appointment updated successfully', 'success');
    logActivity('Appointments', 'UPDATE', `Appointment ${updated.id} details updated`);
  };

  const cancelAppointment = (id) => {
    setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status: 'Cancelled' } : apt));
    addToast('Appointment cancelled', 'info');
    logActivity('Appointments', 'CANCEL', `Appointment ${id} cancelled`);
  };

  const rescheduleAppointment = (id, newDate, newTime) => {
    setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, date: newDate, time: newTime, status: 'Confirmed' } : apt));
    addToast('Appointment rescheduled successfully', 'success');
    logActivity('Appointments', 'RESCHEDULE', `Appointment ${id} rescheduled to ${newDate} at ${newTime}`);
  };

  // CRUD for Departments
  const addDepartment = (dept) => {
    const newId = `DEP-${String(departments.length + 1).padStart(2, '0')}`;
    const newDept = { ...dept, id: newId, totalDoctors: 0 };
    setDepartments(prev => [...prev, newDept]);
    addToast('Department created successfully', 'success');
    logActivity('Departments', 'ADD', `Department ${newDept.name} created`);
  };

  const updateDepartment = (updated) => {
    setDepartments(prev => prev.map(d => d.id === updated.id ? updated : d));
    addToast('Department updated successfully', 'success');
    logActivity('Departments', 'UPDATE', `Department ${updated.name} updated`);
  };

  const deleteDepartment = (id) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
    addToast('Department deleted successfully', 'warning');
    logActivity('Departments', 'DELETE', `Department record ${id} deleted`);
  };

  // CRUD for Prescriptions
  const addPrescription = (prescription) => {
    const newId = `PRX-${String(prescriptions.length + 1).padStart(3, '0')}`;
    const patientObj = patients.find(p => p.id === prescription.patientId);
    const doctorObj = doctors.find(d => d.id === prescription.doctorId);
    const newPrescription = {
      ...prescription,
      id: newId,
      patientName: patientObj ? patientObj.name : 'Unknown Patient',
      doctorName: doctorObj ? doctorObj.name : 'Unknown Doctor',
    };
    setPrescriptions(prev => [newPrescription, ...prev]);
    addToast('Prescription generated successfully', 'success');
    logActivity('Prescriptions', 'ADD', `Prescription ${newPrescription.id} generated for patient ${newPrescription.patientName}`);
    return newPrescription;
  };

  const updatePrescription = (updated) => {
    setPrescriptions(prev => prev.map(prx => prx.id === updated.id ? updated : prx));
    addToast('Prescription updated successfully', 'success');
    logActivity('Prescriptions', 'UPDATE', `Prescription ${updated.id} updated`);
  };

  const deletePrescription = (id) => {
    setPrescriptions(prev => prev.filter(p => p.id !== id));
    addToast('Prescription deleted successfully', 'warning');
    logActivity('Prescriptions', 'DELETE', `Prescription record ${id} deleted`);
  };

  // CRUD for Billing (Invoices)
  const addInvoice = (invoice) => {
    const newId = `INV-${String(billing.length + 1).padStart(3, '0')}`;
    const patientObj = patients.find(p => p.id === invoice.patientId);
    const newInvoice = {
      ...invoice,
      id: newId,
      patientName: patientObj ? patientObj.name : 'Unknown Patient',
      date: invoice.date || new Date().toISOString().split('T')[0]
    };
    setBilling(prev => [newInvoice, ...prev]);
    addToast('Invoice generated successfully', 'success');
    logActivity('Billing', 'ADD', `Invoice ${newInvoice.id} generated for patient ${newInvoice.patientName}`);
    return newInvoice;
  };

  const updateInvoice = (updated) => {
    setBilling(prev => prev.map(b => b.id === updated.id ? updated : b));
    addToast('Invoice details updated', 'success');
    logActivity('Billing', 'UPDATE', `Invoice ${updated.id} details updated`);
  };

  const deleteInvoice = (id) => {
    setBilling(prev => prev.filter(b => b.id !== id));
    addToast('Invoice removed', 'warning');
    logActivity('Billing', 'DELETE', `Invoice ${id} deleted`);
  };

  // CRUD for Pharmacy Stock
  const addMedicine = (medicine) => {
    const newId = `MED-${String(pharmacy.length + 1).padStart(3, '0')}`;
    const newMed = {
      ...medicine,
      id: newId,
      status: medicine.quantity === 0 ? 'Out of Stock' : (medicine.quantity <= 30 ? 'Low Stock' : 'In Stock')
    };
    setPharmacy(prev => [...prev, newMed]);
    addToast('Medicine added to inventory', 'success');
    logActivity('Pharmacy', 'ADD', `Medicine ${newMed.name} added to inventory`);
  };

  const updateMedicine = (updated) => {
    const status = updated.quantity === 0 ? 'Out of Stock' : (updated.quantity <= 30 ? 'Low Stock' : 'In Stock');
    setPharmacy(prev => prev.map(m => m.id === updated.id ? { ...updated, status } : m));
    addToast('Medicine stock details updated', 'success');
    logActivity('Pharmacy', 'UPDATE', `Medicine ${updated.name} stock updated`);
  };

  const deleteMedicine = (id) => {
    setPharmacy(prev => prev.filter(m => m.id !== id));
    addToast('Medicine removed from inventory', 'warning');
    logActivity('Pharmacy', 'DELETE', `Medicine ${id} removed`);
  };

  // CRUD for Laboratory Reports
  const addLabTest = (test) => {
    const newId = `LAB-${String(laboratory.length + 1).padStart(3, '0')}`;
    const patientObj = patients.find(p => p.id === test.patientId);
    const doctorObj = doctors.find(d => d.id === test.doctorId);
    const newTest = {
      ...test,
      id: newId,
      patientName: patientObj ? patientObj.name : 'Unknown Patient',
      doctorName: doctorObj ? doctorObj.name : 'Unknown Doctor',
      testDate: test.testDate || new Date().toISOString().split('T')[0],
      reportStatus: test.reportStatus || 'Pending'
    };
    setLaboratory(prev => [newTest, ...prev]);
    addToast('Lab test order scheduled', 'success');
    logActivity('Laboratory', 'ADD', `Lab test ${newTest.testName} ordered for ${newTest.patientName}`);
    return newTest;
  };

  const updateLabTest = (updated) => {
    setLaboratory(prev => prev.map(t => t.id === updated.id ? updated : t));
    addToast('Lab report updated successfully', 'success');
    logActivity('Laboratory', 'UPDATE', `Lab report ${updated.id} updated`);
  };

  const deleteLabTest = (id) => {
    setLaboratory(prev => prev.filter(t => t.id !== id));
    addToast('Lab report deleted', 'warning');
    logActivity('Laboratory', 'DELETE', `Lab report ${id} deleted`);
  };

  // Rooms & Beds Management
  const addRoom = (room) => {
    const newId = `RM-${room.roomNumber}-${room.bedNumber.replace('Bed ', '')}`;
    const newBed = {
      id: newId,
      ...room,
      patientId: null,
      patientName: null,
      status: 'Available'
    };
    setRooms(prev => [...prev, newBed]);
    addToast(`Bed ${room.bedNumber} added to Room ${room.roomNumber}`, 'success');
    logActivity('Rooms', 'ADD', `Room bed ${newBed.roomNumber}-${newBed.bedNumber} added`);
  };

  const updateRoomBed = (updated) => {
    setRooms(prev => prev.map(r => r.id === updated.id ? updated : r));
    logActivity('Rooms', 'UPDATE', `Room bed ${updated.id} updated`);
  };

  const assignBed = (bedId, patientId) => {
    const patientObj = patients.find(p => p.id === patientId);
    if (!patientObj) return;

    const alreadyAssigned = rooms.find(r => r.patientId === patientId);
    if (alreadyAssigned) {
      addToast(`Patient is already assigned to Room ${alreadyAssigned.roomNumber} - ${alreadyAssigned.bedNumber}`, 'danger');
      return false;
    }

    setRooms(prev => prev.map(room => {
      if (room.id === bedId) {
        return {
          ...room,
          patientId: patientObj.id,
          patientName: patientObj.name,
          status: 'Occupied'
        };
      }
      return room;
    }));

    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, status: 'Active' } : p));
    addToast(`Patient assigned to room successfully`, 'success');
    logActivity('Rooms', 'ASSIGN', `Bed ${bedId} assigned to patient ${patientId}`);
    return true;
  };

  const dischargePatientBed = (bedId) => {
    const roomObj = rooms.find(r => r.id === bedId);
    if (!roomObj || !roomObj.patientId) return;

    const patId = roomObj.patientId;

    setRooms(prev => prev.map(room => {
      if (room.id === bedId) {
        return {
          ...room,
          patientId: null,
          patientName: null,
          status: 'Available'
        };
      }
      return room;
    }));

    setPatients(prev => prev.map(p => p.id === patId ? { ...p, status: 'Discharged' } : p));
    addToast(`Patient discharged and bed is now free`, 'success');
    logActivity('Rooms', 'DISCHARGE', `Patient discharged from bed ${bedId}`);
  };

  // CRUD for Staff
  const addStaff = (member) => {
    const newId = `STF-${String(staff.length + 1).padStart(3, '0')}`;
    const newMember = { ...member, id: newId, attendanceStatus: 'Present' };
    setStaff(prev => [...prev, newMember]);
    addToast('Staff member added successfully', 'success');
    logActivity('Staff', 'ADD', `Staff member ${newMember.name} added`);
    return newMember;
  };

  const updateStaff = (updated) => {
    setStaff(prev => prev.map(s => s.id === updated.id ? updated : s));
    addToast('Staff profile updated', 'success');
    logActivity('Staff', 'UPDATE', `Staff member ${updated.name} updated`);
  };

  const deleteStaff = (id) => {
    setStaff(prev => prev.filter(s => s.id !== id));
    addToast('Staff record removed', 'warning');
    logActivity('Staff', 'DELETE', `Staff member record ${id} removed`);
  };

  const updateStaffAttendance = (id, attendanceStatus) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, attendanceStatus } : s));
    addToast('Attendance updated', 'success');
    logActivity('Staff', 'ATTENDANCE', `Attendance status for staff ${id} updated to ${attendanceStatus}`);
  };

  // Settings Update
  const updateSettings = (updated) => {
    setHospitalSettings(updated);
    addToast('Hospital configurations updated', 'success');
    logActivity('Settings', 'UPDATE', `Hospital configuration settings updated`);
  };

  // 1. EMR Actions
  const addEMR = (emr) => {
    const newId = generateId('EMR');
    const newEMR = { ...emr, id: newId, date: new Date().toISOString().split('T')[0] };
    setEmrList(prev => [newEMR, ...prev]);
    logActivity('EMR', 'ADD', `EMR created for patient ID ${emr.patientId}`);
    addToast('EMR Record added successfully', 'success');
    return newEMR;
  };
  const updateEMR = (updated) => {
    setEmrList(prev => prev.map(e => e.id === updated.id ? updated : e));
    logActivity('EMR', 'UPDATE', `EMR record ${updated.id} updated`);
    addToast('EMR Record updated', 'success');
  };
  const deleteEMR = (id) => {
    setEmrList(prev => prev.filter(e => e.id !== id));
    logActivity('EMR', 'DELETE', `EMR record ${id} removed`);
    addToast('EMR Record removed', 'warning');
  };

  // 2. Doctor Scheduling Actions
  const addSchedule = (schedule) => {
    const newId = generateId('SCH');
    const newSchedule = { ...schedule, id: newId };
    setSchedules(prev => [...prev, newSchedule]);
    logActivity('Doctor Schedule', 'ADD', `Schedule added for doctor ${schedule.doctorName}`);
    addToast('Schedule added successfully', 'success');
    return newSchedule;
  };
  const updateSchedule = (updated) => {
    setSchedules(prev => prev.map(s => s.id === updated.id ? updated : s));
    logActivity('Doctor Schedule', 'UPDATE', `Schedule ${updated.id} updated for doctor ${updated.doctorName}`);
    addToast('Schedule updated successfully', 'success');
  };
  const deleteSchedule = (id) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    logActivity('Doctor Schedule', 'DELETE', `Schedule ${id} removed`);
    addToast('Schedule removed', 'warning');
  };

  // 3. Notification Center Actions
  const addPersistentNotification = (notification) => {
    const newId = generateId('NTF');
    const newNotification = {
      ...notification,
      id: newId,
      timestamp: new Date().toISOString(),
      read: false
    };
    setPersistentNotifications(prev => [newNotification, ...prev]);
    return newNotification;
  };
  const markNotificationRead = (id) => {
    setPersistentNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  const clearAllNotifications = () => {
    setPersistentNotifications([]);
    addToast('Notifications cleared', 'info');
  };

  // 4. Internal Chat Actions
  const sendMessage = (sender, text, recipient = 'All') => {
    const newMsg = {
      id: generateId('MSG'),
      sender,
      text,
      recipient,
      timestamp: new Date().toISOString()
    };
    setChatMessages(prev => [...prev, newMsg]);
    return newMsg;
  };
  const clearChatHistory = () => {
    setChatMessages([]);
  };

  // 5. Document Management Actions
  const uploadDocument = (doc) => {
    const newId = generateId('DOC');
    const newDoc = {
      ...doc,
      id: newId,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setDocuments(prev => [newDoc, ...prev]);
    logActivity('Documents', 'UPLOAD', `Document ${doc.name} uploaded for patient ID ${doc.patientId}`);
    addToast('Document uploaded successfully', 'success');
    return newDoc;
  };
  const deleteDocument = (id) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    logActivity('Documents', 'DELETE', `Document ${id} deleted`);
    addToast('Document deleted', 'warning');
  };

  // 6. Insurance Claims Actions
  const addClaim = (claim) => {
    const newId = generateId('CLM');
    const newClaim = {
      ...claim,
      id: newId,
      filedDate: new Date().toISOString().split('T')[0]
    };
    setClaims(prev => [newClaim, ...prev]);
    logActivity('Insurance', 'CLAIM_FILE', `Insurance claim for patient ${claim.patientName} filed`);
    addToast('Claim filed successfully', 'success');
    return newClaim;
  };
  const updateClaimStatus = (id, status) => {
    setClaims(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    logActivity('Insurance', 'CLAIM_STATUS', `Claim ${id} status updated to ${status}`);
    addToast(`Claim status updated to ${status}`, 'success');
  };

  // 7. Emergency Triage Actions
  const addEmergencyCase = (caseData) => {
    const newId = generateId('EMG');
    const newCase = {
      ...caseData,
      id: newId,
      admittedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setEmergencies(prev => [newCase, ...prev]);
    logActivity('Emergency', 'TRIAGE', `Emergency case registered for ${caseData.patientName}`);
    addToast('Emergency case registered', 'success');
    return newCase;
  };
  const updateEmergencyCase = (updated) => {
    setEmergencies(prev => prev.map(e => e.id === updated.id ? updated : e));
    logActivity('Emergency', 'UPDATE', `Emergency case ${updated.id} updated`);
    addToast('Emergency case details updated', 'success');
  };

  // 8. Ambulance Dispatch Actions
  const addAmbulance = (ambulance) => {
    const newId = generateId('AMB');
    const newAmb = { ...ambulance, id: newId };
    setAmbulances(prev => [...prev, newAmb]);
    logActivity('Ambulance', 'ADD', `Ambulance ${newAmb.vehicleNumber} added`);
    addToast('Ambulance added successfully', 'success');
    return newAmb;
  };
  const updateAmbulance = (updated) => {
    setAmbulances(prev => prev.map(a => a.id === updated.id ? updated : a));
    addToast('Ambulance details updated', 'success');
  };
  const dispatchAmbulance = (id, driverName, patientName, location) => {
    setAmbulances(prev => prev.map(a => a.id === id ? {
      ...a,
      status: 'Dispatched',
      driverName,
      currentAssignment: `Patient: ${patientName}, Location: ${location}`
    } : a));
    logActivity('Ambulance', 'DISPATCH', `Ambulance ${id} dispatched to ${location}`);
    addToast('Ambulance dispatched', 'success');
  };
  const updateAmbulanceStatus = (id, status) => {
    setAmbulances(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    logActivity('Ambulance', 'STATUS', `Ambulance ${id} status updated to ${status}`);
  };

  // 9. ICU Vital Telemetry Actions
  const updateICUVitals = (id, vitalData) => {
    setIcuVitals(prev => prev.map(v => v.id === id ? { ...v, ...vitalData } : v));
  };
  const addICUMonitoring = (icuRecord) => {
    const newId = generateId('ICU');
    const record = { ...icuRecord, id: newId };
    setIcuVitals(prev => [record, ...prev]);
    logActivity('ICU', 'MONITOR_ADD', `Patient ${icuRecord.patientName} added to ICU Vital Telemetry`);
    addToast('Patient added to ICU Monitoring', 'success');
    return record;
  };
  const removeICUMonitoring = (id) => {
    setIcuVitals(prev => prev.filter(v => v.id !== id));
    logActivity('ICU', 'MONITOR_REMOVE', `ICU monitoring record ${id} removed`);
    addToast('Patient removed from ICU Monitoring', 'warning');
  };

  // 10. Attendance Actions
  const logAttendance = (staffId, date, checkInTime, checkOutTime, status) => {
    const newLog = {
      id: generateId('ATT'),
      staffId,
      date,
      checkIn: checkInTime,
      checkOut: checkOutTime,
      status
    };
    setAttendanceLogs(prev => [newLog, ...prev]);
    return newLog;
  };
  const checkInStaff = (staffId) => {
    const staffMember = staff.find(s => s.id === staffId);
    if (!staffMember) return;
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const log = logAttendance(staffId, today, now, null, 'Present');
    setStaff(prev => prev.map(s => s.id === staffId ? { ...s, attendanceStatus: 'Present' } : s));
    logActivity('Attendance', 'CHECK_IN', `Staff ${staffMember.name} checked in at ${now}`);
    addToast(`${staffMember.name} checked in`, 'success');
    return log;
  };
  const checkOutStaff = (staffId) => {
    const staffMember = staff.find(s => s.id === staffId);
    if (!staffMember) return;
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAttendanceLogs(prev => {
      const match = prev.find(l => l.staffId === staffId && l.date === today);
      if (match) {
        return prev.map(l => l.id === match.id ? { ...l, checkOut: now } : l);
      } else {
        return [{ id: generateId('ATT'), staffId, date: today, checkIn: '--:--', checkOut: now, status: 'Present' }, ...prev];
      }
    });
    setStaff(prev => prev.map(s => s.id === staffId ? { ...s, attendanceStatus: 'Absent' } : s));
    logActivity('Attendance', 'CHECK_OUT', `Staff ${staffMember.name} checked out at ${now}`);
    addToast(`${staffMember.name} checked out`, 'info');
  };

  // 11. Payroll Actions
  const addPayrollLog = (payroll) => {
    const newId = generateId('PAY');
    const newPayroll = { ...payroll, id: newId };
    setPayrollLogs(prev => [newPayroll, ...prev]);
    logActivity('Payroll', 'ADD', `Payroll log for staff ${payroll.staffName} added`);
    return newPayroll;
  };
  const generatePayroll = (month, year) => {
    const generated = staff.map(s => {
      const basic = s.salary || 45000;
      const allowance = Math.floor(basic * 0.1);
      const deductions = Math.floor(basic * 0.05);
      const net = basic + allowance - deductions;
      return {
        id: generateId('PAY'),
        staffId: s.id,
        staffName: s.name,
        role: s.role,
        month,
        year,
        basicSalary: basic,
        allowances: allowance,
        deductions,
        netSalary: net,
        status: 'Pending'
      };
    });
    setPayrollLogs(prev => [...generated, ...prev]);
    logActivity('Payroll', 'GENERATE', `Generated payroll for ${month} ${year}`);
    addToast(`Payroll generated for ${month} ${year}`, 'success');
  };
  const updatePayrollStatus = (id, status) => {
    setPayrollLogs(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    logActivity('Payroll', 'STATUS', `Payroll ${id} status updated to ${status}`);
    addToast(`Payroll status updated to ${status}`, 'success');
  };

  // 12. Token Queue Actions
  const generateToken = (patientName, department, priority = 'Normal') => {
    const today = new Date().toISOString().split('T')[0];
    const deptTokens = queueTokens.filter(t => t.department === department && t.tokenDate === today);
    const tokenNumber = deptTokens.length + 1;
    const newToken = {
      id: generateId('TOK'),
      tokenNumber: `${department.substring(0, 3).toUpperCase()}-${String(tokenNumber).padStart(3, '0')}`,
      patientName,
      department,
      status: 'Waiting',
      priority,
      tokenDate: today,
      timeCreated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setQueueTokens(prev => [...prev, newToken]);
    logActivity('Queue', 'TOKEN_GENERATE', `Token ${newToken.tokenNumber} generated for ${patientName}`);
    addToast(`Token ${newToken.tokenNumber} generated`, 'success');
    return newToken;
  };
  const updateTokenStatus = (id, status) => {
    setQueueTokens(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    logActivity('Queue', 'TOKEN_STATUS', `Token ${id} status updated to ${status}`);
  };

  // 13. Patient Feedback Actions
  const addFeedback = (feedback) => {
    const newId = generateId('FDB');
    const newFeedback = {
      ...feedback,
      id: newId,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setFeedbackList(prev => [newFeedback, ...prev]);
    logActivity('Feedback', 'ADD', `Feedback added by patient ${feedback.patientName}`);
    addToast('Feedback submitted successfully', 'success');
    return newFeedback;
  };
  const resolveFeedback = (id, response) => {
    setFeedbackList(prev => prev.map(f => f.id === id ? { ...f, status: 'Resolved', response } : f));
    logActivity('Feedback', 'RESOLVE', `Feedback ${id} resolved`);
    addToast('Feedback status marked as Resolved', 'success');
  };

  // 14. Audit Logs Actions
  const clearAuditLogs = () => {
    setAuditLogs([]);
    addToast('Audit logs cleared', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentUser,
        login,
        logout,
        register,
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        doctors,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        appointments,
        bookAppointment,
        updateAppointment,
        cancelAppointment,
        rescheduleAppointment,
        departments,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        prescriptions,
        addPrescription,
        updatePrescription,
        deletePrescription,
        billing,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        pharmacy,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        laboratory,
        addLabTest,
        updateLabTest,
        deleteLabTest,
        rooms,
        addRoom,
        updateRoomBed,
        assignBed,
        dischargePatientBed,
        staff,
        addStaff,
        updateStaff,
        deleteStaff,
        updateStaffAttendance,
        hospitalSettings,
        updateSettings,
        notifications,
        toasts,
        addToast,
        removeToast,

        // 14 New Advanced Modules Exports
        emrList,
        addEMR,
        updateEMR,
        deleteEMR,
        schedules,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        chatMessages,
        sendMessage,
        clearChatHistory,
        documents,
        uploadDocument,
        deleteDocument,
        claims,
        addClaim,
        updateClaimStatus,
        emergencies,
        addEmergencyCase,
        updateEmergencyCase,
        ambulances,
        addAmbulance,
        updateAmbulance,
        dispatchAmbulance,
        updateAmbulanceStatus,
        icuVitals,
        updateICUVitals,
        addICUMonitoring,
        removeICUMonitoring,
        attendanceLogs,
        logAttendance,
        checkInStaff,
        checkOutStaff,
        payrollLogs,
        addPayrollLog,
        generatePayroll,
        updatePayrollStatus,
        queueTokens,
        generateToken,
        updateTokenStatus,
        feedbackList,
        addFeedback,
        resolveFeedback,
        auditLogs,
        logActivity,
        clearAuditLogs,
        persistentNotifications,
        addPersistentNotification,
        markNotificationRead,
        clearAllNotifications
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
