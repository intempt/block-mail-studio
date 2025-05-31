
import React from 'react';

export const EmailBlockPalette: React.FC = () => {
  return (
    <div data-testid="block-palette" className="p-4 bg-white border-r">
      <div className="space-y-4">
        <section data-testid="basic-blocks-section">
          <h3 className="font-medium mb-2">Basic Blocks</h3>
          <div className="space-y-2">
            <div 
              data-testid="palette-block-text"
              draggable="true"
              className="p-2 border rounded cursor-grab"
              onDragStart={(e) => {
                e.dataTransfer.setData('application/json', JSON.stringify({ blockType: 'text' }));
              }}
              onMouseEnter={() => {}}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  const next = document.querySelector('[data-testid="palette-block-image"]') as HTMLElement;
                  next?.focus();
                }
              }}
            >
              Text
              <div className="text-xs text-gray-500">Add text content to your email</div>
            </div>
            <div 
              data-testid="palette-block-image"
              draggable="true"
              className="p-2 border rounded cursor-grab"
              tabIndex={0}
            >
              Image
            </div>
          </div>
        </section>
        
        <section>
          <h3 className="font-medium mb-2">Layout Blocks</h3>
          <div className="space-y-2">
            <div className="p-2 border rounded cursor-grab">
              Columns
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
