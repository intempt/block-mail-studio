
import React from 'react';
import { EmailBlock } from '@/types/emailBlocks';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TextBlockPropertyEditor } from './property-editors/TextBlockPropertyEditor';
import { ImageBlockPropertyEditor } from './property-editors/ImageBlockPropertyEditor';
import { ButtonBlockPropertyEditor } from './property-editors/ButtonBlockPropertyEditor';
import { SpacerBlockPropertyEditor } from './property-editors/SpacerBlockPropertyEditor';
import { DividerBlockPropertyEditor } from './property-editors/DividerBlockPropertyEditor';
import { VideoBlockPropertyEditor } from './property-editors/VideoBlockPropertyEditor';
import { SocialBlockPropertyEditor } from './property-editors/SocialBlockPropertyEditor';
import { HtmlBlockPropertyEditor } from './property-editors/HtmlBlockPropertyEditor';
import { TableBlockPropertyEditor } from './property-editors/TableBlockPropertyEditor';
import { 
  Type, 
  Image, 
  MousePointer, 
  Space, 
  Minus, 
  Video, 
  Share2, 
  Code, 
  Table,
  Package 
} from 'lucide-react';

interface PropertyEditorPanelProps {
  selectedBlock: EmailBlock | null;
  onBlockUpdate: (block: EmailBlock) => void;
}

export const PropertyEditorPanel: React.FC<PropertyEditorPanelProps> = ({
  selectedBlock,
  onBlockUpdate
}) => {
  if (!selectedBlock) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-lg font-medium mb-2">No block selected</div>
          <div className="text-sm">Click on a block to edit its properties</div>
        </div>
      </Card>
    );
  }

  const renderPropertyEditor = () => {
    switch (selectedBlock.type) {
      case 'text':
        return <TextBlockPropertyEditor block={selectedBlock as any} onUpdate={onBlockUpdate} />;
      case 'image':
        return <ImageBlockPropertyEditor block={selectedBlock as any} onUpdate={onBlockUpdate} />;
      case 'button':
        return <ButtonBlockPropertyEditor block={selectedBlock as any} onUpdate={onBlockUpdate} />;
      case 'spacer':
        return <SpacerBlockPropertyEditor block={selectedBlock as any} onUpdate={onBlockUpdate} />;
      case 'divider':
        return <DividerBlockPropertyEditor block={selectedBlock as any} onUpdate={onBlockUpdate} />;
      case 'video':
        return <VideoBlockPropertyEditor block={selectedBlock as any} onUpdate={onBlockUpdate} />;
      case 'social':
        return <SocialBlockPropertyEditor block={selectedBlock as any} onUpdate={onBlockUpdate} />;
      case 'html':
        return <HtmlBlockPropertyEditor block={selectedBlock as any} onUpdate={onBlockUpdate} />;
      case 'table':
        return <TableBlockPropertyEditor block={selectedBlock as any} onUpdate={onBlockUpdate} />;
      case 'product':
        return (
          <div className="p-4 text-center text-gray-500">
            <div className="text-lg font-medium mb-2">Product Block</div>
            <div className="text-sm">No configuration needed - displays default product cards</div>
          </div>
        );
      default:
        return (
          <div className="p-4 text-center text-gray-500">
            No property editor available for {selectedBlock.type} blocks
          </div>
        );
    }
  };

  const getBlockDisplayName = () => {
    switch (selectedBlock.type) {
      case 'text':
        return 'Text & headings';
      case 'button':
        return 'Call-to-action';
      case 'product':
        return 'Product';
      default:
        return selectedBlock.type.charAt(0).toUpperCase() + selectedBlock.type.slice(1);
    }
  };

  const getBlockIcon = () => {
    switch (selectedBlock.type) {
      case 'text':
        return <Type className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'button':
        return <MousePointer className="w-4 h-4" />;
      case 'spacer':
        return <Space className="w-4 h-4" />;
      case 'divider':
        return <Minus className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'social':
        return <Share2 className="w-4 h-4" />;
      case 'html':
        return <Code className="w-4 h-4" />;
      case 'table':
        return <Table className="w-4 h-4" />;
      case 'product':
        return <Package className="w-4 h-4" />;
      default:
        return <Type className="w-4 h-4" />;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          {getBlockIcon()}
          <h3 className="font-semibold text-base">
            {getBlockDisplayName()}
          </h3>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          {renderPropertyEditor()}
        </div>
      </ScrollArea>
    </Card>
  );
};
