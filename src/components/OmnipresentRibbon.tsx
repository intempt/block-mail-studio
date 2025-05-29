
import React from 'react';

interface OmnipresentRibbonProps {
  onBlockAdd: (blockType: string) => void;
  universalContent: any[];
  onUniversalContentAdd: () => void;
  onGlobalStylesChange: (styles: any) => void;
  emailHTML: string;
  subjectLine: string;
  canvasWidth: number;
  deviceMode: string;
  onDeviceChange: () => void;
  onWidthChange: () => void;
  onPreview: () => void;
  onSaveTemplate: () => void;
  onPublish: () => void;
  canvasRef: any;
  onSubjectLineChange?: (subject: string) => void;
}

export const OmnipresentRibbon: React.FC<OmnipresentRibbonProps> = (props) => {
  return (
    <div className="bg-white border-b px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">Email Editor</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
            Save
          </button>
          <button className="px-3 py-1 bg-green-600 text-white rounded text-sm">
            Preview
          </button>
        </div>
      </div>
    </div>
  );
};
