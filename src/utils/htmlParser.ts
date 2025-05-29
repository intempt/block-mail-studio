
import { EmailBlock } from '@/types/emailBlocks';

export const parseHTMLToBlocks = (html: string): EmailBlock[] => {
  // Simple parser - in a real implementation this would be more sophisticated
  const blocks: EmailBlock[] = [];
  
  // For now, return a simple text block with the HTML content
  if (html && html.trim()) {
    blocks.push({
      id: `block-${Date.now()}`,
      type: 'text',
      content: {
        html: html,
        placeholder: 'Enter text...'
      },
      styling: {
        desktop: {
          width: '100%',
          height: 'auto',
          fontFamily: 'Arial, sans-serif',
          fontSize: '16px',
          color: '#333333',
          padding: '10px',
          backgroundColor: 'transparent'
        }
      }
    });
  }
  
  return blocks;
};

export const generateEmailHTML = (blocks: EmailBlock[], subjectLine: string): string => {
  const blockHTML = blocks.map(block => {
    switch (block.type) {
      case 'text':
        return block.content.html || '<p>Empty text block</p>';
      case 'image':
        return `<img src="${block.content.src || ''}" alt="${block.content.alt || ''}" style="max-width: 100%;" />`;
      case 'button':
        return `<a href="${block.content.link || '#'}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">${block.content.text || 'Button'}</a>`;
      case 'divider':
        return '<hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;" />';
      default:
        return '';
    }
  }).join('\n');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${subjectLine}</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto;">
        ${blockHTML}
      </div>
    </body>
    </html>
  `;
};
