
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export interface InlineNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  autoRemove?: boolean;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface InlineNotificationProps extends InlineNotification {
  onRemove: (id: string) => void;
  className?: string;
}

const notificationStyles = {
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    icon: 'text-green-600',
    IconComponent: CheckCircle
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: 'text-red-600',
    IconComponent: AlertCircle
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: 'text-yellow-600',
    IconComponent: AlertTriangle
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: 'text-blue-600',
    IconComponent: Info
  }
};

export const InlineNotificationComponent: React.FC<InlineNotificationProps> = ({
  id,
  type,
  title,
  message,
  autoRemove = true,
  duration = 5000,
  action,
  onRemove,
  className
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);

  const style = notificationStyles[type];
  const IconComponent = style.IconComponent;

  useEffect(() => {
    if (autoRemove && duration > 0) {
      const timer = setTimeout(() => {
        handleRemove();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoRemove, duration, id]);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(id);
    }, 150);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 border rounded-lg transition-all duration-150',
        style.container,
        isRemoving ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100',
        className
      )}
    >
      <IconComponent className={cn('w-4 h-4 mt-0.5 flex-shrink-0', style.icon)} />
      
      <div className="flex-1 min-w-0">
        {title && (
          <div className="font-medium text-sm mb-1">{title}</div>
        )}
        <div className="text-sm">{message}</div>
        
        {action && (
          <Button
            variant="outline"
            size="sm"
            onClick={action.onClick}
            className="mt-2 h-7 text-xs"
          >
            {action.label}
          </Button>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleRemove}
        className="h-6 w-6 p-0 hover:bg-black/10"
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
};

interface InlineNotificationContainerProps {
  notifications: InlineNotification[];
  onRemove: (id: string) => void;
  className?: string;
  maxNotifications?: number;
}

export const InlineNotificationContainer: React.FC<InlineNotificationContainerProps> = ({
  notifications,
  onRemove,
  className,
  maxNotifications = 3
}) => {
  const visibleNotifications = notifications.slice(0, maxNotifications);

  if (visibleNotifications.length === 0) return null;

  return (
    <div className={cn('space-y-2', className)}>
      {visibleNotifications.map((notification) => (
        <InlineNotificationComponent
          key={notification.id}
          {...notification}
          onRemove={onRemove}
        />
      ))}
      {notifications.length > maxNotifications && (
        <div className="text-xs text-gray-500 text-center py-1">
          +{notifications.length - maxNotifications} more notifications
        </div>
      )}
    </div>
  );
};
