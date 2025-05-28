
import React, { useRef, useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';
import { FullTipTapToolbar } from './FullTipTapToolbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FloatingTipTapToolbarProps {
  editor: Editor | null;
  isVisible: boolean;
  position: { top: number; left: number };
  onLinkClick?: () => void;
  emailContext?: any;
}

const FloatingTipTapToolbar: React.FC<FloatingTipTapToolbarProps> = ({
  editor,
  isVisible,
  position,
  onLinkClick,
  emailContext = {}
}) => {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [containerElement, setContainerElement] = useState<HTMLElement | null>(null);

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

  const handleLinkClick = () => {
    setShowLinkDialog(true);
    onLinkClick?.();
  };

  const handleLinkAdd = () => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkDialog(false);
    }
  };

  return (
    <>
      <FullTipTapToolbar
        editor={editor}
        isVisible={isVisible && !showLinkDialog}
        position={position}
        onLinkClick={handleLinkClick}
        containerElement={containerElement}
      />

      {/* Link Dialog */}
      {showLinkDialog && (
        <div 
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl p-3 z-[9999] animate-scale-in"
          style={{
            top: position.top + 40,
            left: position.left,
            transform: 'translateX(-50%)',
            minWidth: '280px',
            maxWidth: 'calc(100vw - 40px)'
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="flex flex-col gap-3">
            <div className="text-sm font-medium text-gray-700">Add Link</div>
            <div className="flex gap-2">
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLinkAdd();
                  } else if (e.key === 'Escape') {
                    setShowLinkDialog(false);
                  }
                }}
                autoFocus
              />
              <Button size="sm" onClick={handleLinkAdd} disabled={!linkUrl.trim()}>
                Add
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowLinkDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { FloatingTipTapToolbar };
