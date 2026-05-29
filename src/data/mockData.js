// Seed data for Quebix HMS - Indian Demographic Edition

export const defaultDepartments = [
  { id: 'DEP-01', name: 'Cardiology', description: 'Deals with disorders of the heart and circulatory system.', headDoctor: 'Dr. Priya Sharma', totalDoctors: 3, status: 'Active' },
  { id: 'DEP-02', name: 'Neurology', description: 'Focuses on diagnosing and treating disorders of the nervous system.', headDoctor: 'Dr. Rajesh Iyer', totalDoctors: 2, status: 'Active' },
  { id: 'DEP-03', name: 'Orthopedics', description: 'Specializes in conditions involving the musculoskeletal system.', headDoctor: 'Dr. Amit Patel', totalDoctors: 2, status: 'Active' },
  { id: 'DEP-04', name: 'Pediatrics', description: 'Medical care for infants, children, and adolescents.', headDoctor: 'Dr. Sneha Reddy', totalDoctors: 2, status: 'Active' },
  { id: 'DEP-05', name: 'Dermatology', description: 'Deals with diseases and conditions related to skin, hair, and nails.', headDoctor: 'Dr. Kavita Joshi', totalDoctors: 1, status: 'Active' },
  { id: 'DEP-06', name: 'General Medicine', description: 'Primary healthcare and internal medicine diagnosis.', headDoctor: 'Dr. Vijay Kapoor', totalDoctors: 4, status: 'Active' },
  { id: 'DEP-07', name: 'Emergency', description: '24/7 immediate trauma and acute illness care.', headDoctor: 'Dr. Anjali Desai', totalDoctors: 3, status: 'Active' }
];

export const defaultDoctors = [
  { id: 'DOC-001', name: 'Dr. Priya Sharma', specialization: 'Cardiologist', department: 'Cardiology', qualification: 'MD, DM (Cardiology)', experience: '12 Years', phone: '9876543210', email: 'priya.sharma@quebixhms.com', availabilityDays: ['Mon', 'Wed', 'Fri'], timeSlot: '09:00 AM - 01:00 PM', consultationFee: 800, status: 'Active' },
  { id: 'DOC-002', name: 'Dr. Rajesh Iyer', specialization: 'Neurologist', department: 'Neurology', qualification: 'MD, DM (Neurology)', experience: '15 Years', phone: '9876543211', email: 'rajesh.iyer@quebixhms.com', availabilityDays: ['Tue', 'Thu', 'Sat'], timeSlot: '10:00 AM - 02:00 PM', consultationFee: 1000, status: 'Active' },
  { id: 'DOC-003', name: 'Dr. Amit Patel', specialization: 'Orthopedic Surgeon', department: 'Orthopedics', qualification: 'MS (Ortho), MCh', experience: '10 Years', phone: '9876543212', email: 'amit.patel@quebixhms.com', availabilityDays: ['Mon', 'Tue', 'Thu'], timeSlot: '02:00 PM - 06:00 PM', consultationFee: 750, status: 'Active' },
  { id: 'DOC-004', name: 'Dr. Sneha Reddy', specialization: 'Pediatrician', department: 'Pediatrics', qualification: 'MD (Pediatrics), DCH', experience: '8 Years', phone: '9876543213', email: 'sneha.reddy@quebixhms.com', availabilityDays: ['Mon', 'Wed', 'Thu', 'Fri'], timeSlot: '09:00 AM - 12:00 PM', consultationFee: 600, status: 'Active' },
  { id: 'DOC-005', name: 'Dr. Vijay Kapoor', specialization: 'General Physician', department: 'General Medicine', qualification: 'MBBS, MD (Medicine)', experience: '18 Years', phone: '9876543214', email: 'vijay.kapoor@quebixhms.com', availabilityDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], timeSlot: '08:00 AM - 11:30 AM', consultationFee: 500, status: 'Active' },
  { id: 'DOC-006', name: 'Dr. Anjali Desai', specialization: 'Trauma Specialist', department: 'Emergency', qualification: 'MD (Emergency Medicine)', experience: '9 Years', phone: '9876543215', email: 'anjali.desai@quebixhms.com', availabilityDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], timeSlot: 'Shift-based (24/7)', consultationFee: 650, status: 'Active' },
  { id: 'DOC-007', name: 'Dr. Kavita Joshi', specialization: 'Dermatologist', department: 'Dermatology', qualification: 'MD (Dermatology)', experience: '7 Years', phone: '9876543216', email: 'kavita.joshi@quebixhms.com', availabilityDays: ['Tue', 'Fri'], timeSlot: '04:00 PM - 07:00 PM', consultationFee: 700, status: 'Active' }
];

