
import JSZip from 'jszip';
import { EmailBlock } from '@/types/emailBlocks';
import { MJMLTemplateGenerator } from './MJMLTemplateGenerator';

interface ImageAsset {
  fileName: string;
  data: string;
  originalSrc: string;
}

export class EmailZipExportService {
  private static imageCounter = 0;
  private static imageMap = new Map<string, string>();

  static async exportToZip(
    blocks: EmailBlock[],
    subject: string,
    settings?: any
  ): Promise<Blob> {
    const zip = new JSZip();
    
    // Reset counters for new export
    this.imageCounter = 0;
    this.imageMap.clear();

    // Extract images and process blocks
    const { processedBlocks, imageAssets } = await this.extractAndProcessImages(blocks);

    // Generate template with settings
    const template = {
      subject,
      blocks: processedBlocks,
      settings: settings || {
        width: '600px',
        backgroundColor: '#f5f5f5',
        fontFamily: 'Arial, sans-serif'
      }
    };

    // Generate MJML and HTML content
    const mjmlContent = MJMLTemplateGenerator.generateMJML(template);
    const { html } = MJMLTemplateGenerator.generateHTML(template);

    // Add files to ZIP
    zip.file('template.mjml', mjmlContent);
    zip.file('template.html', html);

    // Add images to ZIP
    if (imageAssets.length > 0) {
      const imagesFolder = zip.folder('images');
      for (const asset of imageAssets) {
        if (imagesFolder) {
          // Convert base64 to binary
          const binaryData = this.base64ToBlob(asset.data);
          imagesFolder.file(asset.fileName, binaryData);
        }
      }
    }

    // Add README file with instructions
    const readme = this.generateReadme(imageAssets.length > 0);
    zip.file('README.txt', readme);

    // Generate ZIP blob
    return await zip.generateAsync({ type: 'blob' });
  }

  private static async extractAndProcessImages(blocks: EmailBlock[]): Promise<{
    processedBlocks: EmailBlock[];
    imageAssets: ImageAsset[];
  }> {
    const imageAssets: ImageAsset[] = [];
    const processedBlocks = JSON.parse(JSON.stringify(blocks)); // Deep clone

    const processBlock = (block: EmailBlock) => {
      if (block.type === 'image' && block.content.src) {
        const src = block.content.src;
        
        // Only process base64 images
        if (src.startsWith('data:image/')) {
          let fileName = this.imageMap.get(src);
          
          if (!fileName) {
            // Extract format and create filename
            const format = this.extractImageFormat(src);
            fileName = `image${++this.imageCounter}.${format}`;
            this.imageMap.set(src, fileName);

            // Extract base64 data
            const base64Data = src.split(',')[1];
            imageAssets.push({
              fileName,
              data: base64Data,
              originalSrc: src
            });
          }

          // Update block with relative path
          block.content.src = `images/${fileName}`;
        }
      }

      // Process columns recursively
      if (block.type === 'columns' && block.content.columns) {
        block.content.columns.forEach(column => {
          column.blocks.forEach(processBlock);
        });
      }
    };

    processedBlocks.forEach(processBlock);

    return { processedBlocks, imageAssets };
  }

  private static extractImageFormat(dataUrl: string): string {
    const match = dataUrl.match(/data:image\/([^;]+)/);
    return match ? match[1] : 'png';
  }

  private static base64ToBlob(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  private static generateReadme(hasImages: boolean): string {
    return `Email Template Package
======================

This package contains your email template in multiple formats:

Files Included:
- template.mjml: MJML source code (recommended for editing)
- template.html: Compiled HTML (ready for email clients)${hasImages ? '\n- images/: Image assets referenced in the template' : ''}

How to Use:
-----------

1. MJML Template (template.mjml):
   - Use this file to edit your template
   - Compile with MJML tools to generate HTML
   - Images are referenced as relative paths (images/filename.ext)

2. HTML Template (template.html):
   - Ready-to-use HTML for email clients
   - Upload images to your server and update paths as needed
   - Test in email clients before sending

3. Images (images/ folder):${hasImages ? '\n   - Upload these to your web server\n   - Update image paths in MJML/HTML to match your server URLs' : '\n   - No images found in this template'}

Tips:
-----
- Always test your email in multiple email clients
- Use absolute URLs for images in production
- Keep image file sizes small for better deliverability

Generated on: ${new Date().toLocaleString()}
`;
  }

  static downloadZip(zipBlob: Blob, filename = 'email-template.zip') {
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
