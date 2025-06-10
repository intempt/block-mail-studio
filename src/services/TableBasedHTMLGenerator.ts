import { EmailBlock, ColumnsBlock } from '@/types/emailBlocks';

export class TableBasedHTMLGenerator {
  private static getEmptyCanvasHTML(): string {
    return `<!doctypehtml>
<html dir=auto lang=und xmlns=http://www.w3.org/1999/xhtml xmlns:o=urn:schemas-microsoft-com:office:office
      xmlns:v=urn:schemas-microsoft-com:vml><title></title><!--[if !mso]><!-->
<meta content="IE=edge" http-equiv=X-UA-Compatible><!--<![endif]-->
<meta content="text/html; charset=UTF-8" http-equiv=Content-Type>
<meta content="width=device-width,initial-scale=1" name=viewport>
<style data-embed>#outlook a {
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
</noscript><![endif]--><!--[if lte mso 11]>
<style data-embed>.mj-outlook-group-fix {
  width: 100% !important
}</style><![endif]-->
<style data-embed>@media only screen and (min-width: 480px) {
    .mj-column-per-100 {
        width: 100% !important;
        max-width: 100%
    }
}</style>
<style data-embed media="screen and (min-width:480px)">.moz-text-html .mj-column-per-100 {
    width: 100% !important;
    max-width: 100%
}</style>
<style data-embed>.mjbody a {
    color: inherit
}

@media (max-width: 480px) {
    .hide-mobile-block {
        max-height: 0;
        overflow: hidden;
        display: none !important
    }

    .hide-desktop-block {
        display: block !important
    }

    .hide-mobile-inline-block {
        max-height: 0;
        overflow: hidden;
        display: none !important
    }

    .hide-desktop-inline-block {
        display: inline-block !important
    }
}

.mjbody a, .mjbody a:active, .mjbody a:hover, .mjbody a[href], .mjbody a[href]:active, .mjbody a[href]:hover {
    color: inherit;
    text-decoration: underline
}</style>
<body style=word-spacing:normal;background-color:#f5f5f5>
<div style=background-color:#f5f5f5 class=mjbody dir=auto lang=und><!--[if mso | IE]>
  <table border=0 cellpadding=0 cellspacing=0 role=presentation style=width:600px align=center width=600>
    <tr>
      <td style=line-height:0;font-size:0;mso-line-height-rule:exactly><![endif]-->
  <div style="margin:0 auto;max-width:600px">
    <table border=0 cellpadding=0 cellspacing=0 role=presentation style=width:100% align=center>
      <tr>
        <td style=direction:ltr;font-size:0;padding:0;text-align:center><!--[if mso | IE]>
          <table border=0 cellpadding=0 cellspacing=0 role=presentation>
            <tr>
              <td style=vertical-align:top;width:600px><![endif]-->
          <div style=font-size:0;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%
               class="mj-column-per-100 mj-outlook-group-fix">
            <table border=0 cellpadding=0 cellspacing=0 role=presentation style=vertical-align:top width=100%>
              <tr>
                <td style=font-size:0;word-break:break-word>
                  <div style=height:30px;line-height:30px> </div>
            </table>
          </div><!--[if mso | IE]><![endif]-->
    </table>
  </div>
  <!--[if mso | IE]>
  <table border=0 cellpadding=0 cellspacing=0 role=presentation style=width:600px align=center width=600
         bgcolor=#ffffff>
    <tr>
      <td style=line-height:0;font-size:0;mso-line-height-rule:exactly><![endif]-->
  <div style="background:#fff;background-color:#fff;margin:0 auto;max-width:600px">
    <table border=0 cellpadding=0 cellspacing=0 role=presentation style=background:#fff;background-color:#fff;width:100%
           align=center>
      <tr>
        <td style="direction:ltr;font-size:0;padding:20px 0;text-align:center"><!--[if mso | IE]>
          <table border=0 cellpadding=0 cellspacing=0 role=presentation>
            <tr>
              <td style=vertical-align:top;width:600px><![endif]-->
          <div style=font-size:0;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%
               class="mj-column-per-100 mj-outlook-group-fix">
            <table border=0 cellpadding=0 cellspacing=0 role=presentation style=vertical-align:top width=100%>
              <tbody>
              </tbody>
            </table>
          </div><!--[if mso | IE]><![endif]-->
    </table>
  </div>
  <!--[if mso | IE]>
  <table border=0 cellpadding=0 cellspacing=0 role=presentation style=width:600px align=center width=600>
    <tr>
      <td style=line-height:0;font-size:0;mso-line-height-rule:exactly><![endif]-->
  <div style="margin:0 auto;max-width:600px">
    <table border=0 cellpadding=0 cellspacing=0 role=presentation style=width:100% align=center>
      <tr>
        <td style=direction:ltr;font-size:0;padding:0;text-align:center><!--[if mso | IE]>
          <table border=0 cellpadding=0 cellspacing=0 role=presentation>
            <tr>
              <td style=vertical-align:top;width:600px><![endif]-->
          <div style=font-size:0;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%
               class="mj-column-per-100 mj-outlook-group-fix">
            <table border=0 cellpadding=0 cellspacing=0 role=presentation style=vertical-align:top width=100%>
              <tr>
                <td style=font-size:0;word-break:break-word>
                  <div style=height:30px;line-height:30px> </div>
            </table>
          </div><!--[if mso | IE]><![endif]-->
    </table>
  </div><!--[if mso | IE]><![endif]--></div>
</body>
</html>`;
  }

