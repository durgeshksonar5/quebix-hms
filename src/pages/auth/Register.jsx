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
    <div className="min-h-screen flex items-center justify-center bg-bg p-6">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-white font-bold text-lg">
              Q
            </div>
          </div>
          <h2 className="text-2xl font-bold text-text">Create Account</h2>
          <p className="text-xs text-text-muted mt-1.5">Join the Quebix HMS digital portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
