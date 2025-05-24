
import { EmailSnippet } from '@/types/snippets';
import { EmailBlock } from '@/types/emailBlocks';

export class DirectSnippetService {
  // In-memory snippets only - no persistence
  static createSnippet(block: EmailBlock, name: string, description: string): EmailSnippet {
    console.log('Creating in-memory snippet:', { block, name, description });
    
    const snippet: EmailSnippet = {
      id: `snippet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      category: 'custom',
      tags: [block.type],
      blockData: { ...block, id: `block_${Date.now()}` },
      blockType: block.type,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
      isFavorite: false
    };

    return snippet;
  }

  // Returns empty array - no persistent storage
  static getAllSnippets(): EmailSnippet[] {
    console.log('Getting snippets: returning empty array (no persistence)');
    return [];
  }

  // No-op - no persistent storage
  static deleteSnippet(id: string): void {
    console.log('Delete snippet called (no-op):', id);
  }

  // No-op - no persistent storage
  static incrementUsage(id: string): void {
    console.log('Increment usage called (no-op):', id);
  }

  // Generate default snippets on demand
  static getDefaultSnippets(): EmailSnippet[] {
    return [
      {
        id: 'default_header',
        name: 'Header Block',
        description: 'Simple header with logo and title',
        category: 'layout',
        tags: ['header', 'branding'],
        blockData: { type: 'header', content: 'Default Header' },
        blockType: 'header',
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
        isFavorite: false
      },
      {
        id: 'default_cta',
        name: 'Call to Action',
        description: 'Button with call to action',
        category: 'action',
        tags: ['button', 'cta'],
        blockData: { type: 'button', content: 'Click Here' },
        blockType: 'button',
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
        isFavorite: false
      }
    ];
  }
}