  static generateHTML(blocks: EmailBlock[]): string {
    if (blocks.length === 0) {
      return this.getEmptyCanvasHTML();
    }

    const blockElements = blocks.map(block => this.renderBlockToTableHTML(block)).join('');

    return `<!doctypehtml>
<html dir=auto lang=und xmlns=http://www.w3.org/1999/xhtml xmlns:o=urn:schemas-microsoft-com:office:office
      xmlns:v=urn:schemas-microsoft-com:vml><title></title><!--[if !mso]><!-->
<meta content="IE=edge" http-equiv=X-UA-Compatible><!--<![endif]-->
<meta content="text/html; charset=UTF-8" http-equiv=Content-Type>
<meta content="width=device-width,initial-scale=1" name=viewport>
<style data-embed>#outlook a {
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
</noscript><![endif]--><!--[if lte mso 11]>
<style data-embed>.mj-outlook-group-fix {
  width: 100% !important
}</style><![endif]-->
<style data-embed>@media only screen and (min-width: 480px) {
    .mj-column-per-100 {
        width: 100% !important;
        max-width: 100%
    }
}</style>
<style data-embed media="screen and (min-width:480px)">.moz-text-html .mj-column-per-100 {
    width: 100% !important;
    max-width: 100%
}</style>
<style data-embed>.mjbody a {
    color: inherit
}

@media (max-width: 480px) {
    .hide-mobile-block {
        max-height: 0;
        overflow: hidden;
        display: none !important
    }

    .hide-desktop-block {
        display: block !important
    }

    .hide-mobile-inline-block {
        max-height: 0;
        overflow: hidden;
        display: none !important
    }

    .hide-desktop-inline-block {
        display: inline-block !important
    }
}

.mjbody a, .mjbody a:active, .mjbody a:hover, .mjbody a[href], .mjbody a[href]:active, .mjbody a[href]:hover {
    color: inherit;
    text-decoration: underline
}</style>
<body style=word-spacing:normal;background-color:#f5f5f5>
<div style=background-color:#f5f5f5 class=mjbody dir=auto lang=und><!--[if mso | IE]>
  <table border=0 cellpadding=0 cellspacing=0 role=presentation style=width:600px align=center width=600>
    <tr>
      <td style=line-height:0;font-size:0;mso-line-height-rule:exactly><![endif]-->
  <div style="margin:0 auto;max-width:600px">
    <table border=0 cellpadding=0 cellspacing=0 role=presentation style=width:100% align=center>
      <tr>
        <td style=direction:ltr;font-size:0;padding:0;text-align:center><!--[if mso | IE]>
          <table border=0 cellpadding=0 cellspacing=0 role=presentation>
            <tr>
              <td style=vertical-align:top;width:600px><![endif]-->
          <div style=font-size:0;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%
               class="mj-column-per-100 mj-outlook-group-fix">
            <table border=0 cellpadding=0 cellspacing=0 role=presentation style=vertical-align:top width=100%>
              <tr>
                <td style=font-size:0;word-break:break-word>
                  <div style=height:30px;line-height:30px> </div>
            </table>
          </div><!--[if mso | IE]><![endif]-->
    </table>
  </div>
  <!--[if mso | IE]>
  <table border=0 cellpadding=0 cellspacing=0 role=presentation style=width:600px align=center width=600
         bgcolor=#ffffff>
    <tr>
      <td style=line-height:0;font-size:0;mso-line-height-rule:exactly><![endif]-->
  <div style="background:#fff;background-color:#fff;margin:0 auto;max-width:600px">
    <table border=0 cellpadding=0 cellspacing=0 role=presentation style=background:#fff;background-color:#fff;width:100%
           align=center>
      <tr>
        <td style="direction:ltr;font-size:0;padding:20px 0;text-align:center"><!--[if mso | IE]>
          <table border=0 cellpadding=0 cellspacing=0 role=presentation>
            <tr>
              <td style=vertical-align:top;width:600px><![endif]-->
          <div style=font-size:0;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%
               class="mj-column-per-100 mj-outlook-group-fix">
            <table border=0 cellpadding=0 cellspacing=0 role=presentation style=vertical-align:top width=100%>
              <tbody>
                ${blockElements}
              </tbody>
            </table>
          </div><!--[if mso | IE]><![endif]-->
    </table>
  </div>
  <!--[if mso | IE]>
  <table border=0 cellpadding=0 cellspacing=0 role=presentation style=width:600px align=center width=600>
    <tr>
      <td style=line-height:0;font-size:0;mso-line-height-rule:exactly><![endif]-->
  <div style="margin:0 auto;max-width:600px">
    <table border=0 cellpadding=0 cellspacing=0 role=presentation style=width:100% align=center>
      <tr>
        <td style=direction:ltr;font-size:0;padding:0;text-align:center><!--[if mso | IE]>
          <table border=0 cellpadding=0 cellspacing=0 role=presentation>
            <tr>
              <td style=vertical-align:top;width:600px><![endif]-->
          <div style=font-size:0;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%
               class="mj-column-per-100 mj-outlook-group-fix">
            <table border=0 cellpadding=0 cellspacing=0 role=presentation style=vertical-align:top width=100%>
              <tr>
                <td style=font-size:0;word-break:break-word>
                  <div style=height:30px;line-height:30px> </div>
            </table>
          </div><!--[if mso | IE]><![endif]-->
    </table>
  </div><!--[if mso | IE]><![endif]--></div>
</body>
</html>`;
  }

