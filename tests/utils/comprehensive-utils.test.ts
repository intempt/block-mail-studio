
import { 
  createDragData, 
  parseDragData, 
  getDragTypeColor, 
  getDragTypeMessage 
} from '../../src/utils/dragDropUtils';
import { 
  formatEmailHTML, 
  validateEmailStructure, 
  extractTextContent,
  generatePreviewText 
} from '../../src/utils/emailUtils';
import { 
  createTextBlock, 
  createImageBlock, 
  createButtonBlock,
  createColumnsBlock 
} from '../../src/utils/blockFactory';

describe('Utility Functions', () => {
  describe('dragDropUtils', () => {
    it('creates drag data correctly', () => {
      const data = createDragData({ blockType: 'text', isReorder: false });
      expect(data).toContain('blockType');
      expect(data).toContain('text');
    });

    it('parses drag data correctly', () => {
      const dragString = createDragData({ blockType: 'image' });
      const parsed = parseDragData(dragString);
      expect(parsed.blockType).toBe('image');
    });

    it('handles invalid drag data', () => {
      const parsed = parseDragData('invalid json');
      expect(parsed).toBeNull();
    });

    it('gets correct drag type colors', () => {
      expect(getDragTypeColor('block')).toBe('blue');
      expect(getDragTypeColor('layout')).toBe('purple');
      expect(getDragTypeColor('reorder')).toBe('green');
    });

    it('gets correct drag type messages', () => {
      expect(getDragTypeMessage('block')).toContain('Add');
      expect(getDragTypeMessage('layout')).toContain('Layout');
      expect(getDragTypeMessage('reorder')).toContain('Reorder');
    });
  });

  describe('emailUtils', () => {
    it('formats email HTML correctly', () => {
      const html = '<p>Test content</p>';
      const formatted = formatEmailHTML(html);
      expect(formatted).toContain('<!DOCTYPE html>');
      expect(formatted).toContain(html);
    });

    it('validates email structure', () => {
      const validStructure = {
        subject: 'Test Subject',
        blocks: [{ id: '1', type: 'text', content: {} }]
      };
      expect(validateEmailStructure(validStructure)).toBe(true);
      
      const invalidStructure = { subject: '' };
      expect(validateEmailStructure(invalidStructure)).toBe(false);
    });

    it('extracts text content from HTML', () => {
      const html = '<p>Hello <strong>World</strong></p>';
      const text = extractTextContent(html);
      expect(text).toBe('Hello World');
    });

    it('generates preview text', () => {
      const blocks = [
        { type: 'text', content: { html: '<p>First paragraph</p>' } },
        { type: 'text', content: { html: '<p>Second paragraph</p>' } }
      ];
      const preview = generatePreviewText(blocks);
      expect(preview).toContain('First paragraph');
    });
  });

  describe('blockFactory', () => {
    it('creates text block correctly', () => {
      const block = createTextBlock('Test content');
      expect(block.type).toBe('text');
      expect(block.content.html).toContain('Test content');
      expect(block.id).toBeDefined();
    });

    it('creates image block correctly', () => {
      const block = createImageBlock('https://example.com/image.jpg', 'Alt text');
      expect(block.type).toBe('image');
      expect(block.content.src).toBe('https://example.com/image.jpg');
      expect(block.content.alt).toBe('Alt text');
    });

    it('creates button block correctly', () => {
      const block = createButtonBlock('Click me', 'https://example.com');
      expect(block.type).toBe('button');
      expect(block.content.text).toBe('Click me');
      expect(block.content.link).toBe('https://example.com');
    });

    it('creates columns block correctly', () => {
      const block = createColumnsBlock(3, '33-33-33');
      expect(block.type).toBe('columns');
      expect(block.content.columnCount).toBe(3);
      expect(block.content.columns).toHaveLength(3);
    });

    it('applies default styling to all blocks', () => {
      const block = createTextBlock('Test');
      expect(block.styling.desktop).toBeDefined();
      expect(block.displayOptions).toBeDefined();
    });
  });
});
