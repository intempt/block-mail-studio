
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Type, Image, Divide } from 'lucide-react';

export interface EmailBlockCanvasRef {
  insertBlock: (blockType: string) => void;
  insertSnippet: (snippet: any) => void;
}

interface EmailBlockCanvasProps {
  onContentChange: (html: string) => void;
  previewWidth: number;
  previewMode: 'desktop' | 'mobile' | 'tablet';
  compactMode: boolean;
}

export const EmailBlockCanvas = forwardRef<EmailBlockCanvasRef, EmailBlockCanvasProps>(
  ({ onContentChange, previewWidth, previewMode, compactMode }, ref) => {
    const [blocks, setBlocks] = useState<Array<{ id: string; type: string; content: string }>>([]);

    useImperativeHandle(ref, () => ({
      insertBlock: (blockType: string) => {
        const newBlock = {
          id: `block-${Date.now()}`,
          type: blockType,
          content: getDefaultContent(blockType)
        };
        setBlocks(prev => [...prev, newBlock]);
        onContentChange(generateHTML([...blocks, newBlock]));
      },
      insertSnippet: (snippet: any) => {
        const newBlock = {
          id: `block-${Date.now()}`,
          type: 'snippet',
          content: snippet.content || snippet.name
        };
        setBlocks(prev => [...prev, newBlock]);
        onContentChange(generateHTML([...blocks, newBlock]));
      }
    }));

    const getDefaultContent = (blockType: string) => {
      switch (blockType) {
        case 'text':
          return 'Your text content here...';
        case 'heading':
          return 'Your Heading';
        case 'button':
          return 'Click Me';
        case 'image':
          return 'Image placeholder';
        case 'divider':
          return '---';
        default:
          return 'New block';
      }
    };

    const generateHTML = (blockList: Array<{ id: string; type: string; content: string }>) => {
      return blockList.map(block => `<div class="email-block">${block.content}</div>`).join('\n');
    };

    const addTextBlock = () => {
      const newBlock = {
        id: `block-${Date.now()}`,
        type: 'text',
        content: 'Your text content here...'
      };
      setBlocks(prev => [...prev, newBlock]);
      onContentChange(generateHTML([...blocks, newBlock]));
    };

    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-auto bg-gray-50 p-4">
          <div 
            className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
            style={{ 
              width: previewMode === 'mobile' ? '375px' : previewMode === 'tablet' ? '768px' : `${previewWidth}px`,
              maxWidth: '100%'
            }}
          >
            {blocks.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mb-4">
                  <Type className="w-12 h-12 mx-auto text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building Your Email</h3>
                <p className="text-gray-600 mb-4">Add blocks from the left panel to start creating your email</p>
                <Button onClick={addTextBlock} className="mx-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Text Block
                </Button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {blocks.map((block) => (
                  <Card key={block.id} className="p-4 border-dashed border-2 border-gray-200 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 uppercase font-medium">{block.type}</span>
                    </div>
                    <div className="text-sm">
                      {block.content}
                    </div>
                  </Card>
                ))}
                <div className="text-center py-4">
                  <Button variant="outline" onClick={addTextBlock}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Block
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

EmailBlockCanvas.displayName = 'EmailBlockCanvas';