  private static renderBlockToTableHTML(block: EmailBlock): string {
    switch (block.type) {
      case 'text':
        return `<tr>
          <td style="font-size:0;padding:10px 25px;word-break:break-word;">
            <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;text-align:left;color:#000000;">
              ${block.content.html || ''}
            </div>
          </td>
        </tr>`;
      
      case 'button':
        return `<tr>
          <td align="center" style="font-size:0;padding:10px 25px;word-break:break-word;">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
              <tr>
                <td align="center" bgcolor="${block.content.backgroundColor || '#3B82F6'}" role="presentation" style="border:none;border-radius:6px;cursor:auto;mso-padding-alt:12px 24px;background:${block.content.backgroundColor || '#3B82F6'};" valign="middle">
                  <a href="${block.content.link || '#'}" style="display:inline-block;background:${block.content.backgroundColor || '#3B82F6'};color:${block.content.textColor || '#ffffff'};font-family:Arial,sans-serif;font-size:14px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:12px 24px;mso-padding-alt:0px;border-radius:6px;" target="_blank">
                    ${block.content.text || 'Button'}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
      
      case 'image':
        return `<tr>
          <td align="center" style="font-size:0;padding:10px 25px;word-break:break-word;">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
              <tbody>
                <tr>
                  <td style="width:${block.content.width || '600px'};">
                    ${block.content.link ? `<a href="${block.content.link}" target="_blank">` : ''}
                      <img alt="${block.content.alt || ''}" src="${block.content.src || ''}" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="${block.content.width || '600'}" />
                    ${block.content.link ? `</a>` : ''}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>`;
      
      case 'spacer':
        return `<tr>
          <td style="font-size:0;word-break:break-word;">
            <div style="height:${block.content.height || '20px'};line-height:${block.content.height || '20px'};">&#8202;</div>
          </td>
        </tr>`;
      
      case 'divider':
        return `<tr>
          <td style="font-size:0;padding:10px 25px;word-break:break-word;">
            <p style="border-top:${block.content.thickness || '1px'} ${block.content.style || 'solid'} ${block.content.color || '#000000'};font-size:1px;margin:0px auto;width:${block.content.width || '100%'};"></p>
          </td>
        </tr>`;
      
      case 'html':
        return `<tr>
          <td style="font-size:0;padding:10px 25px;word-break:break-word;">
            ${block.content.html || ''}
          </td>
        </tr>`;
      
      case 'social':
        const platformsHTML = block.content.platforms?.map((platform: any) => 
          `<td style="padding:0 8px;">
            <a href="${platform.url}" target="_blank">
              <img src="${platform.icon}" alt="${platform.name}" style="width:${block.content.iconSize || '32px'};height:${block.content.iconSize || '32px'};display:block;" />
            </a>
          </td>`
        ).join('') || '';
        
        return `<tr>
          <td align="center" style="font-size:0;padding:10px 25px;word-break:break-word;">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                ${platformsHTML}
              </tr>
            </table>
          </td>
        </tr>`;
      
      case 'video':
        return `<tr>
          <td align="center" style="font-size:0;padding:10px 25px;word-break:break-word;">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
              <tbody>
                <tr>
                  <td style="width:600px;">
                    <a href="${block.content.videoUrl || '#'}" target="_blank">
                      <img alt="Video thumbnail" src="${block.content.thumbnail || ''}" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="600" />
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>`;
      
      case 'table':
        return this.renderTableToTableHTML(block);
      
      case 'columns':
        return this.renderColumnsToTableHTML(block as ColumnsBlock);
      
      default:
        return '';
    }
  }

  private static renderTableToTableHTML(block: any): string {
    const getBorderStyle = () => {
      const { borderStyle, borderColor, borderWidth } = block.content;
      return `${borderWidth || '1px'} ${borderStyle || 'solid'} ${borderColor || '#ddd'}`;
    };

    const cellsHTML = block.content.cells?.map((row: any[], rowIndex: number) => {
      const isHeader = block.content.headerRow && rowIndex === 0;
      const Tag = isHeader ? 'th' : 'td';
      
      const rowHTML = row.map((cell: any) => 
        `<${Tag} style="border:${getBorderStyle()};padding:8px;${isHeader ? 'font-weight:bold;background-color:#f5f5f5;' : ''}">${cell.content}</${Tag}>`
      ).join('');
      
      return `<tr>${rowHTML}</tr>`;
    }).join('') || '';

    return `<tr>
      <td style="font-size:0;padding:10px 25px;word-break:break-word;">
        <table border="0" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border:${getBorderStyle()};">
          <tbody>
            ${cellsHTML}
          </tbody>
        </table>
      </td>
    </tr>`;
  }

  private static renderColumnsToTableHTML(block: ColumnsBlock): string {
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
      const columnBlocks = column.blocks.map(this.renderBlockToTableHTML.bind(this)).join('');
      return `<td style="width:${columnWidths[index]};vertical-align:top;">
        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            ${columnBlocks}
          </tbody>
        </table>
      </td>`;
    }).join('');

    return `<tr>
      <td style="font-size:0;padding:10px 25px;word-break:break-word;">
        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tr>
            ${columnsHTML}
          </tr>
        </table>
      </td>
    </tr>`;
  }
}