export const defaultPatients = [
  { id: 'PAT-001', name: 'Aarav Mehta', age: 45, gender: 'Male', bloodGroup: 'O+', phone: '9812345670', email: 'aarav.mehta@gmail.com', address: 'Flat 102, Shanti Sadan, Mumbai', emergencyContact: 'Neha Mehta (9812345671)', insuranceProvider: 'Star Health Insurance', medicalHistory: 'Chronic hypertension, mild asthma', status: 'Active' },
  { id: 'PAT-002', name: 'Diya Nair', age: 32, gender: 'Female', bloodGroup: 'A-', phone: '9812345672', email: 'diya.nair@yahoo.com', address: '45, Galaxy Apartment, Bandra, Mumbai', emergencyContact: 'Suresh Nair (9812345673)', insuranceProvider: 'HDFC Ergo Health', medicalHistory: 'Seasonal allergies, appendectomy (2018)', status: 'Outpatient' },
  { id: 'PAT-003', name: 'Vikram Singh', age: 67, gender: 'Male', bloodGroup: 'B+', phone: '9812345674', email: 'vikram.singh@hotmail.com', address: '12, Residency Road, Bangalore', emergencyContact: 'Kiran Singh (9812345675)', insuranceProvider: 'LIC Health Shield', medicalHistory: 'Type 2 diabetes, coronary artery disease', status: 'ICU' },
  { id: 'PAT-004', name: 'Ananya Rao', age: 9, gender: 'Female', bloodGroup: 'AB+', phone: '9812345676', email: 'ananya.rao@gmail.com', address: 'Apartment 5B, Lotus Heights, Pune', emergencyContact: 'Harish Rao (9812345677)', insuranceProvider: 'None', medicalHistory: 'Fractured left arm (2025)', status: 'Discharged' },
  { id: 'PAT-005', name: 'Rohan Gupta', age: 52, gender: 'Male', bloodGroup: 'O-', phone: '9812345678', email: 'rohan.gupta@gmail.com', address: 'Plot 88, Sector 15, Noida', emergencyContact: 'Geeta Gupta (9812345679)', insuranceProvider: 'ICICI Lombard', medicalHistory: 'Gastroesophageal reflux disease (GERD)', status: 'Active' },
  { id: 'PAT-006', name: 'Meera Verma', age: 28, gender: 'Female', bloodGroup: 'A+', phone: '9812345680', email: 'meera.v@gmail.com', address: '7-1-20, Ameerpet, Hyderabad', emergencyContact: 'Ravi Verma (9812345681)', insuranceProvider: 'Bajaj Allianz', medicalHistory: 'Hypothyroidism', status: 'Outpatient' },
  { id: 'PAT-007', name: 'Arjun Bansal', age: 71, gender: 'Male', bloodGroup: 'AB-', phone: '9812345682', email: 'arjun.b@gmail.com', address: '15/3, Gariahat Road, Kolkata', emergencyContact: 'Vinod Bansal (9812345683)', insuranceProvider: 'LIC Health Shield', medicalHistory: 'Osteoarthritis, benign prostatic hyperplasia', status: 'Active' }
];

