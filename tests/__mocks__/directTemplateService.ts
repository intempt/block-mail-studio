
import { EmailTemplate } from '@/components/TemplateManager';

const mockTemplates: EmailTemplate[] = [
  {
    id: 'default_welcome',
    name: 'Welcome Email',
    description: 'A warm welcome email for new subscribers',
    html: '<div><h1>Welcome!</h1><p>Thank you for joining us.</p></div>',
    subject: 'Welcome to our community!',
    category: 'Welcome',
    tags: ['welcome', 'onboarding'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isFavorite: false,
    usageCount: 0
  },
  {
    id: 'default_newsletter',
    name: 'Newsletter Template',
    description: 'A clean newsletter template for regular updates',
    html: '<div><h2>Newsletter</h2><p>Latest updates and news.</p></div>',
    subject: 'Your weekly newsletter',
    category: 'Newsletter',
    tags: ['newsletter', 'updates'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isFavorite: false,
    usageCount: 0
  }
];

export const DirectTemplateService = {
  getAllTemplates: vi.fn(() => [...mockTemplates]),
  
  saveTemplate: vi.fn((template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => ({
    ...template,
    id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    usageCount: 0
  })),
  
  savePublishedTemplate: vi.fn((emailHTML: string, subjectLine: string, existingTemplateNames: string[]) => {
    const baseName = subjectLine.trim() || 'Untitled Email Template';
    let finalName = baseName;
    let counter = 2;
    
    while (existingTemplateNames.includes(finalName)) {
      finalName = `${baseName} (${counter})`;
      counter++;
    }
    
    const newTemplate = {
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
    
    mockTemplates.push(newTemplate);
    return newTemplate;
  }),
  
  updateTemplate: vi.fn(),
  deleteTemplate: vi.fn((id: string) => {
    const index = mockTemplates.findIndex(t => t.id === id);
    if (index > -1) {
      mockTemplates.splice(index, 1);
    }
  }),
  toggleFavorite: vi.fn(),
  incrementUsage: vi.fn(),
  getDefaultTemplates: vi.fn(() => [...mockTemplates]),
  
  searchTemplates: vi.fn((query: string, templates: EmailTemplate[]) => {
    const lowerQuery = query.toLowerCase();
    return templates.filter(template =>
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.category.toLowerCase().includes(lowerQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  })
};
