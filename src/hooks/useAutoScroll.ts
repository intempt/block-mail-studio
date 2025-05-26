
import { useRef, useEffect, useState, useCallback } from 'react';

interface UseAutoScrollOptions {
  threshold?: number;
  behavior?: ScrollBehavior;
}

export const useAutoScroll = (options: UseAutoScrollOptions = {}) => {
  const { threshold = 100, behavior = 'smooth' } = options;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior
      });
      setUnreadCount(0);
    }
  }, [behavior]);

  const checkScrollPosition = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const nearBottom = distanceFromBottom <= threshold;
      setIsNearBottom(nearBottom);
    }
  }, [threshold]);

  const handleScroll = useCallback(() => {
    checkScrollPosition();
  }, [checkScrollPosition]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll, { passive: true });
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const scrollToBottomIfNeeded = useCallback(() => {
    if (isNearBottom) {
      scrollToBottom();
    } else {
      setUnreadCount(prev => prev + 1);
    }
  }, [isNearBottom, scrollToBottom]);

  return {
    scrollRef,
    isNearBottom,
    unreadCount,
    scrollToBottom,
    scrollToBottomIfNeeded,
    checkScrollPosition
  };
};
