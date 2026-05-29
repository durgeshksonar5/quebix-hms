import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true
}) {
  // Close on ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    full: 'max-w-[95vw]'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/55 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Wrapper for Scrolling */}
      <div className="relative w-full flex items-center justify-center min-h-full pointer-events-none">
        {/* Modal Card */}
        <div 
          className={`relative w-full transform overflow-hidden rounded-2xl bg-card border border-border text-left shadow-2xl transition-all duration-300 animate-zoom-in my-8 pointer-events-auto flex flex-col ${sizes[size]}`}
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h3 className="text-lg font-semibold text-text leading-6">
              {title}
            </h3>
            {showClose && (
              <button
                onClick={onClose}
                type="button"
                className="rounded-lg p-1.5 inline-flex items-center justify-center text-text-muted hover:text-text hover:bg-border transition-colors focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 max-h-[75vh]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
