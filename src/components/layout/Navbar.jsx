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
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 h-16 bg-surface/80 backdrop-blur-md border-b border-border/60 shadow-sm transition-theme">
      {/* Left side: Hamburger and Brand details */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-text-muted hover:text-text hover:bg-border/30 transition-colors focus:outline-none cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative hidden sm:block max-w-xs w-64">
          <div className="flex items-center gap-2 text-text-muted bg-border/30 px-4 py-2 rounded-full border border-border/40 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
            <Search className="h-4.5 w-4.5 text-text-muted/50 flex-shrink-0" />
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
              <div className="absolute left-0 mt-3 w-[400px] bg-card/95 backdrop-blur-xl border border-border/80 rounded-[20px] shadow-2xl z-50 py-3.5 divide-y divide-border/60 max-h-[30rem] overflow-y-auto animate-zoom-in">
                {getSearchResults().length > 0 ? (
                  getSearchResults().map((cat) => (
                    <div key={cat.category} className="p-2">
                      <div className="px-3 py-1 text-[10px] font-bold text-primary uppercase tracking-wider">
                        {cat.category}
                      </div>
                      <div className="mt-1 space-y-0.5">
                        {cat.items.map((item) => (
                          <Link
                            key={item.id}
                            to={item.link}
                            onClick={() => {
                              setSearchQuery('');
                              setShowSearchResults(false);
                            }}
                            className="flex flex-col px-3 py-2 rounded-xl hover:bg-primary/[0.05] dark:hover:bg-white/[0.05] transition-colors"
                          >
                            <span className="text-xs font-bold text-text">{item.title}</span>
                            <span className="text-[10px] text-text-muted/80 mt-0.5">{item.subtitle}</span>
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
            className="p-2.5 rounded-full text-text-muted hover:text-text hover:bg-border/40 transition-all focus:outline-none relative cursor-pointer active:scale-95"
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              {/* Overlay to close */}
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-3 w-80 bg-card/95 backdrop-blur-xl border border-border/80 rounded-[20px] shadow-2xl z-50 py-2.5 animate-zoom-in">
                <div className="px-4 py-2.5 border-b border-border/50 flex items-center justify-between">
                  <span className="font-bold text-sm text-text">System Alerts</span>
                  <span className="text-xs text-text-muted font-semibold bg-border/40 px-2.5 py-0.5 rounded-full">{notifications.length} Alerts</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-border/45">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div key={n.id} className="p-3.5 hover:bg-primary/[0.03] dark:hover:bg-white/[0.03] transition-colors">
                        <div className="flex justify-between items-start gap-1">
                          <span className={`text-xs font-extrabold ${
                            n.type === 'danger' ? 'text-danger' : n.type === 'warning' ? 'text-warning' : 'text-info'
                          }`}>
                            {n.title}
                          </span>
                          <span className="text-[9px] text-text-muted/80 font-medium whitespace-nowrap mt-0.5">{n.date}</span>
                        </div>
                        <p className="text-xs text-text-muted/90 mt-1 leading-relaxed">{n.message}</p>
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
        <div className="h-5 w-px bg-border/60 hidden sm:block mx-1" />

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2.5 focus:outline-none cursor-pointer group p-1 rounded-xl hover:bg-border/30 transition-all active:scale-95"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
              alt="Avatar"
              className="h-8.5 w-8.5 rounded-xl object-cover ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all"
            />
            <div className="hidden md:block text-left pr-1.5">
              <span className="text-xs font-bold text-text block leading-none">{currentUser?.name}</span>
              <span className="text-[9px] font-bold text-text-muted block mt-1 uppercase tracking-wide">{currentUser?.role}</span>
            </div>
          </button>

          {showProfileDropdown && (
            <>
              {/* Overlay */}
              <div className="fixed inset-0 z-40" onClick={() => setShowProfileDropdown(false)} />
              <div className="absolute right-0 mt-3 w-52 bg-card/95 backdrop-blur-xl border border-border/80 rounded-[20px] shadow-2xl z-50 py-2 animate-zoom-in">
                <div className="px-4 py-3 border-b border-border/50 mb-1.5">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Signed in as</span>
                  <span className="text-xs font-bold text-text block truncate mt-0.5">{currentUser?.email}</span>
                </div>
                <Link
                  to="/settings"
                  onClick={() => setShowProfileDropdown(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-text rounded-xl hover:bg-primary/[0.05] dark:hover:bg-white/[0.05] transition-colors mx-2"
                >
                  <SettingsIcon className="h-4 w-4 text-text-muted" />
                  My Settings
                </Link>
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    logout();
                  }}
                  className="flex items-center gap-2 w-[calc(100%-16px)] text-left px-3 py-2 text-xs font-semibold text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors mx-2 mt-1 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
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
