import React from 'react';

export default function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select option',
  required = false,
  error = '',
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-text-muted/80 select-none ml-1">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full px-4.5 py-2.5 text-sm rounded-xl border border-border bg-surface/40 backdrop-blur-sm text-text transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary disabled:opacity-50 disabled:bg-border/5 cursor-pointer ${error ? 'border-danger focus:ring-danger/20' : ''}`}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt, idx) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={idx} value={val} className="bg-card text-text">
              {lbl}
            </option>
          );
        })}
      </select>
      {error && <span className="text-xs text-danger font-medium mt-0.5 ml-1">{error}</span>}
    </div>
  );
}
