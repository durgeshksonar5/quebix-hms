import React, { useState } from 'react';
import { Menu, Bell, Search, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ThemeToggle from '../common/ThemeToggle';
import { Link } from 'react-router-dom';

export default function Navbar({ onMenuToggle }) {
  const {
    currentUser,
    logout,
    notifications,
    patients,
    doctors,
    appointments,
    prescriptions,
    pharmacy,
    laboratory,
    claims,
    emergencies
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const results = [];

    // Patients
    const matchedPatients = (patients || []).filter(p => p.name.toLowerCase().includes(query) || p.id.toLowerCase().includes(query));
    if (matchedPatients.length > 0) {
      results.push({
        category: 'Patients',
        items: matchedPatients.slice(0, 3).map(p => ({
          id: p.id,
          title: p.name,
          subtitle: `ID: ${p.id} | Status: ${p.status}`,
          link: `/patients?id=${p.id}`
        }))
      });
    }

    // Doctors
    const matchedDoctors = (doctors || []).filter(d => d.name.toLowerCase().includes(query) || d.specialization.toLowerCase().includes(query) || d.department.toLowerCase().includes(query));
    if (matchedDoctors.length > 0) {
      results.push({
        category: 'Doctors',
        items: matchedDoctors.slice(0, 3).map(d => ({
          id: d.id,
          title: d.name,
          subtitle: `${d.specialization} (${d.department})`,
          link: `/doctors`
        }))
      });
    }

    // Appointments
    const matchedApts = (appointments || []).filter(a => a.patientName.toLowerCase().includes(query) || a.doctorName.toLowerCase().includes(query) || a.id.toLowerCase().includes(query));
    if (matchedApts.length > 0) {
      results.push({
        category: 'Appointments',
        items: matchedApts.slice(0, 3).map(a => ({
          id: a.id,
          title: `Appointment with ${a.doctorName}`,
          subtitle: `Patient: ${a.patientName} | Date: ${a.date}`,
          link: `/appointments`
        }))
      });
    }

    // Prescriptions
    const matchedPrx = (prescriptions || []).filter(p => p.patientName.toLowerCase().includes(query) || p.diagnosis.toLowerCase().includes(query));
    if (matchedPrx.length > 0) {
      results.push({
        category: 'Prescriptions',
        items: matchedPrx.slice(0, 3).map(p => ({
          id: p.id,
          title: `Prescription for ${p.patientName}`,
          subtitle: `Diagnosis: ${p.diagnosis}`,
          link: `/prescriptions`
        }))
      });
    }

    // Medicines
    const matchedMeds = (pharmacy || []).filter(m => m.name.toLowerCase().includes(query) || m.category.toLowerCase().includes(query));
    if (matchedMeds.length > 0) {
      results.push({
        category: 'Medicines',
        items: matchedMeds.slice(0, 3).map(m => ({
          id: m.id,
          title: m.name,
          subtitle: `${m.category} | Stock: ${m.quantity}`,
          link: `/pharmacy`
        }))
      });
    }

    // Lab Tests
    const matchedLabs = (laboratory || []).filter(l => l.patientName.toLowerCase().includes(query) || l.testName.toLowerCase().includes(query));
    if (matchedLabs.length > 0) {
      results.push({
        category: 'Laboratory',
        items: matchedLabs.slice(0, 3).map(l => ({
          id: l.id,
          title: l.testName,
          subtitle: `Patient: ${l.patientName} | Status: ${l.reportStatus}`,
          link: `/laboratory`
        }))
      });
    }

    // Claims
    const matchedClaims = (claims || []).filter(c => c.patientName.toLowerCase().includes(query) || c.providerName.toLowerCase().includes(query));
    if (matchedClaims.length > 0) {
      results.push({
        category: 'Insurance Claims',
        items: matchedClaims.slice(0, 3).map(c => ({
          id: c.id,
          title: `Claim for ${c.patientName}`,
          subtitle: `${c.providerName} | Amount: ₹${c.claimAmount}`,
          link: `/insurance`
        }))
      });
    }

    // Emergencies
    const matchedEmergencies = (emergencies || []).filter(e => e.patientName.toLowerCase().includes(query) || e.emergencyType.toLowerCase().includes(query));
    if (matchedEmergencies.length > 0) {
      results.push({
        category: 'Emergency Cases',
        items: matchedEmergencies.slice(0, 3).map(e => ({
          id: e.id,
          title: `Emergency: ${e.patientName}`,
          subtitle: `${e.emergencyType} | Bed: ${e.assignedBed}`,
          link: `/emergency`
        }))
      });
    }

    return results;
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 h-16 bg-surface border-b border-border shadow-sm transition-theme">
      {/* Left side: Hamburger and Brand details */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-text-muted hover:text-text hover:bg-border/30 transition-colors focus:outline-none"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative hidden sm:block max-w-xs w-64">
          <div className="flex items-center gap-2 text-text-muted bg-border/20 px-3.5 py-1.5 rounded-xl border border-border focus-within:border-primary/50 transition-colors">
            <Search className="h-4 w-4 text-text-muted/60 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search patients, doctors..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="bg-transparent border-none outline-none text-xs text-text placeholder-text-muted/50 w-full focus:ring-0 p-0"
            />
          </div>

          {showSearchResults && searchQuery.trim() && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowSearchResults(false)} />
              <div className="absolute left-0 mt-2 w-96 bg-card border border-border rounded-2xl shadow-xl z-50 py-2 divide-y divide-border max-h-[30rem] overflow-y-auto animate-zoom-in">
                {getSearchResults().length > 0 ? (
                  getSearchResults().map((cat) => (
                    <div key={cat.category} className="p-2">
                      <div className="px-3 py-1 text-[10px] font-bold text-primary uppercase tracking-wider">
                        {cat.category}
                      </div>
                      <div className="mt-1 space-y-1">
                        {cat.items.map((item) => (
                          <Link
                            key={item.id}
                            to={item.link}
                            onClick={() => {
                              setSearchQuery('');
                              setShowSearchResults(false);
                            }}
                            className="flex flex-col px-3 py-2 rounded-lg hover:bg-border/20 transition-colors"
                          >
                            <span className="text-xs font-semibold text-text">{item.title}</span>
                            <span className="text-[10px] text-text-muted mt-0.5">{item.subtitle}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-text-muted">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Light/Dark Toggle */}
        <ThemeToggle />

        {/* Notifications Alert Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-border/30 transition-colors focus:outline-none relative"
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              {/* Overlay to close */}
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-xl z-50 py-2 animate-zoom-in">
                <div className="px-4 py-2 border-b border-border flex items-center justify-between">
                  <span className="font-semibold text-sm text-text">System Alerts</span>
                  <span className="text-xs text-text-muted font-medium">{notifications.length} Alerts</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-border">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div key={n.id} className="p-3.5 hover:bg-border/10 transition-colors">
                        <div className="flex justify-between items-start">
                          <span className={`text-xs font-bold ${
                            n.type === 'danger' ? 'text-danger' : n.type === 'warning' ? 'text-warning' : 'text-info'
                          }`}>
                            {n.title}
                          </span>
                          <span className="text-[10px] text-text-muted">{n.date}</span>
                        </div>
                        <p className="text-xs text-text-muted mt-1 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-xs text-text-muted">
                      No system warnings active.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-border hidden sm:block" />

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
              alt="Avatar"
              className="h-8 w-8 rounded-lg object-cover ring-2 ring-border"
            />
            <div className="hidden md:block text-left">
              <span className="text-xs font-bold text-text block leading-none">{currentUser?.name}</span>
              <span className="text-[10px] font-semibold text-text-muted block mt-0.5 capitalize">{currentUser?.role}</span>
            </div>
          </button>

          {showProfileDropdown && (
            <>
              {/* Overlay */}
              <div className="fixed inset-0 z-40" onClick={() => setShowProfileDropdown(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl z-50 py-1.5 animate-zoom-in">
                <div className="px-4 py-2 border-b border-border">
                  <span className="text-xs text-text-muted block">Signed in as</span>
                  <span className="text-xs font-bold text-text block truncate">{currentUser?.email}</span>
                </div>
                <Link
                  to="/settings"
                  onClick={() => setShowProfileDropdown(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-text hover:bg-border/30 transition-colors"
                >
                  <SettingsIcon className="h-3.5 w-3.5 text-text-muted" />
                  My Settings
                </Link>
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    logout();
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
