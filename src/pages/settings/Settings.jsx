import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hospital, User, Shield, BellRing, Check, Info } from 'lucide-react';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';
import Button from '../../components/common/Button';

export default function Settings() {
  const {
    hospitalSettings,
    updateSettings,
    currentUser,
    theme,
    toggleTheme,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('hospital');

  // Hospital settings Form state
  const [hospitalForm, setHospitalForm] = useState({ ...hospitalSettings });
  // User profile Form state
  const [userForm, setUserForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    password: currentUser?.password || '••••••••'
  });

  // Notifications State
  const [notifAlerts, setNotifAlerts] = useState({
    emailApts: true,
    smsReceipts: false,
    stockAlerts: true,
    labCompleted: true
  });

  const handleHospitalSubmit = (e) => {
    e.preventDefault();
    updateSettings(hospitalForm);
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    addToast('Profile changes saved successfully (Demo simulation)', 'success');
  };

  const handleNotifToggle = (key) => {
    setNotifAlerts((prev) => ({ ...prev, [key]: !prev[key] }));
    addToast('Notification preferences updated', 'success');
  };

  const tabs = [
    { id: 'hospital', label: 'Hospital Profile', icon: Hospital },
    { id: 'profile', label: 'User Account', icon: User },
    { id: 'notifications', label: 'Preferences', icon: BellRing },
    { id: 'permissions', label: 'Role Permissions Matrix', icon: Shield }
  ];

  // Role permissions display dataset
  const rolePermissions = [
    { role: 'Hospital Admin', desc: 'Full configuration, staff billing, inventory controls, clinical access.', modules: 'All Modules (Full CRUD)' },
    { role: 'Medical Doctor', desc: 'Manage consultations, record clinical histories, write prescriptions, order labs.', modules: 'Dashboard, Patients, Appointments, Prescriptions, Lab' },
    { role: 'Front Desk Receptionist', desc: 'Book patient sessions, register folders, allocate beds, generate billing.', modules: 'Dashboard, Patients, Appointments, Rooms & Beds, Billing' },
    { role: 'Pharmacy Lead', desc: 'Adjust drug inventory logs, review prescription requests.', modules: 'Dashboard, Pharmacy, Prescriptions' },
    { role: 'Laboratory Pathologist', desc: 'Conduct specimen testing, upload finding summaries.', modules: 'Dashboard, Laboratory' },
    { role: 'Registered Patient', desc: 'Review scheduled appointments, view own Rx prescriptions and invoices.', modules: 'Dashboard, Prescriptions, Billing (Read-Only)' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      {/* Sidebar Nav tabs */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col gap-1 select-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left focus:outline-none ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm shadow-primary/10'
                  : 'text-text-muted hover:bg-border/30 hover:text-text'
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Tab Panels content */}
      <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-6 shadow-sm min-h-[400px]">
        {/* TAB 1: HOSPITAL SETTINGS */}
        {activeTab === 'hospital' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-text">Hospital Information</h3>
              <p className="text-xs text-text-muted mt-0.5">Configure clinical letterhead information and billing defaults</p>
            </div>

            <form onSubmit={handleHospitalSubmit} className="space-y-4">
              <InputField
                label="Hospital Registered Title"
                name="hospitalName"
                value={hospitalForm.hospitalName}
                onChange={(e) => setHospitalForm(p => ({ ...p, hospitalName: e.target.value }))}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Contact Email Address"
                  type="email"
                  name="email"
                  value={hospitalForm.email}
                  onChange={(e) => setHospitalForm(p => ({ ...p, email: e.target.value }))}
                  required
                />
                <InputField
                  label="Official Telephone"
                  name="phone"
                  value={hospitalForm.phone}
                  onChange={(e) => setHospitalForm(p => ({ ...p, phone: e.target.value }))}
                  required
                />
              </div>

              <InputField
                label="Hospital Headquarter Address"
                name="address"
                value={hospitalForm.address}
                onChange={(e) => setHospitalForm(p => ({ ...p, address: e.target.value }))}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Hospital Website Domain"
                  name="website"
                  value={hospitalForm.website}
                  onChange={(e) => setHospitalForm(p => ({ ...p, website: e.target.value }))}
                />
                <SelectField
                  label="Standard Currency"
                  name="currency"
                  value={hospitalForm.currency}
                  onChange={(e) => setHospitalForm(p => ({ ...p, currency: e.target.value }))}
                  options={[{ value: 'INR', label: 'INR (₹)' }]}
                  required
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <Button type="submit" variant="primary">Save Configuration</Button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: USER PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-text">Account Security Details</h3>
              <p className="text-xs text-text-muted mt-0.5">Manage portal credentials and verify authorization credentials</p>
            </div>

            <div className="flex items-center gap-4 p-4 bg-border/20 border border-border rounded-2xl max-w-md">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                alt="Avatar"
                className="h-16 w-16 rounded-2xl object-cover ring-2 ring-primary/20"
              />
              <div>
                <span className="text-sm font-bold text-text block leading-none">{currentUser?.name}</span>
                <span className="text-xs font-semibold text-text-muted block mt-1.5 capitalize">Role: {currentUser?.role}</span>
                <span className="text-[10px] text-text-muted/80 block mt-0.5">{currentUser?.email}</span>
              </div>
            </div>

            <form onSubmit={handleUserSubmit} className="space-y-4 max-w-md">
              <InputField
                label="Full Name"
                name="name"
                value={userForm.name}
                onChange={(e) => setUserForm(p => ({ ...p, name: e.target.value }))}
                required
              />
              <InputField
                label="Login Email"
                type="email"
                name="email"
                value={userForm.email}
                onChange={(e) => setUserForm(p => ({ ...p, email: e.target.value }))}
                required
              />
              <InputField
                label="New Password"
                type="password"
                name="password"
                value={userForm.password}
                onChange={(e) => setUserForm(p => ({ ...p, password: e.target.value }))}
                required
              />

              <div className="flex justify-end pt-4 border-t border-border">
                <Button type="submit" variant="primary">Update Profile</Button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: PREFERENCES & THEME */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-text">Preferences & Portal Theme</h3>
              <p className="text-xs text-text-muted mt-0.5">Configure light/dark toggling preferences and mock notifications</p>
            </div>

            {/* Theme switcher segment */}
            <div className="p-4 bg-border/20 border border-border rounded-2xl flex justify-between items-center max-w-md">
              <div>
                <strong className="text-sm text-text block">Visual Portal Layout</strong>
                <span className="text-xs text-text-muted block mt-0.5">Current: {theme === 'dark' ? 'Dark theme' : 'Light theme'}</span>
              </div>
              <Button variant="outline" size="sm" onClick={toggleTheme}>
                Switch Mode
              </Button>
            </div>

            {/* Notifications settings checklist */}
            <div className="space-y-4 max-w-md">
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Alert Notifications</h4>
              
              <div className="flex items-center justify-between p-3 border border-border rounded-xl">
                <div>
                  <span className="text-xs font-semibold text-text block">Consultation Email Alerts</span>
                  <span className="text-[10px] text-text-muted block mt-0.5">Auto-email confirmations to scheduled patients</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifAlerts.emailApts}
                  onChange={() => handleNotifToggle('emailApts')}
                  className="rounded border-border text-primary focus:ring-primary/25 h-5.5 w-5.5 bg-surface cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-xl">
                <div>
                  <span className="text-xs font-semibold text-text block">SMS Billing Confirmations</span>
                  <span className="text-[10px] text-text-muted block mt-0.5">Dispatch text receipt codes on complete payments</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifAlerts.smsReceipts}
                  onChange={() => handleNotifToggle('smsReceipts')}
                  className="rounded border-border text-primary focus:ring-primary/25 h-5.5 w-5.5 bg-surface cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-xl">
                <div>
                  <span className="text-xs font-semibold text-text block">Pharmacy Medicine Levels Alerts</span>
                  <span className="text-[10px] text-text-muted block mt-0.5">Notify in-app if drug stock depletes below reorder limit</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifAlerts.stockAlerts}
                  onChange={() => handleNotifToggle('stockAlerts')}
                  className="rounded border-border text-primary focus:ring-primary/25 h-5.5 w-5.5 bg-surface cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-xl">
                <div>
                  <span className="text-xs font-semibold text-text block">Laboratory Pathology Dispatches</span>
                  <span className="text-[10px] text-text-muted block mt-0.5">Alert physicians once test outcomes are typed</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifAlerts.labCompleted}
                  onChange={() => handleNotifToggle('labCompleted')}
                  className="rounded border-border text-primary focus:ring-primary/25 h-5.5 w-5.5 bg-surface cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ROLE PERMISSIONS MATRIX */}
        {activeTab === 'permissions' && (
          <div className="space-y-6">
            <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-2xl border border-blue-100 dark:border-blue-900/30 text-blue-800 dark:text-blue-200">
              <Info className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs font-semibold block">Portal Authorization Matrix</strong>
                <p className="text-[10px] text-text-muted leading-relaxed mt-0.5">
                  The dashboard counts, navigational links, and editing privileges are filtered automatically based on the signed-in credentials. Reference the guide below.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-border rounded-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-border/20 text-text-muted font-bold">
                    <th className="px-4 py-3">Security Role</th>
                    <th className="px-4 py-3">Scope Description</th>
                    <th className="px-4 py-3">Authorized Paths</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-text">
                  {rolePermissions.map((row, idx) => (
                    <tr key={idx} className="hover:bg-border/5">
                      <td className="px-4 py-3.5 font-bold text-text-muted">{row.role}</td>
                      <td className="px-4 py-3.5 leading-relaxed">{row.desc}</td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary font-semibold rounded text-[10px]">
                          {row.modules}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
