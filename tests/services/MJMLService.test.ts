
import { vi } from 'vitest';
import { MJMLService } from '../../src/services/MJMLService';
import { EmailBlock } from '../../src/types/emailBlocks';

describe('MJMLService', () => {
  const mockBlocks: EmailBlock[] = [
    {
      id: 'text-1',
      type: 'text',
      content: { html: '<p>Hello World</p>' },
      styling: { desktop: { padding: '16px' } },
      position: { x: 0, y: 0 },
      displayOptions: { showOnDesktop: true, showOnTablet: true, showOnMobile: true }
    }
  ];

  it('converts blocks to MJML', () => {
    const mjml = MJMLService.convertBlocksToMJML(mockBlocks);
    
    expect(mjml).toContain('<mjml>');
    expect(mjml).toContain('<mj-body>');
    expect(mjml).toContain('<mj-text>');
    expect(mjml).toContain('Hello World');
  });

  it('handles text blocks correctly', () => {
    const mjml = MJMLService.convertBlocksToMJML(mockBlocks);
    expect(mjml).toContain('<mj-text padding="16px">');
  });

  it('handles image blocks', () => {
    const imageBlocks: EmailBlock[] = [
      {
        id: 'image-1',
        type: 'image',
        content: { src: 'https://example.com/image.jpg', alt: 'Test' },
        styling: { desktop: { padding: '8px' } },
        position: { x: 0, y: 0 },
        displayOptions: { showOnDesktop: true, showOnTablet: true, showOnMobile: true }
      }
    ];
    
    const mjml = MJMLService.convertBlocksToMJML(imageBlocks);
    expect(mjml).toContain('<mj-image');
    expect(mjml).toContain('src="https://example.com/image.jpg"');
  });

  it('handles button blocks', () => {
    const buttonBlocks: EmailBlock[] = [
      {
        id: 'button-1',
        type: 'button',
        content: { text: 'Click me', link: 'https://example.com' },
        styling: { desktop: { backgroundColor: '#3B82F6' } },
        position: { x: 0, y: 0 },
        displayOptions: { showOnDesktop: true, showOnTablet: true, showOnMobile: true }
      }
    ];
    
    const mjml = MJMLService.convertBlocksToMJML(buttonBlocks);
    expect(mjml).toContain('<mj-button');
    expect(mjml).toContain('href="https://example.com"');
  });

  it('handles column layouts', () => {
    const columnBlocks: EmailBlock[] = [
      {
        id: 'columns-1',
        type: 'columns',
        content: {
          columnCount: 2,
          columnRatio: '50-50',
          columns: [
            { id: 'col-1', blocks: [], width: '50%' },
            { id: 'col-2', blocks: [], width: '50%' }
          ],
          gap: '16px'
        },
        styling: { desktop: {} },
        position: { x: 0, y: 0 },
        displayOptions: { showOnDesktop: true, showOnTablet: true, showOnMobile: true }
      }
    ];
    
    const mjml = MJMLService.convertBlocksToMJML(columnBlocks);
    expect(mjml).toContain('<mj-section>');
    expect(mjml).toContain('<mj-column width="50%">');
  });

  it('validates MJML output', () => {
    const mjml = MJMLService.convertBlocksToMJML(mockBlocks);
    const isValid = MJMLService.validateMJML(mjml);
    expect(isValid).toBe(true);
  });

  it('handles empty blocks array', () => {
    const mjml = MJMLService.convertBlocksToMJML([]);
    expect(mjml).toContain('<mjml>');
    expect(mjml).toContain('<mj-body>');
    expect(mjml).toContain('</mj-body>');
  });

  it('applies responsive styles', () => {
    const responsiveBlocks: EmailBlock[] = [
      {
        id: 'text-1',
        type: 'text',
        content: { html: '<p>Responsive text</p>' },
        styling: {
          desktop: { fontSize: '16px' },
          tablet: { fontSize: '14px' },
          mobile: { fontSize: '12px' }
        },
        position: { x: 0, y: 0 },
        displayOptions: { showOnDesktop: true, showOnTablet: true, showOnMobile: true }
      }
    ];
    
    const mjml = MJMLService.convertBlocksToMJML(responsiveBlocks);
    expect(mjml).toContain('font-size="16px"');
  });

  it('includes custom CSS when provided', () => {
    const customCSS = '.custom { color: red; }';
    const mjml = MJMLService.convertBlocksToMJML(mockBlocks, { customCSS });
    
    expect(mjml).toContain('<mj-style>');
    expect(mjml).toContain(customCSS);
  });

  it('handles social blocks', () => {
    const socialBlocks: EmailBlock[] = [
      {
        id: 'social-1',
        type: 'social',
        content: {
          platforms: [
            { name: 'Facebook', url: 'https://facebook.com', icon: 'fb.png' }
          ],
          layout: 'horizontal'
        },
        styling: { desktop: {} },
        position: { x: 0, y: 0 },
        displayOptions: { showOnDesktop: true, showOnTablet: true, showOnMobile: true }
      }
    ];
    
    const mjml = MJMLService.convertBlocksToMJML(socialBlocks);
    expect(mjml).toContain('<mj-social>');
    expect(mjml).toContain('facebook');
  });
});
