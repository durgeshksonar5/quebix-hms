import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative flex items-center w-full max-w-md ${className}`}>
      <div className="absolute left-3.5 text-text-muted pointer-events-none">
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 text-sm rounded-xl border border-border bg-surface text-text placeholder-text-muted/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          type="button"
          className="absolute right-3 p-1 rounded-lg text-text-muted hover:text-text hover:bg-border transition-colors focus:outline-none"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
