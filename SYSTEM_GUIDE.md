# Quebix HMS - Complete System & Architecture Guide

Welcome to the official system documentation for **Quebix HMS (Quebix Hospital Management System)**, a premium digital healthcare ecosystem developed and owned by **Quebix Digital**.

Tagline: **"Smart Healthcare. Simplified Management."**

---

## 1. Technological Stack & Dependencies

Quebix HMS is built using modern frontend technologies optimized for performance, high fidelity styling, printing, and local data persistence.

* **Core Framework**: React.js (v19) & Vite (v8)
* **Design & Styling**: Tailwind CSS (v4) & vanilla CSS styling tokens
* **Routing**: React Router DOM (v7)
* **Data Visualization**: Recharts (v3) for analytics and dashboard metrics
* **Iconography**: Lucide Icons
* **Local Persistence**: Custom LocalStorage mapping with `quebix_` storage keys
* **Reports, Printing & Downloads**:
  * `react-to-print` (v3) for native print layout overrides
  * `html2canvas` (v1.4) for high-resolution DOM-to-canvas rendering
  * `jsPDF` (v4.2) for high-fidelity vector PDF generation

---

## 2. Directory & Component Structure

Below is the directory map of the Quebix HMS project:

```text
quebix-hms/
├── index.html                   # HTML entrypoint
├── package.json                 # Package configurations and scripts
├── postcss.config.js            # PostCSS compiler rules
├── tailwind.config.js           # Tailwind utility configurations
├── vite.config.js               # Vite build rules
├── src/
│   ├── App.css                  # Core app styling rules
│   ├── App.jsx                  # Main router definitions and layout binding
│   ├── index.css                # Global CSS variables, custom themes and print overrides
│   ├── main.jsx                 # Provider setup and React rendering
│   ├── assets/                  # Local static resources and icons
│   ├── data/
│   │   └── mockData.js          # Pre-populated Indian demographic seed databases
│   ├── utils/
│   │   ├── localStorage.js      # LocalStorage CRUD middleware
│   │   ├── invoiceCalculations.js # Invoice fee aggregations and tax formulas
│   │   └── notificationStorage.js  # Global synced alerts engine
│   ├── context/
│   │   └── AppContext.jsx       # Global state management and operations provider
│   ├── components/
│   │   ├── billing/
│   │   │   └── InvoiceTemplate.jsx  # Reusable A4-sized billing card template
│   │   ├── cards/
│   │   │   └── DashboardCard.jsx    # Metric summaries visual component
│   │   ├── common/
│   │   │   ├── Button.jsx           # Apple-style gradient buttons
│   │   │   ├── ConfirmDialog.jsx    # Verification dialog modals
│   │   │   ├── Modal.jsx            # Frosted glass popups
│   │   │   ├── ProtectedRoute.jsx   # Auth gate component
│   │   │   ├── StatusBadge.jsx      # Color-coded workflow badges
│   │   │   ├── ThemeToggle.jsx      # Solarized theme toggles
│   │   │   └── Toast.jsx            # Toast alert notification layout
│   │   ├── forms/
│   │   │   ├── InputField.jsx       # Rounded form textfields
│   │   │   └── SelectField.jsx      # Custom drop-downs
│   │   ├── layout/
│   │   │   ├── Layout.jsx           # Master dashboard portal frame
│   │   │   ├── Navbar.jsx           # Top header with global search & notification trays
│   │   │   └── Sidebar.jsx          # Glassmorphic collapsible navigation drawer
│   │   └── tables/
│   │       ├── DataTable.jsx        # Data grid with pagination and sorting
│   │       ├── SearchBar.jsx        # Table searches
│   │       └── FilterDropdown.jsx   # Column filters
│   └── pages/
│       ├── auth/
│       │   ├── Login.jsx            # Split-screen auth panel with illustration
│       │   ├── Register.jsx         # Signup form
│       │   └── ForgotPassword.jsx   # Pass recovery utility
│       ├── patients/
│       │   └── Patients.jsx         # Patients registry
│       ├── doctors/
│       │   └── Doctors.jsx          # Doctors board
│       ├── appointments/
│       │   └── Appointments.jsx     # Consultations scheduler
│       ├── departments/
│       │   └── Departments.jsx      # Medical units directory
│       ├── prescriptions/
│       │   └── Prescriptions.jsx    # Drug prescriptions
│       ├── billing/
│       │   ├── Billing.jsx          # Billings manager
│       │   └── InvoicePreview.jsx   # Interactive previewer
│       ├── pharmacy/
│       │   └── Pharmacy.jsx         # Medicine inventory logs
│       ├── laboratory/
│       │   └── Laboratory.jsx       # Pathological reports
│       ├── rooms/
│       │   └── RoomsBeds.jsx        # Bed admissions
│       ├── staff/
│       │   └── Staff.jsx            # Staff directory
│       ├── reports/
│       │   └── Reports.jsx          # Statistical summaries
│       ├── settings/
│       │   └── Settings.jsx         # Hospital constants and configs
│       └── [14 advanced pages]      # Dedicated sub-module views
```

