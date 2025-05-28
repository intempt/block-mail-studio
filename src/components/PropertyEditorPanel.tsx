
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
      default:
        return (
          <div className="p-4 text-center text-gray-500">
            No property editor available for {selectedBlock.type} blocks
          </div>
        );
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg capitalize">
          {selectedBlock.type} Block Properties
        </h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          {renderPropertyEditor()}
        </div>
      </ScrollArea>
    </Card>
  );
};
