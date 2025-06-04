
import React from 'react';
import { cn } from '@/lib/utils';

// Brand Card Component
interface BrandCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const BrandCard: React.FC<BrandCardProps> = ({ 
  children, 
  className, 
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "card-brand bg-brand-bg border border-brand rounded-brand-card p-brand-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Brand Button Component
interface BrandButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const BrandButton: React.FC<BrandButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}) => {
  const baseClasses = "btn-brand rounded-brand font-switzer transition-colors focus:ring-2 focus:ring-brand-primary focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-brand-primary text-white hover:bg-brand-primary-hover",
    secondary: "bg-brand-secondary text-brand-fg border border-brand hover:bg-brand-muted",
    ghost: "text-brand-fg hover:bg-brand-muted"
  };
  
  const sizeClasses = {
    sm: "px-brand-2 py-brand-1 text-caption",
    md: "px-brand-3 py-brand-2 text-body",
    lg: "px-brand-4 py-brand-3 text-body"
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// Brand Panel Component
interface BrandPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
}

export const BrandPanel: React.FC<BrandPanelProps> = ({
  title,
  children,
  className,
  ...props
}) => {
  return (
    <div 
      className={cn(
        "bg-brand-bg border border-brand rounded-brand-lg",
        className
      )}
      {...props}
    >
      {title && (
        <div className="border-b border-brand p-brand-4">
          <h3 className="text-h3 text-brand-fg">{title}</h3>
        </div>
      )}
      <div className="p-brand-4">
        {children}
      </div>
    </div>
  );
};

// Brand Status Bar Component
interface BrandStatusBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const BrandStatusBar: React.FC<BrandStatusBarProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-brand-bg border-t border-brand px-brand-4 py-brand-2 text-caption text-brand-fg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Brand Modal Component
interface BrandModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const BrandModal: React.FC<BrandModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  ...props
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      <div 
        className={cn(
          "relative bg-brand-bg border border-brand rounded-brand-lg shadow-lg max-w-2xl w-full mx-brand-4",
          className
        )}
        {...props}
      >
        {title && (
          <div className="border-b border-brand p-brand-4">
            <h2 className="text-h2 text-brand-fg">{title}</h2>
          </div>
        )}
        <div className="p-brand-6">
          {children}
        </div>
      </div>
    </div>
  );
};
