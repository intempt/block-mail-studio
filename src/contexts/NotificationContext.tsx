
import React, { createContext, useContext, useState, useCallback } from 'react';
import { InlineNotification } from '@/components/ui/inline-notification';

interface NotificationContextType {
  notifications: InlineNotification[];
  addNotification: (notification: Omit<InlineNotification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  success: (message: string, options?: Partial<InlineNotification>) => string;
  error: (message: string, options?: Partial<InlineNotification>) => string;
  warning: (message: string, options?: Partial<InlineNotification>) => string;
  info: (message: string, options?: Partial<InlineNotification>) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<InlineNotification[]>([]);

  const addNotification = useCallback((
    notification: Omit<InlineNotification, 'id'>
  ): string => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: InlineNotification = {
      id,
      autoRemove: true,
      duration: 5000,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const success = useCallback((message: string, options?: Partial<InlineNotification>) => {
    return addNotification({
      type: 'success',
      message,
      ...options
    });
  }, [addNotification]);

  const error = useCallback((message: string, options?: Partial<InlineNotification>) => {
    return addNotification({
      type: 'error',
      message,
      autoRemove: false,
      ...options
    });
  }, [addNotification]);

  const warning = useCallback((message: string, options?: Partial<InlineNotification>) => {
    return addNotification({
      type: 'warning',
      message,
      ...options
    });
  }, [addNotification]);

  const info = useCallback((message: string, options?: Partial<InlineNotification>) => {
    return addNotification({
      type: 'info',
      message,
      ...options
    });
  }, [addNotification]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAll,
      success,
      error,
      warning,
      info
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
