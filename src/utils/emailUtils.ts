
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
