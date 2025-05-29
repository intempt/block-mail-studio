
import { HTMLImportService, ImportResult } from './HTMLImportService';
import { MJMLService } from './MJMLService';

export class MJMLImportService {
  static async importMJML(mjmlContent: string): Promise<ImportResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // First validate the MJML
      const isValid = MJMLService.validate(mjmlContent);
      if (!isValid) {
        warnings.push('MJML validation failed, some elements may not import correctly');
      }

      // Compile MJML to HTML
      const compiled = MJMLService.compile(mjmlContent);
      
      if (compiled.errors.length > 0) {
        compiled.errors.forEach(error => {
          errors.push(`Line ${error.line}: ${error.message}`);
        });
      }

      if (!compiled.html) {
        errors.push('Failed to compile MJML to HTML');
        return { blocks: [], errors, warnings };
      }

      // Extract MJML-specific metadata
      const metadata = this.extractMJMLMetadata(mjmlContent);

      // Use HTML import service to convert the compiled HTML to blocks
      const htmlResult = await HTMLImportService.importHTML(compiled.html);

      return {
        ...htmlResult,
        subject: metadata.subject || htmlResult.subject,
        globalStyles: metadata.globalStyles,
        errors: [...errors, ...htmlResult.errors],
        warnings: [...warnings, ...htmlResult.warnings]
      };

    } catch (error) {
      errors.push(`MJML import failed: ${error.message}`);
      return { blocks: [], errors, warnings };
    }
  }

  private static extractMJMLMetadata(mjmlContent: string) {
    const metadata: any = {};

    // Extract title/subject
    const titleMatch = mjmlContent.match(/<mj-title[^>]*>(.*?)<\/mj-title>/s);
    if (titleMatch) {
      metadata.subject = titleMatch[1].trim();
    }

    // Extract preview text
    const previewMatch = mjmlContent.match(/<mj-preview[^>]*>(.*?)<\/mj-preview>/s);
    if (previewMatch) {
      metadata.preview = previewMatch[1].trim();
    }

    // Extract global styles
    const stylesMatch = mjmlContent.match(/<mj-style[^>]*>(.*?)<\/mj-style>/s);
    if (stylesMatch) {
      metadata.globalStyles = stylesMatch[1].trim();
    }

    // Extract font families from mj-font
    const fontMatches = mjmlContent.match(/<mj-font[^>]*name="([^"]*)"[^>]*href="([^"]*)"[^>]*\/>/g);
    if (fontMatches) {
      metadata.fonts = fontMatches.map(match => {
        const nameMatch = match.match(/name="([^"]*)"/);
        const hrefMatch = match.match(/href="([^"]*)"/);
        return {
          name: nameMatch ? nameMatch[1] : '',
          href: hrefMatch ? hrefMatch[1] : ''
        };
      });
    }

    return metadata;
  }
}
