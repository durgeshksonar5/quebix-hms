import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { ChevronRight, Home } from 'lucide-react';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Compute breadcrumbs and title
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  const getPageTitle = () => {
    if (pathnames.length === 0) return 'Clinical Dashboard';
    const raw = pathnames[pathnames.length - 1];
    // Capitalize and format
    return raw.charAt(0).toUpperCase() + raw.slice(1).replace('-', ' & ');
  };

  return (
    <div className="min-h-screen bg-bg text-text flex transition-theme">
      {/* Sidebar - desktop sticky, mobile drawer */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 min-h-screen">
        {/* Top Navbar */}
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Content Shell */}
        <main className="flex-1 px-6 py-6 overflow-y-auto max-w-[1600px] w-full mx-auto flex flex-col gap-6">
          {/* Page Title & Breadcrumbs header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-text leading-tight">
                {getPageTitle()}
              </h1>
              {/* Breadcrumbs */}
              <nav className="flex items-center gap-1.5 text-xs text-text-muted mt-1 select-none font-medium">
                <Link to="/" className="hover:text-primary flex items-center gap-1">
                  <Home className="h-3.5 w-3.5" />
                  <span>Home</span>
                </Link>
                {pathnames.map((value, index) => {
                  const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                  const isLast = index === pathnames.length - 1;
                  const label = value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' & ');

                  return (
                    <React.Fragment key={to}>
                      <ChevronRight className="h-3 w-3 text-text-muted/60" />
                      {isLast ? (
                        <span className="text-text font-semibold truncate">{label}</span>
                      ) : (
                        <Link to={to} className="hover:text-primary truncate">
                          {label}
                        </Link>
                      )}
                    </React.Fragment>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Router Content Outlet */}
          <div className="flex-1 flex flex-col h-full min-h-[400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
