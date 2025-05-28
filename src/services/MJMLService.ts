
import mjml2html from 'mjml-browser';

export interface MJMLCompileResult {
  html: string;
  errors: Array<{
    line: number;
    message: string;
    tagName: string;
  }>;
}

export class MJMLService {
  static compile(mjmlContent: string): MJMLCompileResult {
    try {
      const result = mjml2html(mjmlContent, {
        validationLevel: 'strict',
        minify: true
      });

      return {
        html: result.html,
        errors: result.errors || []
      };
    } catch (error) {
      console.error('MJML compilation error:', error);
      return {
        html: '',
        errors: [{
          line: 0,
          message: `Compilation failed: ${error.message}`,
          tagName: 'mjml'
        }]
      };
    }
  }

  static validate(mjmlContent: string): boolean {
    const result = this.compile(mjmlContent);
    return result.errors.length === 0;
  }

  static wrapInTemplate(bodyContent: string, styles?: string): string {
    return `
      <mjml>
        <mj-head>
          <mj-title>Email Template</mj-title>
          <mj-preview>Preview text</mj-preview>
          <mj-attributes>
            <mj-all font-family="Arial, sans-serif" />
            <mj-text font-size="14px" color="#333333" line-height="1.6" />
            <mj-button background-color="#3B82F6" color="white" border-radius="6px" />
          </mj-attributes>
          ${styles ? `<mj-style>${styles}</mj-style>` : ''}
        </mj-head>
        <mj-body background-color="#f5f5f5">
          ${bodyContent}
        </mj-body>
      </mjml>
    `;
  }
}