export const defaultAppointments = [
  { id: 'APT-001', patientId: 'PAT-001', patientName: 'Aarav Mehta', doctorId: 'DOC-001', doctorName: 'Dr. Priya Sharma', department: 'Cardiology', date: '2026-05-29', time: '09:30 AM', reason: 'Routine heart checkup and blood pressure monitoring', status: 'Confirmed', notes: 'Patient to bring previous ECG reports.' },
  { id: 'APT-002', patientId: 'PAT-002', patientName: 'Diya Nair', doctorId: 'DOC-007', doctorName: 'Dr. Kavita Joshi', department: 'Dermatology', date: '2026-05-29', time: '04:30 PM', reason: 'Unusual skin rash consultation', status: 'Pending', notes: 'Check for allergic contact dermatitis.' },
  { id: 'APT-003', patientId: 'PAT-003', patientName: 'Vikram Singh', doctorId: 'DOC-002', doctorName: 'Dr. Rajesh Iyer', department: 'Neurology', date: '2026-05-30', time: '11:00 AM', reason: 'Follow-up for chronic diabetic neuropathy', status: 'Confirmed', notes: 'Review nerve conduction test results.' },
  { id: 'APT-004', patientId: 'PAT-004', patientName: 'Ananya Rao', doctorId: 'DOC-004', doctorName: 'Dr. Sneha Reddy', department: 'Pediatrics', date: '2026-05-28', time: '10:00 AM', reason: 'General developmental assessment', status: 'Completed', notes: 'Child growing normally, arm fracture healed.' },
  { id: 'APT-005', patientId: 'PAT-005', patientName: 'Rohan Gupta', doctorId: 'DOC-005', doctorName: 'Dr. Vijay Kapoor', department: 'General Medicine', date: '2026-05-29', time: '09:00 AM', reason: 'Severe stomach acidity and bloating', status: 'Confirmed', notes: 'Discuss lifestyle adjustments and antacids.' },
  { id: 'APT-006', patientId: 'PAT-006', patientName: 'Meera Verma', doctorId: 'DOC-005', doctorName: 'Dr. Vijay Kapoor', department: 'General Medicine', date: '2026-05-27', time: '10:30 AM', reason: 'Regular thyroid panel evaluation', status: 'Completed', notes: 'Adjust levothyroxine dosage slightly.' },
  { id: 'APT-007', patientId: 'PAT-007', patientName: 'Arjun Bansal', doctorId: 'DOC-003', doctorName: 'Dr. Amit Patel', department: 'Orthopedics', date: '2026-05-31', time: '03:00 PM', reason: 'Severe bilateral knee joint pain', status: 'Confirmed', notes: 'May require X-ray references.' },
  { id: 'APT-008', patientId: 'PAT-001', patientName: 'Aarav Mehta', doctorId: 'DOC-001', doctorName: 'Dr. Priya Sharma', department: 'Cardiology', date: '2026-05-15', time: '09:30 AM', reason: 'Sudden chest tightening', status: 'Completed', notes: 'ECG was normal. Advised stress test.' },
  { id: 'APT-009', patientId: 'PAT-002', patientName: 'Diya Nair', doctorId: 'DOC-005', doctorName: 'Dr. Vijay Kapoor', department: 'General Medicine', date: '2026-05-20', time: '02:00 PM', reason: 'Common cold and fever', status: 'Cancelled', notes: 'Cancelled by patient.' }
];

export const defaultPrescriptions = [
  {
    id: 'PRX-001',
    patientId: 'PAT-001',
    patientName: 'Aarav Mehta',
    doctorId: 'DOC-001',
    doctorName: 'Dr. Priya Sharma',
    diagnosis: 'Essential Hypertension',
    symptoms: 'Mild morning headache, elevated blood pressure (150/95)',
    medicines: [
      { name: 'Amlodipine (5mg)', dosage: '1 tablet daily', frequency: '0-0-1 (Night)', duration: '30 Days' },
      { name: 'Aspirin (75mg)', dosage: '1 tablet daily', frequency: '1-0-0 (Morning, post food)', duration: '30 Days' }
    ],
    dosageInstructions: 'Take medications regularly. Restrict salt intake to less than 5g per day. Avoid heavy lifting.',
    testsRecommended: 'Serum Creatinine, Lipid Profile, ECG',
    followUpDate: '2026-06-25',
    notes: 'Return immediately if experiencing chest pain, breathlessness, or blurred vision.'
  },
  {
    id: 'PRX-002',
    patientId: 'PAT-005',
    patientName: 'Rohan Gupta',
    doctorId: 'DOC-005',
    doctorName: 'Dr. Vijay Kapoor',
    diagnosis: 'Gastroesophageal Reflux Disease (GERD)',
    symptoms: 'Acid reflux, retrosternal burning, sour belching after meals',
    medicines: [
      { name: 'Pantoprazole (40mg)', dosage: '1 tablet empty stomach', frequency: '1-0-0 (Before breakfast)', duration: '14 Days' },
      { name: 'Domperidone (10mg)', dosage: '1 tablet twice daily', frequency: '1-0-1 (30 mins before meals)', duration: '14 Days' }
    ],
    dosageInstructions: 'Avoid lying down for 2 hours after meals. Limit tea, coffee, and spicy foods.',
    testsRecommended: 'None',
    followUpDate: '2026-06-12',
    notes: 'Eat small, frequent meals rather than large ones.'
  }
];

