
import React, { useRef, useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';
import { FullTipTapToolbar } from './FullTipTapToolbar';
import { EmailContext } from '@/services/tiptapAIService';
import { useNotification } from '@/contexts/NotificationContext';
import { InlineNotificationContainer } from '@/components/ui/inline-notification';

interface FloatingTipTapToolbarProps {
  editor: Editor | null;
  isVisible: boolean;
  position: { top: number; left: number };
  onLinkClick?: () => void;
  emailContext?: EmailContext;
}

const FloatingTipTapToolbar: React.FC<FloatingTipTapToolbarProps> = ({
  editor,
  isVisible,
  position,
  onLinkClick,
  emailContext = {}
}) => {
  const [containerElement, setContainerElement] = useState<HTMLElement | null>(null);
  const { notifications, removeNotification } = useNotification();

  useEffect(() => {
    // Find the closest scrollable container or use document body
    if (editor?.view?.dom) {
      let element = editor.view.dom.parentElement;
      while (element && element !== document.body) {
        const style = window.getComputedStyle(element);
        if (style.overflow === 'auto' || style.overflow === 'scroll' || 
            style.overflowY === 'auto' || style.overflowY === 'scroll' ||
            element.classList.contains('email-block-canvas') ||
            element.classList.contains('enhanced-text-block')) {
          setContainerElement(element);
          break;
        }
        element = element.parentElement;
      }
      if (!element) {
        setContainerElement(document.body);
      }
    }
  }, [editor]);

  return (
    <div>
      {/* Contextual notifications near toolbar */}
      {notifications.length > 0 && (
        <div className="fixed z-50 max-w-sm" style={{ 
          top: position.top - 100, 
          left: position.left 
        }}>
          <InlineNotificationContainer
            notifications={notifications}
            onRemove={removeNotification}
            maxNotifications={1}
          />
        </div>
      )}
      
      <FullTipTapToolbar
        editor={editor}
        isVisible={isVisible}
        position={position}
        onLinkClick={onLinkClick}
        containerElement={containerElement}
        emailContext={emailContext}
      />
    </div>
  );
};

export { FloatingTipTapToolbar };
