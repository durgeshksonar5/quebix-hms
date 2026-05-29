import React from 'react';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.96] cursor-pointer';

  const variants = {
    primary: 'bg-gradient-to-br from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/15 text-white border border-primary/10',
    secondary: 'bg-secondary hover:opacity-95 text-white shadow-sm',
    success: 'bg-gradient-to-br from-success to-emerald-600 hover:shadow-lg hover:shadow-success/15 text-white border border-success/10',
    warning: 'bg-gradient-to-br from-warning to-amber-600 hover:shadow-lg hover:shadow-warning/15 text-white border border-warning/10',
    danger: 'bg-gradient-to-br from-danger to-rose-600 hover:shadow-lg hover:shadow-danger/15 text-white border border-danger/10',
    info: 'bg-gradient-to-br from-info to-blue-600 hover:shadow-lg hover:shadow-info/15 text-white border border-info/10',
    outline: 'border border-border bg-surface/50 backdrop-blur-md text-text hover:bg-border/40 hover:border-text-muted',
    ghost: 'bg-transparent text-text hover:bg-border/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-[10px]',
    md: 'px-4.5 py-2.5 rounded-xl text-sm gap-2',
    lg: 'px-6 py-3 rounded-[14px] text-base gap-2.5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
