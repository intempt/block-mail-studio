
import React from 'react';
import { SplitBlock } from '@/types/emailBlocks';

interface SplitBlockRendererProps {
  block: SplitBlock;
  isSelected: boolean;
  onUpdate: (block: SplitBlock) => void;
}

export const SplitBlockRenderer: React.FC<SplitBlockRendererProps> = ({ block, isSelected }) => {
  const styling = block.styling.desktop;
  const ratios = {
    '50-50': ['50%', '50%'],
    '60-40': ['60%', '40%'],
    '40-60': ['40%', '60%'],
    '70-30': ['70%', '30%'],
    '30-70': ['30%', '70%']
  };
  const ratio = block.content.splitRatio || block.content.ratio || '50-50';
  const [leftWidth, rightWidth] = ratios[ratio] || ratios['50-50'];

  return (
    <div
      className="split-block-renderer"
      style={{
        backgroundColor: styling.backgroundColor,
        padding: styling.padding,
        margin: styling.margin,
      }}
    >
      <table width="100%" cellPadding="0" cellSpacing="0" border={0}>
        <tr>
          <td style={{ width: leftWidth, verticalAlign: 'top', paddingRight: '8px' }}>
            <div className="min-h-16 bg-gray-50 rounded p-3 text-center text-gray-400 text-sm">
              Left Column ({leftWidth})
            </div>
          </td>
          <td style={{ width: rightWidth, verticalAlign: 'top', paddingLeft: '8px' }}>
            <div className="min-h-16 bg-gray-50 rounded p-3 text-center text-gray-400 text-sm">
              Right Column ({rightWidth})
            </div>
          </td>
        </tr>
      </table>
    </div>
  );
};
