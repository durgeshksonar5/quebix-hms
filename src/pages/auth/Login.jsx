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
    <div className="min-h-screen flex bg-bg transition-theme">
      {/* Left side panel (branding illustration) */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar-bg p-12 flex-col justify-between text-white relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-white font-bold text-xl shadow-lg">
            Q
          </div>
          <span className="font-bold text-xl tracking-wide">Quebix HMS</span>
        </div>

        <div className="my-auto max-w-lg relative z-10">
          <h2 className="text-4xl font-extrabold text-white leading-tight">
            Integrated Digital Hospital Ecosystem
          </h2>
          <p className="text-sidebar-text text-sm mt-4 leading-relaxed">
            Manage clinical histories, arrange staff scheduling, organize laboratory orders, track billing files, and analyze pharmacy stocks inside a unified medical workspace.
          </p>
          
          <div className="mt-8 flex flex-col gap-3">
            <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              <ShieldCheck className="h-5 w-5 text-secondary flex-shrink-0" />
              <div>
                <span className="text-xs font-semibold block text-white">Secure Encrypted Vaults</span>
                <span className="text-[10px] text-sidebar-text block">Compliant clinical logs and billing records</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-sidebar-text relative z-10">
          &copy; 2026 Quebix Digital. All Rights Reserved.
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-text">Welcome to Quebix HMS</h2>
            <p className="text-xs text-text-muted mt-1.5">Smart Healthcare. Simplified Management.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer select-none">
                <input type="checkbox" className="rounded border-border text-primary focus:ring-primary/20 h-4 w-4 bg-surface" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:text-primary-dark">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Access Workspace'}
            </Button>
          </form>

          {/* Quick login selector */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-muted mb-3">
              <UserCheck className="h-4 w-4" />
              <span>Evaluate Demo Accounts:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickFill(acc)}
                  className="px-3 py-2 text-left text-xs bg-border/20 border border-border hover:bg-border/40 text-text rounded-xl transition-all duration-150 focus:outline-none"
                >
                  <span className="font-bold block text-text leading-none mb-0.5">{acc.label}</span>
                  <span className="text-[10px] text-text-muted block truncate">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-text-muted">
            Need an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
