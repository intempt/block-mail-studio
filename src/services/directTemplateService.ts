
import { EmailTemplate } from '@/components/TemplateManager';

export class DirectTemplateService {
  // Returns default templates only - no persistent storage
  static getAllTemplates(): EmailTemplate[] {
    console.log('Getting templates: returning default templates only');
    return this.getDefaultTemplates();
  }

  // No-op for saving - templates exist only in component state
  static saveTemplate(template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): EmailTemplate {
    console.log('Save template called (in-memory only):', template.name);
    const newTemplate: EmailTemplate = {
      ...template,
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0
    };
    return newTemplate;
  }

  // Quick save template from publish action
  static savePublishedTemplate(
    emailHTML: string, 
    subjectLine: string, 
    existingTemplateNames: string[]
  ): EmailTemplate {
    console.log('Quick save published template:', subjectLine);
    
    // Generate template name from subject line
    const baseName = subjectLine.trim() || 'Untitled Email Template';
    
    // Handle duplicate names
    let finalName = baseName;
    let counter = 2;
    while (existingTemplateNames.includes(finalName)) {
      finalName = `${baseName} (${counter})`;
      counter++;
    }
    
    const newTemplate: EmailTemplate = {
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: finalName,
      description: `Saved from canvas on ${new Date().toLocaleDateString()}`,
      html: emailHTML,
      subject: subjectLine,
      category: 'Published',
      tags: ['canvas-created', 'published'],
      createdAt: new Date(),
      updatedAt: new Date(),
      isFavorite: false,
      usageCount: 0
    };
    
    return newTemplate;
  }

  // No-op - no persistent storage
  static updateTemplate(id: string, updates: Partial<EmailTemplate>): void {
    console.log('Update template called (no-op):', id);
  }

  // No-op - no persistent storage
  static deleteTemplate(id: string): void {
    console.log('Delete template called (no-op):', id);
  }

  // No-op - no persistent storage
  static toggleFavorite(id: string): void {
    console.log('Toggle favorite called (no-op):', id);
  }

  // No-op - no persistent storage
  static incrementUsage(id: string): void {
    console.log('Increment usage called (no-op):', id);
  }

  // Generate default templates
  static getDefaultTemplates(): EmailTemplate[] {
    return [
      {
        id: 'default_welcome',
        name: 'Welcome Email',
        description: 'A warm welcome email for new subscribers',
        html: `<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #333; text-align: center;">Welcome!</h1>
          <p style="color: #666; line-height: 1.6;">Thank you for joining us. We're excited to have you on board!</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Get Started</a>
          </div>
        </div>`,
        subject: 'Welcome to our community!',
        category: 'Welcome',
        tags: ['welcome', 'onboarding', 'new-user'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        isFavorite: false,
        usageCount: 0
      },
      {
        id: 'default_newsletter',
        name: 'Newsletter Template',
        description: 'A clean newsletter template for regular updates',
        html: `<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Newsletter</h2>
          <p style="color: #666; line-height: 1.6;">Here are the latest updates and news from our team.</p>
          <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px;">
            <h3 style="color: #333; margin-top: 0;">Featured Article</h3>
            <p style="color: #666;">Your featured content goes here...</p>
          </div>
        </div>`,
        subject: 'Your weekly newsletter',
        category: 'Newsletter',
        tags: ['newsletter', 'updates', 'content'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        isFavorite: false,
        usageCount: 0
      }
    ];
  }

  // Search functionality
  static searchTemplates(query: string, templates: EmailTemplate[]): EmailTemplate[] {
    const lowerQuery = query.toLowerCase();
    return templates.filter(template =>
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.category.toLowerCase().includes(lowerQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
}
