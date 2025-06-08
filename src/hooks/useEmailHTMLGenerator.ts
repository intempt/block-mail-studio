import { useCallback, useEffect, useState } from 'react';
import { EmailBlock, ColumnsBlock } from '@/types/emailBlocks';

export const useEmailHTMLGenerator = (blocks: EmailBlock[], onContentChange: (content: string) => void) => {
  const [currentEmailHTML, setCurrentEmailHTML] = useState('');

  const renderBlockToHTML = useCallback((block: EmailBlock): string => {
    switch (block.type) {
      case 'text':
        return `<div style="margin: 20px 0;">${block.content.html || ''}</div>`;
      case 'button':
        return `<div style="text-align: center; margin: 20px 0;"><a href="${block.content.link || '#'}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">${block.content.text || 'Button'}</a></div>`;
      case 'image':
        return `<div style="text-align: center; margin: 20px 0;"><img src="${block.content.src || ''}" alt="${block.content.alt || ''}" style="max-width: 100%; height: auto;" /></div>`;
      case 'html':
        return `<div style="margin: 20px 0;">${block.content.html || ''}</div>`;
      case 'table':
        return renderTableToHTML(block);
      case 'social':
        return renderSocialToHTML(block);
      case 'video':
        return `<div style="text-align: center; margin: 20px 0;"><a href="${block.content.videoUrl || '#'}"><img src="${block.content.thumbnail || ''}" alt="Video thumbnail" style="max-width: 100%; height: auto;" /></a></div>`;
      case 'spacer':
        return `<div style="height: ${block.content.height || '20px'};"></div>`;
      case 'divider':
        return `<hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />`;
      case 'columns':
        return renderColumnsToHTML(block as ColumnsBlock);
      default:
        return '';
    }
  }, []);

  const renderTableToHTML = useCallback((block: any): string => {
    const getBorderStyle = () => {
      const { borderStyle, borderColor, borderWidth } = block.content;
      return `${borderWidth} ${borderStyle} ${borderColor}`;
    };

    const cellsHTML = block.content.cells.map((row: any[], rowIndex: number) => {
      const isHeader = block.content.headerRow && rowIndex === 0;
      const Tag = isHeader ? 'th' : 'td';
      
      const rowHTML = row.map((cell: any) => 
        `<${Tag} style="border: ${getBorderStyle()}; padding: 8px; ${isHeader ? 'font-weight: bold; background-color: #f5f5f5;' : ''}">${cell.content}</${Tag}>`
      ).join('');
      
      return `<tr>${rowHTML}</tr>`;
    }).join('');

    return `
      <div style="margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse; border: ${getBorderStyle()};">
          <tbody>
            ${cellsHTML}
          </tbody>
        </table>
      </div>
    `;
  }, []);

  const renderSocialToHTML = useCallback((block: any): string => {
    const platformsHTML = block.content.platforms.map((platform: any) => 
      `<a href="${platform.url}" style="display: inline-block; margin: 0 8px;"><img src="${platform.icon}" alt="${platform.name}" style="width: ${block.content.iconSize}; height: ${block.content.iconSize};" /></a>`
    ).join('');

    return `
      <div style="text-align: center; margin: 20px 0;">
        <div style="display: ${block.content.layout === 'vertical' ? 'block' : 'inline-block'};">
          ${platformsHTML}
        </div>
      </div>
    `;
  }, []);

  const renderColumnsToHTML = useCallback((block: ColumnsBlock): string => {
    const getColumnWidths = (ratio: string) => {
      const ratioMap: Record<string, string[]> = {
        '100': ['100%'],
        '50-50': ['50%', '50%'],
        '33-67': ['33%', '67%'],
        '67-33': ['67%', '33%'],
        '25-75': ['25%', '75%'],
        '75-25': ['75%', '25%'],
        '33-33-33': ['33.33%', '33.33%', '33.33%'],
        '25-50-25': ['25%', '50%', '25%'],
        '25-25-50': ['25%', '25%', '50%'],
        '50-25-25': ['50%', '25%', '25%'],
        '25-25-25-25': ['25%', '25%', '25%', '25%']
      };
      return ratioMap[ratio] || ['100%'];
    };

    const columnWidths = getColumnWidths(block.content.columnRatio);
    
    const columnsHTML = block.content.columns.map((column, index) => {
      const columnBlocks = column.blocks.map(renderBlockToHTML).join('');
      return `
        <td style="width: ${columnWidths[index]}; vertical-align: top; padding: 0 8px;">
          ${columnBlocks}
        </td>
      `;
    }).join('');

    return `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
        <tr>
          ${columnsHTML}
        </tr>
      </table>
    `;
  }, [renderBlockToHTML]);

  useEffect(() => {
    const generateHTML = () => {
      if (blocks.length === 0) {
        const emptyHTML = '';
        onContentChange(emptyHTML);
        setCurrentEmailHTML(emptyHTML);
        return;
      }

      const blockElements = blocks.map(renderBlockToHTML).join('');

      const fullHTML = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          ${blockElements}
        </div>
      `;

      onContentChange(fullHTML);
      setCurrentEmailHTML(fullHTML);
    };

    generateHTML();
  }, [blocks, onContentChange, renderBlockToHTML]);

  return { currentEmailHTML };
};
