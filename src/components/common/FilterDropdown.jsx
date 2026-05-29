import React from 'react';
import { Filter } from 'lucide-react';

export default function FilterDropdown({
  value,
  onChange,
  options = [],
  placeholder = 'All',
  label,
  className = ''
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && <span className="text-xs font-semibold text-text-muted whitespace-nowrap">{label}</span>}
      <div className="relative flex items-center">
        <div className="absolute left-3 text-text-muted pointer-events-none">
          <Filter className="h-3.5 w-3.5" />
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9 pr-8 py-2 text-sm rounded-xl border border-border bg-surface text-text transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer appearance-none min-w-[120px]"
        >
          <option value="">{placeholder}</option>
          {options.map((opt, idx) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const lbl = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={idx} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
        <div className="absolute right-3 pointer-events-none text-text-muted font-bold text-xs pointer-events-none">
          ▼
        </div>
      </div>
    </div>
  );
}
