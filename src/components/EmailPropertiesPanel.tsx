
import React from 'react';

interface EmailPropertiesPanelProps {
  selectedBlock: any;
  onUpdateBlock: (blockId: string, updates: any) => void;
  globalStyles: any;
  onUpdateGlobalStyles: (styles: any) => void;
}

export const EmailPropertiesPanel: React.FC<EmailPropertiesPanelProps> = ({
  selectedBlock,
  onUpdateBlock,
  globalStyles,
  onUpdateGlobalStyles
}) => {
  return (
    <div data-testid="properties-panel" className="p-4 bg-white border-l">
      <h3 className="font-medium mb-4">Properties</h3>
      {selectedBlock ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Content
            </label>
            <textarea
              id="content"
              className="w-full p-2 border rounded"
              value={selectedBlock.content?.html || ''}
              onChange={(e) => onUpdateBlock(selectedBlock.id, { content: { html: e.target.value } })}
            />
          </div>
          <div>
            <label htmlFor="bg-color" className="block text-sm font-medium mb-1">
              Background Color
            </label>
            <input
              id="bg-color"
              type="color"
              className="w-full p-1 border rounded"
              onChange={(e) => onUpdateBlock(selectedBlock.id, { backgroundColor: e.target.value })}
            />
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Select a block to edit properties</p>
      )}
    </div>
  );
};
