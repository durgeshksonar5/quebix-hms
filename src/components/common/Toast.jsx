import React from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  const { message, type } = toast;

  const styles = {
    success: {
      bg: 'bg-green-50 dark:bg-green-950/30',
      border: 'border-green-200 dark:border-green-900',
      text: 'text-green-800 dark:text-green-200',
      icon: <CheckCircle className="h-5 w-5 text-success" />
    },
    danger: {
      bg: 'bg-red-50 dark:bg-red-950/30',
      border: 'border-red-200 dark:border-red-900',
      text: 'text-red-800 dark:text-red-200',
      icon: <AlertCircle className="h-5 w-5 text-danger" />
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-950/30',
      border: 'border-yellow-200 dark:border-yellow-900',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: <AlertTriangle className="h-5 w-5 text-warning" />
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-200 dark:border-blue-900',
      text: 'text-blue-800 dark:text-blue-200',
      icon: <Info className="h-5 w-5 text-info" />
    }
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-0 animate-bounce-in ${currentStyle.bg} ${currentStyle.border}`}
      role="alert"
    >
      <div className="flex-shrink-0">{currentStyle.icon}</div>
      <div className={`flex-1 text-sm font-medium ${currentStyle.text}`}>{message}</div>
      <button
        onClick={onClose}
        type="button"
        className="flex-shrink-0 ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center text-text-muted hover:text-text hover:bg-border transition-colors focus:outline-none"
      >
        <span className="sr-only">Close</span>
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