export const defaultBilling = [
  {
    id: 'INV-001',
    patientId: 'PAT-001',
    patientName: 'Aarav Mehta',
    services: [
      { name: 'Cardiology Consultation', charge: 800 },
      { name: 'ECG Test', charge: 500 },
      { name: 'Pharmacy - Amlodipine & Aspirin', charge: 350 }
    ],
    consultationFee: 800,
    medicineCharges: 350,
    labCharges: 500,
    roomCharges: 0,
    discount: 100,
    tax: 121,
    totalAmount: 1674,
    paymentStatus: 'Paid',
    paymentMethod: 'Card',
    date: '2026-05-29'
  },
  {
    id: 'INV-002',
    patientId: 'PAT-003',
    patientName: 'Vikram Singh',
    services: [
      { name: 'Neurology Consultation', charge: 1000 },
      { name: 'ICU Room Charge (2 Days)', charge: 10000 },
      { name: 'Lab - MRI Brain Scan', charge: 6500 },
      { name: 'Pharmacy - Specialized Drugs', charge: 1800 }
    ],
    consultationFee: 1000,
    medicineCharges: 1800,
    labCharges: 6500,
    roomCharges: 10000,
    discount: 1500,
    tax: 1424,
    totalAmount: 19224,
    paymentStatus: 'Partially Paid',
    paymentMethod: 'Insurance',
    date: '2026-05-28'
  },
  {
    id: 'INV-003',
    patientId: 'PAT-002',
    patientName: 'Diya Nair',
    services: [
      { name: 'General Medicine Consultation', charge: 500 },
      { name: 'Pharmacy - Paracetamol & Cough Syrup', charge: 180 }
    ],
    consultationFee: 500,
    medicineCharges: 180,
    labCharges: 0,
    roomCharges: 0,
    discount: 0,
    tax: 54,
    totalAmount: 734,
    paymentStatus: 'Pending',
    paymentMethod: 'UPI',
    date: '2026-05-29'
  }
];

export const defaultPharmacy = [
  { id: 'MED-001', name: 'Paracetamol (500mg)', category: 'Analgesics / Antipyretics', price: 15, quantity: 1200, expiryDate: '2027-10-12', supplier: 'Cipla Pharmaceuticals', status: 'In Stock' },
  { id: 'MED-002', name: 'Amlodipine (5mg)', category: 'Cardiovascular Drugs', price: 8, quantity: 950, expiryDate: '2027-02-28', supplier: 'Sun Pharma', status: 'In Stock' },
  { id: 'MED-003', name: 'Pantoprazole (40mg)', category: 'Gastrointestinal Drugs', price: 12, quantity: 20, expiryDate: '2026-07-15', supplier: 'Dr. Reddys Laboratories', status: 'Low Stock' },
  { id: 'MED-004', name: 'Amoxicillin (500mg)', category: 'Antibiotics', price: 25, quantity: 450, expiryDate: '2026-06-10', supplier: 'Lupin Limited', status: 'In Stock' },
  { id: 'MED-005', name: 'Metformin (850mg)', category: 'Antidiabetic Drugs', price: 10, quantity: 800, expiryDate: '2027-05-18', supplier: 'Sun Pharma', status: 'In Stock' },
  { id: 'MED-006', name: 'Atorvastatin (10mg)', category: 'Cardiovascular Drugs', price: 18, quantity: 5, expiryDate: '2027-03-24', supplier: 'Cipla Pharmaceuticals', status: 'Low Stock' },
  { id: 'MED-007', name: 'Cetirizine (10mg)', category: 'Antihistamines', price: 5, quantity: 1500, expiryDate: '2028-01-01', supplier: 'Aurobindo Pharma', status: 'In Stock' },
  { id: 'MED-008', name: 'Loperamide (2mg)', category: 'Gastrointestinal Drugs', price: 9, quantity: 0, expiryDate: '2026-04-12', supplier: 'Dr. Reddys Laboratories', status: 'Out of Stock' }
];

