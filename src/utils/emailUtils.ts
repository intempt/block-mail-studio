
export const generateUniqueId = (): string => {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const createEmailHTML = (content: string): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Email Template</title>
    <style>
        /* Reset and base styles */
        body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .email-block-wrapper { display: block; width: 100%; }
        
        /* Block-specific styles */
        .block-wrapper { position: relative; }
        .email-block-node { margin: 0; }
        
        @media only screen and (max-width: 600px) {
            .email-container { width: 100% !important; margin: 0 !important; border-radius: 0 !important; }
            .email-block-wrapper { padding: 16px !important; }
        }
    </style>
</head>
<body>
    ${content}
</body>
</html>`;
};

export const stripTiptapAttributes = (html: string): string => {
  // Remove TipTap-specific attributes for clean email HTML
  return html
    .replace(/data-pm-slice="[^"]*"/g, '')
    .replace(/class="ProseMirror[^"]*"/g, '')
    .replace(/contenteditable="[^"]*"/g, '')
    .replace(/spellcheck="[^"]*"/g, '');
};

// Additional functions needed by tests
export const formatEmailHTML = (html: string): string => {
  return createEmailHTML(html);
};

export const validateEmailStructure = (structure: any): boolean => {
  if (!structure || typeof structure !== 'object') {
    return false;
  }
  
  // Check if subject exists and is not empty
  if (!structure.subject || typeof structure.subject !== 'string' || structure.subject.trim() === '') {
    return false;
  }
  
  // Check if blocks exist and is an array
  if (!structure.blocks || !Array.isArray(structure.blocks)) {
    return false;
  }
  
  // Validate each block has required properties
  for (const block of structure.blocks) {
    if (!block.id || !block.type || !block.content) {
      return false;
    }
  }
  
  return true;
};

export const extractTextContent = (html: string): string => {
  // Create a temporary DOM element to extract text content
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
};

export const generatePreviewText = (blocks: any[]): string => {
  const textBlocks = blocks.filter(block => block.type === 'text' && block.content?.html);
  const textContent = textBlocks
    .map(block => extractTextContent(block.content.html))
    .join(' ')
    .trim();
  
  // Return first 150 characters as preview
  return textContent.length > 150 ? textContent.substring(0, 150) + '...' : textContent;
};
