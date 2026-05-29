import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { User, Mail, KeyRound, Briefcase } from 'lucide-react';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';
import Button from '../../components/common/Button';

export default function Register() {
  const { register } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Patient');
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { value: 'Admin', label: 'Hospital Administrator' },
    { value: 'Doctor', label: 'Medical Doctor' },
    { value: 'Receptionist', label: 'Front Desk Receptionist' },
    { value: 'Patient', label: 'Admitted / Outpatient Patient' },
    { value: 'Pharmacist', label: 'Pharmacy Lead' },
    { value: 'Lab Assistant', label: 'Laboratory Analyst' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const success = register(name, email, password, role);
      setIsLoading(false);
      if (success) {
        navigate('/login');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center app-bg p-6 relative">
      <div className="absolute top-20 left-20 w-85 h-85 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-85 h-85 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-card/70 backdrop-blur-xl border border-border/80 rounded-[28px] p-8.5 sm:p-10 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3.5">
            <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-primary text-white font-bold text-xl shadow-lg shadow-primary/20">
              Q
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-text tracking-tight">Create Account</h2>
          <p className="text-xs text-text-muted/80 mt-2 font-medium">Join the Quebix HMS digital portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4.5">
          <InputField
            label="Full Name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Aarav Mehta"
            icon={User}
            required
          />

          <InputField
            label="Email Address"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. name@quebixhms.com"
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

          <SelectField
            label="Portal Access Role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={roles}
            placeholder="Select your role"
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3 mt-3 text-sm font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-95"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-text-muted/80 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary hover:underline hover:text-primary-dark transition-colors">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
