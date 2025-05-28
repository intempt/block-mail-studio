import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Palette,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';

interface AdaptiveTipTapToolbarProps {
  editor: Editor | null;
  isVisible: boolean;
  position: { top: number; left: number };
  onLinkClick?: () => void;
  containerElement?: HTMLElement | null;
}

type ToolbarLayout = 'full' | 'compact' | 'minimal' | 'overflow';

const textColors = [
  '#000000', '#374151', '#6B7280', '#9CA3AF',
  '#EF4444', '#F97316', '#EAB308', '#22C55E',
  '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6'
];

export const AdaptiveTipTapToolbar: React.FC<AdaptiveTipTapToolbarProps> = ({
  editor,
  isVisible,
  position,
  onLinkClick,
  containerElement
}) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [toolbarLayout, setToolbarLayout] = useState<ToolbarLayout>('full');
  const [finalPosition, setFinalPosition] = useState(position);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);

  const calculateOptimalPosition = useCallback(() => {
    if (!toolbarRef.current || !isVisible) return;

    const toolbar = toolbarRef.current;
    const toolbarRect = toolbar.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let { top, left } = position;
    let layout: ToolbarLayout = 'full';

    // Determine available space
    const spaceAbove = top;
    const spaceBelow = viewportHeight - top;
    const spaceLeft = left;
    const spaceRight = viewportWidth - left;

    // Calculate required space for different layouts
    const fullWidth = 450;
    const compactWidth = 300;
    const minimalWidth = 150;

    // Determine layout based on available space
    if (spaceRight >= fullWidth || spaceLeft >= fullWidth) {
      layout = 'full';
    } else if (spaceRight >= compactWidth || spaceLeft >= compactWidth) {
      layout = 'compact';
    } else if (spaceRight >= minimalWidth || spaceLeft >= minimalWidth) {
      layout = 'minimal';
    } else {
      layout = 'overflow';
    }

    // Position toolbar
    const toolbarHeight = 60; // Estimated toolbar height

    // Try above first
    if (spaceAbove >= toolbarHeight + 10) {
      top = top - toolbarHeight - 10;
    } else if (spaceBelow >= toolbarHeight + 10) {
      // Position below if no space above
      top = top + 30;
    } else {
      // Use available space, prefer above
      top = Math.max(10, top - toolbarHeight - 10);
    }

    // Horizontal positioning
    if (layout === 'full') {
      left = Math.max(10, Math.min(left - fullWidth / 2, viewportWidth - fullWidth - 10));
    } else if (layout === 'compact') {
      left = Math.max(10, Math.min(left - compactWidth / 2, viewportWidth - compactWidth - 10));
    } else {
      left = Math.max(10, Math.min(left - minimalWidth / 2, viewportWidth - minimalWidth - 10));
    }

    // Handle container constraints if provided
    if (containerElement) {
      const containerRect = containerElement.getBoundingClientRect();
      
      // Keep toolbar within container bounds
      left = Math.max(containerRect.left + 10, Math.min(left, containerRect.right - 200));
      top = Math.max(containerRect.top + 10, Math.min(top, containerRect.bottom - toolbarHeight - 10));
    }

    setToolbarLayout(layout);
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

  const BasicTools = () => (
    <>
      <Button
        variant={editor.isActive('bold') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="h-7 w-7 p-0"
        title="Bold"
      >
        <Bold className="w-3 h-3" />
      </Button>
      <Button
        variant={editor.isActive('italic') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="h-7 w-7 p-0"
        title="Italic"
      >
        <Italic className="w-3 h-3" />
      </Button>
      <Button
        variant={editor.isActive('underline') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className="h-7 w-7 p-0"
        title="Underline"
      >
        <Underline className="w-3 h-3" />
      </Button>
    </>
  );

  const AlignmentTools = () => (
    <>
      <Button
        variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className="h-7 w-7 p-0"
        title="Align Left"
      >
        <AlignLeft className="w-3 h-3" />
      </Button>
      <Button
        variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className="h-7 w-7 p-0"
        title="Center"
      >
        <AlignCenter className="w-3 h-3" />
      </Button>
      <Button
        variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className="h-7 w-7 p-0"
        title="Align Right"
      >
        <AlignRight className="w-3 h-3" />
      </Button>
    </>
  );

  const ColorTool = () => (
    <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          title="Text Color"
        >
          <Palette className="w-3 h-3" />
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
  );

  const LinkTool = () => (
    <Button
      variant={editor.isActive('link') ? 'default' : 'ghost'}
      size="sm"
      onClick={onLinkClick}
      className="h-7 w-7 p-0"
      title="Add Link"
    >
      <LinkIcon className="w-3 h-3" />
    </Button>
  );

  const OverflowMenu = () => (
    <Popover open={showOverflowMenu} onOpenChange={setShowOverflowMenu}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          title="More Options"
        >
          <MoreHorizontal className="w-3 h-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2 bg-white border border-gray-200 shadow-lg z-[110]" sideOffset={5}>
        <div className="space-y-2">
          <div className="flex gap-1">
            <AlignmentTools />
          </div>
          <Separator />
          <div className="flex gap-1">
            <ColorTool />
            <LinkTool />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  const renderToolbarContent = () => {
    switch (toolbarLayout) {
      case 'full':
        return (
          <>
            <BasicTools />
            <Separator orientation="vertical" className="h-5 mx-1" />
            <AlignmentTools />
            <Separator orientation="vertical" className="h-5 mx-1" />
            <ColorTool />
            <LinkTool />
          </>
        );
      case 'compact':
        return (
          <>
            <BasicTools />
            <Separator orientation="vertical" className="h-5 mx-1" />
            <ColorTool />
            <LinkTool />
            <OverflowMenu />
          </>
        );
      case 'minimal':
        return (
          <>
            <BasicTools />
            <OverflowMenu />
          </>
        );
      case 'overflow':
        return (
          <OverflowMenu />
        );
      default:
        return <BasicTools />;
    }
  };

  const getToolbarWidth = () => {
    switch (toolbarLayout) {
      case 'full': return 'w-auto min-w-96';
      case 'compact': return 'w-auto min-w-64';
      case 'minimal': return 'w-auto min-w-32';
      case 'overflow': return 'w-auto min-w-16';
      default: return 'w-auto';
    }
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
      className={`adaptive-tiptap-toolbar fixed bg-white border border-gray-200 rounded-lg shadow-xl p-2 flex items-center gap-1 animate-scale-in ${getToolbarWidth()}`}
      style={toolbarStyle}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => e.stopPropagation()}
    >
      {renderToolbarContent()}
    </div>
  );
};
