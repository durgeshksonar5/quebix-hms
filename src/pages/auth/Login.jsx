import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { KeyRound, Mail, ShieldCheck, UserCheck } from 'lucide-react';
import InputField from '../../components/forms/InputField';
import Button from '../../components/common/Button';

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const demoAccounts = [
    { label: 'Admin Access', email: 'admin@quebixhms.com', pass: 'admin123' },
    { label: 'Doctor access', email: 'doctor@quebixhms.com', pass: 'doctor123' },
    { label: 'Reception desk', email: 'reception@quebixhms.com', pass: 'reception123' },
    { label: 'Patient portal', email: 'patient@quebixhms.com', pass: 'patient123' }
  ];

  const handleQuickFill = (acc) => {
    setEmail(acc.email);
    setPassword(acc.pass);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Add small delay to feel like database checking
    setTimeout(() => {
      const success = login(email, password);
      setIsLoading(false);
      if (success) {
        navigate('/');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex app-bg transition-theme">
      {/* Left side panel (branding illustration) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#080d1a] via-[#0f172a] to-[#03060f] p-12 flex-col justify-between text-white relative overflow-hidden border-r border-border/10">
        {/* Subtle decorative circles */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-white font-bold text-xl shadow-lg shadow-primary/25">
            Q
          </div>
          <span className="font-extrabold text-xl tracking-tight">Quebix HMS</span>
        </div>

        <div className="my-auto max-w-lg relative z-10 space-y-6">
          <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            Smart Healthcare.<br />Simplified Management.
          </h2>
          <p className="text-sidebar-text/80 text-sm leading-relaxed">
            Manage clinical histories, arrange staff scheduling, organize laboratory orders, track billing files, and analyze pharmacy stocks inside a unified medical workspace.
          </p>
          
          <div className="pt-4 flex flex-col gap-3">
            <div className="flex items-center gap-3.5 bg-white/[0.03] backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-sm">
              <div className="p-2 rounded-xl bg-[#FD3A25]/10 text-primary">
                <ShieldCheck className="h-5 w-5 flex-shrink-0" />
              </div>
              <div>
                <span className="text-xs font-bold block text-white">Secure Encrypted Vaults</span>
                <span className="text-[10px] text-sidebar-text/70 block mt-0.5">Compliant clinical logs and billing records</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-sidebar-text/50 relative z-10">
          &copy; 2026 Quebix Digital. All Rights Reserved.
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-20 right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-md w-full bg-card/70 backdrop-blur-xl border border-border/80 rounded-[28px] p-8.5 sm:p-10 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-text tracking-tight">Sign In</h2>
            <p className="text-xs text-text-muted/80 mt-2 font-medium">Smart Healthcare. Simplified Management.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@quebixhms.com"
              icon={Mail}
              required
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={KeyRound}
              required
            />

            <div className="flex items-center justify-between ml-1">
              <label className="flex items-center gap-2 text-xs text-text-muted/80 cursor-pointer select-none font-medium">
                <input type="checkbox" className="rounded border-border/80 text-primary focus:ring-primary/20 h-4 w-4 bg-surface" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-xs font-bold text-primary hover:text-primary-dark transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 mt-2 text-sm font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-95"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Access Workspace'}
            </Button>
          </form>

          {/* Quick login selector */}
          <div className="mt-8 pt-6 border-t border-border/60">
            <div className="flex items-center gap-2 text-xs font-bold text-text-muted mb-4 ml-1">
              <UserCheck className="h-4.5 w-4.5 text-primary" />
              <span>Evaluate Demo Accounts:</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {demoAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickFill(acc)}
                  className="px-3.5 py-2.5 text-left text-xs bg-border/25 border border-border/40 hover:border-primary/30 hover:bg-primary/[0.04] hover:text-primary text-text rounded-xl transition-all duration-250 cursor-pointer active:scale-95 focus:outline-none"
                >
                  <span className="font-extrabold block text-text leading-none mb-1 group-hover:text-primary transition-colors">{acc.label}</span>
                  <span className="text-[9px] text-text-muted/80 block truncate font-medium">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-text-muted/80 font-medium">
            Need an account?{' '}
            <Link to="/register" className="font-bold text-primary hover:underline hover:text-primary-dark transition-colors">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
