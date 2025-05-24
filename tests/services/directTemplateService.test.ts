
import { describe, it, expect, beforeEach } from 'vitest';
import { DirectTemplateService } from '@/services/directTemplateService';
import { EmailTemplate } from '@/components/TemplateManager';

describe('DirectTemplateService', () => {
  let existingTemplates: EmailTemplate[];

  beforeEach(() => {
    existingTemplates = [
      {
        id: 'existing-1',
        name: 'Welcome Email',
        description: 'Existing welcome template',
        html: '<div>Welcome!</div>',
        subject: 'Welcome to our platform',
        category: 'Welcome',
        tags: ['welcome'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        isFavorite: false,
        usageCount: 5
      }
    ];
  });

  describe('savePublishedTemplate', () => {
    it('should create a new template with auto-generated name from subject line', () => {
      const emailHTML = '<div class="email-container"><h1>Test Email</h1></div>';
      const subjectLine = 'Product Launch Announcement';
      const existingNames = existingTemplates.map(t => t.name);

      const result = DirectTemplateService.savePublishedTemplate(
        emailHTML,
        subjectLine,
        existingNames
      );

      expect(result.name).toBe('Product Launch Announcement');
      expect(result.subject).toBe(subjectLine);
      expect(result.html).toBe(emailHTML);
      expect(result.category).toBe('Published');
      expect(result.tags).toContain('canvas-created');
      expect(result.tags).toContain('published');
      expect(result.description).toContain('Saved from canvas');
      expect(result.usageCount).toBe(0);
      expect(result.isFavorite).toBe(false);
    });

    it('should handle duplicate names by appending numbers', () => {
      const emailHTML = '<div>Test content</div>';
      const subjectLine = 'Welcome Email';
      const existingNames = ['Welcome Email', 'Welcome Email (2)'];

      const result = DirectTemplateService.savePublishedTemplate(
        emailHTML,
        subjectLine,
        existingNames
      );

      expect(result.name).toBe('Welcome Email (3)');
    });

    it('should handle empty subject line', () => {
      const emailHTML = '<div>Test content</div>';
      const subjectLine = '';
      const existingNames: string[] = [];

      const result = DirectTemplateService.savePublishedTemplate(
        emailHTML,
        subjectLine,
        existingNames
      );

      expect(result.name).toBe('Untitled Email Template');
    });

    it('should generate unique IDs', () => {
      const emailHTML = '<div>Test</div>';
      const subjectLine = 'Test Subject';
      const existingNames: string[] = [];

      const result1 = DirectTemplateService.savePublishedTemplate(emailHTML, subjectLine, existingNames);
      const result2 = DirectTemplateService.savePublishedTemplate(emailHTML, subjectLine, existingNames);

      expect(result1.id).not.toBe(result2.id);
      expect(result1.id).toMatch(/^template_\d+_[a-z0-9]+$/);
      expect(result2.id).toMatch(/^template_\d+_[a-z0-9]+$/);
    });
  });

  describe('getDefaultTemplates', () => {
    it('should return predefined templates', () => {
      const templates = DirectTemplateService.getDefaultTemplates();

      expect(templates).toHaveLength(2);
      expect(templates[0].name).toBe('Welcome Email');
      expect(templates[1].name).toBe('Newsletter Template');
      expect(templates.every(t => t.id && t.html && t.subject)).toBe(true);
    });
  });

  describe('getAllTemplates', () => {
    it('should return default templates only', () => {
      const templates = DirectTemplateService.getAllTemplates();

      expect(templates).toHaveLength(2);
      expect(templates[0].name).toBe('Welcome Email');
      expect(templates[1].name).toBe('Newsletter Template');
    });
  });

  describe('searchTemplates', () => {
    it('should filter templates by name', () => {
      const templates = DirectTemplateService.getDefaultTemplates();
      const results = DirectTemplateService.searchTemplates('welcome', templates);

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Welcome Email');
    });

    it('should filter templates by category', () => {
      const templates = DirectTemplateService.getDefaultTemplates();
      const results = DirectTemplateService.searchTemplates('newsletter', templates);

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Newsletter Template');
    });

    it('should filter templates by tags', () => {
      const templates = DirectTemplateService.getDefaultTemplates();
      const results = DirectTemplateService.searchTemplates('onboarding', templates);

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Welcome Email');
    });

    it('should be case insensitive', () => {
      const templates = DirectTemplateService.getDefaultTemplates();
      const results = DirectTemplateService.searchTemplates('WELCOME', templates);

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Welcome Email');
    });

    it('should return empty array for no matches', () => {
      const templates = DirectTemplateService.getDefaultTemplates();
      const results = DirectTemplateService.searchTemplates('nonexistent', templates);

      expect(results).toHaveLength(0);
    });
  });

  describe('saveTemplate', () => {
    it('should create template with generated ID and timestamps', () => {
      const templateData = {
        name: 'Test Template',
        description: 'Test description',
        html: '<div>Test HTML</div>',
        subject: 'Test Subject',
        category: 'Custom',
        tags: ['test'],
        isFavorite: false
      };

      const result = DirectTemplateService.saveTemplate(templateData);

      expect(result.id).toMatch(/^template_\d+_[a-z0-9]+$/);
      expect(result.name).toBe(templateData.name);
      expect(result.description).toBe(templateData.description);
      expect(result.html).toBe(templateData.html);
      expect(result.subject).toBe(templateData.subject);
      expect(result.category).toBe(templateData.category);
      expect(result.tags).toEqual(templateData.tags);
      expect(result.usageCount).toBe(0);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });
});
