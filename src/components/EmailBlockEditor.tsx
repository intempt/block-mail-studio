
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Layers, 
  Move, 
  Copy, 
  Trash2, 
  Edit3,
  Type,
  Image,
  MousePointer,
  Columns,
  Minus
} from 'lucide-react';

interface EmailBlock {
  id: string;
  type: string;
  content: string;
  editable: boolean;
}

interface EmailBlockEditorProps {
  editor: Editor | null;
}

export const EmailBlockEditor: React.FC<EmailBlockEditorProps> = ({ editor }) => {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);

  // Extract blocks from editor content
  React.useEffect(() => {
    if (editor) {
      const content = editor.getHTML();
      const blockElements = content.match(/<div class="email-block[^>]*>[\s\S]*?<\/div>/g) || [];
      
      const extractedBlocks: EmailBlock[] = blockElements.map((blockHtml, index) => {
        const typeMatch = blockHtml.match(/class="email-block ([^"]*)/);
        const type = typeMatch ? typeMatch[1].replace('-block', '') : 'unknown';
        
        return {
          id: `block-${index}`,
          type,
          content: blockHtml,
          editable: true
        };
      });
      
      setBlocks(extractedBlocks);
    }
  }, [editor]);

  const blockTypes = [
    { type: 'header', icon: <Type className="w-4 h-4" />, label: 'Header' },
    { type: 'paragraph', icon: <Type className="w-4 h-4" />, label: 'Text' },
    { type: 'button', icon: <MousePointer className="w-4 h-4" />, label: 'Button' },
    { type: 'image', icon: <Image className="w-4 h-4" />, label: 'Image' },
    { type: 'two-column', icon: <Columns className="w-4 h-4" />, label: 'Columns' },
    { type: 'spacer', icon: <Minus className="w-4 h-4" />, label: 'Spacer' }
  ];

  const addBlock = (type: string) => {
    const templates: { [key: string]: string } = {
      header: `<div class="email-block header-block">
        <h2 style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 20px; text-align: center;">
          New Header
        </h2>
      </div>`,
      paragraph: `<div class="email-block paragraph-block">
        <p style="font-family: Arial, sans-serif; color: #666; line-height: 1.6; margin: 0; padding: 20px;">
          New paragraph text goes here.
        </p>
      </div>`,
      button: `<div class="email-block button-block" style="text-align: center; padding: 20px;">
        <a href="#" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; font-family: Arial, sans-serif;">
          Click Here
        </a>
      </div>`,
      image: `<div class="email-block image-block" style="text-align: center; padding: 20px;">
        <img src="https://via.placeholder.com/400x200" alt="Image" style="max-width: 100%; height: auto;" />
      </div>`
    };

    if (editor && templates[type]) {
      editor.chain().focus().insertContent(templates[type]).run();
    }
  };

  const duplicateBlock = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (block && editor) {
      editor.chain().focus().insertContent(block.content).run();
    }
  };

  const deleteBlock = (blockId: string) => {
    // This is a simplified implementation
    // In a real implementation, you'd need to track block positions and remove them from the editor
    console.log('Delete block:', blockId);
  };

  const editBlock = (blockId: string) => {
    setSelectedBlockId(blockId);
    // Focus on the block in the editor
    // This would require more sophisticated block tracking
  };

  const getBlockIcon = (type: string) => {
    const blockType = blockTypes.find(bt => bt.type === type);
    return blockType?.icon || <Type className="w-4 h-4" />;
  };

  const getBlockLabel = (type: string) => {
    const blockType = blockTypes.find(bt => bt.type === type);
    return blockType?.label || type;
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Block Editor</h3>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Add Blocks</h4>
            <div className="grid grid-cols-2 gap-2">
              {blockTypes.map((blockType) => (
                <Button
                  key={blockType.type}
                  variant="outline"
                  size="sm"
                  onClick={() => addBlock(blockType.type)}
                  className="flex items-center gap-2 text-xs"
                >
                  {blockType.icon}
                  {blockType.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Current Blocks</h4>
            
            {blocks.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Layers className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No blocks detected</p>
                <p className="text-xs text-gray-400">Add blocks to start editing</p>
              </div>
            ) : (
              blocks.map((block, index) => (
                <Card 
                  key={block.id} 
                  className={`p-3 cursor-pointer transition-colors ${
                    selectedBlockId === block.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedBlockId(block.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-1 bg-gray-100 rounded">
                        {getBlockIcon(block.type)}
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          {getBlockLabel(block.type)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Block {index + 1}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          editBlock(block.id);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateBlock(block.id);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBlock(block.id);
                        }}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};
