export const generateUniqueId = (): string => {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const createEmailHTML = (content: string): string => {
  // If content is already a complete HTML document, return as-is
  if (content.includes('<!doctype') || content.includes('<!DOCTYPE')) {
    return content;
  }

  // Otherwise, wrap in table-based email template
  return `<!doctypehtml>
<html dir=auto lang=und xmlns=http://www.w3.org/1999/xhtml xmlns:o=urn:schemas-microsoft-com:office:office
      xmlns:v=urn:schemas-microsoft-com:vml><title></title><!--[if !mso]><!-->
<meta content="IE=edge" http-equiv=X-UA-Compatible><!--<![endif]-->
<meta content="text/html; charset=UTF-8" http-equiv=Content-Type>
<meta content="width=device-width,initial-scale=1" name=viewport>
<style>#outlook a {
    padding: 0
}

body {
    margin: 0;
    padding: 0;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%
}

table, td {
    border-collapse: collapse;
    mso-table-lspace: 0;
    mso-table-rspace: 0
}

img {
    border: 0;
    height: auto;
    line-height: 100%;
    outline: 0;
    text-decoration: none;
    -ms-interpolation-mode: bicubic
}

p {
    display: block;
    margin: 13px 0
}</style>
<!--[if mso]>
<noscript>
  <xml>
    <o:officedocumentsettings>
      <o:allowpng>
        <o:pixelsperinch>96</o:pixelsperinch>
    </o:officedocumentsettings>
  </xml>
</noscript><![endif]-->
<body style=word-spacing:normal;background-color:#f5f5f5>
<div style=background-color:#f5f5f5>
  <div style="margin:0 auto;max-width:600px">
    <table border=0 cellpadding=0 cellspacing=0 role=presentation style=width:100% align=center>
      <tr>
        <td style="direction:ltr;font-size:0;padding:20px 0;text-align:center">
          <div style="background:#fff;background-color:#fff;margin:0 auto;max-width:600px">
            <table border=0 cellpadding=0 cellspacing=0 role=presentation style="background:#fff;background-color:#fff;width:100%" align=center>
              <tr>
                <td style="direction:ltr;font-size:0;padding:20px 0;text-align:center">
                  <table border=0 cellpadding=0 cellspacing=0 role=presentation style="vertical-align:top;width:100%">
                    <tbody>
                      <tr>
                        <td style="font-size:0;padding:10px 25px;word-break:break-word;">
                          ${content}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        </td>
      </tr>
    </table>
  </div>
</div>
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
