import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Palette
} from 'lucide-react';

interface FullTipTapToolbarProps {
  editor: Editor | null;
  isVisible: boolean;
  position: { top: number; left: number };
  onLinkClick?: () => void;
  containerElement?: HTMLElement | null;
}

const textColors = [
  '#000000', '#374151', '#6B7280', '#9CA3AF',
  '#EF4444', '#F97316', '#EAB308', '#22C55E',
  '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6'
];

export const FullTipTapToolbar: React.FC<FullTipTapToolbarProps> = ({
  editor,
  isVisible,
  position,
  onLinkClick,
  containerElement
}) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [finalPosition, setFinalPosition] = useState(position);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const calculateOptimalPosition = useCallback(() => {
    if (!toolbarRef.current || !isVisible) return;

    const toolbar = toolbarRef.current;
    const toolbarRect = toolbar.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let { top, left } = position;

    // Fixed toolbar width for full toolbar
    const toolbarWidth = 450;
    const toolbarHeight = 60;

    // Position toolbar above selection if there's space, otherwise below
    if (top >= toolbarHeight + 10) {
      top = top - toolbarHeight - 10;
    } else if (viewportHeight - top >= toolbarHeight + 10) {
      top = top + 30;
    } else {
      top = Math.max(10, top - toolbarHeight - 10);
    }

    // Center horizontally, but keep within viewport
    left = Math.max(10, Math.min(left - toolbarWidth / 2, viewportWidth - toolbarWidth - 10));

    // Handle container constraints if provided
    if (containerElement) {
      const containerRect = containerElement.getBoundingClientRect();
      left = Math.max(containerRect.left + 10, Math.min(left, containerRect.right - toolbarWidth - 10));
      top = Math.max(containerRect.top + 10, Math.min(top, containerRect.bottom - toolbarHeight - 10));
    }

    setFinalPosition({ top, left });
  }, [position, isVisible, containerElement]);

  useEffect(() => {
    calculateOptimalPosition();
  }, [calculateOptimalPosition]);

  useEffect(() => {
    const handleResize = () => calculateOptimalPosition();
    const handleScroll = () => calculateOptimalPosition();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [calculateOptimalPosition]);

  if (!editor || !isVisible) return null;

  const handleTextColorChange = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  };

  const toolbarStyle = {
    top: finalPosition.top,
    left: finalPosition.left,
    zIndex: 9999,
    maxWidth: 'calc(100vw - 20px)',
  };

  return (
    <div
      ref={toolbarRef}
      className="full-tiptap-toolbar fixed bg-white border border-gray-200 rounded-lg shadow-xl p-2 flex items-center gap-1 animate-scale-in min-w-96"
      style={toolbarStyle}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Text Formatting */}
      <Button
        variant={editor.isActive('bold') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="h-8 w-8 p-0"
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        variant={editor.isActive('italic') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="h-8 w-8 p-0"
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        variant={editor.isActive('underline') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className="h-8 w-8 p-0"
        title="Underline"
      >
        <Underline className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Text Alignment */}
      <Button
        variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className="h-8 w-8 p-0"
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button
        variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className="h-8 w-8 p-0"
        title="Center"
      >
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button
        variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className="h-8 w-8 p-0"
        title="Align Right"
      >
        <AlignRight className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Text Color */}
      <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Text Color"
          >
            <Palette className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2 bg-white border border-gray-200 shadow-lg z-[110]" sideOffset={5}>
          <div className="grid grid-cols-4 gap-1">
            {textColors.map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded border border-gray-200 hover:border-gray-400 transition-colors"
                style={{ backgroundColor: color }}
                onClick={() => handleTextColorChange(color)}
                title={color}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Link */}
      <Button
        variant={editor.isActive('link') ? 'default' : 'ghost'}
        size="sm"
        onClick={onLinkClick}
        className="h-8 w-8 p-0"
        title="Add Link"
      >
        <LinkIcon className="w-4 h-4" />
      </Button>
    </div>
  );
};