export const defaultLaboratory = [
  { id: 'LAB-001', patientId: 'PAT-001', patientName: 'Aarav Mehta', doctorId: 'DOC-001', doctorName: 'Dr. Priya Sharma', testName: 'Electrocardiogram (ECG)', testDate: '2026-05-29', resultSummary: 'Sinus rhythm, normal axis, heart rate 72 bpm. Mild LVH signs.', reportStatus: 'Completed', price: 500 },
  { id: 'LAB-002', patientId: 'PAT-003', patientName: 'Vikram Singh', doctorId: 'DOC-002', doctorName: 'Dr. Rajesh Iyer', testName: 'MRI Brain Scan', testDate: '2026-05-28', resultSummary: 'Normal ventricular system. No acute hemorrhage or infarct. Chronic ischemic microvascular changes.', reportStatus: 'Completed', price: 6500 },
  { id: 'LAB-003', patientId: 'PAT-002', patientName: 'Diya Nair', doctorId: 'DOC-007', doctorName: 'Dr. Kavita Joshi', testName: 'Dermatological Allergy Skin Patch', testDate: '2026-05-29', resultSummary: 'Awaiting patch readings at 48 hours.', reportStatus: 'In Progress', price: 1200 },
  { id: 'LAB-004', patientId: 'PAT-005', patientName: 'Rohan Gupta', doctorId: 'DOC-005', doctorName: 'Dr. Vijay Kapoor', testName: 'Complete Blood Count (CBC)', testDate: '2026-05-29', resultSummary: 'Analysis in process at lab desk.', reportStatus: 'Pending', price: 400 }
];

export const defaultRooms = [
  { id: 'RM-101-A', roomNumber: '101', roomType: 'ICU', bedNumber: 'Bed A', patientId: 'PAT-003', patientName: 'Vikram Singh', chargesPerDay: 5000, status: 'Occupied' },
  { id: 'RM-101-B', roomNumber: '101', roomType: 'ICU', bedNumber: 'Bed B', patientId: null, patientName: null, chargesPerDay: 5000, status: 'Available' },
  { id: 'RM-102-A', roomNumber: '102', roomType: 'Private Room', bedNumber: 'Bed 1', patientId: 'PAT-001', patientName: 'Aarav Mehta', chargesPerDay: 3000, status: 'Occupied' },
  { id: 'RM-103-A', roomNumber: '103', roomType: 'Semi-private Room', bedNumber: 'Bed A', patientId: null, patientName: null, chargesPerDay: 1800, status: 'Available' },
  { id: 'RM-103-B', roomNumber: '103', roomType: 'Semi-private Room', bedNumber: 'Bed B', patientId: null, patientName: null, chargesPerDay: 1800, status: 'Maintenance' },
  { id: 'RM-201-A', roomNumber: '201', roomType: 'General Ward', bedNumber: 'Bed 1', patientId: 'PAT-005', patientName: 'Rohan Gupta', chargesPerDay: 1000, status: 'Occupied' },
  { id: 'RM-201-B', roomNumber: '201', roomType: 'General Ward', bedNumber: 'Bed 2', patientId: null, patientName: null, chargesPerDay: 1000, status: 'Available' },
  { id: 'RM-201-C', roomNumber: '201', roomType: 'General Ward', bedNumber: 'Bed 3', patientId: null, patientName: null, chargesPerDay: 1000, status: 'Available' },
  { id: 'RM-201-D', roomNumber: '201', roomType: 'General Ward', bedNumber: 'Bed 4', patientId: null, patientName: null, chargesPerDay: 1000, status: 'Available' }
];

export const defaultStaff = [
  { id: 'STF-001', name: 'Nurse Sunita Sharma', role: 'Nurse', department: 'Emergency', phone: '9823456701', email: 'sunita.sharma@quebixhms.com', shiftTiming: 'Night', salary: 35000, attendanceStatus: 'Present' },
  { id: 'STF-002', name: 'Nurse Rahul Patel', role: 'Nurse', department: 'Cardiology', phone: '9823456702', email: 'rahul.patel@quebixhms.com', shiftTiming: 'Morning', salary: 34000, attendanceStatus: 'Present' },
  { id: 'STF-003', name: 'Aditya Kulkarni', role: 'Receptionist', department: 'Front Desk', phone: '9823456703', email: 'reception@quebixhms.com', shiftTiming: 'Morning', salary: 25000, attendanceStatus: 'Present' },
  { id: 'STF-004', name: 'Dr. Sandeep Sen', role: 'Lab Assistant', department: 'Laboratory', phone: '9823456704', email: 'lab@quebixhms.com', shiftTiming: 'General', salary: 45000, attendanceStatus: 'Present' },
  { id: 'STF-005', name: 'Abhishek Roy', role: 'Pharmacist', department: 'Pharmacy', phone: '9823456705', email: 'pharmacist@quebixhms.com', shiftTiming: 'General', salary: 40000, attendanceStatus: 'On Leave' },
  { id: 'STF-006', name: 'Sanjay Dutt', role: 'Security Chief', department: 'Support Staff', phone: '9823456706', email: 'sanjay.dutt@quebixhms.com', shiftTiming: 'Night', salary: 28000, attendanceStatus: 'Present' }
];

