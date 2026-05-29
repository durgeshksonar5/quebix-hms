import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Mail, ArrowLeft } from 'lucide-react';
import InputField from '../../components/forms/InputField';
import Button from '../../components/common/Button';

export default function ForgotPassword() {
  const { addToast } = useApp();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
      addToast('Reset instructions sent to your email', 'success');
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
          <h2 className="text-2xl font-bold text-text">Recover Password</h2>
          <p className="text-xs text-text-muted mt-1.5">Enter email to recover access to the Quebix HMS workspace</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Account Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@quebixhms.com"
              icon={Mail}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Send Recovery Email'}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4 bg-green-50 dark:bg-green-950/20 p-6 rounded-2xl border border-green-100 dark:border-green-900/30">
            <span className="text-sm font-semibold text-green-800 dark:text-green-300 block">Check Your Inbox</span>
            <p className="text-xs text-green-700/80 dark:text-green-400/80 leading-relaxed">
              We have dispatched recovery coordinates to <span className="font-bold">{email}</span>. Click the enclosed token link to finalize your new credentials.
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
