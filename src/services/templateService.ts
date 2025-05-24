
import { EmailTemplate } from '@/components/TemplateManager';
import { EmailSnippet } from '@/types/snippets';

export interface TemplateLibrary {
  id: string;
  name: string;
  description: string;
  templates: EmailTemplate[];
  isPublic: boolean;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  author?: string;
  tags: string[];
}

export interface TemplateAnalytics {
  templateId: string;
  views: number;
  uses: number;
  ratings: number[];
  avgRating: number;
  conversionRate?: number;
  lastUsed: Date;
}

export class TemplateService {
  private static TEMPLATES_KEY = 'email_templates';
  private static LIBRARIES_KEY = 'template_libraries';
  private static ANALYTICS_KEY = 'template_analytics';

  // Template Management
  static getAllTemplates(): EmailTemplate[] {
    try {
      const stored = localStorage.getItem(this.TEMPLATES_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultTemplates();
    } catch (error) {
      console.error('Failed to load templates:', error);
      return this.getDefaultTemplates();
    }
  }

  static saveTemplate(template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): EmailTemplate {
    const newTemplate: EmailTemplate = {
      ...template,
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0
    };

    const templates = this.getAllTemplates();
    templates.push(newTemplate);
    localStorage.setItem(this.TEMPLATES_KEY, JSON.stringify(templates));
    
    return newTemplate;
  }

  static updateTemplate(id: string, updates: Partial<EmailTemplate>): void {
    const templates = this.getAllTemplates();
    const index = templates.findIndex(t => t.id === id);
    
    if (index !== -1) {
      templates[index] = { ...templates[index], ...updates, updatedAt: new Date() };
      localStorage.setItem(this.TEMPLATES_KEY, JSON.stringify(templates));
    }
  }

  static deleteTemplate(id: string): void {
    const templates = this.getAllTemplates().filter(t => t.id !== id);
    localStorage.setItem(this.TEMPLATES_KEY, JSON.stringify(templates));
  }

  static toggleFavorite(id: string): void {
    const templates = this.getAllTemplates();
    const template = templates.find(t => t.id === id);
    
    if (template) {
      template.isFavorite = !template.isFavorite;
      template.updatedAt = new Date();
      localStorage.setItem(this.TEMPLATES_KEY, JSON.stringify(templates));
    }
  }

  static incrementUsage(id: string): void {
    const templates = this.getAllTemplates();
    const template = templates.find(t => t.id === id);
    
    if (template) {
      template.usageCount++;
      template.updatedAt = new Date();
      localStorage.setItem(this.TEMPLATES_KEY, JSON.stringify(templates));
      
      // Update analytics
      this.updateAnalytics(id, { uses: 1 });
    }
  }

  // Library Management
  static createLibrary(
    name: string, 
    description: string, 
    templateIds: string[] = [], 
    category: string = 'Custom'
  ): TemplateLibrary {
    const library: TemplateLibrary = {
      id: `library_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      category,
      templates: this.getAllTemplates().filter(t => templateIds.includes(t.id)),
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: []
    };
    
    const libraries = this.getAllLibraries();
    libraries.push(library);
    localStorage.setItem(this.LIBRARIES_KEY, JSON.stringify(libraries));
    
    return library;
  }

  static getAllLibraries(): TemplateLibrary[] {
    try {
      const stored = localStorage.getItem(this.LIBRARIES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load libraries:', error);
      return [];
    }
  }

  // Analytics
  static getAnalytics(templateId: string): TemplateAnalytics | null {
    try {
      const stored = localStorage.getItem(this.ANALYTICS_KEY);
      const analytics = stored ? JSON.parse(stored) : {};
      return analytics[templateId] || null;
    } catch (error) {
      console.error('Failed to load analytics:', error);
      return null;
    }
  }

  static updateAnalytics(templateId: string, updates: Partial<TemplateAnalytics>): void {
    try {
      const stored = localStorage.getItem(this.ANALYTICS_KEY);
      const analytics = stored ? JSON.parse(stored) : {};
      
      if (!analytics[templateId]) {
        analytics[templateId] = {
          templateId,
          views: 0,
          uses: 0,
          ratings: [],
          avgRating: 0,
          lastUsed: new Date()
        };
      }
      
      analytics[templateId] = { ...analytics[templateId], ...updates };
      
      // Recalculate average rating if ratings updated
      if (updates.ratings) {
        const ratings = analytics[templateId].ratings;
        analytics[templateId].avgRating = ratings.length > 0 
          ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length 
          : 0;
      }
      
      localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(analytics));
    } catch (error) {
      console.error('Failed to update analytics:', error);
    }
  }

  // Search and Filtering
  static searchTemplates(query: string): EmailTemplate[] {
    const templates = this.getAllTemplates();
    const lowerQuery = query.toLowerCase();
    
    return templates.filter(template =>
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.category.toLowerCase().includes(lowerQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  static getTemplatesByCategory(category: string): EmailTemplate[] {
    return this.getAllTemplates().filter(template => template.category === category);
  }

  static getPopularTemplates(limit: number = 10): EmailTemplate[] {
    return this.getAllTemplates()
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  static getRecentTemplates(limit: number = 5): EmailTemplate[] {
    return this.getAllTemplates()
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  }

  static getFavoriteTemplates(): EmailTemplate[] {
    return this.getAllTemplates().filter(template => template.isFavorite);
  }

  // Import/Export
  static exportTemplates(): string {
    const templates = this.getAllTemplates();
    const libraries = this.getAllLibraries();
    const analytics = localStorage.getItem(this.ANALYTICS_KEY);
    
    return JSON.stringify({
      templates,
      libraries,
      analytics: analytics ? JSON.parse(analytics) : {},
      exportedAt: new Date(),
      version: '1.0'
    }, null, 2);
  }

  static importTemplates(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.templates) {
        const existingTemplates = this.getAllTemplates();
        const mergedTemplates = [...existingTemplates];
        
        data.templates.forEach((template: EmailTemplate) => {
          if (!mergedTemplates.find(t => t.id === template.id)) {
            mergedTemplates.push(template);
          }
        });
        
        localStorage.setItem(this.TEMPLATES_KEY, JSON.stringify(mergedTemplates));
      }
      
      if (data.libraries) {
        const existingLibraries = this.getAllLibraries();
        const mergedLibraries = [...existingLibraries];
        
        data.libraries.forEach((library: TemplateLibrary) => {
          if (!mergedLibraries.find(l => l.id === library.id)) {
            mergedLibraries.push(library);
          }
        });
        
        localStorage.setItem(this.LIBRARIES_KEY, JSON.stringify(mergedLibraries));
      }
    } catch (error) {
      console.error('Failed to import templates:', error);
      throw new Error('Invalid template data format');
    }
  }

  // Template to Snippet Conversion
  static convertTemplateToSnippet(templateId: string): EmailSnippet | null {
    const template = this.getAllTemplates().find(t => t.id === templateId);
    if (!template) return null;
    
    return {
      id: `snippet_from_template_${Date.now()}`,
      name: template.name,
      description: template.description,
      category: 'custom' as const,
      tags: template.tags,
      blockData: { html: template.html },
      blockType: 'template',
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
      isFavorite: false
    };
  }

  // Default Templates
  private static getDefaultTemplates(): EmailTemplate[] {
    return [
      {
        id: 'default_welcome',
        name: 'Welcome Email',
        description: 'A warm welcome email for new subscribers',
        html: `<div class="email-container">...</div>`,
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
        html: `<div class="email-container">...</div>`,
        category: 'Newsletter',
        tags: ['newsletter', 'updates', 'content'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        isFavorite: false,
        usageCount: 0
      }
    ];
  }

  // Template Statistics
  static getTemplateStats() {
    const templates = this.getAllTemplates();
    const categoryStats: Record<string, number> = {};
    
    templates.forEach(template => {
      categoryStats[template.category] = (categoryStats[template.category] || 0) + 1;
    });
    
    return {
      total: templates.length,
      categories: categoryStats,
      favorites: templates.filter(t => t.isFavorite).length,
      totalUsage: templates.reduce((sum, t) => sum + t.usageCount, 0),
      avgUsage: templates.length > 0 ? templates.reduce((sum, t) => sum + t.usageCount, 0) / templates.length : 0
    };
  }
}
