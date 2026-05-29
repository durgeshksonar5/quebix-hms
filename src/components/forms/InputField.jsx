import React from 'react';

export default function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-text-muted select-none">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-text-muted pointer-events-none">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full px-4 py-2 text-sm rounded-xl border border-border bg-surface text-text placeholder-text-muted/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:bg-border/10 ${Icon ? 'pl-10' : ''} ${error ? 'border-danger focus:ring-danger/20 focus:border-danger' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-danger font-medium mt-0.5">{error}</span>}
    </div>
  );
}
