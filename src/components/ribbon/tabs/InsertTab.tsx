
import React from 'react';
import { RibbonGroup } from '../RibbonGroup';
import { Button } from '@/components/ui/button';
import { 
  Type, 
  Image, 
  Square, 
  Minus, 
  Columns, 
  Table,
  Link,
  Star
} from 'lucide-react';

interface InsertTabProps {
  onBlockAdd: (blockType: string, layoutConfig?: any) => void;
  onSnippetAdd: (snippet: any) => void;
  snippetRefreshTrigger: number;
}

export const InsertTab: React.FC<InsertTabProps> = ({
  onBlockAdd,
  onSnippetAdd,
  snippetRefreshTrigger
}) => {
  const handleBlockAdd = (blockType: string) => {
    onBlockAdd(blockType);
  };

  return (
    <div className="insert-tab flex items-stretch bg-white border-b border-gray-100">
      {/* Blocks Group */}
      <RibbonGroup title="Blocks">
        <div className="grid grid-cols-3 gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-12 w-12 p-0 flex flex-col items-center"
            onClick={() => handleBlockAdd('text')}
            title="Text Block"
          >
            <Type className="w-4 h-4" />
            <span className="text-xs mt-1">Text</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-12 w-12 p-0 flex flex-col items-center"
            onClick={() => handleBlockAdd('image')}
            title="Image Block"
          >
            <Image className="w-4 h-4" />
            <span className="text-xs mt-1">Image</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-12 w-12 p-0 flex flex-col items-center"
            onClick={() => handleBlockAdd('button')}
            title="Button Block"
          >
            <Square className="w-4 h-4" />
            <span className="text-xs mt-1">Button</span>
          </Button>
        </div>
      </RibbonGroup>

      {/* Layout Group */}
      <RibbonGroup title="Layout">
        <div className="flex flex-col gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-3"
            onClick={() => handleBlockAdd('columns', { columns: 2, ratio: '1:1' })}
            title="Two Columns"
          >
            <Columns className="w-4 h-4 mr-1" />
            Columns
          </Button>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2"
              onClick={() => handleBlockAdd('spacer')}
              title="Spacer"
            >
              <Minus className="w-3 h-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2"
              onClick={() => handleBlockAdd('divider')}
              title="Divider"
            >
              <Minus className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </RibbonGroup>

      {/* Media Group */}
      <RibbonGroup title="Media">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="h-8 px-3">
            <Image className="w-4 h-4 mr-1" />
            Gallery
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-3">
            Video
          </Button>
        </div>
      </RibbonGroup>

      {/* Links Group */}
      <RibbonGroup title="Links">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="h-8 px-3">
            <Link className="w-4 h-4 mr-1" />
            Hyperlink
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-3">
            Bookmark
          </Button>
        </div>
      </RibbonGroup>

      {/* Snippets Group */}
      <RibbonGroup title="Snippets">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="h-8 px-3">
            <Star className="w-4 h-4 mr-1" />
            Saved
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-3">
            Library
          </Button>
        </div>
      </RibbonGroup>
    </div>
  );
};
