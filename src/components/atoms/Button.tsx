import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'error';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-surface-tint shadow-sm hover:shadow-md active:scale-[0.98]',
    secondary: 'bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed-dim active:scale-[0.98]',
    outline: 'border border-outline-variant text-on-surface hover:bg-surface-container-low active:scale-[0.98]',
    ghost: 'text-on-surface-variant hover:bg-surface-container-low transition-colors',
    error: 'bg-error-container text-on-error-container hover:bg-error/10 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-label-sm rounded-lg',
    md: 'px-6 py-2.5 text-label-sm font-semibold rounded-xl min-h-[48px]',
    lg: 'px-8 py-4 text-title-sm rounded-2xl min-h-[56px]',
    icon: 'p-2 rounded-full',
  };

  return (
    <button
      className={cn(
        'flex items-center justify-center gap-2 transition-all duration-200 outline-none focus:ring-2 focus:ring-primary/20',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
