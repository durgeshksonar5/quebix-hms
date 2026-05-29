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
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-sm ring-primary/20',
    secondary: 'bg-secondary hover:opacity-90 text-white shadow-sm ring-secondary/20',
    success: 'bg-success hover:opacity-90 text-white shadow-sm ring-success/20',
    warning: 'bg-warning hover:opacity-90 text-white shadow-sm ring-warning/20',
    danger: 'bg-danger hover:opacity-90 text-white shadow-sm ring-danger/20',
    info: 'bg-info hover:opacity-90 text-white shadow-sm ring-info/20',
    outline: 'border border-border bg-transparent text-text hover:bg-border/30 hover:border-text-muted',
    ghost: 'bg-transparent text-text hover:bg-border/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
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
