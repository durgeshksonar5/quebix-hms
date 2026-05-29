import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'increase',
  iconBg = 'bg-primary/10 text-primary',
  className = ''
}) {
  return (
    <div className={`p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            {title}
          </p>
          <h3 className="mt-2 text-3xl font-bold text-text tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${iconBg}`}>
          {Icon && <Icon className="h-6 w-6" />}
        </div>
      </div>
      
      {change !== undefined && (
        <div className="mt-4 flex items-center gap-1">
          <span className={`inline-flex items-center text-xs font-semibold ${
            changeType === 'increase' 
              ? 'text-success' 
              : changeType === 'decrease' 
                ? 'text-danger' 
                : 'text-text-muted'
          }`}>
            {changeType === 'increase' ? (
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
            ) : changeType === 'decrease' ? (
              <ArrowDownRight className="h-3 w-3 mr-0.5" />
            ) : null}
            {change}
          </span>
          <span className="text-xs text-text-muted">
            vs last month
          </span>
        </div>
      )}
    </div>
  );
}
