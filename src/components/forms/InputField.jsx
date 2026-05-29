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
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-text-muted/80 select-none ml-1">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-text-muted/60 pointer-events-none">
            <Icon className="h-4.5 w-4.5" />
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
          className={`w-full px-4.5 py-2.5 text-sm rounded-xl border border-border bg-surface/40 backdrop-blur-sm text-text placeholder-text-muted/50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary disabled:opacity-50 disabled:bg-border/5 ${Icon ? 'pl-11' : ''} ${error ? 'border-danger focus:ring-danger/20' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-danger font-medium mt-0.5 ml-1">{error}</span>}
    </div>
  );
}
