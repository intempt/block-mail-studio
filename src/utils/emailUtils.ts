
export const sanitizeEmailHTML = (html: string): string => {
  // Remove Tiptap-specific classes and attributes
  let sanitized = html
    .replace(/class="[^"]*"/g, '')
    .replace(/data-[^=]*="[^"]*"/g, '')
    .replace(/contenteditable="[^"]*"/g, '');

  // Ensure inline styles for email compatibility
  sanitized = sanitized.replace(
    /<(h[1-6]|p|div|span)([^>]*)>/g,
    (match, tag, attrs) => {
      const hasStyle = attrs.includes('style=');
      if (!hasStyle) {
        const defaultStyles = getDefaultEmailStyles(tag);
        return `<${tag}${attrs} style="${defaultStyles}">`;
      }
      return match;
    }
  );

  return sanitized;
};

export const getDefaultEmailStyles = (tag: string): string => {
  const styles: Record<string, string> = {
    'h1': 'font-family: Arial, sans-serif; color: #333; margin: 0; font-size: 24px; font-weight: bold;',
    'h2': 'font-family: Arial, sans-serif; color: #333; margin: 0; font-size: 20px; font-weight: bold;',
    'h3': 'font-family: Arial, sans-serif; color: #333; margin: 0; font-size: 18px; font-weight: bold;',
    'p': 'font-family: Arial, sans-serif; color: #666; margin: 0; font-size: 16px; line-height: 1.6;',
    'div': 'font-family: Arial, sans-serif;',
    'span': 'font-family: Arial, sans-serif;'
  };

  return styles[tag] || 'font-family: Arial, sans-serif;';
};

export const generateEmailTemplate = (content: string): string => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Email Template</title>
    <style type="text/css">
        /* Reset styles */
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
        }
        
        /* Main styles */
        body {
            margin: 0;
            padding: 0;
            width: 100% !important;
            height: 100% !important;
            background-color: #f4f4f4;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        
        .email-block {
            display: block;
            width: 100%;
        }
        
        /* Mobile styles */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
            }
            .email-block {
                padding: 10px !important;
            }
            .two-column-block table {
                width: 100% !important;
            }
            .two-column-block td {
                display: block !important;
                width: 100% !important;
                padding: 0 !important;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        ${sanitizeEmailHTML(content)}
    </div>
</body>
</html>`;
};
