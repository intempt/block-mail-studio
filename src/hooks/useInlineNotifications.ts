
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
      autoRemove: false,
      duration: 0,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 2)]); // Limit to 3 notifications
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const error = useCallback((message: string, options?: Partial<InlineNotification>) => {
    return addNotification({
      type: 'error',
      message,
      autoRemove: false,
      ...options
    });
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    error
  };
};