export const demoUsers = [
  { email: 'admin@quebixhms.com', password: 'admin123', name: 'Administrator', role: 'Admin', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop' },
  { email: 'doctor@quebixhms.com', password: 'doctor123', name: 'Dr. Priya Sharma', role: 'Doctor', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop' },
  { email: 'reception@quebixhms.com', password: 'reception123', name: 'Aditya Kulkarni', role: 'Receptionist', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop' },
  { email: 'patient@quebixhms.com', password: 'patient123', name: 'Aarav Mehta', role: 'Patient', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop' },
  { email: 'pharmacist@quebixhms.com', password: 'pharmacist123', name: 'Abhishek Roy', role: 'Pharmacist', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop' },
  { email: 'lab@quebixhms.com', password: 'lab123', name: 'Dr. Sandeep Sen', role: 'Lab Assistant', avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=100&auto=format&fit=crop' }
];

export const defaultHospitalSettings = {
  hospitalName: 'Quebix Hospital',
  email: 'support@quebixdigital.in',
  phone: '+91 7769971133',
  address: 'Quebix Digital Office, Maharashtra, India',
  website: 'hms.quebixdigital.in',
  currency: 'INR',
  taxRate: 8,
  allowOnlineBooking: true
};

export const defaultEMR = [
  {
    id: 'EMR-001',
    patientName: 'Aarav Mehta',
    visitDate: '2026-05-20',
    doctorName: 'Dr. Priya Sharma',
    diagnosis: 'Essential Hypertension',
    symptoms: 'Morning headaches, dizziness, chest tension',
    allergies: 'Gluten, Penicillin',
    vaccinations: 'Covid-19 Covaxin Booster',
    chronicDiseases: 'Hypertension',
    prescriptionRef: 'PRX-001',
    notes: 'Restricted dietary sodium. Follow up on blood pressure next month.'
  },
  {
    id: 'EMR-002',
    patientName: 'Rohan Gupta',
    visitDate: '2026-05-22',
    doctorName: 'Dr. Vijay Kapoor',
    diagnosis: 'Gastroesophageal Reflux',
    symptoms: 'Sour belching, throat burn post food',
    allergies: 'None reported',
    vaccinations: 'Hepatitis B, Covid-19',
    chronicDiseases: 'GERD',
    prescriptionRef: 'PRX-002',
    notes: 'Advised lifestyle adjustments and small meals.'
  }
];

export const defaultDoctorSchedules = [
  { id: 'SCH-001', doctorName: 'Dr. Priya Sharma', day: 'Monday', startTime: '09:00 AM', endTime: '01:00 PM', slotDuration: '15 mins', availabilityStatus: 'Available', leaveStatus: 'No Leave', notes: 'OPD Consultations' },
  { id: 'SCH-002', doctorName: 'Dr. Priya Sharma', day: 'Wednesday', startTime: '09:00 AM', endTime: '01:00 PM', slotDuration: '15 mins', availabilityStatus: 'Available', leaveStatus: 'No Leave', notes: 'OPD Consultations' },
  { id: 'SCH-003', doctorName: 'Dr. Priya Sharma', day: 'Friday', startTime: '09:00 AM', endTime: '01:00 PM', slotDuration: '15 mins', availabilityStatus: 'Available', leaveStatus: 'No Leave', notes: 'Cardiology Ward Rounds' },
  { id: 'SCH-004', doctorName: 'Dr. Rajesh Iyer', day: 'Tuesday', startTime: '10:00 AM', endTime: '02:00 PM', slotDuration: '20 mins', availabilityStatus: 'Available', leaveStatus: 'No Leave', notes: 'Neurology Consultation Hours' },
  { id: 'SCH-005', doctorName: 'Dr. Rajesh Iyer', day: 'Thursday', startTime: '10:00 AM', endTime: '02:00 PM', slotDuration: '20 mins', availabilityStatus: 'On Leave', leaveStatus: 'Approved Leave', notes: 'Approved Personal Leave' },
  { id: 'SCH-006', doctorName: 'Dr. Amit Patel', day: 'Monday', startTime: '02:00 PM', endTime: '06:00 PM', slotDuration: '15 mins', availabilityStatus: 'Available', leaveStatus: 'No Leave', notes: 'Orthopedic Consults' }
];

export const defaultChatMessages = [
  { id: 'MSG-001', sender: 'Aditya Kulkarni', receiver: 'Dr. Priya Sharma', message: 'Doctor, the patient Aarav Mehta has arrived for his ECG.', dateTime: '2026-05-29 09:15 AM', group: 'Direct' },
  { id: 'MSG-002', sender: 'Dr. Priya Sharma', receiver: 'Aditya Kulkarni', message: 'Thank you Aditya. Please send him to consultation room 2.', dateTime: '2026-05-29 09:16 AM', group: 'Direct' },
  { id: 'MSG-003', sender: 'Dr. Sandeep Sen', receiver: 'Dr. Priya Sharma', message: 'Priya, the blood lipid report for Aarav Mehta is ready and uploaded.', dateTime: '2026-05-29 10:10 AM', group: 'Direct' },
  { id: 'MSG-004', sender: 'Abhishek Roy', receiver: 'General Lounge', message: 'We have updated stock for Paracetamol and Amoxicillin in the pharmacy.', dateTime: '2026-05-29 11:20 AM', group: 'General Lounge' }
];

export const defaultMedicalDocuments = [
  { id: 'DOC-101', patientName: 'Aarav Mehta', documentType: 'Prescription', fileName: 'aarav_mehta_prescription_prx001.pdf', uploadDate: '2026-05-29', uploadedBy: 'Dr. Priya Sharma', notes: 'Hypertension prescription sheet' },
  { id: 'DOC-102', patientName: 'Vikram Singh', documentType: 'MRI Report', fileName: 'vikram_singh_brain_mri_may28.pdf', uploadDate: '2026-05-28', uploadedBy: 'Dr. Sandeep Sen', notes: 'Brain MRI Scan results - Microvascular changes' },
  { id: 'DOC-103', patientName: 'Diya Nair', documentType: 'Lab Report', fileName: 'diya_nair_allergy_patch_test.pdf', uploadDate: '2026-05-29', uploadedBy: 'Dr. Sandeep Sen', notes: 'Dermatological allergy patch scan sheet' }
];

export const defaultInsuranceClaims = [
  { id: 'CLM-001', patientName: 'Aarav Mehta', providerName: 'Star Health Insurance', policyNumber: 'POL-992281', claimAmount: 15000, submittedDate: '2026-05-29', approvedAmount: 12000, status: 'Approved', notes: 'Cardiac OPD checkup wellness cover approved' },
  { id: 'CLM-002', patientName: 'Vikram Singh', providerName: 'LIC Health Shield', policyNumber: 'POL-445582', claimAmount: 75000, submittedDate: '2026-05-28', approvedAmount: 0, status: 'Submitted', notes: 'ICU charges & MRI Brain scan claim processing' },
  { id: 'CLM-003', patientName: 'Diya Nair', providerName: 'HDFC Ergo Health', policyNumber: 'POL-118833', claimAmount: 12000, submittedDate: '2026-05-29', approvedAmount: 0, status: 'Pending', notes: 'Allergy screening claim' }
];

export const defaultEmergencyCases = [
  { id: 'EMG-001', patientName: 'Rohan Gupta', age: 52, emergencyType: 'Acute Chest Spasm', assignedDoctor: 'Dr. Anjali Desai', assignedBed: 'RM-201-A', priority: 'High', status: 'Under Treatment', arrivalTime: '11:30 AM', notes: 'Administered IV antispasmodics. Vitals stable.' },
  { id: 'EMG-002', patientName: 'Vikram Singh', age: 67, emergencyType: 'Stroke Suspect', assignedDoctor: 'Dr. Rajesh Iyer', assignedBed: 'RM-101-A', priority: 'Critical', status: 'Under Treatment', arrivalTime: '08:15 AM', notes: 'Emergency admit. Transfer to ICU completed.' }
];

export const defaultAmbulances = [
  { id: 'AMB-001', vehicleNumber: 'MH-12-PQ-9988', driverName: 'Karan Malhotra', driverPhone: '9876543001', currentLocation: 'Andheri East, Mumbai', status: 'Available', assignedEmergencyCase: 'None', notes: 'Fully stocked Advanced Life Support (ALS) kit.' },
  { id: 'AMB-002', vehicleNumber: 'MH-12-AB-3344', driverName: 'Satish Patil', driverPhone: '9876543002', currentLocation: 'Kothrud, Pune', status: 'On Duty', assignedEmergencyCase: 'EMG-001', notes: 'Dispatched to patient home for acute pickup.' },
  { id: 'AMB-003', vehicleNumber: 'MH-04-XY-1212', driverName: 'Vijay Shinde', driverPhone: '9876543003', currentLocation: 'Thane, Mumbai', status: 'Maintenance', assignedEmergencyCase: 'None', notes: 'Scheduled engine oil replacement.' }
];

export const defaultICUMonitoring = [
  { id: 'ICU-001', bedNumber: 'RM-101-A', patientName: 'Vikram Singh', assignedDoctor: 'Dr. Rajesh Iyer', heartRate: 82, bloodPressure: '125/80', oxygenLevel: 97, temperature: 98.6, status: 'Stable' },
  { id: 'ICU-002', bedNumber: 'RM-101-B', patientName: 'None', assignedDoctor: 'None', heartRate: 0, bloodPressure: '0/0', oxygenLevel: 0, temperature: 0, status: 'Stable' }
];

export const defaultAttendanceLogs = [
  { id: 'ATT-001', staffName: 'Nurse Sunita Sharma', role: 'Nurse', date: '2026-05-29', checkInTime: '08:00 AM', checkOutTime: '--', shift: 'Night', status: 'Present' },
  { id: 'ATT-002', staffName: 'Nurse Rahul Patel', role: 'Nurse', date: '2026-05-29', checkInTime: '09:05 AM', checkOutTime: '--', shift: 'Morning', status: 'Late' },
  { id: 'ATT-003', staffName: 'Aditya Kulkarni', role: 'Receptionist', date: '2026-05-29', checkInTime: '08:30 AM', checkOutTime: '--', shift: 'Morning', status: 'Present' }
];

export const defaultPayrollLogs = [
  { id: 'PAY-001', staffName: 'Nurse Sunita Sharma', role: 'Nurse', month: 'May 2026', basicSalary: 35000, bonus: 2000, deductions: 1000, netSalary: 36000, paymentStatus: 'Paid' },
  { id: 'PAY-002', staffName: 'Nurse Rahul Patel', role: 'Nurse', month: 'May 2026', basicSalary: 34000, bonus: 1500, deductions: 500, netSalary: 35000, paymentStatus: 'Paid' },
  { id: 'PAY-003', staffName: 'Aditya Kulkarni', role: 'Receptionist', month: 'May 2026', basicSalary: 25000, bonus: 1000, deductions: 0, netSalary: 26000, paymentStatus: 'Pending' }
];

export const defaultQueueTokens = [
  { id: 'TKN-001', tokenNumber: 'OPD-005', patientName: 'Meera Verma', department: 'General Medicine', doctorName: 'Dr. Vijay Kapoor', status: 'Waiting', createdTime: '11:45 AM' },
  { id: 'TKN-002', tokenNumber: 'OPD-006', patientName: 'Aarav Mehta', department: 'Cardiology', doctorName: 'Dr. Priya Sharma', status: 'Serving', createdTime: '11:50 AM' },
  { id: 'TKN-003', tokenNumber: 'OPD-007', patientName: 'Diya Nair', department: 'Dermatology', doctorName: 'Dr. Kavita Joshi', status: 'Waiting', createdTime: '11:55 AM' }
];

export const defaultFeedbackList = [
  { id: 'FDB-001', patientName: 'Aarav Mehta', doctorName: 'Dr. Priya Sharma', doctorRating: 5, hospitalRating: 5, receptionRating: 4, pharmacyRating: 5, comment: 'Excellent response and treatment for hypertension.', date: '2026-05-28' },
  { id: 'FDB-002', patientName: 'Diya Nair', doctorName: 'Dr. Kavita Joshi', doctorRating: 4, hospitalRating: 4, receptionRating: 5, pharmacyRating: 4, comment: 'Dermatology clinic was helpful. Reception was fast.', date: '2026-05-29' }
];

export const defaultAuditLogs = [
  { id: 'LOG-001', user: 'admin@quebixhms.com', role: 'Admin', module: 'Authentication', action: 'Login', description: 'Administrator successfully logged in to secure portal.', dateTime: '2026-05-29 11:34 AM' }
];