---

## 3. Core System Branding & Design Tokens

Quebix HMS utilizes an **Apple-inspired premium SaaS UI/UX design** with glassmorphic cards, rounded corners, soft shadows, and clean gradients.

### 🎨 Color Palette & Variables
* **Primary Color**: `#FD3A25` (Quebix Brand Orange)
* **Primary Dark Color**: `#E62E1B`
* **Accent Color**: `#2563EB`
* **Success Color**: `#10B981` (Emerald Green)
* **Warning Color**: `#F59E0B`
* **Danger Color**: `#EF4444`
* **Light Theme Background**: `#F5F5F7` (Apple Light Gray)
* **Dark Theme Background**: `#030712` (Midnight Deep Gray)

### 📐 CSS Variable Definitions (Tailwind `@theme`)
```css
:root {
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 22px;
  --radius-xl: 28px;
  
  --shadow-card: 0 18px 45px rgba(15, 23, 42, 0.08);
  --shadow-soft: 0 8px 24px rgba(15, 23, 42, 0.06);
}
```

### 💎 Glassmorphic & Layout Utilities
* `.app-bg`: Radial gradient blend overlays.
* `.glass-card`: Frosted transparent container with backdrop filters (`blur(20px)`) and subtle border frames.
* `.soft-card`: Elevated surface containers with micro drop-shadows.
* `.premium-btn`: Gradient buttons with click scaling offsets (`active:scale-95`).
* `.premium-input`: Fully interactive borders, input focus rings, and transition states.

---

## 4. Functional Modules Directory

Quebix HMS is comprised of **26 separate integrated modules** designed for comprehensive clinical, logistical, and financial operations:

### 🔒 Access Control & Auth
1. **User Authentication (`pages/auth/Login.jsx`, `Register.jsx`)**: Split-panel design matching role coordinates (Admin, Doctor, Receptionist, Pharmacist, Lab Assistant, Patient) with floating quick-fill buttons.

### 🩺 Clinical Registry
2. **Clinical Dashboard (`pages/dashboard/Dashboard.jsx`)**: Main workspace aggregating KPI cards, revenue charts, appointment splits, bed metrics, and critical alert cards.
3. **Patients Registry (`pages/patients/Patients.jsx`)**: Patient file compiler with demographic variables, medical history, and status flags.
4. **Doctors Directory (`pages/doctors/Doctors.jsx`)**: Scheduling availability logs, qualifications, and consultation rates.
5. **Appointments Board (`pages/appointments/Appointments.jsx`)**: Real-time consultation scheduler linked to active patient files.
6. **Departments Directory (`pages/departments/Departments.jsx`)**: Organization of clinical departments and heads of staff.
7. **EMR Portal (`pages/emr/EMR.jsx`)**: Electronic Medical Records tracking patient vitals (Blood pressure, heart rate, SpO2, temp) and diagnoses.
8. **Prescriptions Console (`pages/prescriptions/Prescriptions.jsx`)**: Medication orders and dosage recommendations.

### 🔬 Laboratory & Diagnostics
9. **Laboratory Module (`pages/laboratory/Laboratory.jsx`)**: Diagnostic test ordering and pathology status tracking.
10. **Medical Documents Library (`pages/medical-documents/MedicalDocuments.jsx`)**: Digital locker for pathology scans, prescriptions, and files.

### 💳 Finance & Billing
11. **Billing & Invoices (`pages/billing/Billing.jsx`, `InvoicePreview.jsx`)**: Full invoices CRUD with itemized extra services, automated GST (8%) calculations, and LocalStorage updates.
    * Features: *Print Invoice* (A4 layout), *Download PDF*, *Save Soft Copy (JPG)*, and *Mark as Paid*.
12. **Insurance Claims (`pages/insurance/Insurance.jsx`)**: Coverage tracking and claims filing against local insurance carriers (e.g. Star Health, HDFC Ergo).

### 💊 Pharmacy & Supply Chain
13. **Pharmacy Stock (`pages/pharmacy/Pharmacy.jsx`)**: Medication storage log triggering automatic low stock warnings (quantity <= 30) or expiry flags.

