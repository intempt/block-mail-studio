
import React from 'react';

export interface GlobalStylesPanelProps {
  onStylesChange?: (styles: any) => void;
  compactMode?: boolean;
}

export const GlobalStylesPanel: React.FC<GlobalStylesPanelProps> = ({
  onStylesChange,
  compactMode = false
}) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">Global Styles</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Primary Color</label>
          <input
            type="color"
            className="w-full"
            onChange={(e) => onStylesChange?.({ primaryColor: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Font Family</label>
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => onStylesChange?.({ fontFamily: e.target.value })}
          >
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
          </select>
        </div>
      </div>
    </div>
  );
};
