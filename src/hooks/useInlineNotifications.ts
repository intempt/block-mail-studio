
import { useState, useCallback } from 'react';
import { InlineNotification } from '@/components/ui/inline-notification';

export const useInlineNotifications = () => {
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

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  };
};