### 🏥 Operations & Ward Logistics
14. **Rooms & Beds (`pages/rooms/RoomsBeds.jsx`)**: Bed assignment and room status monitoring.
15. **Doctor Shift Scheduling (`pages/doctor-schedule/DoctorSchedule.jsx`)**: OPD shift rosters, consult token limits, and cabin allocations.
16. **OPD Token Queue (`pages/queue/QueueManagement.jsx`)**: Active queue panel listing tokens with speech synthesis announcements.
17. **Emergency Triage Board (`pages/emergency/Emergency.jsx`)**: High-priority trauma admissions dashboard categorized by color urgency tags (Normal, High, Critical).
18. **Ambulance Dispatch (`pages/ambulance/Ambulance.jsx`)**: Fleet console tracking emergency vehicles, drivers, and dispatch locations.
19. **ICU Vital Telemetry (`pages/icu-monitoring/ICUMonitoring.jsx`)**: Dynamic clinical monitor charting vitals (BP, Heart Rate, Oxygen, Temp).

### 👥 Human Resources & Support
20. **Staff Directory (`pages/staff/Staff.jsx`)**: Administration of hospital employees.
21. **Staff Attendance (`pages/attendance/Attendance.jsx`)**: Loggers tracking check-in and check-out times.
22. **Payroll Manager (`pages/payroll/Payroll.jsx`)**: Compensation calculator factoring allowances, deductions, and payslip generation.
23. **Patient Feedback (`pages/feedback/Feedback.jsx`)**: Surveys evaluating clinical workflows with administrative reply capabilities.

### 📊 System Utilities & Security
24. **Reports & Analytics (`pages/reports/Reports.jsx`)**: Aggregated medical charts, billing statistics, and census figures.
25. **System Settings (`pages/settings/Settings.jsx`)**: Configurations for hospital name, address, and localized INR currencies.
26. **Security Audit Logs (`pages/audit-logs/AuditLogs.jsx`)**: Ledger documenting logins, edits, and deletions with actor roles and IP addresses.

---

## 5. Routing & Layout Registry

Quebix HMS utilizes **React Router DOM** inside a secure portal frame. Navigation sidebar links are dynamically filtered according to the user's role parameters:

* `*` (Fallback): Redirects to `/` (Login/Dashboard)
* `/login`, `/register`, `/forgot-password`: Public access pathways
* `/`: Dashboard
* `/patients`, `/doctors`, `/appointments`, `/departments`, `/prescriptions`: Clinical records
* `/billing`, `/billing/preview`: Accounting portal
* `/pharmacy`, `/laboratory`: Inventory and diagnostics
* `/rooms`, `/staff`, `/settings`, `/reports`: Operations registry
* `/emr`, `/doctor-schedule`, `/notifications`, `/internal-chat`, `/medical-documents`, `/insurance`, `/emergency`, `/ambulance`, `/icu-monitoring`, `/attendance`, `/payroll`, `/queue`, `/feedback`, `/audit-logs`: Advanced workspaces

---

## 6. Shared Data & Synchronized States

1. **LocalStorage CRUD Interface (`utils/localStorage.js`)**: All transactions are saved dynamically in LocalStorage with `quebix_` prefix. Seeding functions populate default databases on first boot, with automated checks that clear out deprecated database iterations.
2. **Notification Synced Engine (`utils/notificationStorage.js`)**: All pages fetch alerts and badges from `quebix_notifications` using the shared storage utility and register listeners to the custom window event `"notificationsUpdated"`.
3. **Internal Chat Channels**: Real-time dialogue console divided into medical groups (Doctors, Nurses, Pharmacy, Admin).
4. **Rupees Currency Localization (`₹`)**: Numeric fee calculations, revenues, daily wages, and drug prices are localized to Indian Rupees (`₹`).

---

## 7. Development & Deployment Procedures

### Development Commands
```bash
# Install package dependencies
npm install

# Start Vite hot module replacement (HMR) local development server
npm run dev

# Run ESLint validation checks
npm run lint

# Build production bundle assets
npm run build

# Preview production build assets locally
npm run preview
```

### Production Build Assets
The compiled production bundle outputs standard optimized files:
* `dist/index.html`
* `dist/assets/index-[hash].css` (Compiled Tailwind CSS styling)
* `dist/assets/index-[hash].js` (Minified React code containing routes, views, and packages)
* Dynamic chunks for large third-party modules (`html2canvas`, `jspdf`, etc.) to optimize initial load speed.

---
*Quebix HMS | Hospital Management System. Powered by Quebix Digital.*
